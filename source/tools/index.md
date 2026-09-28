---
title: 工具箱
type: page
date: 2026-09-28 12:00:00
comments: false
---

<div class="tools-grid" id="tools-grid">

<div class="tool-card" id="tool-timestamp">
  <h3>⏳ 时间戳</h3>
  <input id="ts-input" placeholder="时间戳（秒），如 1759000000">
  <div class="tool-row">
    <button data-act="ts2date">→ 日期</button>
    <button data-act="tsnow">现在</button>
  </div>
  <input id="ts-date" type="datetime-local">
  <div class="tool-row">
    <button data-act="date2ts">→ 时间戳</button>
  </div>
  <div class="tool-out" id="ts-out"></div>
</div>

<div class="tool-card" id="tool-base64">
  <h3>🔐 Base64</h3>
  <textarea id="b64-in" rows="3" placeholder="输入文本"></textarea>
  <div class="tool-row">
    <button data-act="b64enc">编码</button>
    <button data-act="b64dec">解码</button>
  </div>
  <div class="tool-out" id="b64-out"></div>
</div>

<div class="tool-card" id="tool-url">
  <h3>🔗 URL 编解码</h3>
  <textarea id="url-in" rows="3" placeholder="输入文本或 URL"></textarea>
  <div class="tool-row">
    <button data-act="urlenc">编码</button>
    <button data-act="urldec">解码</button>
  </div>
  <div class="tool-out" id="url-out"></div>
</div>

<div class="tool-card" id="tool-json">
  <h3>📦 JSON</h3>
  <textarea id="json-in" rows="3" placeholder='{"a":1}'></textarea>
  <div class="tool-row">
    <button data-act="jsonfmt">格式化</button>
    <button data-act="jsonmin">压缩</button>
  </div>
  <div class="tool-out" id="json-out"></div>
</div>

<div class="tool-card" id="tool-regex">
  <h3>🎯 正则测试</h3>
  <input id="re-pat" placeholder="正则，如 \d+">
  <input id="re-flags" placeholder="修饰符，如 gim（可空）">
  <textarea id="re-text" rows="3" placeholder="测试文本"></textarea>
  <div class="tool-row">
    <button data-act="retest">测试</button>
  </div>
  <div class="tool-out" id="re-out"></div>
</div>

<div class="tool-card" id="tool-num">
  <h3>🔢 进制转换</h3>
  <input id="num-in" placeholder="输入数字">
  <select id="num-base">
    <option value="10">十进制</option>
    <option value="16">十六进制</option>
    <option value="8">八进制</option>
    <option value="2">二进制</option>
  </select>
  <div class="tool-row">
    <button data-act="numconv">转换</button>
  </div>
  <div class="tool-out" id="num-out"></div>
</div>

<div class="tool-card" id="tool-pass">
  <h3>🎲 密码生成</h3>
  <div class="tool-row">
    <label>长度 <input id="pw-len" type="number" value="16" min="4" max="64"></label>
  </div>
  <div class="tool-row tool-checks">
    <label><input type="checkbox" id="pw-upper" checked> 大写</label>
    <label><input type="checkbox" id="pw-lower" checked> 小写</label>
    <label><input type="checkbox" id="pw-digit" checked> 数字</label>
    <label><input type="checkbox" id="pw-sym" checked> 符号</label>
  </div>
  <div class="tool-row">
    <button data-act="pwgen">生成</button>
  </div>
  <div class="tool-out" id="pw-out"></div>
</div>

<div class="tool-card" id="tool-morse">
  <h3>📡 摩斯电码</h3>
  <textarea id="morse-in" rows="3" placeholder="文本 或 .- ... --- ..."></textarea>
  <div class="tool-row">
    <button data-act="morseenc">文本 → 摩斯</button>
    <button data-act="morsedec">摩斯 → 文本</button>
  </div>
  <div class="tool-out" id="morse-out"></div>
</div>

</div>

<script src="/js/custom-tools.js?v=20260928a"></script>
