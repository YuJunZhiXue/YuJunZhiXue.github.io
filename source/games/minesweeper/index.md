---
title: 扫雷
type: page
date: 2026-09-28 17:00:00
comments: false
---

<style>
/* 扫雷：纯游戏全屏，不显示博客框架 */
#page-header, #aside-content, #footer, #rightside { display: none !important; }
#content-inner.layout { padding: 0 !important; margin: 0 !important; max-width: 100% !important; display: block !important; }
#content-inner.layout > #page { padding: 0 !important; margin: 0 !important; width: 100% !important; }
#article-container { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
.ms-back {
  position: fixed; top: 14px; left: 14px; z-index: 9999;
  padding: .45rem .95rem; font-size: .85rem; text-decoration: none;
  color: #a8351f; background: rgba(247,243,232,.92);
  border: 1px solid rgba(168,53,31,.55); border-radius: 2rem;
  box-shadow: 0 2px 10px rgba(60,45,30,.18);
}
.ms-back:hover { background: #a8351f; color: #fff; }
.ms-stage {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #f7f3e8; font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  padding: 70px 12px 32px; box-sizing: border-box; user-select: none; -webkit-user-select: none;
}
.ms-panel {
  background: #fdfbf4; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(120,95,50,.22);
  display: flex; flex-direction: column; align-items: center; max-width: 96vw;
}
.ms-title { font-size: 1.7rem; font-weight: 800; color: #7a5c2e; margin-bottom: 2px; }
.ms-sub { font-size: .75rem; color: #a08c5f; margin-bottom: 12px; }
.ms-diff { display: flex; gap: 8px; margin-bottom: 12px; }
.ms-diff button {
  border: 1px solid #d9c9a3; background: #f7f3e8; color: #7a5c2e; font-size: .8rem;
  border-radius: 2rem; padding: 7px 16px; cursor: pointer; transition: all .15s;
}
.ms-diff button.active { background: #a8351f; border-color: #a8351f; color: #fff; box-shadow: 0 3px 8px rgba(168,53,31,.35); }
.ms-hud {
  display: flex; align-items: center; gap: 12px; width: 100%; margin-bottom: 12px;
  background: #2b2b2b; border-radius: 10px; padding: 10px 16px; box-sizing: border-box;
  box-shadow: inset 0 2px 6px rgba(0,0,0,.4);
}
.ms-num {
  font-family: "Courier New", monospace; font-weight: 700; font-size: 1.5rem; color: #ff5a4e;
  background: #111; border-radius: 6px; padding: 2px 10px; min-width: 64px; text-align: center;
  text-shadow: 0 0 6px rgba(255,90,78,.7);
}
.ms-face {
  margin: 0 auto; font-size: 1.9rem; cursor: pointer; background: #d9c9a3; border: none;
  width: 52px; height: 52px; border-radius: 10px; line-height: 1;
  box-shadow: 0 3px 0 #b8a276, 0 5px 10px rgba(0,0,0,.25); transition: transform .1s;
}
.ms-face:active { transform: translateY(2px); box-shadow: 0 1px 0 #b8a276; }
.ms-board { display: grid; gap: 2px; background: #b8a276; padding: 6px; border-radius: 8px; touch-action: none; }
.ms-cell {
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  font-size: 1.05rem; font-weight: 700; cursor: pointer; border-radius: 3px;
  background: #e6d9b8; box-shadow: inset 0 2px 0 rgba(255,255,255,.55), inset 0 -2px 0 rgba(120,95,50,.25);
}
.ms-cell:active { transform: scale(.94); }
.ms-cell.open {
  background: #f4eedd; box-shadow: inset 0 1px 3px rgba(120,95,50,.25); cursor: default;
}
.ms-cell.open:active { transform: none; }
.ms-cell.boom { background: #d9534f; }
.ms-cell.flagged { font-size: 1rem; }
.ms-mask {
  position: fixed; inset: 0; z-index: 50; display: none; align-items: center; justify-content: center;
  background: rgba(60,45,30,.45); backdrop-filter: blur(3px);
}
.ms-mask.show { display: flex; }
.ms-dialog {
  background: #fdfbf4; border-radius: 16px; padding: 28px 36px; text-align: center;
  box-shadow: 0 16px 48px rgba(0,0,0,.3); animation: mspop .25s ease;
}
@keyframes mspop { from { transform: scale(.8); opacity: 0; } }
.ms-dialog h2 { margin: 0 0 8px; font-size: 1.8rem; color: #7a5c2e; }
.ms-dialog p { margin: 0 0 16px; color: #a08c5f; font-size: .9rem; }
.ms-btn {
  border: none; cursor: pointer; font-size: .9rem; font-weight: 600; color: #fff;
  background: #a8351f; border-radius: 10px; padding: 10px 28px;
  box-shadow: 0 3px 10px rgba(168,53,31,.4);
}
.ms-btn:hover { background: #8f2c1a; }
.ms-btn:active { transform: scale(.95); }
.ms-hint { margin-top: 12px; font-size: .72rem; color: #a08c5f; text-align: center; line-height: 1.7; }
.ms-n1{color:#2b6cb0}.ms-n2{color:#2f855a}.ms-n3{color:#c53030}.ms-n4{color:#6b46c1}
.ms-n5{color:#b7791f}.ms-n6{color:#2c7a7b}.ms-n7{color:#1a202c}.ms-n8{color:#718096}
@media (max-width: 560px) { .ms-cell { width: 26px; height: 26px; font-size: .95rem; } }
</style>

<div class="ms-stage">
  <a class="ms-back" href="/games/">← 返回游戏列表</a>
  <div class="ms-panel">
    <div class="ms-title">扫雷</div>
    <div class="ms-sub">左键翻开 · 右键/长按插旗</div>
    <div class="ms-diff" id="msdiff">
      <button data-r="9" data-c="9" data-m="10" class="active">初级 9×9</button>
      <button data-r="16" data-c="16" data-m="40">中级 16×16</button>
    </div>
    <div class="ms-hud">
      <div class="ms-num" id="msmines">010</div>
      <button class="ms-face" id="msface" title="重新开始">🙂</button>
      <div class="ms-num" id="mstime">000</div>
    </div>
    <div class="ms-board" id="msboard"></div>
    <div class="ms-hint">电脑：左键翻开格子，右键插旗标记地雷<br>手机：短按翻开，长按 0.5 秒插旗 · 首次点击必不踩雷</div>
  </div>
</div>

<div class="ms-mask" id="msmask">
  <div class="ms-dialog">
    <h2 id="msmasktitle">你赢了！</h2>
    <p id="msmaskdesc"></p>
    <button class="ms-btn" id="msagain">再来一局</button>
  </div>
</div>

<script>
(function(){
  "use strict";
  var ROWS = 9, COLS = 9, MINES = 10;
  var boardEl = document.getElementById('msboard');
  var minesEl = document.getElementById('msmines');
  var timeEl = document.getElementById('mstime');
  var faceEl = document.getElementById('msface');
  var maskEl = document.getElementById('msmask');
  var maskTitle = document.getElementById('msmasktitle');
  var maskDesc = document.getElementById('msmaskdesc');

  var cells, mineSet, revealed, flagged, started, ended, timer, seconds, minesLeft;

  function fmt(n){ n = Math.max(0, Math.min(999, n)); return ('00'+n).slice(-3); }

  function build(){
    boardEl.style.gridTemplateColumns = 'repeat(' + COLS + ', auto)';
    boardEl.innerHTML = '';
    cells = [];
    for (var r=0;r<ROWS;r++){
      cells.push([]);
      for (var c=0;c<COLS;c++){
        var d = document.createElement('div');
        d.className = 'ms-cell';
        d.dataset.r = r; d.dataset.c = c;
        (function(rr, cc, el){
          el.addEventListener('click', function(e){ reveal(rr, cc); });
          el.addEventListener('contextmenu', function(e){ e.preventDefault(); toggleFlag(rr, cc); });
          // 长按插旗（移动端）
          var pressTimer = null, longFired = false;
          el.addEventListener('touchstart', function(e){
            longFired = false;
            pressTimer = setTimeout(function(){ longFired = true; toggleFlag(rr, cc); }, 500);
          }, {passive:true});
          el.addEventListener('touchend', function(e){
            if (pressTimer) clearTimeout(pressTimer);
            if (longFired){ e.preventDefault(); }
          });
          el.addEventListener('touchmove', function(){ if (pressTimer) clearTimeout(pressTimer); }, {passive:true});
        })(r, c, d);
        boardEl.appendChild(d);
        cells[r].push({ el: d, mine: false, open: false, flag: false, n: 0 });
      }
    }
  }

  function reset(){
    build();
    mineSet = {}; revealed = 0; flagged = 0;
    started = false; ended = false; seconds = 0; minesLeft = MINES;
    if (timer){ clearInterval(timer); timer = null; }
    minesEl.textContent = fmt(minesLeft);
    timeEl.textContent = fmt(0);
    faceEl.textContent = '🙂';
    maskEl.classList.remove('show');
  }

  function placeMines(safeR, safeC){
    var placed = 0, total = ROWS*COLS;
    while (placed < MINES){
      var i = Math.floor(Math.random()*total);
      var r = Math.floor(i/COLS), c = i%COLS;
      if (mineSet[r+'_'+c]) continue;
      if (Math.abs(r-safeR)<=1 && Math.abs(c-safeC)<=1) continue; // 首次点击周围安全
      mineSet[r+'_'+c] = true;
      cells[r][c].mine = true;
      placed++;
    }
    for (var r=0;r<ROWS;r++) for (var c=0;c<COLS;c++){
      if (cells[r][c].mine) continue;
      var n = 0;
      for (var dr=-1;dr<=1;dr++) for (var dc=-1;dc<=1;dc++){
        if (!dr&&!dc) continue;
        var nr=r+dr, nc=c+dc;
        if (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&cells[nr][nc].mine) n++;
      }
      cells[r][c].n = n;
    }
  }

  function startTimer(){
    timer = setInterval(function(){
      seconds++;
      timeEl.textContent = fmt(seconds);
      if (seconds >= 999){ clearInterval(timer); }
    }, 1000);
  }

  function reveal(r, c){
    if (ended) return;
    var cell = cells[r][c];
    if (cell.open || cell.flag) return;
    if (!started){
      started = true;
      placeMines(r, c);
      startTimer();
    }
    if (cell.mine){ return lose(r, c); }
    flood(r, c);
    if (revealed === ROWS*COLS - MINES) win();
  }

  function flood(sr, sc){
    var stack = [[sr, sc]];
    while (stack.length){
      var cur = stack.pop(), r = cur[0], c = cur[1];
      var cell = cells[r][c];
      if (cell.open || cell.flag || cell.mine) continue;
      cell.open = true; revealed++;
      cell.el.classList.add('open');
      if (cell.n > 0){
        cell.el.textContent = cell.n;
        cell.el.classList.add('ms-n' + cell.n);
      } else {
        for (var dr=-1;dr<=1;dr++) for (var dc=-1;dc<=1;dc++){
          if (!dr&&!dc) continue;
          var nr=r+dr, nc=c+dc;
          if (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) stack.push([nr,nc]);
        }
      }
    }
  }

  function toggleFlag(r, c){
    if (ended || !started && false) return;
    var cell = cells[r][c];
    if (cell.open) return;
    cell.flag = !cell.flag;
    cell.el.classList.toggle('flagged', cell.flag);
    cell.el.textContent = cell.flag ? '🚩' : '';
    flagged += cell.flag ? 1 : -1;
    minesLeft = MINES - flagged;
    minesEl.textContent = fmt(minesLeft);
  }

  function lose(br, bc){
    ended = true;
    if (timer) clearInterval(timer);
    faceEl.textContent = '😵';
    for (var r=0;r<ROWS;r++) for (var c=0;c<COLS;c++){
      var cell = cells[r][c];
      if (cell.mine && !cell.flag){
        cell.el.classList.add('open');
        cell.el.textContent = (r===br && c===bc) ? '💥' : '💣';
        if (r===br && c===bc) cell.el.classList.add('boom');
      } else if (!cell.mine && cell.flag){
        cell.el.textContent = '❌';
      }
    }
    showMask('踩到地雷了', '用时 ' + seconds + ' 秒，再试一次吧！');
  }

  function win(){
    ended = true;
    if (timer) clearInterval(timer);
    faceEl.textContent = '😎';
    for (var k in mineSet){
      var p = k.split('_'), cell = cells[+p[0]][+p[1]];
      if (!cell.flag){ cell.flag = true; cell.el.classList.add('flagged'); cell.el.textContent = '🚩'; }
    }
    minesLeft = 0; flagged = MINES;
    minesEl.textContent = fmt(0);
    showMask('你赢了！🎉', (ROWS===9?'初级':'中级') + '难度 · 用时 ' + seconds + ' 秒');
  }

  function showMask(title, desc){
    maskTitle.textContent = title;
    maskDesc.textContent = desc;
    setTimeout(function(){ maskEl.classList.add('show'); }, 600);
  }

  faceEl.addEventListener('click', reset);
  document.getElementById('msagain').addEventListener('click', reset);

  document.getElementById('msdiff').addEventListener('click', function(e){
    var b = e.target.closest('button');
    if (!b) return;
    var btns = this.querySelectorAll('button');
    for (var i=0;i<btns.length;i++) btns[i].classList.remove('active');
    b.classList.add('active');
    ROWS = parseInt(b.dataset.r,10); COLS = parseInt(b.dataset.c,10); MINES = parseInt(b.dataset.m,10);
    reset();
  });

  // 双击空白格快速展开（chord）：已翻开数字格，双击且周围旗数足够时展开邻居
  boardEl.addEventListener('dblclick', function(e){
    var el = e.target.closest('.ms-cell');
    if (!el || ended) return;
    var r = +el.dataset.r, c = +el.dataset.c, cell = cells[r][c];
    if (!cell.open || cell.n === 0) return;
    var flags = 0;
    for (var dr=-1;dr<=1;dr++) for (var dc=-1;dc<=1;dc++){
      var nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&cells[nr][nc].flag) flags++;
    }
    if (flags >= cell.n){
      for (var dr2=-1;dr2<=1;dr2++) for (var dc2=-1;dc2<=1;dc2++){
        var nr2=r+dr2, nc2=c+dc2;
        if (nr2>=0&&nr2<ROWS&&nc2>=0&&nc2<COLS&&!cells[nr2][nc2].flag) reveal(nr2, nc2);
      }
    }
  });

  reset();
})();
</script>
