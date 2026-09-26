/* ============================================
 * 批次2 JS：侧边栏组件数据驱动
 * 1. 个人卡片统计（文章数/字数/运行天数）
 * 2. GitHub 仓库卡片
 * 3. 农历日历
 * 4. 在线人数/访客统计
 * 5. 即时搜索
 * 6. 一言
 * ============================================ */
(function () {
  "use strict";

  /* ===== 1. 个人卡片统计 ===== */
  function initAuthorStats() {
    var el = document.getElementById("author-stats");
    if (!el) return;
    // 文章数：从 search.json 统计
    fetch("/search.json")
      .then(function (r) { return r.json(); })
      .then(function (posts) {
        var wordCount = 0;
        posts.forEach(function (p) {
          wordCount += (p.content || "").length;
        });
        el.querySelector('[data-stat="posts"]').textContent = posts.length;
        el.querySelector('[data-stat="words"]').textContent =
          wordCount > 10000 ? (wordCount / 10000).toFixed(1) + "万" : wordCount;
      })
      .catch(function () {});
    // 运行天数
    var startDate = new Date("2018-02-04");
    var days = Math.floor((Date.now() - startDate.getTime()) / 86400000);
    el.querySelector('[data-stat="days"]').textContent = days;
  }

  /* ===== 2. GitHub 仓库卡片 ===== */
  function initGithubCard() {
    var el = document.getElementById("gh-repos");
    if (!el) return;
    var username = el.getAttribute("data-username") || "YuJunZhiXue";
    fetch("https://api.github.com/users/" + username + "/repos?sort=updated&per_page=4")
      .then(function (r) { return r.json(); })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;
        el.innerHTML = repos
          .map(function (repo) {
            return '<a class="gh-repo" href="' + repo.html_url + '" target="_blank" rel="noopener">' +
              '<div class="gh-repo-name">' + (repo.fork ? "⑂ " : "") + repo.name + '</div>' +
              (repo.description ? '<div class="gh-repo-desc">' + repo.description + "</div>" : "") +
              '<div class="gh-repo-stars">★ ' + repo.stargazers_count + " · ⑂ " + repo.forks_count + "</div>" +
              "</a>";
          })
          .join("");
      })
      .catch(function () {
        el.innerHTML = '<div class="search-empty">GitHub 数据加载失败（可能需要代理）</div>';
      });
  }

  /* ===== 3. 农历日历 ===== */
  var LUNAR_INFO = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  ];
  function lunarYearDays(y) {
    var sum = 348;
    for (var i = 0x8000; i > 0x8; i >>= 1) {
      sum += LUNAR_INFO[y - 1900] & i ? 1 : 0;
    }
    return sum + leapDays(y);
  }
  function leapMonth(y) { return LUNAR_INFO[y - 1900] & 0xf; }
  function leapDays(y) {
    if (leapMonth(y)) return LUNAR_INFO[y - 1900] & 0x10000 ? 30 : 29;
    return 0;
  }
  function monthDays(y, m) { return LUNAR_INFO[y - 1900] & (0x10000 >> m) ? 30 : 29; }
  function toLunar(date) {
    var offset = (date.getTime() - new Date(1900, 0, 31).getTime()) / 86400000;
    var temp = 0,
      i,
      lunarYear,
      lunarMonth,
      lunarDay,
      isLeap = false;
    for (i = 1900; i < 2100 && offset > 0; i++) {
      temp = lunarYearDays(i);
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;
      i--;
    }
    lunarYear = i;
    var leap = leapMonth(i);
    isLeap = false;
    for (i = 1; i < 13 && offset > 0; i++) {
      if (leap > 0 && i === leap + 1 && !isLeap) {
        --i;
        isLeap = true;
        temp = leapDays(lunarYear);
      } else {
        temp = monthDays(lunarYear, i);
      }
      if (isLeap && i === leap + 1) isLeap = false;
      offset -= temp;
    }
    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) isLeap = false;
      else {
        isLeap = true;
        --i;
      }
    }
    if (offset < 0) {
      offset += temp;
      --i;
    }
    lunarMonth = i;
    lunarDay = offset + 1;
    return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap: isLeap };
  }
  var LUNAR_MONTHS = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
  var LUNAR_DAYS = ["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];
  var JIEQI = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
  function getJieqi(date) {
    // 粗略节气：按日期估算（够用，精确到日需寿星天文算法）
    var m = date.getMonth() + 1, d = date.getDate();
    var ranges = [[1,6,"小寒"],[1,21,"大寒"],[2,4,"立春"],[2,19,"雨水"],[3,6,"惊蛰"],[3,21,"春分"],[4,5,"清明"],[4,20,"谷雨"],[5,6,"立夏"],[5,21,"小满"],[6,6,"芒种"],[6,21,"夏至"],[7,7,"小暑"],[7,23,"大暑"],[8,8,"立秋"],[8,23,"处暑"],[9,8,"白露"],[9,23,"秋分"],[10,8,"寒露"],[10,24,"霜降"],[11,7,"立冬"],[11,22,"小雪"],[12,7,"大雪"],[12,22,"冬至"]];
    var current = "暂无节气";
    for (var i = 0; i < ranges.length; i++) {
      if (m > ranges[i][0] || (m === ranges[i][0] && d >= ranges[i][1])) {
        current = ranges[i][2];
      }
    }
    return current;
  }
  function initLunar() {
    var el = document.getElementById("lunar-card");
    if (!el) return;
    var now = new Date();
    var lunar = toLunar(now);
    var monthName = LUNAR_MONTHS[lunar.month - 1] + "月";
    var dayName = LUNAR_DAYS[lunar.day - 1];
    el.querySelector('[data-lunar="month"]').textContent = (lunar.isLeap ? "闰" : "") + monthName;
    el.querySelector('[data-lunar="day"]').textContent = lunar.day;
    el.querySelector('[data-lunar="dayname"]').textContent = dayName;
    el.querySelector('[data-lunar="gregorian"]').textContent =
      now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日";
    el.querySelector('[data-lunar="jieqi"]').textContent = getJieqi(now);
  }

  /* ===== 4. 在线统计（localStorage 模拟 + 不蒜子真实数据）===== */
  function initOnline() {
    var el = document.getElementById("online-card");
    if (!el) return;
    // 今日访问：本地计数
    var today = new Date().toDateString();
    var storage = localStorage.getItem("gufeng_visits") || "{}";
    var visits = {};
    try { visits = JSON.parse(storage); } catch (e) {}
    if (visits.date !== today) {
      visits = { date: today, count: 0 };
    }
    visits.count++;
    localStorage.setItem("gufeng_visits", JSON.stringify(visits));
    var todayEl = el.querySelector('[data-online="today"]');
    if (todayEl) todayEl.textContent = visits.count;
    // 总访问：不蒜子
    var totalEl = el.querySelector('[data-online="total"]');
    if (totalEl && window.busuanzi) {
      window.busuanzi.fetch();
      setTimeout(function () {
        var bv = document.getElementById("busuanzi_value_site_pv");
        if (bv) totalEl.textContent = bv.textContent;
      }, 800);
    }
  }

  /* ===== 5. 即时搜索 ===== */
  var searchCache = null;
  function initSearch() {
    var input = document.getElementById("aside-search-input");
    var results = document.getElementById("aside-search-results");
    if (!input || !results) return;

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML = "";
        return;
      }
      if (!searchCache) {
        fetch("/search.json")
          .then(function (r) { return r.json(); })
          .then(function (data) {
            searchCache = data;
            renderResults(q, results);
          })
          .catch(function () {
            results.innerHTML = '<div class="search-empty">搜索索引加载失败</div>';
          });
      } else {
        renderResults(q, results);
      }
    });
  }
  function renderResults(q, container) {
    var hits = searchCache
      .filter(function (p) {
        return (p.title || "").toLowerCase().indexOf(q) > -1;
      })
      .slice(0, 6);
    if (!hits.length) {
      container.innerHTML = '<div class="search-empty">没找到「' + q + '」相关文章</div>';
      return;
    }
    container.innerHTML = hits
      .map(function (p) {
        return '<a class="search-result-item" href="' + p.url + '">' + p.title + "</a>";
      })
      .join("");
  }

  /* ===== 6. 一言 ===== */
  function initYiyan() {
    var el = document.getElementById("yiyan-card");
    if (!el) return;
    var textEl = el.querySelector('[data-yiyan="text"]');
    var fromEl = el.querySelector('[data-yiyan="from"]');
    var btn = el.querySelector(".yiyan-refresh");

    function loadYiyan() {
      // 古诗词 API（公开免费）
      fetch("https://v1.jinrishici.com/all.json")
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.content) {
            textEl.textContent = data.content;
            fromEl.textContent = "—— " + (data.origin || {}).title + " · " + (data.origin || {}).dynasty + "《" + (data.origin || {}).author + "》";
          }
        })
        .catch(function () {
          // 兜底本地古诗
          var fallback = [
            { t: "人生若只如初见，何事秋风悲画扇", f: "—— 纳兰性德《木兰花·拟古决绝词柬友》" },
            { t: "众里寻他千百度，蓦然回首，那人却在，灯火阑珊处", f: "—— 辛弃疾《青玉案·元夕》" },
            { t: "此情可待成追忆，只是当时已惘然", f: "—— 李商隐《锦瑟》" },
            { t: "纸上得来终觉浅，绝知此事要躬行", f: "—— 陆游《冬夜读书示子聿》" },
          ];
          var pick = fallback[Math.floor(Math.random() * fallback.length)];
          textEl.textContent = pick.t;
          fromEl.textContent = pick.f;
        });
    }

    loadYiyan();
    if (btn) btn.addEventListener("click", loadYiyan);
  }

  /* ===== 启动 ===== */
  document.addEventListener("DOMContentLoaded", function () {
    initAuthorStats();
    initGithubCard();
    initLunar();
    initOnline();
    initSearch();
    initYiyan();
  });
})();
