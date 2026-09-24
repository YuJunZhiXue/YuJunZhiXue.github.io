---
title: Maven创建Hibernate5+mysql8
date: 2020-09-07 00:00:00
tags:
  - Maven
  - Hibernate
  - mysql8
---

**使用Maven创建Hibernate5+mysql8，遇到的困难和错误**

**开始我们的废话连篇阶段，至于我为什么要写这篇博客，简单陈述一下，我之前一直使用的都是hibernate3+MySQL5，所以很多更改的地方我完全不知道，以至于我上网去找就一脸懵逼，好了废话不多说，开始教程，搞起🔨**

## 创建maven项目

**首先申明我使用的是eclipse，所以有使用IntelliJ IDEA，那不好意思，等我以后换软件以后更新，第一步当然很简单，那就是创建maven项目，~~这里废话一下,能看这个博客的一般都会使用maven~~，如果不会当我没说，你可以看另一篇博客[如何创建maven项目](https://yangyuhou.com/2020-09-01-%E5%88%B6%E4%BD%9C%E4%B8%80%E4%B8%AA%E7%AE%80%E5%8D%95%E7%9A%84%E7%BD%91%E7%BB%9C%E7%88%AC%E8%99%AB(%E4%B8%80)/ “百分之百可以运行的简单网络爬虫(一)”)**

创建完maven项目的样子如图：![链接](/images/2020-09-07_112951.png)

---

## 会创建maven项目的，可以直接复制下面的pom.xml的代码，也可以直接去我的 GitHub仓库 直接下载

```plain
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import pojo.Product;

/**
 * hibernate的基本步骤是：
1. 获取SessionFactory
2. 通过SessionFactory 获取一个Session
3. 在Session基础上开启一个事务
4. 通过调用Session的save方法把对象保存到数据库
5. 提交事务
6. 关闭Session
7. 关闭SessionFactory
 */
public class TestHibernate {
	public static void main(String[] args) {
		//1、加载Hibernate的核心配置文件：hibernate.cfg.xml
		Configuration configuration = new Configuration().configure();
		//2、创建一个SessionFactory对象：类似于JDBC中的连接池
		SessionFactory sessionFactory = configuration.buildSessionFactory();
		//3、通过SessionFactory获取Session对象：类似JDBC中的Connection
		Session session = sessionFactory.openSession();
		//4、手动开启事务
		Transaction transaction = session.beginTransaction();
		//5、编写代码
		
		for (int i = 1; i <=10; i++) {
			Product p = new Product();
			p.setName("iphone"+i);
			p.setPrice(1000*i);
			session.save(p);
		}
		//6、事务提交
		transaction.commit();
		//7、资源释放
		session.close();
		sessionFactory.close();

	
	
	}	
}
```

---

## 创建数据库文件

在数据库中创建表，MySQL的下载安装，百度谷歌一大把，我就不阐述了，用nivacat创建表

##

也可以用命令行创建，首先准备数据库test create database test; 创建表：

```plain
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import pojo.Product;

/**
 * hibernate的基本步骤是：
1. 获取SessionFactory
2. 通过SessionFactory 获取一个Session
3. 在Session基础上开启一个事务
4. 通过调用Session的save方法把对象保存到数据库
5. 提交事务
6. 关闭Session
7. 关闭SessionFactory
 */
public class TestHibernate {
	public static void main(String[] args) {
		//1、加载Hibernate的核心配置文件：hibernate.cfg.xml
		Configuration configuration = new Configuration().configure();
		//2、创建一个SessionFactory对象：类似于JDBC中的连接池
		SessionFactory sessionFactory = configuration.buildSessionFactory();
		//3、通过SessionFactory获取Session对象：类似JDBC中的Connection
		Session session = sessionFactory.openSession();
		//4、手动开启事务
		Transaction transaction = session.beginTransaction();
		//5、编写代码
		
		for (int i = 1; i <=10; i++) {
			Product p = new Product();
			p.setName("iphone"+i);
			p.setPrice(1000*i);
			session.save(p);
		}
		//6、事务提交
		transaction.commit();
		//7、资源释放
		session.close();
		sessionFactory.close();

	
	
	}	
}
```

## 创建实体类和实体类映射文件

实体类的 getter（）和 setter（）方法一定要遵循—->>>JavaBean规则<<<—- 否则会报错！！！

```plain
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import pojo.Product;

/**
 * hibernate的基本步骤是：
1. 获取SessionFactory
2. 通过SessionFactory 获取一个Session
3. 在Session基础上开启一个事务
4. 通过调用Session的save方法把对象保存到数据库
5. 提交事务
6. 关闭Session
7. 关闭SessionFactory
 */
public class TestHibernate {
	public static void main(String[] args) {
		//1、加载Hibernate的核心配置文件：hibernate.cfg.xml
		Configuration configuration = new Configuration().configure();
		//2、创建一个SessionFactory对象：类似于JDBC中的连接池
		SessionFactory sessionFactory = configuration.buildSessionFactory();
		//3、通过SessionFactory获取Session对象：类似JDBC中的Connection
		Session session = sessionFactory.openSession();
		//4、手动开启事务
		Transaction transaction = session.beginTransaction();
		//5、编写代码
		
		for (int i = 1; i <=10; i++) {
			Product p = new Product();
			p.setName("iphone"+i);
			p.setPrice(1000*i);
			session.save(p);
		}
		//6、事务提交
		transaction.commit();
		//7、资源释放
		session.close();
		sessionFactory.close();

	
	
	}	
}
```

在实体类目录下新建一个配置文件：右键entity -> New -> Other -> General -> File -> Next -> 文件命名：Product.hbm.xml：P一定要大写，要和实体类 Product 保持一致

```plain
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import pojo.Product;

/**
 * hibernate的基本步骤是：
1. 获取SessionFactory
2. 通过SessionFactory 获取一个Session
3. 在Session基础上开启一个事务
4. 通过调用Session的save方法把对象保存到数据库
5. 提交事务
6. 关闭Session
7. 关闭SessionFactory
 */
public class TestHibernate {
	public static void main(String[] args) {
		//1、加载Hibernate的核心配置文件：hibernate.cfg.xml
		Configuration configuration = new Configuration().configure();
		//2、创建一个SessionFactory对象：类似于JDBC中的连接池
		SessionFactory sessionFactory = configuration.buildSessionFactory();
		//3、通过SessionFactory获取Session对象：类似JDBC中的Connection
		Session session = sessionFactory.openSession();
		//4、手动开启事务
		Transaction transaction = session.beginTransaction();
		//5、编写代码
		
		for (int i = 1; i <=10; i++) {
			Product p = new Product();
			p.setName("iphone"+i);
			p.setPrice(1000*i);
			session.save(p);
		}
		//6、事务提交
		transaction.commit();
		//7、资源释放
		session.close();
		sessionFactory.close();

	
	
	}	
}
```

在src类目录下新建一个配置文件：右键src -> New -> Other -> General -> File -> Next -> 文件命名：hibernate.cfg.xml

设置hibernate.cfg.xml文件

```plain
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import pojo.Product;

/**
 * hibernate的基本步骤是：
1. 获取SessionFactory
2. 通过SessionFactory 获取一个Session
3. 在Session基础上开启一个事务
4. 通过调用Session的save方法把对象保存到数据库
5. 提交事务
6. 关闭Session
7. 关闭SessionFactory
 */
public class TestHibernate {
	public static void main(String[] args) {
		//1、加载Hibernate的核心配置文件：hibernate.cfg.xml
		Configuration configuration = new Configuration().configure();
		//2、创建一个SessionFactory对象：类似于JDBC中的连接池
		SessionFactory sessionFactory = configuration.buildSessionFactory();
		//3、通过SessionFactory获取Session对象：类似JDBC中的Connection
		Session session = sessionFactory.openSession();
		//4、手动开启事务
		Transaction transaction = session.beginTransaction();
		//5、编写代码
		
		for (int i = 1; i <=10; i++) {
			Product p = new Product();
			p.setName("iphone"+i);
			p.setPrice(1000*i);
			session.save(p);
		}
		//6、事务提交
		transaction.commit();
		//7、资源释放
		session.close();
		sessionFactory.close();

	
	
	}	
}
```

## 创建hibernate测试类

```

```plain
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import pojo.Product;

/**
 * hibernate的基本步骤是：
1. 获取SessionFactory
2. 通过SessionFactory 获取一个Session
3. 在Session基础上开启一个事务
4. 通过调用Session的save方法把对象保存到数据库
5. 提交事务
6. 关闭Session
7. 关闭SessionFactory
 */
public class TestHibernate {
	public static void main(String[] args) {
		//1、加载Hibernate的核心配置文件：hibernate.cfg.xml
		Configuration configuration = new Configuration().configure();
		//2、创建一个SessionFactory对象：类似于JDBC中的连接池
		SessionFactory sessionFactory = configuration.buildSessionFactory();
		//3、通过SessionFactory获取Session对象：类似JDBC中的Connection
		Session session = sessionFactory.openSession();
		//4、手动开启事务
		Transaction transaction = session.beginTransaction();
		//5、编写代码
		
		for (int i = 1; i <=10; i++) {
			Product p = new Product();
			p.setName("iphone"+i);
			p.setPrice(1000*i);
			session.save(p);
		}
		//6、事务提交
		transaction.commit();
		//7、资源释放
		session.close();
		sessionFactory.close();

	
	
	}	
}
```
```

## 测试成功图

![链接](/images/2020-09-07_115010.png)

![链接](/images/2020-09-07_115115.png)
