/* ============================================
 * 批次3 JS：文章页交互
 * 1. 阅读进度条
 * 2. 点赞（localStorage）
 * 3. 上下篇导航
 * 4. 代码块：语言标签 + 复制 + 折叠
 * 5. 手机悬浮工具栏
 * 6. 图片全屏查看
 * 7. TOC 滚动高亮
 * ============================================ */
(function () {
  "use strict";

  var isPostPage = !!document.getElementById("post-info") || document.body.classList.contains("post");

  /* ===== 1. 阅读进度条 ===== */
  function initReadProgress() {
    if (!isPostPage) return;
    var bar = document.createElement("div");
    bar.className = "read-progress";
    document.body.appendChild(bar);

    function update() {
      var article = document.getElementById("article-container") || document.querySelector(".post-content");
      if (!article) return;
      var total = article.offsetHeight;
      var scrolled = window.scrollY - article.offsetTop;
      var pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      bar.style.width = pct + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ===== 2. 点赞 ===== */
  function initLike() {
    var container = document.getElementById("post-actions");
    if (!container) return;
    var btn = container.querySelector(".post-like-btn");
    if (!btn) return;
    var countEl = btn.querySelector(".like-count");
    var path = window.location.pathname;
    var key = "gufeng_like_" + path;
    var liked = localStorage.getItem(key) === "1";
    var count = parseInt(countEl.textContent || "0", 10) || 0;

    function render() {
      if (liked) {
        btn.classList.add("liked");
        btn.querySelector(".like-icon").textContent = "♥";
      } else {
        btn.classList.remove("liked");
        btn.querySelector(".like-icon").textContent = "♡";
      }
      countEl.textContent = count;
    }
    render();

    btn.addEventListener("click", function () {
      liked = !liked;
      count += liked ? 1 : -1;
      localStorage.setItem(key, liked ? "1" : "0");
      render();
    });
  }

  /* ===== 3. 上下篇导航（Hexo 已渲染，这里只补样式容错）===== */
  function initPostNav() {
    // Butterfly 自带 prev/next，JS 无需处理
  }

  /* ===== 4. 代码块美化 ===== */
  function initCodeBlocks() {
    var figures = document.querySelectorAll("#article-container figure.highlight");
    figures.forEach(function (fig) {
      // 已处理过则跳过
      if (fig.querySelector(".code-lang")) return;

      // 语言名：Butterfly 高亮块的类名如 highlight yaml
      var lang = "";
      fig.classList.forEach(function (c) {
        if (c !== "highlight" && c !== "code-container" && !/^language-/.test(c)) {
          if (!lang) lang = c;
        }
      });
      lang = lang || "text";

      // 语言标签栏
      var langBar = document.createElement("div");
      langBar.className = "code-lang";
      langBar.innerHTML = '<span class="lang-name">' + lang.toUpperCase() + "</span>";

      // 折叠按钮
      var toggle = document.createElement("button");
      toggle.className = "code-toggle";
      toggle.textContent = "折叠";
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var collapsed = fig.classList.toggle("collapsed");
        toggle.textContent = collapsed ? "展开" : "折叠";
      });
      langBar.appendChild(toggle);
      fig.insertBefore(langBar, fig.firstChild);

      // 复制按钮
      var copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.textContent = "复制";
      copyBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var code = fig.querySelector("td.code, .code-container, pre");
        var text = code ? code.innerText : fig.innerText;
        // 去掉复制按钮自己的文字
        text = text.replace(/复制$|展开$|折叠$/g, "");
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          done();
        }
        function done() {
          copyBtn.textContent = "✓ 已复制";
          copyBtn.classList.add("copied");
          setTimeout(function () {
            copyBtn.textContent = "复制";
            copyBtn.classList.remove("copied");
          }, 1500);
        }
      });
      fig.appendChild(copyBtn);
    });
  }

  /* ===== 5. 手机悬浮工具栏 ===== */
  function initMobileToolbar() {
    if (!isPostPage) return;
    var toolbar = document.createElement("div");
    toolbar.className = "mobile-toolbar";
    toolbar.innerHTML =
      '<button class="tb-btn" data-tb="toc" title="目录"><i class="fas fa-list"></i></button>' +
      '<button class="tb-btn" data-tb="top" title="回顶"><i class="fas fa-arrow-up"></i></button>' +
      '<button class="tb-btn" data-tb="comment" title="评论"><i class="fas fa-comment"></i></button>' +
      '<button class="tb-btn" data-tb="theme" title="夜间模式"><i class="fas fa-moon"></i></button>';
    document.body.appendChild(toolbar);

    toolbar.querySelector('[data-tb="top"]').addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    toolbar.querySelector('[data-tb="toc"]').addEventListener("click", function () {
      var toc = document.getElementById("aside-content") || document.querySelector(".toc");
      if (toc) toc.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    toolbar.querySelector('[data-tb="comment"]').addEventListener("click", function () {
      var c = document.getElementById("post-comment") || document.querySelector("#comment");
      if (c) c.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    toolbar.querySelector('[data-tb="theme"]').addEventListener("click", function () {
      var btn = document.querySelector(".darkmode-toggle, [data-darkmode]");
      if (btn) btn.click();
    });
  }

  /* ===== 6. 图片全屏查看 ===== */
  function initImageViewer() {
    var container = document.getElementById("article-container");
    if (!container) return;
    container.addEventListener("click", function (e) {
      var img = e.target.closest("img");
      if (!img) return;
      // 排除已经在链接里的图片（不劫持原链接行为）
      if (img.closest("a")) return;

      var mask = document.createElement("div");
      mask.className = "img-viewer-mask";
      var full = document.createElement("img");
      full.src = img.src;
      mask.appendChild(full);
      mask.addEventListener("click", function () {
        mask.remove();
      });
      document.body.appendChild(mask);
    });
  }

  /* ===== 7. TOC 滚动高亮 ===== */
  function initTocHighlight() {
    var links = document.querySelectorAll("#aside-content .toc-link, .toc-link");
    if (!links.length) return;
    var headings = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href");
      if (id && id.startsWith("#")) {
        var h = document.querySelector(id);
        if (h) headings.push({ el: h, link: link });
      }
    });
    if (!headings.length) return;

    function update() {
      var scrollY = window.scrollY + 100;
      var current = null;
      headings.forEach(function (h) {
        if (h.el.offsetTop <= scrollY) current = h;
      });
      links.forEach(function (l) { l.classList.remove("toc-active"); });
      if (current) current.link.classList.add("toc-active");
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ===== 启动 ===== */
  document.addEventListener("DOMContentLoaded", function () {
    initReadProgress();
    initLike();
    initPostNav();
    initCodeBlocks();
    initMobileToolbar();
    initImageViewer();
    initTocHighlight();
  });
})();
