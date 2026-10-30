# 我的网站

一个只做两件事的静态站：**首页** + **文件目录**。
用 Jekyll 生成，托管在 GitHub Pages，推代码即自动部署。

---

## 一、怎么加文件（最常用）

把文件拷进 `assets/files/` 目录，然后推送：

```bash
cp ~/某个文件.pdf assets/files/
git add -A && git commit -m "加资料" && git push
```

**文件目录页会自动列出它**，不需要改任何代码或列表。列表按修改时间倒序，最新的排在最前。

限制：单个文件不超过 **25MB**（网页上传）或 **100MB**（git 推送）。更大的文件放网盘，在首页贴链接。

文件名建议用英文、数字、短横线，避免空格——中文也能用，但下载时个别浏览器可能乱码。

---

## 二、本地预览

```bash
cd ~/.reasonix/global-workspace/my-site
./serve.sh              # 只有本机能看 http://127.0.0.1:4000
./serve.sh --lan        # 同一 WiFi 的手机也能看
```

改完保存，浏览器自动刷新。

---

## 三、改站点的基本信息

全部在 `_config.yml` 前 10 行：

```yaml
name: "你的名字"                 # 显示在导航栏和页脚
title: "一句话身份"
institution: "你的学校或单位"
email: "你的邮箱"
photo: ""                       # 头像文件名，放 assets/images/ 下
accent_color: "#1a7a6d"         # 主题色
```

改完推送即可。

---

## 四、页面结构

网站只有三页：

| 页面 | 地址 | 作用 |
|---|---|---|
| 首页 | `/` | 简介 + 文件目录入口 + 联系方式 |
| 文件目录 | `/files/` | 自动列出 `assets/files/` 下所有文件 |
| 文件预览 | `/view/?f=...` | 点文件后在这里打开（PDF/图片/视频/文本都能预览） |

```
_pages/home.md     首页
_pages/files.md    文件目录（自动扫描，不用维护列表）
_pages/view.md     文件预览页
assets/files/      放要分发的文件 ← 平时只动这里
```

导航栏只显示「文件」，点左上角名字回首页。预览页从文件目录点进去，顶部有「← 返回」和「下载」。

### 配色

**黑白灰为主，红色是唯一的彩色**（`#d0021b`，深色模式下自动调亮为 `#ff4d63`）。
红色只出现在：链接、按钮、标题下的短线、PDF 徽章。其他一律灰阶。

要改主题色，动 `_config.yml` 的 `accent_color` 和 `_sass/base/_variables.scss` 里的 `--accent`。

想加回更多页面（博客、CV 之类），`_archive/` 里有之前归档的模板。

## 五、发布

推到 GitHub 就自动重新构建，1 分钟左右生效。

```bash
git add -A && git commit -m "更新" && git push
# 网络不稳时用 ./push.sh，会自动重试
```

网址：**https://hanyi04.github.io**

---

## 附：留言板（未启用）

仓库里保留了一套完整的留言板实现，但**当前没有启用**——网站是纯静态的。

| 文件 | 作用 |
|---|---|
| `functions/api/messages.js` | 留言读写接口 |
| `functions/api/file/[[key]].js` | 附件下载接口 |
| `schema.sql` | 数据库表结构 |
| `wrangler.toml` | Cloudflare 绑定配置 |
| `_archive/guestbook.md` | 留言板页面 |
| `留言板部署指南.md` | 完整部署步骤 |

将来想启用，按 `留言板部署指南.md` 操作即可（需要 Cloudflare 账号）。

**为什么没启用**：留言板必须有后端才能工作，而 GitHub Pages 跑不了后端代码。
启用等于给网站再引入一个平台，目前必要性不足。
