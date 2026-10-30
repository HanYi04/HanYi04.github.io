---
title: "查看文件"
layout: gridlay
permalink: /view/
---

{::nomarkdown}
<div class="viewer-wrap" id="viewer">

  <div class="viewer-bar">
    <a class="viewer-back" id="viewer-back" href="{{ '/files/' | relative_url }}">← 返回</a>
    <span class="viewer-title" id="viewer-title">加载中…</span>
    <a class="viewer-download" id="viewer-download" href="#" download>下载</a>
  </div>

  <div class="viewer-body" id="viewer-body"></div>

</div>
{:/nomarkdown}

<script src="{{ '/assets/js/viewer.js' | relative_url }}" defer></script>
