/* ============================================
 * 书单影单（本地数据，Tab 切换）
 * ============================================ */
(function () {
  "use strict";

  var BOOKS = [
    {
      title: "代码整洁之道",
      meta: "Robert C. Martin · 2008",
      note: "程序员的基本功书。变量命名、函数拆分、注释边界——看起来都是小事，写大了全是事故。",
      cover: "https://cdn.jsdelivr.net/gh/YuJunZhiXue/YuJunZhiXue.github.io@master/source/images/legacy.png",
    },
    {
      title: "深入理解 Java 虚拟机",
      meta: "周志明 · 第3版",
      note: "Java 进阶绕不开的书。内存模型、垃圾回收、类加载，面试问的都在这儿。",
      cover: "",
    },
    {
      title: "人月神话",
      meta: "Frederick Brooks · 1975",
      note: "「加人不能让项目更快」——五十年前就说透了，五十年后还在犯。",
      cover: "",
    },
  ];

  var MOVIES = [
    {
      title: "大话西游",
      meta: "1995 · 刘镇伟",
      note: "小时候看笑了，长大了看哭了。所有的「如果能重来」，其实都回不去。",
      cover: "",
    },
    {
      title: "霸王别姬",
      meta: "1993 · 陈凯歌",
      note: "不疯魔不成活。一部电影看懂什么叫「痴」。",
      cover: "",
    },
    {
      title: "三傻大闹宝莱坞",
      meta: "2009 · 拉库马·希拉尼",
      note: "「追求卓越，成功就会追着你跑」。笑着看完，回头想了很久。",
      cover: "",
    },
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("media-list");
    var tabs = document.querySelectorAll(".media-tab");
    if (!list || !tabs.length) return;

    var current = "book";

    function render() {
      var data = current === "book" ? BOOKS : MOVIES;
      list.innerHTML = data
        .map(function (m) {
          return (
            '<div class="media-item">' +
            (m.cover
              ? '<img class="media-cover" src="' + m.cover + '" loading="lazy" alt="' + m.title + '">'
              : '<div class="media-cover" style="display:flex;align-items:center;justify-content:center;font-size:1.4rem;opacity:.25;">◈</div>') +
            '<div class="media-info"><div class="media-title">' + m.title + "</div>" +
            '<div class="media-meta">' + m.meta + "</div>" +
            '<div class="media-note">' + m.note + "</div></div></div>"
          );
        })
        .join("");
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        current = tab.getAttribute("data-media");
        render();
      });
    });

    render();
  });
})();
