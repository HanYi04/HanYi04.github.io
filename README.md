# 我的网站

一个用 Jekyll 写的静态个人网站：可以放文章、笔记、课程材料，也能挂 PDF 等文件供下载。
视觉沿用一套暖米白 + 墨绿的低饱和学术风模板，自带深色模式、数学公式、代码高亮。

---

## 一、本地预览

```bash
./serve.sh
```

然后浏览器打开 **http://127.0.0.1:4000** 。按 `Ctrl+C` 停止。

改完文件保存，页面会自动刷新，不用重启。

### 第一次安装（这台机器已经装好了，换机器才需要）

Jekyll 需要 Ruby。分两步：

```bash
# 1. 确认 Ruby 在（本机装在 ~/.local/ruby）
export PATH="$HOME/.local/ruby/bin:$PATH"
ruby -v

# 2. 安装依赖
bundle install
```

---

## 二、加一篇新文章

```bash
./new-post.sh "我的第一篇笔记"
```

它会用当天日期在 `_posts/` 下生成一个 `.md` 文件，写好文件头，正文留空等你填。
也可以手动创建，命名必须是 `_posts/年-月-日-英文短名.md`：

```
_posts/2026-10-29-my-note.md
```

文件开头这一段叫 front matter，必须有：

```yaml
---
layout: post
title: "我的第一篇笔记"
date: 2026-10-29 10:00:00 +0800
summary: "一句话摘要，会显示在博客列表里"
---
```

写完保存，它会自动出现在 `/blogs/` 列表里，按日期倒序。

**想让某篇文章用固定网址**，在 front matter 里加一行：

```yaml
permalink: /blogs/my-note/
```

---

## 三、放文件（PDF、讲义、压缩包）

1. 把文件拷进 `assets/files/`
2. 在任意页面的 Markdown 里加一条链接：

```markdown
[下载讲义 PDF]({{ '/assets/files/lecture-01.pdf' | relative_url }})
```

**文件名用英文、数字、短横线**，别用空格和中文——有些浏览器下载时会变成乱码。

---

## 四、放图片

图片放进 `assets/images/`，然后：

```markdown
![图片说明]({{ '/assets/images/photo.jpg' | relative_url }})
```

想让首页显示头像：把图片放进 `assets/images/`，然后在 `_config.yml` 里填文件名：

```yaml
photo: "headshot.jpg"
```

---

## 五、写数学公式

公式由 MathJax 3 渲染，写法是 **`$...$`（行内）** 和 **`$$...$$`（独立成行）**。

行内：`$\hat H |\psi\rangle = E|\psi\rangle$` → $\hat H |\psi\rangle = E|\psi\rangle$

独立公式，前后各留一个空行：

```markdown
$$
\hat H = \frac{\hat{\boldsymbol P}^2}{2m} + V(\boldsymbol r)
$$
```

多行对齐：

```markdown
$$
\begin{aligned}
i\hbar\frac{d}{dt}\hat A^I(t)
&= \left[\hat A^I(t), \hat H_0\right] \\
&\quad + i\hbar\left(\frac{\partial \hat A}{\partial t}\right)^I(t)
\end{aligned}
$$
```

### ⚠️ 这里有个坑

**不要用 LaTeX 里常见的 `\(...\)` 和 `\[...\]`。**

Markdown 解析器会把 `\(` 当成转义符，反斜杠被吃掉，公式变成纯文本 `(E=mc^2)`；`\[...\]` 同样会废掉。
这个问题实测确认过，只有 `$` 系列能正常工作。

表格里的公式也用 `$...$`，例如 `| $\hat L_z$ | $m\hbar$ |`。

---

## 六、改外观

几乎都在 `_config.yml` 里：

| 想改什么 | 改哪里 |
|---|---|
| 名字、身份、单位、邮箱 | `_config.yml` 前 8 行 |
| 主题色 | `accent_color`，如 `"#1a7a6d"` 墨绿、`"#c0392b"` 砖红 |
| 导航栏有哪些页 | `nav_pages` 列表，不要的行首加 `#` 注释掉 |
| 深色模式开关 | `dark_mode: true/false` |
| 页脚「已上线 N 天」 | `launch_date: "2026-10-29"`，留空则不显示 |

想调字体，在 `_includes/head.html` 的 Google Fonts `<link>` 里换，正文用 `DM Sans`、标题用 `Source Serif 4`。

配色深度定制在 `_sass/base/_variables.scss`（所有颜色和间距变量都在这里）。

---

## 七、加一个新页面

1. 在 `_pages/` 下新建 `notes.md`：

```yaml
---
title: "Notes"
layout: gridlay
permalink: /notes/
---

## Notes

正文……
```

2. 在 `_config.yml` 的 `nav_pages` 里加一行 `- name: notes`

`layout` 可选的几种：`gridlay`（默认，带淡入）、`homelay`（首页，窄栏居中）、`page`、`post`。

---

## 八、目录结构

```
_config.yml          站点配置，最常改的就是它
_pages/              固定页面：首页 / 博客列表 / 文件 / CV / 论文 / 研究 / 相册
_posts/              文章，文件名带日期
_layouts/            页面骨架
_includes/           页头、导航、页脚、MathJax 配置
_sass/               样式源码（bootstrap + 自定义）
assets/
  main.scss          → 编译成 /assets/main.css
  files/             放要供下载的文件
  images/            放图片
  js/site.js         深色模式、搜索等交互
serve.sh             本地预览
new-post.sh          新建文章
.github/workflows/   GitHub Pages 自动部署
```

---

## 九、发布到网上（GitHub Pages，免费）

发布后网址形如 `https://你的用户名.github.io/blogs/hello/`，任何人点开就能看。

### 一次性设置

1. 在 GitHub 上建仓库，**仓库名必须是 `你的用户名.github.io`**（例如用户名 `mingyi`，仓库就叫 `mingyi.github.io`）。
2. 把本项目推进去：

```bash
git init
git add -A
git commit -m "init site"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

3. 打开仓库 → **Settings → Pages** → 把 **Source** 改成 **GitHub Actions**。
4. 等一两分钟，仓库的 **Actions** 标签里会看到构建跑完，网址就是 `https://你的用户名.github.io`。

### 之后更新内容

```bash
git add -A
git commit -m "更新笔记"
git push
```

推上去后 GitHub 会自动重新构建，一分钟左右生效。

### 别忘了改这两行

部署成功后，把 `_config.yml` 里的地址填上，这样分享卡片和 RSS 才正确：

```yaml
url: "https://你的用户名.github.io"
baseurl: ""
```

> 如果仓库名不是 `<用户名>.github.io`（比如叫 `my-site`），那网址会变成
> `https://用户名.github.io/my-site/`，此时必须写 `baseurl: "/my-site"`。

---

## 十、常见问题

**页面 404？** 检查 `_pages/` 里 `permalink` 是否和导航里的 `name` 对得上。

**公式显示成源码？** 检查是不是用了 `\(...\)` 或 `\[...\]`，换成 `$...$` 和 `$$...$$`。

**改完没反应？** `serve.sh` 还在跑的话刷新浏览器；如果是样式改动，按 `Ctrl+C` 重启一次。

**中文文件名下载乱码？** 换成英文名。
