---
title: 关于request获取不到前端form表单的值
date: 2020-02-03 00:00:00
tags:
  - servlet
  - java
  - javaweb
---

## 前言

**在研究完两个框架以后，脑子一热就想着去将底层的web框架servlet复习一遍，就发现一个问题，就是获取不到form表单数据，然后我又上网上搜索查找!下面就是我查找的问题原因!**

问题：**servlet中使用request.getParameter()获取不到前端发送的form表单数据**

**Post请求接收到了，利用system.out.println()输出，后台显示一直为“null”，数据为空，我一直以为是自己后台写错了**

```plain
<span style="font-size: small;">POST /post_test.php?t=1 HTTP/1.1
Accept-Language: zh-CN
User-Agent: Mozilla/4.0 
Content-Type: multipart/form-data; boundary=---------------------------7dbf514701e8
Accept-Encoding: gzip, deflate
Host: 192.168.12.102
Content-Length: 345
Connection: Keep-Alive
Cache-Control: no-cache
 
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="title"
test
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="content"
....
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="submit"
post article
-----------------------------7dbf514701e8--
</span>
```

**结果是自己的前端表单中的问题，自己在网上找的一份模板，很早之前里面是带着上传文件的所以别人在form表单中添加”enctype=”multipart/form-data”**

```plain
<span style="font-size: small;">POST /post_test.php?t=1 HTTP/1.1
Accept-Language: zh-CN
User-Agent: Mozilla/4.0 
Content-Type: multipart/form-data; boundary=---------------------------7dbf514701e8
Accept-Encoding: gzip, deflate
Host: 192.168.12.102
Content-Length: 345
Connection: Keep-Alive
Cache-Control: no-cache
 
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="title"
test
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="content"
....
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="submit"
post article
-----------------------------7dbf514701e8--
</span>
```

**我也很好奇为什么去掉就好了，去查找之后明白了，这是因为”enctype=”application/x-ww-form-urlencoded” 是默认的编码方式，当以这种方式提交数据时，HTTP报文中的内容是**

```plain
<span style="font-size: small;">POST /post_test.php?t=1 HTTP/1.1
Accept-Language: zh-CN
User-Agent: Mozilla/4.0 
Content-Type: multipart/form-data; boundary=---------------------------7dbf514701e8
Accept-Encoding: gzip, deflate
Host: 192.168.12.102
Content-Length: 345
Connection: Keep-Alive
Cache-Control: no-cache
 
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="title"
test
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="content"
....
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="submit"
post article
-----------------------------7dbf514701e8--
</span>
```

在传输大数据量的二进制数据时，必须将编码方式设置为”enctype=”multipart/form-data”，当以这种方式提交数据时，HTTP报文中的内容

```plain
<span style="font-size: small;">POST /post_test.php?t=1 HTTP/1.1
Accept-Language: zh-CN
User-Agent: Mozilla/4.0 
Content-Type: multipart/form-data; boundary=---------------------------7dbf514701e8
Accept-Encoding: gzip, deflate
Host: 192.168.12.102
Content-Length: 345
Connection: Keep-Alive
Cache-Control: no-cache
 
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="title"
test
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="content"
....
-----------------------------7dbf514701e8
Content-Disposition: form-data; name="submit"
post article
-----------------------------7dbf514701e8--
</span>
```

所以当form表单内容采用”enctype=”multipart/form-data”编码室，调用request。getParameter()获取不到数据
