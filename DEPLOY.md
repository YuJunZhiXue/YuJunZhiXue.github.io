# Hexo + Butterfly 博客部署文档

> **给 AI / 新接手者**：本文档记录了本博客从零搭建到云端部署的完整流程。
> 照着做即可复现或维护。当前状态：**已部署上线**。

## 项目现状（已完成，勿重复执行）

- 站点地址：https://YuJunZhiXue.github.io
- GitHub 仓库：https://github.com/YuJunZhiXue/YuJunZhiXue.github.io
- 技术栈：Hexo 6 + Butterfly 主题 5.7.0
- 内容：11 篇旧文章 + 92 张图片（2018~2020 年存档）
- 部署方式：GitHub Actions 自动构建部署（push 到 main 即触发）
- 源码本地路径：`E:\渗透\新建文件夹\myblog`
- 旧文章 Markdown 源：`E:\渗透\新建文件夹\articles-md\`（备份）

## 目录结构

```
myblog/
├── .github/workflows/deploy.yml   # GitHub Actions 自动部署流水线
├── source/
│   ├── _posts/                    # ★ 所有文章（11 篇 .md）
│   ├── images/                    # ★ 文章图片（92 张，文章内用 /images/xxx.png 引用）
│   ├── categories/index.md        # 分类页（type: categories）
│   ├── tags/index.md              # 标签页（type: tags）
│   └── _data/                     # 友链等数据
├── themes/                        # 空目录（主题通过 npm 安装，不在此）
├── _config.yml                    # ★ 站点配置（标题/作者/语言/时区/url）
├── _config.butterfly.yml          # ★ 主题配置（菜单/深色模式/搜索/特效）
├── package.json                   # 依赖清单（含 hexo-theme-butterfly）
└── package-lock.json
```

**主题不在 `themes/` 目录里**——它作为 npm 依赖装在 `node_modules/hexo-theme-butterfly`，由 `package.json` 管理。`npm install` 会自动装好。

## 环境要求

- Node.js 20+（本机为 v24）
- npm（本机为 11.x）
- Git（本机为 2.53）

## 本地预览

```powershell
cd E:\渗透\新建文件夹\myblog
npm install              # 首次或换机器后执行，装依赖（含主题）
npx hexo s               # 启动本地服务，访问 http://localhost:4000
```

本地预览**不会**影响线上站点，随便改随便试。

## 日常写文章（核心流程）

```powershell
cd E:\渗透\新建文件夹\myblog

# 1. 生成新文章
npx hexo new "我的新文章"
# → 生成 source/_posts/我的新文章.md

# 2. 编辑该 .md 文件，写正文（Markdown 语法）

# 3. 本地预览确认效果
npx hexo s

# 4. 发布到线上
git add -A
git commit -m "发布：我的新文章"
git push
# → GitHub Actions 自动构建，约 1~2 分钟后线上更新
```

push 后无需任何手动操作，Actions 会自动 `hexo clean && hexo g` 并部署。

## 文章 front-matter 说明

每篇文章开头的元数据：

```yaml
---
title: 文章标题
date: 2020-09-07 00:00:00
categories:
  - 分类名
tags:
  - 标签1
  - 标签2
---
```

- `date` 决定永久链接路径（`:year/:month/:day/:title/`）
- 旧文章是从 HTML 还原的，`date` 只有日期没有具体时间，Hexo 会按 `00:00:00` 处理

## 图片插入

图片放 `source/images/` 下，文章中用绝对路径引用：

```markdown
![描述](/images/2020-09-07_112951.png)
```

`/` 指向站点根目录，即 `source/` 目录。

## 关键配置文件

### `myblog/_config.yml`（站点级）

已配置的关键项：

```yaml
title: Yangyuhou's Blog
author: Yangyuhou
language: zh-CN
timezone: Asia/Shanghai
url: https://YuJunZhiXue.github.io
permalink: :year/:month/:day/:title/
theme: butterfly
```

### `myblog/_config.butterfly.yml`（主题级）

主题所有个性化都在这里，**不修改 `node_modules` 里的主题文件**。已开启：

- 默认深色模式 + 跟随系统（`display_mode: dark`，`darkmode.autoChangeMode: 1`）
- Mac 风格代码块（`code_blocks.macStyle: true`，主题 `darker`）
- 本地搜索（`search.use: local_search`，依赖 `hexo-generator-searchdb` 插件）
- 图片点击放大（`lightbox: fancybox`）
- 鼠标点击烟花（`fireworks.enable: true`）
- 加载进度条（`preloader.enable: true`，`source: 2`）
- 文章版权声明（`post_copyright`，CC BY-NC-SA 4.0）
- 相关文章推荐（`related_post`）
- 分享按钮（`share.use: sharejs`）

修改后 `git push` 即生效。

## 自动部署原理

`.github/workflows/deploy.yml` 的流程：

1. 监听 `push` 到 `main` 分支（或手动触发 `workflow_dispatch`）
2. GitHub 提供的 Ubuntu 环境拉取源码
3. 装 Node.js 20 → `npm ci` 装依赖
4. `hexo clean && hexo g` 生成静态页面到 `public/`
5. 上传 `public/` 为构建产物
6. 部署到 GitHub Pages

查看构建状态：仓库页 → Actions 标签页。构建失败会在那里显示红色叉和日志。

## 已知坑点（重要）

1. **文章日期会早一天**：`permalink: :year/:month/:day/:title/` 用的是文章 `date`。`timezone: Asia/Shanghai` 时区下，Hexo 内部按 UTC 计算永久链接日期，`2020-09-07 00:00:00`（北京时间）= `2020-09-06 16:00`（UTC），所以线上链接是 `/2020/09/06/`。**访问文章请从首页/归档页点链接，不要手拼日期**。
2. **`.gitignore` 排除了 `node_modules/` 和 `public/`**：仓库里不存构建产物，换机器后先 `npm install`。
3. **npm ci 可能因 lockfile 差异失败**：流水线里已加 `continue-on-error: true` 兜底，会自动回退到 `npm install`。
4. **GitHub Pages 要求仓库为 Public**：Private 仓库的 Pages 需付费，Free 账号无法使用。

## 换主题（如需）

```powershell
cd E:\渗透\新建文件夹\myblog
npm install hexo-theme-<主题名> --save
```

然后改 `_config.yml` 里的 `theme: <主题名>`，并把 `_config.butterfly.yml` 的配置按新主题文档迁移。Butterfly 的所有可用主题配置见 https://butterfly.js.org/ 。

## 从零复现（若仓库丢失）

1. `npm install -g hexo-cli`
2. `hexo init myblog` → `cd myblog` → `npm install`
3. `npm install hexo-theme-butterfly hexo-generator-searchdb --save`
4. 重建 `source/_posts/`（11 篇，源在 `articles-md/`）、`source/images/`（92 张）
5. 创建 `source/categories/index.md`（含 `type: categories`）和 `source/tags/index.md`（含 `type: tags`）
6. 按「关键配置文件」章节填写 `_config.yml` 和新建 `_config.butterfly.yml`
7. 加入 `.github/workflows/deploy.yml`
8. GitHub 建同名 Public 仓库 → `git init -b main` → commit → push
9. 仓库 Settings → Pages → Source 选 GitHub Actions

旧文章还原脚本在 `E:\渗透\新建文件夹\convert.ps1`（HTML→Markdown，含 front-matter 提取）。
