---
title: v2ray开启局域网让手机可以不用挂载代理就上外网
date: 2020-09-25 00:00:00
tags:
  - VPN
---

**使用v2ray开启局域网让手机可以不用挂载代理就上外网**

# 一、v2ray介绍

市面上出现最多的词语，VPN，VPS,代理服务器（Proxy），关于这些理解可以查看我准备写的下一篇博客，抛开所有，我来说说v2ray 2Ray 是 Project V 下的一个工具。Project V 是一个包含一系列构建特定网络环境工具的项目，而 V2Ray 属于最核心的一个。 官方中介绍Project V 提供了单一的内核和多种界面操作方式。内核（V2Ray）用于实际的网络交互、路由等针对网络数据的处理，而外围的用户界面程序提供了方便直接的操作流程。 不过从时间上来说，先有 V2Ray 才有 Project V。 如果还是不理解，那么简单地说，V2Ray 是一个与 Shadowsocks 类似的代理软件，可以用来科学上网（翻墙）学习国外先进科学技术。 V2Ray 定位为一个平台，任何开发者都可以利用 V2Ray 提供的模块开发出新的代理软件，所以v2ray就是代理软件

## 1、v2ray 简介

> V2Ray Windows 客户端主要有两个，一个是 v2ray-core（v2ray 核心，官方客户端），另一个是 v2rayN（基于 v2ray-core 的开一个 GUI 可视化客户端），其中 v2ray-core 可以单独使用，而 v2rayN 则是基于 v2ray-core 的一个辅助可视化工具。

所以推荐V2Ray Windows下面的客户端软件是V2RayN。图形化可视工具，适合新手用户。

## 2、V2Ray-Core

需要注意的是 v2ray-core 区分 32 位和 64 位，大家在选择时注意自己的系统版本。

官方项目下载地址：[点击访问](https://github.com/v2fly/v2ray-core)

官方软件发布地址：[点击访问](https://github.com/v2ray/v2ray-core/releases)

| 文件名称 | Windows32位下载 | Windows64位下载 |
| --- | --- | --- |
| V2Ray-Core | 点击下载 | 点击下载 |

## 3、V2RayN （推荐）

v2rayN 是基于官方 v2ray-core 的一个 V2Ray GUI 客户端，提供可视化界面，非常方便。使用时只需要将 v2rayN.exe 拖入到 V2Ray-core 文件夹内即可。

若是下载的完整版，即可解压直接使用。

官方项目发布地址：[点击访问](https://github.com/2dust/v2rayN)

官方软件发布地址：[点击访问](https://github.com/2dust/v2rayN/releases/)
| 文件名称 | V2RayN文件下载 | V2RayN-Core 完整（带运行环境）下载 |
| ——— | ——— | ——— |
| V2Ray-Core | [点击下载](https://github.com/2dust/v2rayN/releases/download/3.23/v2rayN.zip) | [点击下载](https://github.com/2dust/v2rayN/releases/download/3.23/v2rayN-Core.zip) |

![界面](/images/2020-09-30_113145.png)

# 二、v2ray开启局域网

平台：一台PC或其他（软件能够开启共享），一台iphone或安卓或PC等等进行局域网蹭网 工具：V2rayN（我在windows平台使用这个，其他平台只要有开启共享设置都一样）

操作很简单！我就不用语言表达，直接上图。

## 1、查询自己ip

不会查询自己ip的向下看，会查询的跳过直接进入第二节
![v2ray设置](/images/2020-09-30_103349.png)

![v2ray设置](/images/2020-09-30_103444.png)

![v2ray设置](/images/2020-09-30_103537.png)

## 2、v2ray设置

![v2ray设置](/images/2020-09-30_102333.png)

![v2ray设置](/images/2020-09-30_102409.png)

![v2ray设置](/images/2020-09-30_102419.png)

![v2ray设置](/images/2020-09-30_103028.png)

v2ray设置完基本上就开启了局域网共享，所以接下来就是用手机连接的教程，**我不推荐**PC端连接局域网共享这个 有PC端的最好直接使用软件代理

## 3、Android配置代理

我申明这里使用的是华为荣耀9机型，关于别的机型，可以自己百度一下。 连接WiFi以后
![Android设置](/images/微信图片_20200930105745.jpg)

![Android设置](/images/微信图片_20200930105738.jpg)

![Android设置](/images/微信图片_20200930105734.jpg)

![Android设置](/images/微信图片_20200930105726.jpg)

## 4、IOS配置代理

![Android设置](/images/微信图片_20200930102455.png)

![Android设置](/images/微信图片_20200930102502.png)

![Android设置](/images/微信图片_20200930102507.png)

![Android设置](/images/微信图片_20200930102511.png)

这里以后基本上就可以遨游外网，一定要记住是同一局域网下**一定要将电脑打开，运行软件**如果电脑关闭以后发现自己的WiFi用不了可以忘记WiFi重新登录，也可以将那个图片中的代理换成自动就好了 不会的可以评论，我跟你解答
