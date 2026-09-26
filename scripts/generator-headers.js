hexo.extend.filter.register("after_generate", function () {
  const fs = require("fs");
  const path = require("path");
  const headers = [
    "# Cloudflare Pages: 图片与静态资源走 CDN 长缓存",
    "/images/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "/css/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "/js/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
    "/fonts/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "",
  ].join("\n");
  const out = path.join(hexo.public_dir, "_headers");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, headers);
  hexo.log.info("已写入 _headers (CF Pages 缓存头)");
});
