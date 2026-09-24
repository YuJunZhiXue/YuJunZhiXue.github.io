---
title: 使用springBoot创建一个简单的helloWorld运行
date: 2020-09-18 00:00:00
tags:
  - springBoot
---

**使用springBoot创建一个简单的helloWorld运行**

# 一、Spring Boot 入门

## 1、Spring Boot 简介

> 简化Spring应用开发的一个框架；
> 整个Spring技术栈的一个大整合；
> J2EE开发的一站式解决方案；

## 2、微服务

2014，martin fowler

微服务：架构风格（服务微化）

一个应用应该是一组小型服务；可以通过HTTP的方式进行互通；

单体应用：ALL IN ONE

微服务：每一个功能元素最终都是一个可独立替换和独立升级的软件单元；

[详细参照微服务文档](https://martinfowler.com/articles/microservices.html#MicroservicesAndSoa)

### 1、MAVEN设置；

给maven 的settings.xml配置文件的profiles标签添加

```xml
<!-- 这个插件，可以将应用打包成一个可执行的jar包；-->
 <build>
 <plugins>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 </plugin>
 </plugins>
 </build>
```

### 2、IDEA设置

这里为什么用IDEA? 是因为IDEA使用springBoot轻松

整合maven进来；

![idea设置](/images/搜狗截图20180129151045.png)

![images/](/images/搜狗截图20180129151112.png)

## 4、Spring Boot HelloWorld

一个功能：

浏览器发送hello请求，服务器接受请求并处理，响应Hello World字符串；

### 1、创建一个maven工程；（jar）

### 2、导入spring boot相关的依赖

```xml
<!-- 这个插件，可以将应用打包成一个可执行的jar包；-->
 <build>
 <plugins>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 </plugin>
 </plugins>
 </build>
```

### 3、编写一个主程序；启动Spring Boot应用

```xml
<!-- 这个插件，可以将应用打包成一个可执行的jar包；-->
 <build>
 <plugins>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 </plugin>
 </plugins>
 </build>
```

### 4、编写相关的Controller、Service

```xml
<!-- 这个插件，可以将应用打包成一个可执行的jar包；-->
 <build>
 <plugins>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 </plugin>
 </plugins>
 </build>
```

### 5、运行主程序测试

### 6、简化部署

```xml
<!-- 这个插件，可以将应用打包成一个可执行的jar包；-->
 <build>
 <plugins>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 </plugin>
 </plugins>
 </build>
```

将这个应用打成jar包，直接使用java -jar的命令进行执行；

只发布了一个简单的springBoot程序，因为有很多我都没有思绪写，想跟大家分享，顺便让我自己巩固一下，之所以没有思绪是因为我想的就是将这个弄成简单化容易理解的，所以希望看到我博文的各位能帮我提出意见让我借鉴！
