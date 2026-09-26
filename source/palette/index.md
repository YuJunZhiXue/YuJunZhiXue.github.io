<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>古风配色色板 · 雨君博客</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;background:#e8e4db;padding:40px 20px}
  .wrap{max-width:1180px;margin:0 auto}
  h1{text-align:center;font-size:1.6rem;margin-bottom:.4rem;letter-spacing:.1em}
  .sub{text-align:center;opacity:.6;font-size:.85rem;margin-bottom:2.5rem}
  .pal{margin-bottom:3rem;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,.12)}
  .pal-head{padding:.9rem 1.4rem;display:flex;justify-content:space-between;align-items:center}
  .pal-head h2{font-size:1.15rem;letter-spacing:.08em}
  .pal-head .tag{font-size:.72rem;padding:.2rem .7rem;border-radius:999px}
  .swatches{display:flex}
  .sw{flex:1;height:64px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:.35rem;font-size:.65rem;font-family:monospace}
  .demo{padding:1.4rem}
  .demo-card{border-radius:10px;padding:1.2rem 1.4rem}
  .demo-card h3{font-size:1.05rem;margin-bottom:.5rem}
  .demo-card p{font-size:.85rem;line-height:1.9;margin-bottom:.6rem}
  .demo-card blockquote{border-left:3px solid;padding:.5rem .9rem;border-radius:0 6px 6px 0;font-size:.82rem}
  .row{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
  .btn{padding:.4rem 1.1rem;border-radius:8px;font-size:.8rem;cursor:pointer;border:none}
  .pill{font-size:.72rem;padding:.2rem .8rem;border-radius:999px;border:1px solid;text-decoration:none}
  .link{font-size:.82rem;border-bottom:1px dashed;text-decoration:none}
  .serif{font-family:"Noto Serif SC","Songti SC","STSong",serif}

/* 通用深浅两档 head/tag 样式由各方案覆盖 */
.pal-head .tag{background:rgba(255,255,255,.2)}
.pal-head.dark .tag{background:rgba(0,0,0,.18)}

/* A 青瓷汝窑 */ .a{--bg:#f4f1ea;--paper:#fffdf8;--ink:#2b2622;--soft:#5a5249;--main:#4a7d74;--line:#d8d2c4}
.a .pal-head{background:#4a7d74;color:#fff} .a .demo{background:#f4f1ea}
.a .demo-card{background:#fffdf8;border:1px solid #d8d2c4;box-shadow:0 1px 3px rgba(60,52,44,.06);color:#2b2622}
.a .demo-card h3{color:#2b2622} .a blockquote{border-color:#4a7d74;background:rgba(74,125,116,.07);color:#5a5249}
.a .btn{background:#4a7d74;color:#fff} .a .pill{border-color:rgba(74,125,116,.35);color:#4a7d74;background:rgba(74,125,116,.06)} .a .link{color:#4a7d74;border-color:#4a7d74}

/* B 朱砂宣纸 */ .b{--bg:#faf7f0;--paper:#fffdf8;--ink:#2b2622;--soft:#5a5249;--main:#8c3b2e;--line:#ddd5c7}
.b .pal-head{background:#8c3b2e;color:#fff} .b .demo{background:#faf7f0}
.b .demo-card{background:#fffdf8;border:1px solid #ddd5c7;box-shadow:0 1px 3px rgba(60,52,44,.06);color:#2b2622}
.b .demo-card h3{color:#2b2622} .b blockquote{border-color:#8c3b2e;background:rgba(140,59,46,.06);color:#5a5249}
.b .btn{background:#8c3b2e;color:#fff} .b .pill{border-color:rgba(140,59,46,.3);color:#8c3b2e;background:rgba(140,59,46,.05)} .b .link{color:#8c3b2e;border-color:#8c3b2e}

/* C 黛山夜雨 */ .c{--bg:#1a1d1a;--paper:#24271f;--ink:#e8e6df;--soft:#b0aca0;--main:#7fa88f;--line:#3a3d33}
.c .pal-head{background:#7fa88f;color:#1a1d1a} .c .demo{background:#1a1d1a}
.c .demo-card{background:#24271f;border:1px solid #3a3d33;box-shadow:0 2px 8px rgba(0,0,0,.3);color:#e8e6df}
.c .demo-card h3{color:#e8e6df} .c blockquote{border-color:#7fa88f;background:rgba(127,168,143,.1);color:#b0aca0}
.c .btn{background:#7fa88f;color:#1a1d1a} .c .pill{border-color:rgba(127,168,143,.4);color:#7fa88f;background:rgba(127,168,143,.08)} .c .link{color:#7fa88f;border-color:#7fa88f}

/* D 竹影清风 */ .d{--bg:#f6f7f2;--paper:#fefffb;--ink:#2f3329;--soft:#5e6455;--main:#5a7a4a;--line:#dcdccf}
.d .pal-head{background:#5a7a4a;color:#fff} .d .demo{background:#f6f7f2}
.d .demo-card{background:#fefffb;border:1px solid #dcdccf;box-shadow:0 1px 3px rgba(60,70,50,.06);color:#2f3329}
.d .demo-card h3{color:#2f3329} .d blockquote{border-color:#5a7a4a;background:rgba(90,122,74,.07);color:#5e6455}
.d .btn{background:#5a7a4a;color:#fff} .d .pill{border-color:rgba(90,122,74,.35);color:#5a7a4a;background:rgba(90,122,74,.06)} .d .link{color:#5a7a4a;border-color:#5a7a4a}

/* E 靛蓝扎染 */ .e{--bg:#f5f3ee;--paper:#fffdf9;--ink:#25272f;--soft:#55586b;--main:#2c4a7c;--line:#d9d8cf}
.e .pal-head{background:#2c4a7c;color:#fff} .e .demo{background:#f5f3ee}
.e .demo-card{background:#fffdf9;border:1px solid #d9d8cf;box-shadow:0 1px 3px rgba(40,45,60,.06);color:#25272f}
.e .demo-card h3{color:#25272f} .e blockquote{border-color:#2c4a7c;background:rgba(44,74,124,.06);color:#55586b}
.e .btn{background:#2c4a7c;color:#fff} .e .pill{border-color:rgba(44,74,124,.3);color:#2c4a7c;background:rgba(44,74,124,.05)} .e .link{color:#2c4a7c;border-color:#2c4a7c}

/* F 胭脂海棠 */ .f{--bg:#faf5f2;--paper:#fffdfa;--ink:#3a2622;--soft:#6b5048;--main:#a8453c;--line:#e3d3cd}
.f .pal-head{background:#a8453c;color:#fff} .f .demo{background:#faf5f2}
.f .demo-card{background:#fffdfa;border:1px solid #e3d3cd;box-shadow:0 1px 3px rgba(90,50,44,.06);color:#3a2622}
.f .demo-card h3{color:#3a2622} .f blockquote{border-color:#a8453c;background:rgba(168,69,60,.06);color:#6b5048}
.f .btn{background:#a8453c;color:#fff} .f .pill{border-color:rgba(168,69,60,.3);color:#a8453c;background:rgba(168,69,60,.05)} .f .link{color:#a8453c;border-color:#a8453c}

/* G 螺黛远山 */ .g{--bg:#f3f5f7;--paper:#fdfeff;--ink:#232a31;--soft:#57636e;--main:#3d5a73;--line:#d6dce2}
.g .pal-head{background:#3d5a73;color:#fff} .g .demo{background:#f3f5f7}
.g .demo-card{background:#fdfeff;border:1px solid #d6dce2;box-shadow:0 1px 3px rgba(35,42,49,.06);color:#232a31}
.g .demo-card h3{color:#232a31} .g blockquote{border-color:#3d5a73;background:rgba(61,90,115,.06);color:#57636e}
.g .btn{background:#3d5a73;color:#fff} .g .pill{border-color:rgba(61,90,115,.3);color:#3d5a73;background:rgba(61,90,115,.05)} .g .link{color:#3d5a73;border-color:#3d5a73}

/* H 鎏金乌木 */ .h{--bg:#1e1b17;--paper:#2a251f;--ink:#ede4d3;--soft:#b8a886;--main:#c9a05a;--line:#3d362c}
.h .pal-head{background:#c9a05a;color:#1e1b17} .h .demo{background:#1e1b17}
.h .demo-card{background:#2a251f;border:1px solid #3d362c;box-shadow:0 2px 8px rgba(0,0,0,.35);color:#ede4d3}
.h .demo-card h3{color:#c9a05a} .h blockquote{border-color:#c9a05a;background:rgba(201,160,90,.1);color:#b8a886}
.h .btn{background:#c9a05a;color:#1e1b17} .h .pill{border-color:rgba(201,160,90,.4);color:#c9a05a;background:rgba(201,160,90,.08)} .h .link{color:#c9a05a;border-color:#c9a05a}

/* I 荷塘月色 */ .i{--bg:#f4f6f8;--paper:#fdfefe;--ink:#242b2a;--soft:#5a6663;--main:#4e8b8b;--line:#d8e0e0}
.i .pal-head{background:#4e8b8b;color:#fff} .i .demo{background:#f4f6f8}
.i .demo-card{background:#fdfefe;border:1px solid #d8e0e0;box-shadow:0 1px 3px rgba(36,43,42,.06);color:#242b2a}
.i .demo-card h3{color:#242b2a} .i blockquote{border-color:#4e8b8b;background:rgba(78,139,139,.06);color:#5a6663}
.i .btn{background:#4e8b8b;color:#fff} .i .pill{border-color:rgba(78,139,139,.3);color:#4e8b8b;background:rgba(78,139,139,.05)} .i .link{color:#4e8b8b;border-color:#4e8b8b}

/* J 松烟墨 */ .j{--bg:#f7f7f5;--paper:#ffffff;--ink:#1f1f1f;--soft:#666666;--main:#3d3d3d;--line:#d9d9d6}
.j .pal-head{background:#3d3d3d;color:#fff} .j .demo{background:#f7f7f5}
.j .demo-card{background:#ffffff;border:1px solid #d9d9d6;box-shadow:0 1px 3px rgba(0,0,0,.05);color:#1f1f1f}
.j .demo-card h3{color:#1f1f1f} .j blockquote{border-color:#3d3d3d;background:rgba(0,0,0,.03);color:#666}
.j .btn{background:#1f1f1f;color:#fff} .j .pill{border-color:rgba(0,0,0,.25);color:#3d3d3d;background:rgba(0,0,0,.03)} .j .link{color:#1f1f1f;border-color:#3d3d3d}

/* K 缃叶杏黄 */ .k{--bg:#f8f4ea;--paper:#fffdf6;--ink:#33291c;--soft:#6b5b44;--main:#a87830;--line:#e0d4bc}
.k .pal-head{background:#a87830;color:#fff} .k .demo{background:#f8f4ea}
.k .demo-card{background:#fffdf6;border:1px solid #e0d4bc;box-shadow:0 1px 3px rgba(51,41,28,.06);color:#33291c}
.k .demo-card h3{color:#33291c} .k blockquote{border-color:#a87830;background:rgba(168,120,48,.06);color:#6b5b44}
.k .btn{background:#a87830;color:#fff} .k .pill{border-color:rgba(168,120,48,.3);color:#a87830;background:rgba(168,120,48,.05)} .k .link{color:#a87830;border-color:#a87830}

/* L 玄夜孤灯 */ .l{--bg:#1c1917;--paper:#28231f;--ink:#f0e9dc;--soft:#b5a795;--main:#d4884a;--line:#3a342e}
.l .pal-head{background:#d4884a;color:#1c1917} .l .demo{background:#1c1917}
.l .demo-card{background:#28231f;border:1px solid #3a342e;box-shadow:0 2px 8px rgba(0,0,0,.35);color:#f0e9dc}
.l .demo-card h3{color:#d4884a} .l blockquote{border-color:#d4884a;background:rgba(212,136,74,.1);color:#b5a795}
.l .btn{background:#d4884a;color:#1c1917} .l .pill{border-color:rgba(212,136,74,.4);color:#d4884a;background:rgba(212,136,74,.08)} .l .link{color:#d4884a;border-color:#d4884a}
</style>
</head>
<body>
<div class="wrap">
<h1 class="serif">古风配色色板</h1>
<div class="sub">十二套方案 · 每套含底色/卡片/标题/正文/按钮/标签/引用真实模拟 · 看中哪套告诉我编号</div>

<div class="pal a"><div class="pal-head"><h2 class="serif">A · 青瓷汝窑</h2><span class="tag">天青/米白/墨</span></div>
<div class="swatches"><div class="sw" style="background:#f4f1ea;color:#888">#f4f1ea</div><div class="sw" style="background:#fffdf8;color:#aaa">#fffdf8</div><div class="sw" style="background:#4a7d74;color:#fff">#4a7d74</div><div class="sw" style="background:#2b2622;color:#fff">#2b2622</div><div class="sw" style="background:#d8d2c4;color:#888">#d8d2c4</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">雨过天青云破处</h3><p>青瓷取汝窑天青，冷淡中带温润。主色用于标题装饰、按钮与链接，大面积留白，素净首选。</p><blockquote>瓷青配米白，安静、克制、不抢戏，适合长文阅读。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal b"><div class="pal-head"><h2 class="serif">B · 朱砂宣纸（当前方案）</h2><span class="tag">朱砂/宣纸/墨</span></div>
<div class="swatches"><div class="sw" style="background:#faf7f0;color:#888">#faf7f0</div><div class="sw" style="background:#fffdf8;color:#aaa">#fffdf8</div><div class="sw" style="background:#8c3b2e;color:#fff">#8c3b2e</div><div class="sw" style="background:#2b2622;color:#fff">#2b2622</div><div class="sw" style="background:#ddd5c7;color:#888">#ddd5c7</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">朱砂点雪，一点即活</h3><p>你现在博客用的就是这套。朱砂红做点缀，宣纸底+墨色字，对比度最高，也最醒目。</p><blockquote>喜欢现在的感觉、只想微调，选这套。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal c"><div class="pal-head dark"><h2 class="serif">C · 黛山夜雨（深色）</h2><span class="tag">墨黑/月白/竹青</span></div>
<div class="swatches"><div class="sw" style="background:#1a1d1a;color:#999">#1a1d1a</div><div class="sw" style="background:#24271f;color:#aaa">#24271f</div><div class="sw" style="background:#7fa88f;color:#1a1d1a">#7fa88f</div><div class="sw" style="background:#e8e6df;color:#333">#e8e6df</div><div class="sw" style="background:#3a3d33;color:#999">#3a3d33</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">夜雨剪春韭</h3><p>深色古风：墨色底、竹青点缀、月白字。CrazyWong、Butterfly 作者站都是深色系，夜读不刺眼，质感强。</p><blockquote>适合习惯夜间阅读、想要「沉」一点气质的博客。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal d"><div class="pal-head"><h2 class="serif">D · 竹影清风</h2><span class="tag">竹青/留白/墨</span></div>
<div class="swatches"><div class="sw" style="background:#f6f7f2;color:#888">#f6f7f2</div><div class="sw" style="background:#fefffb;color:#aaa">#fefffb</div><div class="sw" style="background:#5a7a4a;color:#fff">#5a7a4a</div><div class="sw" style="background:#2f3329;color:#fff">#2f3329</div><div class="sw" style="background:#dcdccf;color:#888">#dcdccf</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">不可居无竹</h3><p>竹青是文人色，比青瓷更暖、更自然。绿意淡而不艳，配大量留白，清新中带书卷气。</p><blockquote>想要比青瓷有生机、但同样素净，选这套。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal e"><div class="pal-head"><h2 class="serif">E · 靛蓝扎染</h2><span class="tag">靛青/棉白/青</span></div>
<div class="swatches"><div class="sw" style="background:#f5f3ee;color:#888">#f5f3ee</div><div class="sw" style="background:#fffdf9;color:#aaa">#fffdf9</div><div class="sw" style="background:#2c4a7c;color:#fff">#2c4a7c</div><div class="sw" style="background:#25272f;color:#fff">#25272f</div><div class="sw" style="background:#d9d8cf;color:#888">#d9d8cf</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">青出于蓝</h3><p>靛蓝来自扎染与蓝印花布，是古风里最正的蓝。比青瓷沉稳、比朱砂冷静，技术博客用显得专业又中国。</p><blockquote>安知鱼站用蓝色系（#163bf2），我调成更古朴的靛蓝。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal f"><div class="pal-head"><h2 class="serif">F · 胭脂海棠</h2><span class="tag">胭脂/粉白/墨</span></div>
<div class="swatches"><div class="sw" style="background:#faf5f2;color:#888">#faf5f2</div><div class="sw" style="background:#fffdfa;color:#aaa">#fffdfa</div><div class="sw" style="background:#a8453c;color:#fff">#a8453c</div><div class="sw" style="background:#3a2622;color:#fff">#3a2622</div><div class="sw" style="background:#e3d3cd;color:#888">#e3d3cd</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">海棠经雨胭脂透</h3><p>比朱砂更柔更暖的红，偏胭脂，配粉白底。古风里最有书卷气的一套，温润不刺目。</p><blockquote>喜欢红色系但觉得朱砂太冲，选这套胭脂。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal g"><div class="pal-head"><h2 class="serif">G · 螺黛远山</h2><span class="tag">黛蓝/霜白/墨</span></div>
<div class="swatches"><div class="sw" style="background:#f3f5f7;color:#888">#f3f5f7</div><div class="sw" style="background:#fdfeff;color:#aaa">#fdfeff</div><div class="sw" style="background:#3d5a73;color:#fff">#3d5a73</div><div class="sw" style="background:#232a31;color:#fff">#232a31</div><div class="sw" style="background:#d6dce2;color:#888">#d6dce2</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">远山如黛，近水含烟</h3><p>黛蓝是水墨山水里远山的颜色，比靛蓝更灰更冷，像雨天看山。冷静、克制、高级。</p><blockquote>觉得纯蓝太亮、想要更「水墨」的灰蓝，选这套。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal h"><div class="pal-head dark"><h2 class="serif">H · 鎏金乌木（深色）</h2><span class="tag">乌木/鎏金/月白</span></div>
<div class="swatches"><div class="sw" style="background:#1e1b17;color:#999">#1e1b17</div><div class="sw" style="background:#2a251f;color:#aaa">#2a251f</div><div class="sw" style="background:#c9a05a;color:#1e1b17">#c9a05a</div><div class="sw" style="background:#ede4d3;color:#333">#ede4d3</div><div class="sw" style="background:#3d362c;color:#999">#3d362c</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">乌木鎏金，华而不俗</h3><p>深色里最有质感的一套：乌木深棕底、鎏金点缀。像旧书馆里的黄铜灯，沉稳贵气。</p><blockquote>想要深色但比 C 更暖、更「有温度的贵」，选这套。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal i"><div class="pal-head"><h2 class="serif">I · 荷塘月色</h2><span class="tag">莲青/水白/墨</span></div>
<div class="swatches"><div class="sw" style="background:#f4f6f8;color:#888">#f4f6f8</div><div class="sw" style="background:#fdfefe;color:#aaa">#fdfefe</div><div class="sw" style="background:#4e8b8b;color:#fff">#4e8b8b</div><div class="sw" style="background:#242b2a;color:#fff">#242b2a</div><div class="sw" style="background:#d8e0e0;color:#888">#d8e0e0</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">清水出芙蓉</h3><p>莲青偏水绿，比青瓷更清透、比竹影更凉。夏天看尤其舒服，干净到近乎透明。</p><blockquote>喜欢青色系但想要更水润、更轻，选这套。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal j"><div class="pal-head"><h2 class="serif">J · 松烟墨（极简）</h2><span class="tag">纯墨/宣白/灰</span></div>
<div class="swatches"><div class="sw" style="background:#f7f7f5;color:#888">#f7f7f5</div><div class="sw" style="background:#ffffff;color:#aaa">#ffffff</div><div class="sw" style="background:#3d3d3d;color:#fff">#3d3d3d</div><div class="sw" style="background:#1f1f1f;color:#fff">#1f1f1f</div><div class="sw" style="background:#d9d9d6;color:#888">#d9d9d6</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">大道至简，唯墨而已</h3><p>几乎不用颜色：纯白底、墨黑字、灰线。所有彩色组件（标签、热力图）自动退到灰阶，像真正的水墨留白。</p><blockquote>受 Paul Graham、overreacted 这类极简博客启发，最耐看。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal k"><div class="pal-head"><h2 class="serif">K · 缃叶杏黄</h2><span class="tag">杏黄/缃白/褐</span></div>
<div class="swatches"><div class="sw" style="background:#f8f4ea;color:#888">#f8f4ea</div><div class="sw" style="background:#fffdf6;color:#aaa">#fffdf6</div><div class="sw" style="background:#a87830;color:#fff">#a87830</div><div class="sw" style="background:#33291c;color:#fff">#33291c</div><div class="sw" style="background:#e0d4bc;color:#888">#e0d4bc</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">满城尽带黄金甲</h3><p>杏黄是秋天和老书页的颜色，暖而不燥。配深褐字，像旧宣纸上的工笔，温厚有古意。</p><blockquote>喜欢暖色但红绿蓝都不要，选这套。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="pal l"><div class="pal-head dark"><h2 class="serif">L · 玄夜孤灯（深色）</h2><span class="tag">玄黑/琥珀/暖白</span></div>
<div class="swatches"><div class="sw" style="background:#1c1917;color:#999">#1c1917</div><div class="sw" style="background:#28231f;color:#aaa">#28231f</div><div class="sw" style="background:#d4884a;color:#1c1917">#d4884a</div><div class="sw" style="background:#f0e9dc;color:#333">#f0e9dc</div><div class="sw" style="background:#3a342e;color:#999">#3a342e</div></div>
<div class="demo"><div class="demo-card"><h3 class="serif">绿蚁新醅酒，红泥小火炉</h3><p>深色暖底+琥珀点缀，像冬夜一盏灯。比 H 更暖更家常，比 C 更有烟火气。</p><blockquote>想要深色、但不要冷冰冰，选这套暖琥珀。</blockquote><div class="row"><button class="btn">按钮示例</button><a class="pill" href="javascript:void(0)">标签示例</a><a class="link" href="javascript:void(0)">链接示例 →</a></div></div></div></div>

<div class="sub" style="margin-top:2rem">选好后告诉我编号（如「A」或「白天 G 晚上 H」），我直接改。</div>
</div>
</body>
</html>
