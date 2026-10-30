// =============================================================
//  文件预览页
//  地址形如 /view/?f=%2Fassets%2Ffiles%2F%E8%AE%B2%E4%B9%89.pdf
//  只允许预览 /assets/files/ 下的文件
// =============================================================
(function () {
  'use strict';

  var root = document.getElementById('viewer');
  if (!root) return;

  var titleEl = document.getElementById('viewer-title');
  var bodyEl = document.getElementById('viewer-body');
  var downloadEl = document.getElementById('viewer-download');
  var backEl = document.getElementById('viewer-back');

  // ---- 取出并校验 ?f= 参数 ----
  var params = new URLSearchParams(window.location.search);
  var raw = params.get('f') || '';
  var path = raw;

  try { path = decodeURIComponent(raw); } catch (e) { path = raw; }

  // 安全：只允许 assets/files/ 下的路径，禁止 .. 穿越
  var safe = path.startsWith('/assets/files/') && path.indexOf('..') === -1;

  function fail(msg) {
    if (titleEl) titleEl.textContent = '无法打开';
    if (bodyEl) {
      var p = document.createElement('p');
      p.className = 'viewer-error';
      p.textContent = msg;
      bodyEl.appendChild(p);
    }
    if (downloadEl) downloadEl.style.display = 'none';
  }

  if (!safe) {
    fail('文件路径无效。请从文件目录页点击进入。');
    return;
  }

  // ---- 文件名 ----
  var fileName = path.split('/').pop() || '文件';
  var ext = (fileName.indexOf('.') > -1 ? fileName.split('.').pop() : '').toLowerCase();

  document.title = fileName + ' · ' + (document.title.split(' · ').pop() || '');
  if (titleEl) titleEl.textContent = fileName;

  if (downloadEl) downloadEl.href = path;

  // ---- 按类型渲染 ----
  function el(tag, attrs) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  var imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg', 'bmp'];
  var videoExts = ['mp4', 'webm', 'ogv'];
  var audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
  var textExts = ['txt', 'md', 'markdown', 'csv', 'json', 'yml', 'yaml', 'log', 'tex', 'py', 'c', 'cpp', 'js', 'html', 'css'];
  var officeExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  if (ext === 'pdf') {
    // 用 <object> 而不是 <iframe>：浏览器不支持内嵌 PDF 时会显示 fallback 内容
    var obj = el('object', {
      data: path,
      type: 'application/pdf',
      'class': 'viewer-frame'
    });
    var fb = el('div', { 'class': 'viewer-fallback' });
    var fbP = el('p');
    fbP.textContent = '当前浏览器无法直接显示 PDF。';
    var fbHint = el('p');
    fbHint.className = 'viewer-fallback-hint';
    fbHint.textContent = '请点击上方「下载」按钮保存到本地后打开。';
    fb.appendChild(fbP);
    fb.appendChild(fbHint);
    obj.appendChild(fb);
    bodyEl.appendChild(obj);
    return;
  }

  if (imageExts.indexOf(ext) > -1) {
    bodyEl.appendChild(el('img', { src: path, alt: fileName, 'class': 'viewer-image' }));
    return;
  }

  if (videoExts.indexOf(ext) > -1) {
    var v = el('video', { controls: '', 'class': 'viewer-video' });
    v.src = path;
    bodyEl.appendChild(v);
    return;
  }

  if (audioExts.indexOf(ext) > -1) {
    var a = el('audio', { controls: '', 'class': 'viewer-audio' });
    a.src = path;
    bodyEl.appendChild(a);
    return;
  }

  if (textExts.indexOf(ext) > -1) {
    var pre = el('pre', { 'class': 'viewer-text' });
    pre.textContent = '加载中…';
    bodyEl.appendChild(pre);

    fetch(path)
      .then(function (r) {
        if (!r.ok) throw new Error('读取失败');
        return r.text();
      })
      .then(function (t) { pre.textContent = t; })
      .catch(function () { pre.textContent = '无法读取文件内容，请用上方按钮下载。'; });
    return;
  }

  // ---- 无法预览的类型 ----
  var hint = el('div', { 'class': 'viewer-fallback' });
  var p1 = el('p');
  p1.textContent = officeExts.indexOf(ext) > -1
    ? '浏览器无法直接预览 Office 文档。'
    : '这种类型的文件无法在浏览器里预览。';
  var p2 = el('p');
  p2.className = 'viewer-fallback-hint';
  p2.textContent = '请点击上方「下载」按钮保存到本地后打开。';
  hint.appendChild(p1);
  hint.appendChild(p2);
  bodyEl.appendChild(hint);
})();
