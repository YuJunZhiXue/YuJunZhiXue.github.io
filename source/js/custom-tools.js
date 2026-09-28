/* 工具箱：纯前端小工具集 */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function out(id, text) { $(id).textContent = text; }
  function copyable(id, text) {
    var el = $(id);
    el.innerHTML = '';
    var span = document.createElement('span');
    span.textContent = text;
    var btn = document.createElement('button');
    btn.textContent = '复制';
    btn.onclick = function () {
      navigator.clipboard.writeText(text).then(function () { btn.textContent = '已复制'; });
      setTimeout(function () { btn.textContent = '复制'; }, 1500);
    };
    el.appendChild(span);
    el.appendChild(btn);
  }

  /* base64 unicode 安全版 */
  function b64enc(s) {
    return btoa(String.fromCharCode.apply(null, new TextEncoder().encode(s)));
  }
  function b64dec(s) {
    var bin = atob(s.replace(/\s+/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  var MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', 0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', ' ': '/' };
  var MORSE_REV = {};
  Object.keys(MORSE).forEach(function (k) { MORSE_REV[MORSE[k]] = k; });

  var handlers = {
    ts2date: function () {
      var v = parseFloat($('ts-input').value.trim());
      if (isNaN(v)) return out('ts-out', '请输入有效时间戳');
      if (v < 1e12) v = v * 1000; /* 秒→毫秒 */
      var d = new Date(v);
      out('ts-out', d.toLocaleString('zh-CN', { hour12: false }));
    },
    tsnow: function () {
      var now = Math.floor(Date.now() / 1000);
      $('ts-input').value = now;
      out('ts-out', new Date().toLocaleString('zh-CN', { hour12: false }));
    },
    date2ts: function () {
      var v = $('ts-date').value;
      if (!v) return out('ts-out', '请选择日期时间');
      var t = Math.floor(new Date(v).getTime() / 1000);
      copyable('ts-out', String(t));
    },
    b64enc: function () { try { copyable('b64-out', b64enc($('b64-in').value)); } catch (e) { out('b64-out', '编码失败'); } },
    b64dec: function () { try { copyable('b64-out', b64dec($('b64-in').value)); } catch (e) { out('b64-out', '解码失败：不是有效 Base64'); } },
    urlenc: function () { copyable('url-out', encodeURIComponent($('url-in').value)); },
    urldec: function () { try { copyable('url-out', decodeURIComponent($('url-in').value)); } catch (e) { out('url-out', '解码失败'); } },
    jsonfmt: function () {
      try { copyable('json-out', JSON.stringify(JSON.parse($('json-in').value), null, 2)); }
      catch (e) { out('json-out', 'JSON 解析失败：' + e.message); }
    },
    jsonmin: function () {
      try { copyable('json-out', JSON.stringify(JSON.parse($('json-in').value))); }
      catch (e) { out('json-out', 'JSON 解析失败：' + e.message); }
    },
    retest: function () {
      var pat = $('re-pat').value, flags = $('re-flags').value.replace(/[^gimsuy]/g, ''), text = $('re-text').value;
      try {
        var re = new RegExp(pat, flags.indexOf('g') >= 0 ? flags : flags + 'g');
        var m, res = [], i = 0;
        while ((m = re.exec(text)) !== null && i < 50) { res.push(m[0]); i++; if (m[0] === '') re.lastIndex++; }
        out('re-out', res.length ? '命中 ' + res.length + ' 处：' + res.slice(0, 10).join(' | ') + (res.length > 10 ? ' …' : '') : '无匹配');
      } catch (e) { out('re-out', '正则错误：' + e.message); }
    },
    numconv: function () {
      var raw = $('num-in').value.trim(), base = parseInt($('num-base').value, 10);
      var n = parseInt(raw.replace(/^0x/i, ''), base);
      if (isNaN(n)) return out('num-out', '请输入有效数字');
      out('num-out', '二进制: ' + n.toString(2) + '\n八进制: ' + n.toString(8) + '\n十进制: ' + n.toString(10) + '\n十六进制: 0x' + n.toString(16).toUpperCase());
    },
    pwgen: function () {
      var len = Math.min(64, Math.max(4, parseInt($('pw-len').value, 10) || 16));
      var pool = '';
      if ($('pw-upper').checked) pool += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      if ($('pw-lower').checked) pool += 'abcdefghijkmnpqrstuvwxyz';
      if ($('pw-digit').checked) pool += '23456789';
      if ($('pw-sym').checked) pool += '!@#$%^&*()-_=+[]{};:,.<>?';
      if (!pool) return out('pw-out', '至少选一种字符');
      var arr = new Uint32Array(len), s = '';
      crypto.getRandomValues(arr);
      for (var i = 0; i < len; i++) s += pool[arr[i] % pool.length];
      copyable('pw-out', s);
    },
    morseenc: function () {
      var s = $('morse-in').value.toUpperCase().split('').map(function (c) { return MORSE[c] || '?'; }).join(' ');
      copyable('morse-out', s);
    },
    morsedec: function () {
      var s = $('morse-in').value.trim().split(/\s+/).map(function (c) { return MORSE_REV[c] || '?'; }).join('');
      copyable('morse-out', s);
    }
  };

  document.querySelectorAll('#tools-grid [data-act]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var fn = handlers[btn.getAttribute('data-act')];
      if (fn) fn();
    });
  });
})();
