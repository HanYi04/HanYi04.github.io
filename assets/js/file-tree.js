// =============================================================
//  把扁平的文件列表重建成可折叠的目录树，支持任意层嵌套
//  设计原则：任何一步出错都不破坏原始列表（失败就保持扁平显示）
// =============================================================
(function () {
  'use strict';

  var container = document.querySelector('.file-tree');
  if (!container) return;

  var itemList = container.querySelectorAll('.file-item');
  if (!itemList.length) return;

  try {
    // ---------- 1. 建树（用普通对象，不用 Map）----------
    var root = { dirs: {}, files: [] };

    for (var i = 0; i < itemList.length; i++) {
      var el = itemList[i];
      var path = el.getAttribute('data-path') || '';
      var parts = path.split('/').filter(function (s) { return s; });
      parts.pop();                       // 去掉文件名，剩下目录层级

      var node = root;
      for (var j = 0; j < parts.length; j++) {
        var name = parts[j];
        if (!node.dirs[name]) {
          node.dirs[name] = { dirs: {}, files: [] };
        }
        node = node.dirs[name];
      }
      node.files.push(el);
    }

    // ---------- 2. 统计每个目录的文件总数 ----------
    function countAll(node) {
      var n = node.files.length;
      for (var k in node.dirs) {
        if (Object.prototype.hasOwnProperty.call(node.dirs, k)) {
          n += countAll(node.dirs[k]);
        }
      }
      node.total = n;
      return n;
    }
    countAll(root);

    // 根目录下没有任何文件夹 → 保持扁平，不动
    if (Object.keys(root.dirs).length === 0) return;

    // ---------- 3. 渲染 ----------
    function build(node, depth) {
      var frag = document.createDocumentFragment();
      var names = Object.keys(node.dirs).sort(function (a, b) {
        return a < b ? -1 : (a > b ? 1 : 0);
      });

      for (var d = 0; d < names.length; d++) {
        var dirName = names[d];
        var child = node.dirs[dirName];

        var details = document.createElement('details');
        details.className = 'file-group' + (depth > 0 ? ' file-group--nested' : '');

        var summary = document.createElement('summary');
        summary.className = 'file-group-head';

        var nameEl = document.createElement('span');
        nameEl.className = 'file-group-name';
        nameEl.textContent = dirName;

        var countEl = document.createElement('span');
        countEl.className = 'file-group-count';
        countEl.textContent = child.total + ' 个文件';

        summary.appendChild(nameEl);
        summary.appendChild(countEl);
        details.appendChild(summary);

        var inner = document.createElement('div');
        inner.className = 'file-list';
        inner.appendChild(build(child, depth + 1));
        details.appendChild(inner);

        frag.appendChild(details);
      }

      // 本层直接放的文件
      for (var f = 0; f < node.files.length; f++) {
        frag.appendChild(node.files[f]);
      }

      return frag;
    }

    var tree = build(root, 0);

    // ---------- 4. 一次性替换 ----------
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(tree);

  } catch (err) {
    // 出任何错都保持原样，用户至少还能看到扁平列表
    if (window.console && console.warn) {
      console.warn('[file-tree] 建树失败，保持扁平列表：', err);
    }
  }
})();
