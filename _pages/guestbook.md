---
title: "留言板"
layout: gridlay
permalink: /guestbook/
---

## 留言板

有话想说、想留个联系方式、或者想传个文件，都可以写在这里。昵称可以留空，留空就显示「匿名」。

{::nomarkdown}
<div class="gb-wrap">

  <form id="gb-form" class="gb-form" autocomplete="off">
    <div class="gb-row">
      <label for="gb-name">昵称</label>
      <input id="gb-name" name="name" type="text" maxlength="30" placeholder="可留空">
    </div>

    <div class="gb-row">
      <label for="gb-content">内容</label>
      <textarea id="gb-content" name="content" rows="4" maxlength="2000" required
                placeholder="想说的话，最多 2000 字"></textarea>
    </div>

    <div class="gb-row">
      <label for="gb-file">附件</label>
      <input id="gb-file" name="file" type="file">
      <p class="gb-hint">可选，单个文件不超过 20MB。图片会在留言里直接显示下载链接。</p>
    </div>

    <div class="gb-actions">
      <button type="submit" class="gb-submit">发布留言</button>
      <span id="gb-status" class="gb-status"></span>
    </div>
  </form>

  <hr class="gb-divider">

  <div id="gb-list" class="gb-list"></div>

  <div class="gb-more-wrap">
    <button id="gb-more" class="gb-more" type="button" style="display:none">加载更早的留言</button>
  </div>

</div>
{:/nomarkdown}

<script src="{{ '/assets/js/guestbook.js' | relative_url }}" defer></script>
