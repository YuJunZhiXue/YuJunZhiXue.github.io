/* ============================================
 * 批次4 JS：首页组件
 * 1. 问候语打字机
 * 2. 最近更新滚动条
 * 3. 首页标签云
 * 4. 分类标签卡片墙
 * ============================================ */
(function () {
  "use strict";

  // 只在首页执行
  var isHome = document.body.classList.contains("home-page") ||
    !!document.getElementById("recent-posts") ||
    window.location.pathname === "/";

  /* ===== 1. 问候语打字机 ===== */
  function initGreeting() {
    if (!isHome) return;
    var hero = document.createElement("div");
    hero.className = "hero-greeting";
    hero.innerHTML =
      '<div class="greeting-time"></div>' +
      '<div><span class="greeting-sub"></span><span class="greeting-cursor"></span></div>';

    var recent = document.getElementById("recent-posts");
    var siteInfo = document.querySelector(".site-info, #page-header");
    var anchor = recent || siteInfo;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(hero, anchor);
    } else {
      document.body.insertBefore(hero, document.body.firstChild);
      return;
    }

    // 时辰问候
    var h = new Date().getHours();
    var timeText, subText;
    if (h < 5) { timeText = "夜深了"; subText = "文章如烛火，长夜共此读"; }
    else if (h < 9) { timeText = "早安"; subText = "晨光正好，宜读旧文，宜写新篇"; }
    else if (h < 12) { timeText = "上午好"; subText = "纸上得来终觉浅，绝知此事要躬行"; }
    else if (h < 14) { timeText = "午安"; subText = "偷得浮生半日闲，且读且行"; }
    else if (h < 18) { timeText = "下午好"; subText = "墨香伴茶香，时光正慢"; }
    else if (h < 22) { timeText = "晚上好"; subText = "挑灯夜读，不负光阴"; }
    else { timeText = "夜深了"; subText = "文章如烛火，长夜共此读"; }

    hero.querySelector(".greeting-time").textContent = timeText;

    // 打字机效果
    var subEl = hero.querySelector(".greeting-sub");
    var idx = 0;
    function type() {
      if (idx <= subText.length) {
        subEl.textContent = subText.slice(0, idx);
        idx++;
        setTimeout(type, 120);
      }
    }
    setTimeout(type, 400);
  }

  /* ===== 2. 最近更新滚动条 + 3. 标签云 + 4. 分类墙 ===== */
  function initHomeWidgets() {
    if (!isHome) return;
    fetch("/posts-data.json")
      .then(function (r) { return r.json(); })
      .then(function (posts) {
        if (!Array.isArray(posts) || !posts.length) return;
        renderRecentStrip(posts);
        renderTagCloud(posts);
        renderCategoryWall(posts);
      })
      .catch(function () {});
  }

  /* 最近更新滚动条（取最新 10 篇）*/
  function renderRecentStrip(posts) {
    var recent = document.getElementById("recent-posts");
    if (!recent) return;
    // 按日期排序
    var sorted = posts.slice().sort(function (a, b) {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
    var top10 = sorted.slice(0, 10);

    var strip = document.createElement("div");
    strip.className = "recent-strip";
    strip.innerHTML =
      '<div class="strip-head"><span class="strip-title">最近更新</span>' +
      '<a class="strip-more" href="/archives/">查看全部 →</a></div>' +
      '<div class="recent-scroll"></div>';

    var scroll = strip.querySelector(".recent-scroll");
    top10.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "recent-item";
      a.href = p.url;
      // 封面：首图或默认
      var thumb = p.cover || p.firstimage || "";
      a.innerHTML =
        (thumb
          ? '<img class="recent-thumb" src="' + thumb + '" loading="lazy" alt="">'
          : '<div class="recent-thumb" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;opacity:.3;">◈</div>') +
        '<div class="recent-meta"><div class="recent-name"></div>' +
        '<div class="recent-date">' + (p.date || "").slice(0, 10) + "</div></div>";
      a.querySelector(".recent-name").textContent = p.title;
      scroll.appendChild(a);
    });

    recent.parentNode.insertBefore(strip, recent);
  }

  /* 首页标签云 */
  function renderTagCloud(posts) {
    var recent = document.getElementById("recent-posts");
    if (!recent) return;
    // 统计标签（search.json 的 tags 字段）
    var tagMap = {};
    posts.forEach(function (p) {
      var tags = p.tags || [];
      if (typeof tags === "string") tags = [tags];
      tags.forEach(function (t) {
        tagMap[t] = (tagMap[t] || 0) + 1;
      });
    });
    var tags = Object.keys(tagMap).sort(function (a, b) { return tagMap[b] - tagMap[a]; }).slice(0, 16);
    if (!tags.length) return;

    var cloud = document.createElement("div");
    cloud.className = "home-tag-cloud";
    cloud.innerHTML = '<div class="cloud-title">标签</div><div class="tag-list"></div>';
    var list = cloud.querySelector(".tag-list");
    tags.forEach(function (t) {
      var a = document.createElement("a");
      a.className = "tag-pill";
      a.href = "/tags/" + encodeURIComponent(t) + "/";
      a.innerHTML = '<span class="tag-name"></span><span class="tag-count">' + tagMap[t] + "</span>";
      a.querySelector(".tag-name").textContent = t;
      list.appendChild(a);
    });

    var strip = document.querySelector(".recent-strip");
    if (strip) {
      strip.parentNode.insertBefore(cloud, strip.nextSibling);
    } else {
      recent.parentNode.insertBefore(cloud, recent);
    }
  }

  /* 分类标签卡片墙 */
  function renderCategoryWall(posts) {
    var recent = document.getElementById("recent-posts");
    if (!recent) return;
    var catMap = {};
    posts.forEach(function (p) {
      var cats = p.categories || [];
      if (typeof cats === "string") cats = [cats];
      cats.forEach(function (c) {
        catMap[c] = (catMap[c] || 0) + 1;
      });
    });
    var cats = Object.keys(catMap).sort(function (a, b) { return catMap[b] - catMap[a]; }).slice(0, 8);
    if (!cats.length) return;

    var wall = document.createElement("div");
    wall.className = "home-category-wall";
    cats.forEach(function (c) {
      var a = document.createElement("a");
      a.className = "cat-card";
      a.href = "/categories/" + encodeURIComponent(c) + "/";
      a.innerHTML = '<div class="cat-name"></div><div class="cat-count">' + catMap[c] + " 篇</div>";
      a.querySelector(".cat-name").textContent = c;
      wall.appendChild(a);
    });

    var cloud = document.querySelector(".home-tag-cloud");
    if (cloud) {
      cloud.parentNode.insertBefore(wall, cloud.nextSibling);
    } else {
      recent.parentNode.insertBefore(wall, recent);
    }
  }

  /* ===== 启动 ===== */
  document.addEventListener("DOMContentLoaded", function () {
    initGreeting();
    initHomeWidgets();
  });
})();
