---
title: 记录自己第一次搭建github+jekyll博客
date: 2020-01-02 00:00:00
tags:
  - 搭建博客
  - jekyll
  - github
---

## 引言

**最开始从来都不写博客，每次开发的错误，都无法记载，遇到同样的错误又要回头去查，一般就要浪费很久的时间，总是一个错误上面栽很久的时间，于是我想到了写博客这个东西,然后我就上网学习搭建GitHubpages+jekyll博客**

## 构思

于是我就在百度上找搭建博客的思路，百度有很多，如CSDN，简书，于是在google上寻找，有两种方法用github+jekyll和github+hexo 想搭建一个足够干净、页面几乎不要有多余元素的博客，同时博客的功能还要足够丰富，满足我以下的需求：

- [x] 用Markdown写博客

- [x] 支持Latex公式

- [x] 支持mermaid等插件

- [x] 个性化Live2D

- [x] 分享一些我在其他网站的个人账号

- [x] 移动端适配

- [x] 足够快的加载速度

- [x] 访问量统计，评论互动

其中，Live2D是我某次访问别人的博客初次见到的，感觉非常吸引人。最终的目标是去掉网页上所有多余的元素，只剩下博文和Live2D看板娘，看板娘本身还可以作为博客访问的导航，感觉会十分有新意。

）

## 搭建过程（不定期更新）

我目前读的专业是软件方向，大部分的内容都是参考网上教程慢慢摸索的，假如对某些过程有意见和建议欢迎向我提出！

Jekyll是基于Ruby和Node.js环境的，很多依赖的包也会同时安装进来。现在，找在目录下打开终端，运行如下代码，加入新建了一个名为blog的文件夹，则说明安装成功了。

```autoit
├──_config.yml
├── _drafts
| ├── begin-with-the-crazy-ideas.textile
| └── on-simplicity-in-technology.markdown
├── _includes
| ├── footer.html
| └── header.html
├── _layouts
| ├── default.html
| └── post.html
├── _posts
| ├── 2007-10-29-why-every-programmer-should-play-nethack.textile
| └── 2009-04-26-barcamp-boston-4-roundup.textile
├── _site
├── .jekyll-metadata
└── index.html
```

### 结构解析

观察刚刚生成的博客目录，有如下的结构：

```autoit
├──_config.yml
├── _drafts
| ├── begin-with-the-crazy-ideas.textile
| └── on-simplicity-in-technology.markdown
├── _includes
| ├── footer.html
| └── header.html
├── _layouts
| ├── default.html
| └── post.html
├── _posts
| ├── 2007-10-29-why-every-programmer-should-play-nethack.textile
| └── 2009-04-26-barcamp-boston-4-roundup.textile
├── _site
├── .jekyll-metadata
└── index.html
```

它的结构还算是比较简单清晰，详细功能如下表。

| 文件/目录 | 描述 |
| --- | --- |
| _config.yml | 保存配置数据。很多配置选项都可以直接在命令行中进行设置，但是如果把那些配置写在这儿，就不用非要去记住那些命令了。 |
| _drafts | drafts（草稿）是未发布的文章。这些文件的格式中都没有 title.MARKUP 数据。学习如何使用草稿。 |
| _includes | 可以加载这些包含部分到的布局或者文章中以方便重用。 |
| _layouts | layouts（布局）是包裹在文章外部的模板。布局可以在 YAML 头信息中根据不同文章进行选择 |
| _posts | 这里放的就是的文章了。文件格式很重要，必须要符合:YEAR-MONTH-DAY-title.MARKUP。 永久链接 可以在文章中自己定制，但是数据和标记语言都是根据文件名来确定的。 |
| _data | 格式化好的网站数据应放在这里。jekyll 的引擎会自动加载在该目录下所有的 yaml 文件（后缀是 .yml, .yaml, .json 或者 .csv ）。这些文件可以经由 ｀site.data｀ 访问。如果有一个 members.yml 文件在该目录下，就可以通过 site.data.members 获取该文件的内容。 |
| _site | 一旦 Jekyll 完成转换，就会将生成的页面放在这里（默认）。最好将这个目录放进 .gitignore 文件中。 |
| .jekyll-metadata | 该文件帮助 Jekyll 跟踪哪些文件从上次建立站点开始到现在没有被修改，哪些文件需要在下一次站点建立时重新生成。该文件不会被包含在生成的站点中。将它加入到 .gitignore 文件可能是一个好注意。 |
| index.html and other HTML, Markdown, Textile files | 如果这些文件中包含 YAML 头信息 部分，Jekyll 就会自动将它们进行转换。当然，其他的如 .html, .markdown, .md, 或者 .textile 等在的站点根目录下或者不是以上提到的目录中的文件也会被转换。 |
| Other Files/Folders | 其他一些未被提及的目录和文件如 css 还有 images 文件夹， favicon.ico 等文件都将被完全拷贝到生成的 site 中。 |

### 选取模板

和丰富精美的Hexo比起来，好的Jekyll模板真的是太少了…经过漫长时间的挑选，最终选择在[wu-kan](https://wu-kan.github.io/about) 主题的基础上修改啦。

这里选我自己的博客为模板，也可以在GitHub上慢慢翻一些别人的博客或模板。

### 发送到Github托管

把本地文件修改后，上传到博客仓库的master或者gh-pages分支即可。

### 定制

> Update: 注意！以下移植插件的办法即将/已经过时。目前的计划（v2.3.0）是，将所有插件做成jsloader的形式，这样引用的时候只要<script src='/public/js/x.js'></script>即可，可以加快页面访问速度。目前的计划是完全去掉_include/目录下的所有文件。

我把博客实现的的插件基本上都封装起来了，拿走的流程都差不多：

- 将我博客代码仓库下_includes\相关文件加入你自己的_includes

- 在你的_config.yml内加入相关配置项（如果有的话，可以参看我的）

- 最后在需要这个插件的地方加入include语句即可

#### 上传更新

所有的所有前提一定是你要有Github的账号

我是利用github客户端上传，简单讲就是先将你看上的模板fork到自己的仓库，点击settings修改，将其中的XXX.github.io，XXX修改为自己的仓库名就可以

![这里写图片描述](/images/20180101112125849.png)
![这里写图片描述](/images/20180101112152464.png)

博客的文件是放在项目的_posts文件中的，这里要注意文件名称的格式，年-月-日-文章标题.markdown ，一般我们是用markdown编写文章，这种编辑方式也是非常的方便。如果还不知道markdown怎么使用的同学，可以参考

接下来就是自己学习一下markdown的语法

认识与入门：[markdown语法](https://sspai.com/post/25137) 介绍就到这里 这就是我搭建博客的历程！有不会的可以问我！
