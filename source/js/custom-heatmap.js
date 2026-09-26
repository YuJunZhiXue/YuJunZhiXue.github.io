/* ============================================
 * GitHub 贡献热力图（用 Events API 数据，前端画格子）
 * 数据源：https://api.github.com/users/{user}/events?per_page=100
 * ============================================ */
(function () {
  "use strict";

  var USERNAME = "YuJunZhiXue";

  document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("gh-heatmap");
    if (!el) return;

    fetch("https://api.github.com/users/" + USERNAME + "/events?per_page=100")
      .then(function (r) { return r.json(); })
      .then(function (events) {
        if (!Array.isArray(events) || !events.length) {
          el.innerHTML = '<div class="search-empty">暂无近期活跃数据</div>';
          return;
        }
        // 统计每天提交数
        var dayMap = {};
        events.forEach(function (ev) {
          var d = (ev.created_at || "").slice(0, 10);
          if (d) dayMap[d] = (dayMap[d] || 0) + 1;
        });

        // 画最近 12 周 × 7 天的网格
        var today = new Date();
        var weeks = 12;
        var cells = [];
        for (var i = weeks * 7 - 1; i >= 0; i--) {
          var d = new Date(today.getTime() - i * 86400000);
          var key = d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
          var count = dayMap[key] || 0;
          cells.push({ date: key, count: count, dow: d.getDay() });
        }

        var maxCount = Math.max(1, ...Object.values(dayMap));

        // 按列（周）渲染
        var html = '<div class="heatmap-grid">';
        for (var row = 0; row < 7; row++) {
          html += '<div class="heatmap-row">';
          for (var col = 0; col < weeks; col++) {
            var idx = col * 7 + row;
            var c = cells[idx];
            if (!c) {
              html += '<span class="hm-cell hm-empty"></span>';
              continue;
            }
            var level = c.count === 0 ? 0 : Math.ceil((c.count / maxCount) * 4);
            html += '<span class="hm-cell hm-l' + level + '" title="' + c.date + ' · ' + c.count + ' 条动态"></span>';
          }
          html += "</div>";
        }
        html += "</div>";

        // 统计摘要
        var total = events.length;
        var days = Object.keys(dayMap).length;
        html += '<div class="heatmap-summary">近 90 天 <b>' + total + "</b> 条公开动态 · 活跃 <b>" + days + "</b> 天</div>";

        // 图例
        html += '<div class="heatmap-legend">少 <span class="hm-cell hm-l0"></span><span class="hm-cell hm-l1"></span><span class="hm-cell hm-l2"></span><span class="hm-cell hm-l3"></span><span class="hm-cell hm-l4"></span> 多</div>';

        el.innerHTML = html;
      })
      .catch(function () {
        el.innerHTML = '<div class="search-empty">GitHub 数据加载失败（可能需要代理）</div>';
      });
  });
})();
