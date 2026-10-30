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

我是 **{{ site.name }}**，{{ site.title }}，目前在 {{ site.institution }}。

这里存放我整理的材料和需要分发的文件。

---

### 文件下载

所有文件都在文件目录里，点击即可打开或下载。

<p style="margin-top: var(--space-6);">
  <a href="{{ '/files/' | relative_url }}" class="btn-entry">打开文件目录 →</a>
</p>

{% assign has_links = false %}
{% if site.links.google_scholar != "" or site.links.github != "" or site.links.orcid != "" or site.links.researchgate != "" %}
{% assign has_links = true %}
{% endif %}

{% if has_links %}
---

### 链接

{% if site.links.github and site.links.github != "" %}
- GitHub：[{{ site.links.github }}]({{ site.links.github }})
{% endif %}
{% if site.links.google_scholar and site.links.google_scholar != "" %}
- Google Scholar：[{{ site.links.google_scholar }}]({{ site.links.google_scholar }})
{% endif %}
{% if site.links.orcid and site.links.orcid != "" %}
- ORCID：[{{ site.links.orcid }}]({{ site.links.orcid }})
{% endif %}
{% if site.links.researchgate and site.links.researchgate != "" %}
- ResearchGate：[{{ site.links.researchgate }}]({{ site.links.researchgate }})
{% endif %}
{% endif %}

---

### 联系方式

- 邮箱：[{{ site.email }}](mailto:{{ site.email }})
