/* ============================================
 * 留言板（localStorage 本地保存，无需后端）
 * ============================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "gufeng_messages";
  var MAX_MSGS = 50;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function save(msgs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_MSGS)));
    } catch (e) {}
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    var list = document.getElementById("msg-list");
    if (!list) return;
    var msgs = load();
    if (!msgs.length) {
      list.innerHTML = '<div class="msg-empty">还没有留言，来当第一个题字人</div>';
      return;
    }
    list.innerHTML = msgs
      .slice()
      .reverse()
      .map(function (m) {
        return (
          '<div class="msg-item"><div class="msg-head"><span class="msg-author">' +
          escapeHtml(m.name || "匿名") +
          '</span><span class="msg-date">' +
          escapeHtml(m.date) +
          '</span></div><div class="msg-body">' +
          escapeHtml(m.text) +
          "</div></div>"
        );
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    var sendBtn = document.getElementById("msg-send");
    var input = document.getElementById("msg-input");
    var nameInput = document.getElementById("msg-name");
    if (!sendBtn || !input) return;

    function send() {
      var text = input.value.trim();
      if (!text) {
        input.focus();
        return;
      }
      var now = new Date();
      var msgs = load();
      msgs.push({
        name: nameInput.value.trim(),
        text: text,
        date:
          now.getFullYear() +
          "-" +
          String(now.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(now.getDate()).padStart(2, "0") +
          " " +
          String(now.getHours()).padStart(2, "0") +
          ":" +
          String(now.getMinutes()).padStart(2, "0"),
      });
      save(msgs);
      input.value = "";
      render();
    }

    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", function (e) {
      if (e.ctrlKey && e.key === "Enter") send();
    });
  });
})();
