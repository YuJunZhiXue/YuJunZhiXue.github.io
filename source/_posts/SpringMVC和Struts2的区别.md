---
title: SpringMVC和Struts2的区别
date: 2020-01-13 00:00:00
tags:
  - servlet
  - java
  - javaweb
  - SpringMVC
  - Struts2
---

## 关于SpringMVC和Struts2的区别

**前段时间整合SpringMVC+spring和Struts2+spring，然后突发奇想SpringMVC和Struts2的区别大家都是MVC框架那到底之间有什么区别！**

1. 机制不同，SpringMVC 的入口是servlet，struts2的入口是filter

1. 从性能上来说，SpringMVC的性能高于struts2，struts2是基于类设计的，每发一次请求就会创建一个Action实例，每个action都会被注入属性，而SpringMVC 是基于方法的设计，一个方法一个request上下文，而方法同时又跟一个URL对应

1. 从参数上来说，SpringMVC 的方法之间基本上是独立的，独享request和response数据，请求数据通过参数获取，处理结果通过Model交回框架，方法之间不共享变量，而struts2虽然方法之间也是也是独立，但其所有Action变量是共享的，每次来了请求就创建一个Action，一个Action对象对应一个request上下文

1. 从设计思想上来说，Struts2使用的是拦截器机制，而SpringMVC使用的是独立的AOP方式，SpringMVC使用起来更简洁

1. 从数据验证上来说，SpringMVC处理AJAX的请求比较方便，只需要一个注解@ResponseBody，然后直接返回响应文本即可，而Struts2的验证比较繁琐

1. 从配置上来说，在实际项目开发中使用Struts2是大多采用传统的配置文件方式，SpringMvc除了配置spring mvc——servlet.xml文件外，已经是100%的零配置开发，所以在开发效率上高于struts2

1. 从项目管理上来说，SpringMVC和Spring无缝组合，这个优势是Struts2无法与之相提并论
