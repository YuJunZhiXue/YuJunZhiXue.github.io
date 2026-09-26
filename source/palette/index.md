<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>古风配色色板 · 雨君博客</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif; background: #e8e4db; padding: 40px 20px; }
  .wrap { max-width: 1180px; margin: 0 auto; }
  h1 { text-align: center; font-size: 1.6rem; margin-bottom: .4rem; letter-spacing: .1em; }
  .sub { text-align: center; opacity: .6; font-size: .85rem; margin-bottom: 2.5rem; }

  /* 每套配色：一个区块，内含变量 + 真实模拟卡片 */
  .pal { margin-bottom: 3rem; border-radius: 14px; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,.12); }
  .pal-head { padding: .9rem 1.4rem; display: flex; justify-content: space-between; align-items: center; }
  .pal-head h2 { font-size: 1.15rem; letter-spacing: .08em; }
  .pal-head .tag { font-size: .72rem; padding: .2rem .7rem; border-radius: 999px; }
  .swatches { display: flex; gap: 0; }
  .sw { flex: 1; height: 64px; display: flex; align-items: flex-end; justify-content: center; padding-bottom: .35rem; font-size: .65rem; font-family: monospace; }
  .demo { padding: 1.4rem; }
  .demo-card { border-radius: 10px; padding: 1.2rem 1.4rem; margin-bottom: .9rem; }
  .demo-card h3 { font-size: 1.05rem; margin-bottom: .5rem; }
  .demo-card p { font-size: .85rem; line-height: 1.9; margin-bottom: .6rem; }
  .demo-card blockquote { border-left: 3px solid; padding: .5rem .9rem; border-radius: 0 6px 6px 0; font-size: .82rem; }
  .row { display: flex; gap: .6rem; flex-wrap: wrap; align-items: center; }
  .btn { padding: .4rem 1.1rem; border-radius: 8px; font-size: .8rem; cursor: pointer; border: none; }
  .pill { font-size: .72rem; padding: .2rem .8rem; border-radius: 999px; border: 1px solid; text-decoration: none; }
  .link { font-size: .82rem; border-bottom: 1px dashed; }

  /* ===== A 青瓷汝窑 ===== */
  .a { --bg:#f4f1ea; --paper:#fffdf8; --ink:#2b2622; --soft:#5a5249; --main:#4a7d74; --line:#d8d2c4; }
  .a .pal-head { background:var(--main); color:#fff; }
  .a .pal-head .tag { background:rgba(255,255,255,.2); color:#fff; }
  .a .demo { background:var(--bg); }
  .a .demo-card { background:var(--paper); border:1px solid var(--line); box-shadow:0 1px 3px rgba(60,52,44,.06); }
  .a .demo-card { color:var(--ink); }
  .a .demo-card h3 { color:var(--ink); }
  .a blockquote { border-color:var(--main); background:rgba(74,125,116,.07); color:var(--soft); }
  .a .btn { background:var(--main); color:#fff; }
  .a .pill { border-color:rgba(74,125,116,.35); color:var(--main); background:rgba(74,125,116,.06); }
  .a .link { color:var(--main); border-color:var(--main); }

  /* ===== B 朱砂宣纸 ===== */
  .b { --bg:#faf7f0; --paper:#fffdf8; --ink:#2b2622; --soft:#5a5249; --main:#8c3b2e; --line:#ddd5c7; }
  .b .pal-head { background:var(--main); color:#fff; }
  .b .pal-head .tag { background:rgba(255,255,255,.2); color:#fff; }
  .b .demo { background:var(--bg); }
  .b .demo-card { background:var(--paper); border:1px solid var(--line); color:var(--ink); box-shadow:0 1px 3px rgba(60,52,44,.06); }
  .b .demo-card h3 { color:var(--ink); }
  .b blockquote { border-color:var(--main); background:rgba(140,59,46,.06); color:var(--soft); }
  .b .btn { background:var(--main); color:#fff; }
  .b .pill { border-color:rgba(140,59,46,.3); color:var(--main); background:rgba(140,59,46,.05); }
  .b .link { color:var(--main); border-color:var(--main); }

  /* ===== C 黛山夜雨（深色）===== */
  .c { --bg:#1a1d1a; --paper:#24271f; --ink:#e8e6df; --soft:#b0aca0; --main:#7fa88f; --line:#3a3d33; }
  .c .pal-head { background:var(--main); color:#1a1d1a; }
  .c .pal-head .tag { background:rgba(0,0,0,.18); color:#1a1d1a; }
  .c .demo { background:var(--bg); }
  .c .demo-card { background:var(--paper); border:1px solid var(--line); color:var(--ink); box-shadow:0 2px 8px rgba(0,0,0,.3); }
  .c .demo-card h3 { color:var(--ink); }
  .c blockquote { border-color:var(--main); background:rgba(127,168,143,.1); color:var(--soft); }
  .c .btn { background:var(--main); color:#1a1d1a; }
  .c .pill { border-color:rgba(127,168,143,.4); color:var(--main); background:rgba(127,168,143,.08); }
  .c .link { color:var(--main); border-color:var(--main); }

  /* ===== D 竹影清风 ===== */
  .d { --bg:#f6f7f2; --paper:#fefffb; --ink:#2f3329; --soft:#5e6455; --main:#5a7a4a; --line:#dcdccf; }
  .d .pal-head { background:var(--main); color:#fff; }
  .d .pal-head .tag { background:rgba(255,255,255,.2); color:#fff; }
  .d .demo { background:var(--bg); }
  .d .demo-card { background:var(--paper); border:1px solid var(--line); color:var(--ink); box-shadow:0 1px 3px rgba(60,70,50,.06); }
  .d .demo-card h3 { color:var(--ink); }
  .d blockquote { border-color:var(--main); background:rgba(90,122,74,.07); color:var(--soft); }
  .d .btn { background:var(--main); color:#fff; }
  .d .pill { border-color:rgba(90,122,74,.35); color:var(--main); background:rgba(90,122,74,.06); }
  .d .link { color:var(--main); border-color:var(--main); }

  /* ===== E 靛蓝扎染 ===== */
  .e { --bg:#f5f3ee; --paper:#fffdf9; --ink:#25272f; --soft:#55586b; --main:#2c4a7c; --line:#d9d8cf; }
  .e .pal-head { background:var(--main); color:#fff; }
  .e .pal-head .tag { background:rgba(255,255,255,.2); color:#fff; }
  .e .demo { background:var(--bg); }
  .e .demo-card { background:var(--paper); border:1px solid var(--line); color:var(--ink); box-shadow:0 1px 3px rgba(40,45,60,.06); }
  .e .demo-card h3 { color:var(--ink); }
  .e blockquote { border-color:var(--main); background:rgba(44,74,124,.06); color:var(--soft); }
  .e .btn { background:var(--main); color:#fff; }
  .e .pill { border-color:rgba(44,74,124,.3); color:var(--main); background:rgba(44,74,124,.05); }
  .e .link { color:var(--main); border-color:var(--main); }

  /* ===== F 胭脂海棠 ===== */
  .f { --bg:#faf5f2; --paper:#fffdfa; --ink:#3a2622; --soft:#6b5048; --main:#a8453c; --line:#e3d3cd; }
  .f .pal-head { background:var(--main); color:#fff; }
  .f .pal-head .tag { background:rgba(255,255,255,.2); color:#fff; }
  .f .demo { background:var(--bg); }
  .f .demo-card { background:var(--paper); border:1px solid var(--line); color:var(--ink); box-shadow:0 1px 3px rgba(90,50,44,.06); }
  .f .demo-card h3 { color:var(--ink); }
  .f blockquote { border-color:var(--main); background:rgba(168,69,60,.06); color:var(--soft); }
  .f .btn { background:var(--main); color:#fff; }
  .f .pill { border-color:rgba(168,69,60,.3); color:var(--main); background:rgba(168,69,60,.05); }
  .f .link { color:var(--main); border-color:var(--main); }

  .serif { font-family: "Noto Serif SC", "Songti SC", "STSong", serif; }
</style>
</head>
<body>
<div class="wrap">
  <h1 class="serif">古风配色色板</h1>
  <div class="sub">六套方案 · 每套含底色 / 卡片 / 标题 / 正文 / 按钮 / 标签 / 引用真实模拟 · 看中哪套告诉我编号</div>

  <!-- A -->
  <div class="pal a">
    <div class="pal-head"><h2 class="serif">A · 青瓷汝窑</h2><span class="tag">天青 / 米白 / 墨</span></div>
    <div class="swatches">
      <div class="sw" style="background:#f4f1ea;color:#888">#f4f1ea</div>
      <div class="sw" style="background:#fffdf8;color:#aaa">#fffdf8</div>
      <div class="sw" style="background:#4a7d74;color:#fff">#4a7d74</div>
      <div class="sw" style="background:#2b2622;color:#fff">#2b2622</div>
      <div class="sw" style="background:#d8d2c4;color:#888">#d8d2c4</div>
    </div>
    <div class="demo">
      <div class="demo-card">
        <h3 class="serif">雨过天青云破处</h3>
        <p>青瓷配色取汝窑天青，冷淡中带温润。主色用于标题装饰、按钮与链接，大面积留白，是「素净」一路的首选。</p>
        <blockquote>瓷青配米白，安静、克制、不抢戏，适合长文阅读。</blockquote>
        <div class="row">
          <button class="btn">按钮示例</button>
          <a class="pill" href="javascript:void(0)">标签示例</a>
          <a class="link" href="javascript:void(0)">链接示例 →</a>
        </div>
      </div>
    </div>
  </div>

  <!-- B -->
  <div class="pal b">
    <div class="pal-head"><h2 class="serif">B · 朱砂宣纸（当前方案）</h2><span class="tag">朱砂 / 宣纸 / 墨</span></div>
    <div class="swatches">
      <div class="sw" style="background:#faf7f0;color:#888">#faf7f0</div>
      <div class="sw" style="background:#fffdf8;color:#aaa">#fffdf8</div>
      <div class="sw" style="background:#8c3b2e;color:#fff">#8c3b2e</div>
      <div class="sw" style="background:#2b2622;color:#fff">#2b2622</div>
      <div class="sw" style="background:#ddd5c7;color:#888">#ddd5c7</div>
    </div>
    <div class="demo">
      <div class="demo-card">
        <h3 class="serif">朱砂点雪，一点即活</h3>
        <p>你现在博客用的就是这套。朱砂红做点缀色，宣纸底 + 墨色字，对比度最高，也最「古」最醒目。</p>
        <blockquote>如果喜欢现在的感觉、只想微调，选这套，我帮你把红色调更正、明暗更舒服。</blockquote>
        <div class="row">
          <button class="btn">按钮示例</button>
          <a class="pill" href="javascript:void(0)">标签示例</a>
          <a class="link" href="javascript:void(0)">链接示例 →</a>
        </div>
      </div>
    </div>
  </div>

  <!-- C -->
  <div class="pal c">
    <div class="pal-head"><h2 class="serif">C · 黛山夜雨（深色）</h2><span class="tag">墨黑 / 月白 / 竹青</span></div>
    <div class="swatches">
      <div class="sw" style="background:#1a1d1a;color:#999">#1a1d1a</div>
      <div class="sw" style="background:#24271f;color:#aaa">#24271f</div>
      <div class="sw" style="background:#7fa88f;color:#1a1d1a">#7fa88f</div>
      <div class="sw" style="background:#e8e6df;color:#333">#e8e6df</div>
      <div class="sw" style="background:#3a3d33;color:#999">#3a3d33</div>
    </div>
    <div class="demo">
      <div class="demo-card">
        <h3 class="serif">夜雨剪春韭</h3>
        <p>深色古风：墨色底、竹青点缀、月白字。CrazyWong、Butterfly 作者站都是深色系，夜读不刺眼，质感强。</p>
        <blockquote>适合习惯夜间阅读、想要「沉」一点气质的博客。</blockquote>
        <div class="row">
          <button class="btn">按钮示例</button>
          <a class="pill" href="javascript:void(0)">标签示例</a>
          <a class="link" href="javascript:void(0)">链接示例 →</a>
        </div>
      </div>
    </div>
  </div>

  <!-- D -->
  <div class="pal d">
    <div class="pal-head"><h2 class="serif">D · 竹影清风</h2><span class="tag">竹青 / 留白 / 墨</span></div>
    <div class="swatches">
      <div class="sw" style="background:#f6f7f2;color:#888">#f6f7f2</div>
      <div class="sw" style="background:#fefffb;color:#aaa">#fefffb</div>
      <div class="sw" style="background:#5a7a4a;color:#fff">#5a7a4a</div>
      <div class="sw" style="background:#2f3329;color:#fff">#2f3329</div>
      <div class="sw" style="background:#dcdccf;color:#888">#dcdccf</div>
    </div>
    <div class="demo">
      <div class="demo-card">
        <h3 class="serif">不可居无竹</h3>
        <p>竹青是文人色，比青瓷更暖一点、更「自然」。绿意淡而不艳，配大量留白，清新中带书卷气。</p>
        <blockquote>想要比青瓷更有生机、但同样素净，选这套。</blockquote>
        <div class="row">
          <button class="btn">按钮示例</button>
          <a class="pill" href="javascript:void(0)">标签示例</a>
          <a class="link" href="javascript:void(0)">链接示例 →</a>
        </div>
      </div>
    </div>
  </div>

  <!-- E -->
  <div class="pal e">
    <div class="pal-head"><h2 class="serif">E · 靛蓝扎染</h2><span class="tag">靛青 / 棉白 / 青</span></div>
    <div class="swatches">
      <div class="sw" style="background:#f5f3ee;color:#888">#f5f3ee</div>
      <div class="sw" style="background:#fffdf9;color:#aaa">#fffdf9</div>
      <div class="sw" style="background:#2c4a7c;color:#fff">#2c4a7c</div>
      <div class="sw" style="background:#25272f;color:#fff">#25272f</div>
      <div class="sw" style="background:#d9d8cf;color:#888">#d9d8cf</div>
    </div>
    <div class="demo">
      <div class="demo-card">
        <h3 class="serif">青出于蓝</h3>
        <p>靛蓝来自扎染与蓝印花布，是古风里最「正」的蓝。比青瓷沉稳、比朱砂冷静，技术博客用显得专业又中国。</p>
        <blockquote>安知鱼站用的就是蓝色系（#163bf2），我调成更古朴的靛蓝。</blockquote>
        <div class="row">
          <button class="btn">按钮示例</button>
          <a class="pill" href="javascript:void(0)">标签示例</a>
          <a class="link" href="javascript:void(0)">链接示例 →</a>
        </div>
      </div>
    </div>
  </div>

  <!-- F -->
  <div class="pal f">
    <div class="pal-head"><h2 class="serif">F · 胭脂海棠</h2><span class="tag">胭脂 / 粉白 / 墨</span></div>
    <div class="swatches">
      <div class="sw" style="background:#faf5f2;color:#888">#faf5f2</div>
      <div class="sw" style="background:#fffdfa;color:#aaa">#fffdfa</div>
      <div class="sw" style="background:#a8453c;color:#fff">#a8453c</div>
      <div class="sw" style="background:#3a2622;color:#fff">#3a2622</div>
      <div class="sw" style="background:#e3d3cd;color:#888">#e3d3cd</div>
    </div>
    <div class="demo">
      <div class="demo-card">
        <h3 class="serif">海棠经雨胭脂透</h3>
        <p>比朱砂更柔、更暖的红，偏胭脂色，配粉白底。是古风里最有「女儿气」和书卷气的一套，温润不刺目。</p>
        <blockquote>喜欢红色系但觉得朱砂太冲，选这套胭脂。</blockquote>
        <div class="row">
          <button class="btn">按钮示例</button>
          <a class="pill" href="javascript:void(0)">标签示例</a>
          <a class="link" href="javascript:void(0)">链接示例 →</a>
        </div>
      </div>
    </div>
  </div>

  <div class="sub" style="margin-top:2rem">选好后告诉我编号（如「A」或「A 和 E 都要，白天 A 晚上 E」），我直接改。</div>
</div>
</body>
</html>
