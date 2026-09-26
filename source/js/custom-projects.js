/* ============================================
 * 项目展示页（从 GitHub API 拉取仓库）
 * ============================================ */
(function () {
  "use strict";

  var USERNAME = "YuJunZhiXue";
  // 固定展示的项目（手动维护，比 API 更可控）
  var FEATURED = [
    {
      name: "YuJunZhiXue.github.io",
      desc: "个人技术博客 · Hexo + Butterfly 古风主题，GitHub Pages + Cloudflare 双线部署",
      url: "https://github.com/YuJunZhiXue/YuJunZhiXue.github.io",
      tags: ["Hexo", "Butterfly", "Cloudflare"],
    },
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("project-grid");
    if (!grid) return;

    // 先渲染固定项目
    grid.innerHTML = FEATURED.map(renderCard).join("");

    // 再从 GitHub 拉其他仓库
    fetch("https://api.github.com/users/" + USERNAME + "/repos?sort=updated&per_page=20")
      .then(function (r) { return r.json(); })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;
        var featuredNames = FEATURED.map(function (f) { return f.name.toLowerCase(); });
        var extra = repos.filter(function (repo) {
          return (
            !repo.fork &&
            !repo.archived &&
            repo.name.toLowerCase() !== "yujunzhixue.github.io" &&
            featuredNames.indexOf(repo.name.toLowerCase()) === -1
          );
        }).slice(0, 5);

        if (extra.length) {
          grid.innerHTML += extra
            .map(function (repo) {
              return renderCard({
                name: repo.name,
                desc: repo.description || "暂无描述",
                url: repo.html_url,
                tags: [repo.language || "Code", "★ " + repo.stargazers_count],
              });
            })
            .join("");
        }
      })
      .catch(function () {
        grid.innerHTML += '<div class="msg-empty">GitHub 数据加载失败（可能需要代理）</div>';
      });
  });

  function renderCard(p) {
    return (
      '<div class="project-card"><div class="project-body">' +
      '<div class="project-name"><a href="' + p.url + '" target="_blank" rel="noopener">' + escapeHtml(p.name) + "</a></div>" +
      '<div class="project-desc">' + escapeHtml(p.desc) + "</div>" +
      '<div class="project-tags">' +
      p.tags.map(function (t) { return '<span class="project-tag">' + escapeHtml(t) + "</span>"; }).join("") +
      "</div></div></div>"
    );
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = String(str || "");
    return div.innerHTML;
  }
})();
