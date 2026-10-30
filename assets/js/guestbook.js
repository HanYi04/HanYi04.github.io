// ============================================================
//  留言板前端逻辑
//  渲染一律用 textContent，不拼 innerHTML —— 用户输入永远当纯文本
// ============================================================
(function () {
  'use strict';

  var listEl = document.getElementById('gb-list');
  var formEl = document.getElementById('gb-form');
  var statusEl = document.getElementById('gb-status');
  var loadMoreBtn = document.getElementById('gb-more');
  if (!listEl || !formEl) return;

  var cursor = null;      // 分页游标（最后一条的 created_at）
  var loading = false;

  function setStatus(text, kind) {
    if (!statusEl) return;
    statusEl.textContent = text || '';
    statusEl.className = 'gb-status' + (kind ? ' gb-status--' + kind : '');
  }

  function formatTime(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d)) return iso;
      var p = function (n) { return String(n).padStart(2, '0'); };
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
             ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    } catch (e) { return iso; }
  }

  function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  function renderMessage(m) {
    var wrap = document.createElement('div');
    wrap.className = 'gb-item';

    var head = document.createElement('div');
    head.className = 'gb-item-head';

    var who = document.createElement('span');
    who.className = 'gb-item-name';
    who.textContent = (m.name && m.name.trim()) ? m.name : '匿名';
    head.appendChild(who);

    var time = document.createElement('time');
    time.className = 'gb-item-time';
    time.textContent = formatTime(m.created_at);
    head.appendChild(time);

    wrap.appendChild(head);

    var body = document.createElement('div');
    body.className = 'gb-item-body';
    // 关键：textContent 而不是 innerHTML，任何 HTML 标签都会原样显示
    body.textContent = m.content;
    wrap.appendChild(body);

    if (m.file_key && m.file_name) {
      var fileRow = document.createElement('div');
      fileRow.className = 'gb-item-file';

      var a = document.createElement('a');
      a.href = '/api/file/' + m.file_key.replace(/^\/+/, '');
      a.textContent = '附件：' + m.file_name;
      a.setAttribute('download', '');
      fileRow.appendChild(a);

      if (m.file_size) {
        var sz = document.createElement('span');
        sz.className = 'gb-item-filesize';
        sz.textContent = '（' + formatSize(m.file_size) + '）';
        fileRow.appendChild(sz);
      }
      wrap.appendChild(fileRow);
    }

    return wrap;
  }

  function load(reset) {
    if (loading) return;
    loading = true;
    if (reset) { cursor = null; listEl.textContent = ''; }
    if (loadMoreBtn) loadMoreBtn.textContent = '加载中…';

    var url = '/api/messages?limit=20' + (cursor ? '&before=' + encodeURIComponent(cursor) : '');

    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.ok) throw new Error((data && data.error) || '加载失败');
        var msgs = data.messages || [];

        if (!msgs.length && reset) {
          var empty = document.createElement('p');
          empty.className = 'gb-empty';
          empty.textContent = '还没有人留言，来写第一条吧。';
          listEl.appendChild(empty);
        }

        msgs.forEach(function (m) { listEl.appendChild(renderMessage(m)); });

        if (msgs.length) {
          cursor = msgs[msgs.length - 1].created_at;
        }
        if (loadMoreBtn) {
          loadMoreBtn.style.display = msgs.length >= 20 ? '' : 'none';
          loadMoreBtn.textContent = '加载更早的留言';
        }
      })
      .catch(function (e) {
        setStatus(e.message || '加载失败', 'error');
        if (loadMoreBtn) loadMoreBtn.textContent = '加载更早的留言';
      })
      .finally(function () { loading = false; });
  }

  formEl.addEventListener('submit', function (ev) {
    ev.preventDefault();

    var nameInput = formEl.querySelector('[name="name"]');
    var contentInput = formEl.querySelector('[name="content"]');
    var fileInput = formEl.querySelector('[name="file"]');
    var submitBtn = formEl.querySelector('button[type="submit"]');

    var content = (contentInput.value || '').trim();
    if (!content) {
      setStatus('留言内容不能为空', 'error');
      contentInput.focus();
      return;
    }

    var fd = new FormData();
    fd.append('name', (nameInput.value || '').trim());
    fd.append('content', content);
    if (fileInput && fileInput.files && fileInput.files[0]) {
      var f = fileInput.files[0];
      if (f.size > 20 * 1024 * 1024) {
        setStatus('附件不能超过 20MB', 'error');
        return;
      }
      fd.append('file', f);
    }

    submitBtn.disabled = true;
    setStatus('正在提交…', 'busy');

    fetch('/api/messages', { method: 'POST', body: fd })
      .then(function (r) { return r.json().then(function (d) { return { status: r.status, data: d }; }); })
      .then(function (res) {
        if (!res.data || !res.data.ok) {
          throw new Error((res.data && res.data.error) || '提交失败');
        }
        formEl.reset();
        setStatus('留言已发布', 'ok');
        load(true);
      })
      .catch(function (e) {
        setStatus(e.message || '提交失败，请重试', 'error');
      })
      .finally(function () { submitBtn.disabled = false; });
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () { load(false); });
  }

  load(true);
})();
