---
title: "Files"
layout: gridlay
permalink: /files/
---

## 文件与资料

把 PDF、讲义、代码压缩包等放进 `assets/files/` 目录，然后在下面加一条链接。

<div class="section-card">

### 怎么加一个文件

1. 把文件拷进 `assets/files/`
2. 在下面「下载」里加一行链接

链接的写法（照抄改文件名）：

{% raw %}
```markdown
[讲义第一讲 PDF]({{ '/assets/files/lecture-01.pdf' | relative_url }})
```
{% endraw %}

文件名建议用英文、数字和短横线，避免空格和中文——有些浏览器下载时文件名会乱码。

### 下载

<ul>
  <li><a href="{{ '/assets/files/示例文件.txt' | relative_url }}">示例文件.txt</a> — 演示用，可以删掉</li>
</ul>

</div>
