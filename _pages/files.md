---
title: "文件下载"
layout: gridlay
permalink: /files/
---

## 文件下载

{% comment %}
  自动扫描 assets/files/ 目录下所有文件并列出。
  加文件只需把文件拷进 assets/files/，推上去就会自动出现在这里。
{% endcomment %}

{% assign all_files = site.static_files | where_exp: "f", "f.path contains '/assets/files/'" | sort: "modified_time" | reverse %}

{% if all_files.size > 0 %}

<div class="file-list">
{% for file in all_files %}
  {% assign ext = file.extname | downcase | remove_first: "." %}
  <a class="file-item" href="{{ file.path | relative_url }}" target="_blank" rel="noopener">
    <span class="file-ext" data-ext="{{ ext }}">{{ ext }}</span>
    <span class="file-name">{{ file.name }}</span>
    <span class="file-date">{{ file.modified_time | date: "%Y-%m-%d" }}</span>
  </a>
{% endfor %}
</div>

<p class="file-count">共 {{ all_files.size }} 个文件</p>

{% else %}

<p class="file-empty">还没有文件。把文件放进 <code>assets/files/</code> 目录，推送到 GitHub 后就会自动出现在这里。</p>

{% endif %}
