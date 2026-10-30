---
layout: gridlay
title: Blogs
permalink: /blogs/
---

## Blogs

按时间倒序。每篇文章放在 `_posts/` 目录，文件名形如 `2026-10-29-标题.md`。

<div class="section-card" markdown="0">

{% for post in site.posts %}
<div class="news-item" style="padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
  <a href="{{ post.url | relative_url }}" style="font-weight: 600;">
    {{ post.title | escape }}
  </a>
  <div class="text-muted" style="font-size: 0.875rem; margin-top: 0.25rem;">
    {{ post.date | date: "%Y-%m-%d" }}{% if post.summary %} · {{ post.summary | escape }}{% endif %}
  </div>
</div>
{% endfor %}

</div>
