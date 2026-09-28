---
title: 小游戏
type: page
date: 2026-09-28 17:00:00
comments: false
---

<style>
.games-grid {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 20px 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
}
.game-card {
  border-radius: 1rem;
  border: 1px solid rgba(73, 177, 245, .15);
  background: var(--paper);
  overflow: hidden;
  transition: all .3s cubic-bezier(.4, 0, .2, 1);
  text-decoration: none !important;
  display: block;
}
.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px -12px rgba(7, 17, 27, .08);
  border-color: rgba(73, 177, 245, .35);
}
.game-icon {
  font-size: 3rem;
  text-align: center;
  padding: 1.5rem 0 .5rem;
}
.game-body { padding: .5rem 1.2rem 1.3rem; text-align: center; }
.game-name { font-size: 1.1rem; font-weight: 700; font-family: "Noto Serif SC", serif; margin-bottom: .4rem; color: var(--font-color); }
.game-desc { font-size: .82rem; line-height: 1.7; opacity: .7; }
</style>

<div class="games-grid">
  <a class="game-card" href="/games/2048/">
    <div class="game-icon">🔢</div>
    <div class="game-body">
      <div class="game-name">2048</div>
      <div class="game-desc">滑动合并数字，挑战 2048！支持键盘与触屏操作</div>
    </div>
  </a>
  <a class="game-card" href="/games/snake/">
    <div class="game-icon">🐍</div>
    <div class="game-body">
      <div class="game-name">贪吃蛇</div>
      <div class="game-desc">经典贪吃蛇，越吃越长，越吃越快，别撞到自己</div>
    </div>
  </a>
  <a class="game-card" href="/games/minesweeper/">
    <div class="game-icon">💣</div>
    <div class="game-body">
      <div class="game-name">扫雷</div>
      <div class="game-desc">经典扫雷，考验逻辑与运气，支持多难度</div>
    </div>
  </a>
  <a class="game-card" href="/relife/">
    <div class="game-icon">🎲</div>
    <div class="game-body">
      <div class="game-name">人生重开模拟器</div>
      <div class="game-desc">这垃圾人生一秒也不想待了？那就重开吧</div>
    </div>
  </a>
</div>
