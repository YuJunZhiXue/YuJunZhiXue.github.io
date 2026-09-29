/**
 * scripts/cache-bust.js — 构建后独立脚本（不要做成 Hexo after_generate filter！
 * 原因：hexo g 的执行顺序是 load() -> after_generate -> firstGenerate() 落盘，
 * filter 里改 public/ 会被随后的落盘覆盖，只有未被重写的非路由文件能幸免）
 *
 * 用法：npx hexo g && node bin/cache-bust.js [public目录]
 *
 * 遍历 public/ 下的 HTML/CSS/JS，给引用的本地静态资源追加内容哈希 ?v=xxxxxxxx。
 * 配合 _headers 里 /css/* /js/* /images/* /fonts/* 的
 * `Cache-Control: public, max-age=31536000, immutable`，
 * 资源内容一改 URL 就变，CDN/浏览器自动拿最新版，
 * 以后改样式再也不用手动 bump ?v=。
 *
 * 处理范围：
 *   HTML: <script src>、<link rel="stylesheet" href>、<img src>、<source src>
 *   CSS : url(...) 引用的本地图片/字体
 *   JS  : import/export ... from './x.js'、import('./x.js') 的相对路径
 * 规则：
 *   - 只处理本地路径，http(s)://、//cdn、data: 一律跳过
 *   - 已有的 ?v=xxx 会被去掉重算，不会叠加；幂等，可重复执行
 *   - 目标文件不存在时保持原样，不破坏页面
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const publicDir = path.resolve(process.argv[2] || path.join(__dirname, "..", "public"));
if (!fs.existsSync(publicDir)) {
  console.error(`[cache-bust] 目录不存在: ${publicDir}`);
  process.exit(1);
}

let hashCache = new Map();
const md5file = (abs) => {
  if (hashCache.has(abs)) return hashCache.get(abs);
  let h = null;
  try {
    h = crypto.createHash("md5").update(fs.readFileSync(abs)).digest("hex").slice(0, 8);
  } catch (e) {
    /* 目标不存在：保持原样 */
  }
  hashCache.set(abs, h);
  return h;
};

// 去掉已有的 ?v=xxx / &v=xxx，保留其它查询参数和 #fragment
const stripV = (url) => {
  const hi = url.indexOf("#");
  const frag = hi >= 0 ? url.slice(hi) : "";
  const base = hi >= 0 ? url.slice(0, hi) : url;
  const qi = base.indexOf("?");
  if (qi < 0) return url;
  const stem = base.slice(0, qi);
  const params = base
    .slice(qi + 1)
    .split("&")
    .filter((p) => p && !/^v=/.test(p));
  return stem + (params.length ? "?" + params.join("&") : "") + frag;
};

const isExternal = (u) =>
  /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(u) || /^data:/i.test(u) || u.startsWith("#");

// 把引用 URL 解析成 public/ 下的绝对路径；外部 URL 返回 null
const resolveLocal = (url, fromFile) => {
  const stem = url.split("#")[0].split("?")[0];
  if (!stem || isExternal(stem)) return null;
  let decoded = stem;
  try {
    decoded = decodeURIComponent(stem);
  } catch (e) {
    /* 用原始路径 */
  }
  return stem.startsWith("/")
    ? path.join(publicDir, decoded)
    : path.join(path.dirname(fromFile), decoded);
};

const withV = (url, fromFile) => {
  const abs = resolveLocal(url, fromFile);
  if (!abs) return url;
  const h = md5file(abs);
  if (!h) return url;
  const clean = stripV(url);
  const hi = clean.indexOf("#");
  const frag = hi >= 0 ? clean.slice(hi) : "";
  const base = hi >= 0 ? clean.slice(0, hi) : clean;
  return base + (base.includes("?") ? "&" : "?") + "v=" + h + frag;
};

