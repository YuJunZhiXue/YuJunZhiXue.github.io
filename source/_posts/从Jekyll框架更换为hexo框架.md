---
title: 从Jekyll框架更换为hexo框架
date: 2020-01-02 00:00:00
tags:
  - 搭建博客
  - jekyll
  - github
  - hexo
---

## 闲扯一下

**在我使用了一段时间的Jekyll博客以后发现，Jekyll框架不是太过于完美，于是乎我就上网找框架，找到了这款[hexo](https://github.com/hexojs/hexo)框架，这里是[中文官方文档](https://hexo.io/zh-cn/)**

### hexo框架的安装过程

我知道很多人肯定是看官方文档有些晕头转向的，所以我就在这里写出来，顺便自己回顾一下这个搭建过程。

#### 准备工作

- 安装前提
- 安装Git
- 安装nodejs

**安装Hexo相当简单，只需要先安装下列应用程序即可：** **[nodejs](https://nodejs.org/en/)** **[Git](https://git-scm.com/)** **如果您的电脑中已经安装上述必备程序，那么恭喜您！你可以直接前往 安装 Hexo 步骤。** **如果您的电脑中尚未安装所需要的程序，请点击旁边的安装提示**

**Windows：下载并安装 git.**

**Mac：使用 Homebrew, MacPorts 或者下载 安装程序。**

**Linux (Ubuntu, Debian)：sudo apt-get install git-core**

**Node.js 为大多数平台提供了官方的 安装程序。对于中国大陆地区用户，可以前往 淘宝 Node.js 镜像 下载。**

**其它的安装方法：**

**Windows：通过 nvs（推荐）或者nvm 安装。**

**Mac：使用 Homebrew 或 MacPorts 安装。**

**Linux（DEB/RPM-based）：从 NodeSource 安装。**

**其它：使用相应的软件包管理器进行安装，可以参考由 Node.js 提供的 指导**

**对于 Mac 和 Linux 同样建议使用 nvs 或者 nvm，以避免可能会出现的权限问题**

#### 安装Hexo

- 第一步，在你自己的本地 (也就是你的D盘或者E盘) 创建一个文件夹，用于放置博客

- 进入你放置博客的文件夹， 安装好Git以后，右键就会出现 右键点击Git Bash Here如下图所示：

- 所有准备的工作做完以后就可以开始安装如下

- 使用npm安装，大家可能看到很多人使用cnpm对于这个我使用较少，可以自行查找

> $ npm install -g hexo-cli //这个意思是全局安装hexo-cli

- 推荐大家全局安装，安装完以后，进入你自己创建的博客文件夹。

- 在这多说一句，很多人会看到初始化hexo的时候会出现$ hexo init blog和$ cd blog这两个命令，解释一下，这两个命令就是你不是在你博客文件夹打开的时候，需要你cd到你的文件夹，我这说的是笨办法，之际进入你自己创建好的文件夹初始化。

> 使用$ npm install 直接初始化，初始化完成以后目录如下：
> ```plain
.
├── _config.yml
├── package.json
├── scaffolds
├── source
| ├── _drafts
| └── _posts
└── themes
```
> 到这里可以说你在本地安装的博客已经大功告成！恭喜你！

## 测试

接着上面的继续，现在您已经在本地搭建好了，就会有人想着说，我搭建好了，怎么才能去将这个这个运行一下查看呢？这就是接下来的讲解。

### 本地运行查看

> 本地运行查看很简单，只需要两个命令！
> $ hexo clean
> $ hexo s或者hexo sever

第一个的意思是清理hexo,第二个是运行hexo。 运行以后http://localhost:4000复制此链接在网页查 如图所示：
![这里写图片描述](/images/hexo.jpg)

到这里证明你的博客运行成功了！

## 上传GitHub

如果有GitHub仓库的可以直接往下看，如果没有仓库的人，跳转到大佬的[简书](https://www.jianshu.com/p/834d7cc0668d) 查看

## 文件简述

| 文件/目录 | 描述 |
| --- | --- |
| _config.yml | 保存配置数据。很多配置选项都可以直接在命令行中进行设置，但是如果把那些配置写在这儿，就不用非要去记住那些命令了。 |
| _drafts | drafts（草稿）是未发布的文章。这些文件的格式中都没有 title.MARKUP 数据。学习如何使用草稿。 |
| _posts | 这里放的就是的文章了。文件格式很重要，必须要符合:YEAR-MONTH-DAY-title.MARKUP。 永久链接 可以在文章中自己定制，但是数据和标记语言都是根据文件名来确定的。 |
| _data | 此文件是自己创建，后面会讲到 |

更改博客信息，下一篇文章会讲到，此篇就是将hexo搭建本地，再部署到github

博客的文件是放在项目的_posts文件中的，这里要注意文件名称的格式，年-月-日-文章标题.markdown ，一般我们是用markdown编写文章，这种编辑方式也是非常的方便。如果还不知道markdown怎么使用的同学，可以参考

接下来就是自己学习一下markdown的语法

认识与入门：**[markdown语法](https://yangyuhou.com/posts/22603.html)** 介绍就到这里 这就是我更换hexo框架的历程！有不会的可以评论区留言！
