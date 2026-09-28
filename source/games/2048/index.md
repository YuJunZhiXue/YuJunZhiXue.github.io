---
title: 2048
type: page
date: 2026-09-28 17:00:00
comments: false
---

<style>
/* 2048：纯游戏全屏，不显示博客框架 */
#page-header, #aside-content, #footer, #rightside { display: none !important; }
#content-inner.layout { padding: 0 !important; margin: 0 !important; max-width: 100% !important; display: block !important; }
#content-inner.layout > #page { padding: 0 !important; margin: 0 !important; width: 100% !important; }
#article-container { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
.g2048-back {
  position: fixed; top: 14px; left: 14px; z-index: 9999;
  padding: .45rem .95rem; font-size: .85rem; text-decoration: none;
  color: #a8351f; background: rgba(247,243,232,.92);
  border: 1px solid rgba(168,53,31,.55); border-radius: 2rem;
  box-shadow: 0 2px 10px rgba(60,45,30,.18);
}
.g2048-back:hover { background: #a8351f; color: #fff; }
.g2048-stage {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #f7f3e8; font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  padding: 70px 16px 32px; box-sizing: border-box; user-select: none; -webkit-user-select: none;
  touch-action: pan-y;
}
.g2048-head { display: flex; align-items: center; gap: 18px; margin-bottom: 14px; width: 100%; max-width: 440px; }
.g2048-title { font-size: 3rem; font-weight: 800; color: #8a6d3b; letter-spacing: 2px; line-height: 1; }
.g2048-sub { font-size: .8rem; color: #a08c5f; margin-top: 6px; }
.g2048-scores { margin-left: auto; display: flex; gap: 8px; }
.g2048-score {
  background: #e9dcc0; color: #8a6d3b; border-radius: 8px; padding: 8px 14px; text-align: center; min-width: 74px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.6);
}
.g2048-score .lbl { font-size: .68rem; opacity: .8; }
.g2048-score .val { font-size: 1.25rem; font-weight: 700; }
.g2048-score .val.bump { animation: g2048bump .3s ease; }
@keyframes g2048bump { 50% { transform: scale(1.25); } }
.g2048-bar { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 440px; margin-bottom: 12px; }
.g2048-tip { font-size: .78rem; color: #a08c5f; }
.g2048-btn {
  margin-left: auto; border: none; cursor: pointer; font-size: .85rem; font-weight: 600;
  color: #fff; background: #a8351f; border-radius: 8px; padding: 9px 18px;
  box-shadow: 0 3px 8px rgba(168,53,31,.35); transition: transform .12s, background .15s;
}
.g2048-btn:hover { background: #8f2c1a; }
.g2048-btn:active { transform: scale(.96); }
.g2048-board {
  position: relative; width: 100%; max-width: 440px; aspect-ratio: 1;
  background: #d9c9a3; border-radius: 12px; padding: 10px; box-sizing: border-box;
  display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); gap: 10px;
  box-shadow: 0 8px 24px rgba(120,95,50,.25), inset 0 2px 6px rgba(120,95,50,.2);
  touch-action: none;
}
.g2048-cell { background: rgba(255,255,255,.35); border-radius: 8px; }
.g2048-tile {
  position: absolute; display: flex; align-items: center; justify-content: center;
  font-weight: 700; border-radius: 8px; color: #6b5a3e;
  transition: transform .12s ease-in-out; z-index: 2;
}
.g2048-tile.pop { animation: g2048pop .18s ease; z-index: 3; }
.g2048-tile.merge { animation: g2048merge .18s ease; z-index: 3; }
@keyframes g2048pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
@keyframes g2048merge { 0% { transform: scale(.6); } 60% { transform: scale(1.12); } 100% { transform: scale(1); } }
.g2048-mask {
  position: absolute; inset: 0; z-index: 10; display: none; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px;
  background: rgba(247,243,232,.82); backdrop-filter: blur(3px); border-radius: 12px; text-align: center;
}
.g2048-mask.show { display: flex; }
.g2048-mask h2 { margin: 0; font-size: 2rem; color: #8a6d3b; }
.g2048-mask p { margin: 0; color: #a08c5f; font-size: .9rem; }
@media (max-width: 480px) {
  .g2048-title { font-size: 2.4rem; }
  .g2048-score { min-width: 62px; padding: 6px 10px; }
}
</style>

<div class="g2048-stage" id="g2048stage">
  <a class="g2048-back" href="/games/">← 返回游戏列表</a>
  <div class="g2048-head">
    <div>
      <div class="g2048-title">2048</div>
      <div class="g2048-sub">合并数字，冲击 2048！</div>
    </div>
    <div class="g2048-scores">
      <div class="g2048-score"><div class="lbl">得分</div><div class="val" id="g2048score">0</div></div>
      <div class="g2048-score"><div class="lbl">最高</div><div class="val" id="g2048best">0</div></div>
    </div>
  </div>
  <div class="g2048-bar">
    <div class="g2048-tip">方向键 / 滑动屏幕移动方块</div>
    <button class="g2048-btn" id="g2048restart">重新开始</button>
  </div>
  <div class="g2048-board" id="g2048board">
    <div class="g2048-mask" id="g2048mask">
      <h2 id="g2048masktitle">游戏结束</h2>
      <p id="g2048maskdesc"></p>
      <button class="g2048-btn" id="g2048again">再来一局</button>
    </div>
  </div>
</div>

<script>
(function(){
  "use strict";
  var SIZE = 4;
  var boardEl = document.getElementById('g2048board');
  var scoreEl = document.getElementById('g2048score');
  var bestEl = document.getElementById('g2048best');
  var maskEl = document.getElementById('g2048mask');
  var maskTitle = document.getElementById('g2048masktitle');
  var maskDesc = document.getElementById('g2048maskdesc');
  var grid = [], tiles = {}, score = 0, best = 0, over = false, won = false, keepGoing = false, tileId = 0;

  try { best = parseInt(localStorage.getItem('g2048_best') || '0', 10) || 0; } catch(e){}
  bestEl.textContent = best;

  var COLORS = {
    2:['#f3ead6','#6b5a3e', '1.6rem'], 4:['#efdfbd','#6b5a3e','1.6rem'],
    8:['#f2b179','#fff','1.6rem'], 16:['#f59563','#fff','1.6rem'],
    32:['#f67c5f','#fff','1.6rem'], 64:['#f65e3b','#fff','1.6rem'],
    128:['#edcf72','#fff','1.5rem'], 256:['#edcc61','#fff','1.5rem'],
    512:['#edc850','#fff','1.5rem'], 1024:['#edc53f','#fff','1.2rem'],
    2048:['#edc22e','#fff','1.2rem']
  };
  function styleFor(v){
    if (COLORS[v]) return COLORS[v];
    return ['#3c3a32','#fff','1rem'];
  }

  function cellPos(r, c){
    var rect = boardEl.getBoundingClientRect();
    var pad = 10, gap = 10;
    var cell = (rect.width - pad*2 - gap*(SIZE-1)) / SIZE;
    return { x: pad + c*(cell+gap), y: pad + r*(cell+gap), s: cell };
  }

  function renderTile(t){
    var el = document.createElement('div');
    el.className = 'g2048-tile';
    el.id = 'gt' + t.id;
    var st = styleFor(t.v);
    el.style.background = st[0];
    el.style.color = st[1];
    el.style.fontSize = st[2];
    el.textContent = t.v;
    positionTile(el, t.r, t.c);
    boardEl.appendChild(el);
    return el;
  }
  function positionTile(el, r, c){
    var p = cellPos(r, c);
    el.style.width = p.s + 'px';
    el.style.height = p.s + 'px';
    el.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)';
  }

  function addRandomTile(pop){
    var empty = [];
    for (var r=0;r<SIZE;r++) for (var c=0;c<SIZE;c++) if (!grid[r][c]) empty.push([r,c]);
    if (!empty.length) return;
    var pick = empty[Math.floor(Math.random()*empty.length)];
    var t = { id: ++tileId, r: pick[0], c: pick[1], v: Math.random() < 0.9 ? 2 : 4 };
    grid[t.r][t.c] = t;
    tiles[t.id] = t;
    var el = renderTile(t);
    if (pop !== false){ el.classList.add('pop'); setTimeout(function(){ el.classList.remove('pop'); }, 200); }
  }

  function updateScore(add){
    score += add;
    scoreEl.textContent = score;
    scoreEl.classList.remove('bump'); void scoreEl.offsetWidth; scoreEl.classList.add('bump');
    if (score > best){ best = score; bestEl.textContent = best; try{ localStorage.setItem('g2048_best', String(best)); }catch(e){} }
  }

  function buildBackground(){
    var olds = boardEl.querySelectorAll('.g2048-cell');
    for (var i=0;i<olds.length;i++) olds[i].remove();
    for (var r=0;r<SIZE;r++) for (var c=0;c<SIZE;c++){
      var d = document.createElement('div');
      d.className = 'g2048-cell';
      boardEl.appendChild(d);
    }
    boardEl.appendChild(maskEl);
  }

  function reset(){
    grid = []; tiles = {}; score = 0; over = false; won = false; keepGoing = false; tileId = 0;
    for (var r=0;r<SIZE;r++){ grid.push([]); for (var c=0;c<SIZE;c++) grid[r].push(null); }
    var olds = boardEl.querySelectorAll('.g2048-tile');
    for (var i=0;i<olds.length;i++) olds[i].remove();
    scoreEl.textContent = '0';
    maskEl.classList.remove('show');
    addRandomTile(false); addRandomTile(false);
  }

  function vectors(dir){ return { up:[-1,0], down:[1,0], left:[0,-1], right:[0,1] }[dir]; }

  function move(dir){
    if (over) return;
    var v = vectors(dir), moved = false, mergedIds = {};
    var gained = 0;
    var rStart = v[0] === 1 ? SIZE-1 : 0, rStep = v[0] === 1 ? -1 : 1;
    var cStart = v[1] === 1 ? SIZE-1 : 0, cStep = v[1] === 1 ? -1 : 1;
    for (var r=rStart; r>=0 && r<SIZE; r+=rStep){
      for (var c=cStart; c>=0 && c<SIZE; c+=cStep){
        var t = grid[r][c];
        if (!t) continue;
        var nr = r, nc = c;
        while (true){
          var tr = nr + v[0], tc = nc + v[1];
          if (tr<0||tr>=SIZE||tc<0||tc>=SIZE) break;
          var target = grid[tr][tc];
          if (!target){ nr = tr; nc = tc; }
          else if (target.v === t.v && !mergedIds[target.id] && !mergedIds[t.id]){
            nr = tr; nc = tc; break;
          } else break;
        }
        if (nr !== r || nc !== c){
          moved = true;
          grid[r][c] = null;
          var dest = grid[nr][nc];
          if (dest && dest.v === t.v){
            // merge into dest
            grid[nr][nc] = dest;
            dest.v *= 2; gained += dest.v;
            mergedIds[dest.id] = true;
            var oldEl = document.getElementById('gt'+t.id);
            if (oldEl) oldEl.remove();
            delete tiles[t.id];
            var destEl = document.getElementById('gt'+dest.id);
            var st = styleFor(dest.v);
            destEl.style.background = st[0]; destEl.style.color = st[1]; destEl.style.fontSize = st[2];
            destEl.textContent = dest.v;
            destEl.classList.add('merge');
            (function(el){ setTimeout(function(){ el.classList.remove('merge'); }, 200); })(destEl);
            positionTile(destEl, nr, nc);
            if (dest.v === 2048 && !won){ won = true; }
          } else {
            grid[nr][nc] = t; t.r = nr; t.c = nc;
            var el2 = document.getElementById('gt'+t.id);
            positionTile(el2, nr, nc);
          }
        }
      }
    }
    if (moved){
      if (gained) updateScore(gained);
      addRandomTile(true);
      if (won && !keepGoing){ showMask('你赢了！', '成功合成 2048，继续挑战更高分，或重新开始。', true); }
      else if (isOver()){ over = true; showMask('游戏结束', '最终得分：' + score + '，最高分：' + best, false); }
    }
  }

  function isOver(){
    for (var r=0;r<SIZE;r++) for (var c=0;c<SIZE;c++){
      if (!grid[r][c]) return false;
      var v = grid[r][c].v;
      if (r+1<SIZE && grid[r+1][c] && grid[r+1][c].v===v) return false;
      if (c+1<SIZE && grid[r][c+1] && grid[r][c+1].v===v) return false;
    }
    return true;
  }

  function showMask(title, desc, isWin){
    maskTitle.textContent = title;
    maskDesc.textContent = desc;
    document.getElementById('g2048again').textContent = isWin ? '继续挑战' : '再来一局';
    maskEl.classList.add('show');
    maskEl.dataset.win = isWin ? '1' : '';
  }

  document.getElementById('g2048restart').addEventListener('click', reset);
  document.getElementById('g2048again').addEventListener('click', function(){
    if (maskEl.dataset.win){ keepGoing = true; maskEl.classList.remove('show'); }
    else reset();
  });

  document.addEventListener('keydown', function(e){
    var map = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right' };
    if (map[e.key]){ e.preventDefault(); move(map[e.key]); }
  });

  var tsx=0, tsy=0;
  boardEl.addEventListener('touchstart', function(e){
    var t = e.changedTouches[0]; tsx = t.clientX; tsy = t.clientY;
  }, {passive:true});
  boardEl.addEventListener('touchend', function(e){
    var t = e.changedTouches[0];
    var dx = t.clientX - tsx, dy = t.clientY - tsy;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    e.preventDefault();
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  }, {passive:false});
  boardEl.addEventListener('touchmove', function(e){ e.preventDefault(); }, {passive:false});

  window.addEventListener('resize', function(){
    for (var id in tiles){ var t = tiles[id]; var el = document.getElementById('gt'+id); if (el) positionTile(el, t.r, t.c); }
  });

  buildBackground();
  reset();
})();
</script>
