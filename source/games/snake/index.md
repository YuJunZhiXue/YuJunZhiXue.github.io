---
title: 贪吃蛇
type: page
date: 2026-09-28 17:00:00
comments: false
---

<style>
/* 贪吃蛇：纯游戏全屏，不显示博客框架 */
#page-header, #aside-content, #footer, #rightside { display: none !important; }
#content-inner.layout { padding: 0 !important; margin: 0 !important; max-width: 100% !important; display: block !important; }
#content-inner.layout > #page { padding: 0 !important; margin: 0 !important; width: 100% !important; }
#article-container { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
.snake-back {
  position: fixed; top: 14px; left: 14px; z-index: 9999;
  padding: .45rem .95rem; font-size: .85rem; text-decoration: none;
  color: #a8351f; background: rgba(247,243,232,.92);
  border: 1px solid rgba(168,53,31,.55); border-radius: 2rem;
  box-shadow: 0 2px 10px rgba(60,45,30,.18);
}
.snake-back:hover { background: #a8351f; color: #fff; }
.snake-stage {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: #f7f3e8; font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  padding: 70px 16px 32px; box-sizing: border-box; user-select: none; -webkit-user-select: none;
}
.snake-head { display: flex; align-items: center; gap: 16px; width: 100%; max-width: 440px; margin-bottom: 12px; }
.snake-title { font-size: 2rem; font-weight: 800; color: #5d7a4e; }
.snake-title small { display: block; font-size: .75rem; font-weight: 400; color: #8a9a7b; margin-top: 4px; }
.snake-scores { margin-left: auto; display: flex; gap: 8px; }
.snake-score {
  background: #e3ecd9; color: #5d7a4e; border-radius: 8px; padding: 8px 14px; text-align: center; min-width: 70px;
}
.snake-score .lbl { font-size: .68rem; opacity: .8; }
.snake-score .val { font-size: 1.25rem; font-weight: 700; }
.snake-wrap { position: relative; width: 100%; max-width: 440px; }
.snake-canvas {
  display: block; width: 100%; aspect-ratio: 1; border-radius: 12px;
  background: #fdfbf4; box-shadow: 0 8px 24px rgba(93,122,78,.22), inset 0 0 0 3px #d8e2c8;
  touch-action: none;
}
.snake-mask {
  position: absolute; inset: 0; z-index: 5; display: none; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px; border-radius: 12px;
  background: rgba(247,243,232,.88); backdrop-filter: blur(3px); text-align: center; padding: 20px;
}
.snake-mask.show { display: flex; }
.snake-mask h2 { margin: 0; font-size: 1.8rem; color: #5d7a4e; }
.snake-mask p { margin: 0; color: #8a9a7b; font-size: .9rem; }
.snake-mask .final { font-size: 1.1rem; color: #5d7a4e; font-weight: 700; }
.snake-btn {
  border: none; cursor: pointer; font-size: .9rem; font-weight: 600; color: #fff;
  background: #5d7a4e; border-radius: 10px; padding: 10px 26px;
  box-shadow: 0 3px 10px rgba(93,122,78,.4); transition: transform .12s, background .15s;
}
.snake-btn:hover { background: #4c6540; }
.snake-btn:active { transform: scale(.95); }
.snake-pad {
  display: none; margin-top: 16px; grid-template-columns: repeat(3, 64px); grid-template-rows: repeat(3, 64px); gap: 8px;
}
.snake-pad button {
  border: none; border-radius: 14px; background: #e3ecd9; color: #5d7a4e; font-size: 1.5rem;
  box-shadow: 0 3px 8px rgba(93,122,78,.25); cursor: pointer; touch-action: manipulation;
}
.snake-pad button:active { background: #cddcbb; transform: scale(.94); }
.snake-pad .spacer { visibility: hidden; }
@media (pointer: coarse) { .snake-pad { display: grid; } }
.snake-hint { margin-top: 10px; font-size: .75rem; color: #a3b193; }
</style>

<div class="snake-stage">
  <a class="snake-back" href="/games/">← 返回游戏列表</a>
  <div class="snake-head">
    <div class="snake-title">贪吃蛇<small>吃豆变长，别撞到自己！</small></div>
    <div class="snake-scores">
      <div class="snake-score"><div class="lbl">得分</div><div class="val" id="snakescore">0</div></div>
      <div class="snake-score"><div class="lbl">最高</div><div class="val" id="snakebest">0</div></div>
    </div>
  </div>
  <div class="snake-wrap">
    <canvas class="snake-canvas" id="snakecanvas"></canvas>
    <div class="snake-mask show" id="snakemask">
      <h2 id="snakemasktitle">贪吃蛇</h2>
      <p>方向键 / 滑动 / 按钮控制方向<br>吃到豆子加速，小心别撞墙！</p>
      <button class="snake-btn" id="snakestart">开始游戏</button>
    </div>
  </div>
  <div class="snake-pad" id="snakepad">
    <span class="spacer"></span><button data-d="up">▲</button><span class="spacer"></span>
    <button data-d="left">◀</button><button data-d="down">▼</button><button data-d="right">▶</button>
  </div>
  <div class="snake-hint">空格键暂停 · 速度会随得分提升</div>
</div>

<script>
(function(){
  "use strict";
  var COLS = 20, ROWS = 20;
  var canvas = document.getElementById('snakecanvas');
  var ctx = canvas.getContext('2d');
  var scoreEl = document.getElementById('snakescore');
  var bestEl = document.getElementById('snakebest');
  var maskEl = document.getElementById('snakemask');
  var maskTitle = document.getElementById('snakemasktitle');
  var startBtn = document.getElementById('snakestart');

  var snake, dir, nextDir, food, score, best, timer, speed, running, paused, grow;

  try { best = parseInt(localStorage.getItem('snake_best') || '0', 10) || 0; } catch(e){ best = 0; }
  bestEl.textContent = best;

  function fitCanvas(){
    var size = canvas.clientWidth;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr; canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (running || paused) draw();
  }

  function reset(){
    var cx = Math.floor(COLS/2), cy = Math.floor(ROWS/2);
    snake = [{x:cx,y:cy},{x:cx-1,y:cy},{x:cx-2,y:cy}];
    dir = {x:1,y:0}; nextDir = {x:1,y:0};
    score = 0; speed = 150; grow = 0; paused = false;
    scoreEl.textContent = '0';
    placeFood();
  }

  function placeFood(){
    while (true){
      var f = { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) };
      var ok = true;
      for (var i=0;i<snake.length;i++) if (snake[i].x===f.x && snake[i].y===f.y){ ok=false; break; }
      if (ok){ food = f; return; }
    }
  }

  function step(){
    dir = nextDir;
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS){ return gameOver(); }
    for (var i=0;i<snake.length- (grow>0?0:1);i++){
      if (snake[i].x===head.x && snake[i].y===head.y){ return gameOver(); }
    }
    snake.unshift(head);
    if (head.x===food.x && head.y===food.y){
      score += 10;
      scoreEl.textContent = score;
      if (score > best){ best = score; bestEl.textContent = best; try{ localStorage.setItem('snake_best', String(best)); }catch(e){} }
      if (speed > 70){ speed -= 4; restartTimer(); }
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function restartTimer(){
    if (timer) clearInterval(timer);
    timer = setInterval(step, speed);
  }

  function draw(){
    var W = canvas.clientWidth, cell = W / COLS;
    ctx.clearRect(0, 0, W, W);
    // 棋盘格
    ctx.fillStyle = 'rgba(93,122,78,0.045)';
    for (var y=0;y<ROWS;y++) for (var x=0;x<COLS;x++){
      if ((x+y)%2===0) ctx.fillRect(x*cell, y*cell, cell, cell);
    }
    // 食物
    var fx = food.x*cell, fy = food.y*cell;
    ctx.beginPath();
    ctx.arc(fx+cell/2, fy+cell/2, cell*0.36, 0, Math.PI*2);
    ctx.fillStyle = '#d9534f';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fx+cell/2-cell*0.1, fy+cell/2-cell*0.12, cell*0.1, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fill();
    // 蛇
    for (var i=snake.length-1;i>=0;i--){
      var s = snake[i], px = s.x*cell, py = s.y*cell, pad = cell*0.08;
      var t = i / Math.max(1, snake.length-1);
      if (i===0){
        ctx.fillStyle = '#4c6540';
        roundRect(px+pad*0.5, py+pad*0.5, cell-pad, cell-pad, cell*0.28);
        ctx.fill();
        // 眼睛
        var ex = px+cell/2, ey = py+cell/2, er = cell*0.09;
        var ox = dir.x!==0 ? 0 : cell*0.16, oy = dir.y!==0 ? 0 : cell*0.16;
        var fx2 = dir.x*cell*0.12, fy2 = dir.y*cell*0.12;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(ex-ox+fx2, ey-oy+fy2, er*1.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex+ox+fx2, ey+oy+fy2, er*1.5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(ex-ox+fx2*1.4, ey-oy+fy2*1.4, er*0.8, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex+ox+fx2*1.4, ey+oy+fy2*1.4, er*0.8, 0, Math.PI*2); ctx.fill();
      } else {
        var g = Math.round(122 - t*40), r = Math.round(93 + t*30);
        ctx.fillStyle = 'rgb('+r+','+g+',78)';
        roundRect(px+pad, py+pad, cell-pad*2, cell-pad*2, cell*0.3);
        ctx.fill();
      }
    }
    if (paused){
      ctx.fillStyle = 'rgba(247,243,232,.7)';
      ctx.fillRect(0,0,W,W);
      ctx.fillStyle = '#5d7a4e';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('已暂停', W/2, W/2);
    }
  }

  function roundRect(x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }

  function gameOver(){
    running = false;
    if (timer) clearInterval(timer);
    maskTitle.textContent = '游戏结束';
    var oldFinal = maskEl.querySelector('.final');
    if (oldFinal) oldFinal.remove();
    var div = document.createElement('div');
    div.className = 'final';
    div.textContent = '得分：' + score + '　最高分：' + best;
    startBtn.parentNode.insertBefore(div, startBtn);
    startBtn.textContent = '再来一局';
    maskEl.classList.add('show');
  }

  function start(){
    reset();
    running = true; paused = false;
    maskTitle.textContent = '贪吃蛇';
    var oldFinal = maskEl.querySelector('.final');
    if (oldFinal) oldFinal.remove();
    maskEl.classList.remove('show');
    restartTimer();
    draw();
  }

  function setDir(d){
    var map = { up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0} };
    var nd = map[d];
    if (!nd || !running || paused) return;
    if (nd.x === -dir.x && nd.y === -dir.y) return;
    nextDir = nd;
  }

  startBtn.addEventListener('click', start);

  document.addEventListener('keydown', function(e){
    var map = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right' };
    if (map[e.key]){ e.preventDefault(); setDir(map[e.key]); }
    else if (e.key === ' '){
      e.preventDefault();
      if (running){ paused = !paused; draw(); }
      else if (!maskEl.classList.contains('show')){ /* noop */ }
    }
  });

  var tsx=0, tsy=0;
  canvas.addEventListener('touchstart', function(e){
    var t = e.changedTouches[0]; tsx = t.clientX; tsy = t.clientY;
  }, {passive:true});
  canvas.addEventListener('touchend', function(e){
    var t = e.changedTouches[0];
    var dx = t.clientX - tsx, dy = t.clientY - tsy;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    e.preventDefault();
    if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 'right' : 'left');
    else setDir(dy > 0 ? 'down' : 'up');
  }, {passive:false});
  canvas.addEventListener('touchmove', function(e){ e.preventDefault(); }, {passive:false});

  var pad = document.getElementById('snakepad');
  pad.addEventListener('click', function(e){
    var d = e.target.getAttribute && e.target.getAttribute('data-d');
    if (d) setDir(d);
  });
  pad.addEventListener('touchstart', function(e){
    var t = e.target.getAttribute && e.target.getAttribute('data-d');
    if (t){ e.preventDefault(); setDir(t); }
  }, {passive:false});

  window.addEventListener('resize', fitCanvas);
  fitCanvas();
  reset(); draw();
})();
</script>
