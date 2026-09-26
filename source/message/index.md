---
title: 留言板
type: page
date: 2020-09-30 10:00:00
comments: true
---

> 来都来了，留个印再走。

<div class="message-board">
  <div class="message-form">
    <textarea id="msg-input" placeholder="写点什么……（保存在你自己的浏览器里，换设备就看不到了）"></textarea>
    <div class="msg-actions">
      <input class="msg-name" id="msg-name" type="text" placeholder="昵称" maxlength="20">
      <button class="msg-send" id="msg-send">留言</button>
    </div>
  </div>
  <div class="message-list" id="msg-list"></div>
</div>

<script src="/js/custom-message.js"></script>
