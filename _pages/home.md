---
title: "Home"
layout: homelay
sitemap: false
permalink: /
---

{% if site.photo and site.photo != "" %}
<img src="{{ '/assets/images/' | append: site.photo | relative_url }}"
     alt="{{ site.name }}"
     style="max-width: 260px; width: 100%; height: auto; margin-bottom: 1.5rem;">
{% endif %}

我是 **{{ site.name }}**，{{ site.title }}，目前在 {{ site.institution }}。<br>
这里是我的个人主页：放我写的东西、整理的材料，以及需要分发的文件。

---

### 联系方式

- 邮箱：[{{ site.email }}](mailto:{{ site.email }})

{% assign has_links = false %}
{% if site.links.google_scholar != "" or site.links.github != "" or site.links.orcid != "" or site.links.researchgate != "" %}
{% assign has_links = true %}
{% endif %}

{% if has_links %}
---

### 链接

{% if site.links.google_scholar and site.links.google_scholar != "" %}
- Google Scholar：[{{ site.links.google_scholar }}]({{ site.links.google_scholar }})
{% endif %}
{% if site.links.github and site.links.github != "" %}
- GitHub：[{{ site.links.github }}]({{ site.links.github }})
{% endif %}
{% if site.links.orcid and site.links.orcid != "" %}
- ORCID：[{{ site.links.orcid }}]({{ site.links.orcid }})
{% endif %}
{% if site.links.researchgate and site.links.researchgate != "" %}
- ResearchGate：[{{ site.links.researchgate }}]({{ site.links.researchgate }})
{% endif %}
{% endif %}

---

这个站用 [Jekyll](https://jekyllrb.com/) 生成，文章和公式都写在 Markdown 里。
想看怎么加内容，读 `README.md`，或者直接打开 `_posts/` 里那篇示例文章。
