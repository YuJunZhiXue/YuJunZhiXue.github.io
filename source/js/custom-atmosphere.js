/* ============================================
 * 批次1 JS：全站氛围交互
 * 1. 标签页失焦标题切换
 * 2. 樱花飘落
 * 3. 点击水墨晕染
 * ============================================ */
(function () {
  "use strict";

  /* ===== 1. 标签页失焦动效 ===== */
  var originalTitle = document.title;
  var awayTitles = ["（꒪⌓꒪）别走啊…", "快回来写 BUG", "墨还没干，人就走了？", "回来盖个章再走"];
  var isAway = false;

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !isAway) {
      originalTitle = document.title;
      isAway = true;
      document.title = awayTitles[Math.floor(Math.random() * awayTitles.length)];
    } else if (!document.hidden && isAway) {
      document.title = originalTitle;
      isAway = false;
    }
  });

  /* ===== 2. 樱花飘落（PC 端，限量）===== */
  var isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (!isMobile) {
    var petals = ["❀", "✿", "❁", "✾"];
    var maxPetals = 12;

    function spawnPetal() {
      var petal = document.createElement("span");
      petal.className = "sakura-petal";
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.fontSize = (10 + Math.random() * 12) + "px";
      petal.style.opacity = String(0.4 + Math.random() * 0.5);
      var duration = 8 + Math.random() * 10;
      petal.style.animationDuration = duration + "s";
      document.body.appendChild(petal);
      setTimeout(function () {
        petal.remove();
      }, duration * 1000);
    }

    // 初始铺一波
    for (var i = 0; i < 5; i++) {
      setTimeout(spawnPetal, i * 800);
    }
    // 持续生成，控制上限
    setInterval(function () {
      var count = document.querySelectorAll(".sakura-petal").length;
      if (count < maxPetals) spawnPetal();
    }, 1800);
  }

  /* ===== 3. 点击水墨晕染 ===== */
  document.addEventListener("click", function (e) {
    // 忽略链接和按钮上的点击（避免干扰交互）
    if (e.target.closest("a, button, input, textarea, select, .aplayer")) return;

    var ripple = document.createElement("span");
    ripple.className = "ink-ripple";
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";
    document.body.appendChild(ripple);
    setTimeout(function () {
      ripple.remove();
    }, 800);
  });
})();
