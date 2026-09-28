---
title: 快乐农场
type: page
date: 2026-09-28 17:10:00
comments: false
---

<style>
#page-header, #aside-content, #footer, #rightside { display: none !important; }
#content-inner.layout {
  padding: 0 !important;
  margin: 0 !important;
  max-width: 100% !important;
  display: block !important;
}
#post { padding: 0 !important; margin: 0 !important; background: transparent !important; box-shadow: none !important; }
.farm-wrap {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #1a1a2e;
  z-index: 1;
}
.farm-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
.farm-back {
  position: fixed;
  top: 12px; left: 12px;
  z-index: 10;
  background: rgba(0,0,0,.55);
  color: #fff !important;
  padding: .45rem .9rem;
  border-radius: 2rem;
  font-size: .82rem;
  text-decoration: none !important;
  backdrop-filter: blur(4px);
}
.farm-back:hover { background: rgba(0,0,0,.75); color: #fff !important; }
</style>

<div class="farm-wrap">
  <a class="farm-back" href="/games/">← 返回游戏列表</a>
  <iframe src="/games/farm/game/" title="快乐农场" allow="fullscreen"></iframe>
</div>