const processCss = (file) => {
  let text = fs.readFileSync(file, "utf8");
  let changed = false;
  text = text.replace(/url\(\s*(['"]?)([^'")\s][^'")]*)\1\s*\)/g, (m, q, u) => {
    if (isExternal(u)) return m;
    const v = withV(u, file);
    if (v === u) return m;
    changed = true;
    return "url(" + q + v + q + ")";
  });
  if (changed) fs.writeFileSync(file, text);
  return changed;
};

const processJs = (file) => {
  let text = fs.readFileSync(file, "utf8");
  let changed = false;
  const repl = (m, q, spec) => {
    if (!/^\.\.?\//.test(spec)) return m; // 只处理相对路径
    if (!spec.split("?")[0].split("#")[0].endsWith(".js")) return m;
    const v = withV(spec, file);
    if (v === spec) return m;
    changed = true;
    return m.slice(0, m.indexOf(spec)) + v + m.slice(m.indexOf(spec) + spec.length);
  };
  // import x from './a.js' / export { y } from './b.js'
  text = text.replace(/\bfrom\s*(['"])(\.\.?\/[^'"]+)\1/g, repl);
  // import('./a.js') 动态导入
  text = text.replace(/\bimport\s*\(\s*(['"])(\.\.?\/[^'"]+)\1\s*\)/g, repl);
  // import './a.js' 副作用导入
  text = text.replace(/(^|[;{}()\n]\s*import\s*)(['"])(\.\.?\/[^'"]+\.js(?:[?#][^'"]*)?)\2/g, (m, pre, q, spec) => {
    const v = withV(spec, file);
    if (v === spec) return m;
    changed = true;
    return pre + q + v + q;
  });
  if (changed) fs.writeFileSync(file, text);
  return changed;
};

const processHtml = (file) => {
  let text = fs.readFileSync(file, "utf8");
  let changed = false;
  const attrRepl = (m, pre, q, u) => {
    const v = withV(u, file);
    if (v === u) return m;
    changed = true;
    return pre + q + v + q;
  };
  // <script src="...">
  text = text.replace(/(<script\b[^>]*?\ssrc\s*=\s*)(['"])([^'"]+)\2/gi, attrRepl);
  // <link rel="stylesheet" href="...">（href/rel 顺序不限）
  text = text.replace(/(<link\b[^>]*>)/gi, (tag) => {
    if (!/\brel\s*=\s*(['"])stylesheet\1/i.test(tag)) return tag;
    return tag.replace(/(\shref\s*=\s*)(['"])([^'"]+)\2/i, attrRepl);
  });
  // <img src> / <source src>
  text = text.replace(/(<(?:img|source)\b[^>]*?\ssrc\s*=\s*)(['"])([^'"]+)\2/gi, attrRepl);
  // 懒加载主题把真实图片 URL 放在 data-lazy-src / data-src 里（Butterfly 等），同样追加哈希
  text = text.replace(/(<(?:img|source|div|a|span)\b[^>]*?\sdata-(?:lazy-)?src\s*=\s*)(['"])([^'"]+)\2/gi, attrRepl);
  if (changed) fs.writeFileSync(file, text);
  return changed;
};

const walk = (dir, exts, out) => {
  out = out || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, out);
    else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
  }
  return out;
};

// 顺序重要：先 CSS（改了 CSS 内容），再 JS，最后 HTML（引用的是最终哈希）
// JS 之间存在 import 依赖链（a.js -> b.js -> c.js），一次遍历里先处理的文件
// 拿到的是依赖的旧哈希，所以 JS pass 要迭代到不动点为止
let touched = 0;
for (const f of walk(publicDir, [".css"])) if (processCss(f)) touched++;
hashCache = new Map();
for (let i = 0; i < 10; i++) {
  hashCache = new Map();
  let round = 0;
  for (const f of walk(publicDir, [".js"])) if (processJs(f)) round++;
  touched += round;
  if (round === 0) break;
}
hashCache = new Map();
for (const f of walk(publicDir, [".html", ".htm"])) if (processHtml(f)) touched++;
console.log(`[cache-bust] 已处理 ${touched} 个文件，本地 CSS/JS/图片引用已追加内容哈希`);
