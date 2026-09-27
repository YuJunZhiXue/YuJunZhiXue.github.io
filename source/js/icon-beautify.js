// 图标美化：把常用 FA 实心图标替换为 Remix Icon 线性图标
// 只替换视觉，不改变动结构
(function () {
  "use strict";
  // FA 类名 → Remix Icon 类名（精选常用图标）
  const MAP = {
    "fa-home": "ri-home-4-line",
    "fa-archive": "ri-archive-line",
    "fa-folder-open": "ri-folder-open-line",
    "fa-tags": "ri-price-tag-3-line",
    "fa-comment-dots": "ri-chat-quote-line",
    "fa-camera-retro": "ri-camera-lens-line",
    "fa-calendar-day": "ri-calendar-2-line",
    "fa-chart-line": "ri-line-chart-line",
    "fa-fire": "ri-fire-line",
    "fa-search": "ri-search-line",
    "fa-history": "ri-history-line",
    "fa-book": "ri-book-2-line",
    "fa-link": "ri-links-line",
    "fa-user": "ri-user-3-line",
    "fa-heart": "ri-heart-3-line",
    "fa-clock": "ri-time-line",
    "fa-edit": "ri-edit-2-line",
    "fa-arrow-up": "ri-arrow-up-line",
    "fa-arrow-left": "ri-arrow-left-line",
    "fa-arrow-right": "ri-arrow-right-line",
    "fa-list": "ri-list-unordered",
    "fa-th": "ri-grid-line",
    "fa-bars": "ri-menu-line",
    "fa-times": "ri-close-line",
    "fa-copy": "ri-file-copy-2-line",
    "fa-chevron-up": "ri-arrow-up-s-line",
    "fa-chevron-down": "ri-arrow-down-s-line",
    "fa-chevron-left": "ri-arrow-left-s-line",
    "fa-chevron-right": "ri-arrow-right-s-line",
    "fa-play": "ri-play-fill",
    "fa-pause": "ri-pause-fill",
    "fa-step-forward": "ri-skip-forward-fill",
    "fa-step-backward": "ri-skip-back-fill",
    "fa-volume-up": "ri-volume-up-line",
    "fa-random": "ri-shuffle-line",
    "fa-music": "ri-music-2-line",
  };
  function swap() {
    document.querySelectorAll("i.fas, i.far, i.fab").forEach((el) => {
      const faCls = [...el.classList].find((c) => MAP[c]);
      if (!faCls) return;
      el.classList.remove("fas", "far", "fab", "fa-fw", faCls);
      el.classList.add(MAP[faCls]);
    });
  }
  document.addEventListener("DOMContentLoaded", swap);
  // pjax 局部刷新后重跑
  document.addEventListener("pjax:success", swap);
})();
