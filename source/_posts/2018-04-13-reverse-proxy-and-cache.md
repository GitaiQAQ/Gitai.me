---

  layout:     post
  title:      "无脑的反代+缓存说明书"
  date:       2018-04-13
  author:     "Gitai"
  categories:
      - 小脚本
---


除了微博这个好图床，BAT 三家都有对应的防盗链机制。

![](http://mmbiz.qpic.cn/mmbiz_png/XYVZfgnKcyjElWSLP2wIzbsIBibgWzzNThmHUFkuEiapBD4hmHm8k1QvdOqUo2ZCDZ9A0ZWicDHugCVrJRNHOs8jw/640)

反代就能很轻巧的解决这个问题，即使不说反盗链，反代还有其他用途。

<!-- more -->

## Caddy

```
:80 {
        proxy /mmbiz_jpg http://mmbiz.qpic.cn
}
```

简单粗暴，最基本的反代就完成了。

但是 `mmbiz.qpic.cn` 的报错非常不友好，一般都是自己写个后端接上调试，或者用抓包工具拦截，但是有几个非常好用的服务这时候就值得推荐了。

如同 `example.com` 一样的更为适合作为例子使用的一类服务，在此以 `httpbin.org` 为例子。其中有个 `anything` 的接口，会把访问携带的参数全部打印出来。

```
:80 {
        proxy /mmbiz_jpg http://httpbin.org/anything
}
```
然后继续以页首的为例，会获得如下 JSON 数据。

```
{
  "args": {
    "wx_fmt": "jpeg"
  }, 
  "data": "", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8", 
    "Accept-Encoding": "gzip, deflate", 
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7", 
    "Connection": "close", 
    "Cookie": "wp-settings-time-1=1519806291; wordpress_logged_in_ac0818ef3df8d5d8ee0c025b0c25a7af=0.%E6%B5%8B%E8%AF%95%E7%94%A8%E6%88%B7%7C1520337495%7CB1MSh82sorzJldJf5uyTMNsVyTEwl4ceeAfes3ZqMZT%7Cc3864d5561528961921f2e797322877d945e0c4c0eeeb7633ea7c8d8defc91b9", 
    "Host": "httpbin.org", 
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
  }, 
  "json": null, 
  "method": "GET", 
  "origin": "171.110.30.*, 112.74.108.*", 
  "url": "http://httpbin.org/anything/mmbiz_jpg/AyxiaR9c8c68jZyJgca9R2kno7THAeXaEoeM4RtLutq6UYFfn5E0gRANz6tVKTXibNMj0GLw969W5Boub5rTJhYg/0?wx_fmt=jpeg"
}
```
通过上面的数据，会发现携带了不少没什么用的参数，这些参数还可能暴露这是反代这回事。

于是用 `header_upstream` 参数和 `-` 操作符，去除无用的头部元素。

```
proxy /mmbiz_jpg http://httpbin.org/anything {
        header_upstream -Cookie
}
```
然后可以得到如下内容

```
{
  "args": {
    "wx_fmt": "jpeg"
  }, 
  "data": "", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8", 
    "Accept-Encoding": "gzip, deflate", 
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7", 
    "Connection": "close", 
    "Host": "httpbin.org", 
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
  }, 
  "json": null, 
  "method": "GET", 
  "origin": "171.110.30.*, 112.74.108.*", 
  "url": "http://httpbin.org/anything/mmbiz_jpg/AyxiaR9c8c68jZyJgca9R2kno7THAeXaEoeM4RtLutq6UYFfn5E0gRANz6tVKTXibNMj0GLw969W5Boub5rTJhYg/0?wx_fmt=jpeg"
}
```
`Cookie` 已经被移除了。

接下来为它加上缓存，毕竟每次都从上游服务器抓取，总会被 ban 的。

```
cache {
        match_path /
        status_header X-Cache-Status
        default_max_age 60m
        path /tmp/caddy-cache
}
```
在此并没有使用 `match_header` 对数据类型进行限制，所以会缓存全部数据。下面这段即可过滤 `image` 类型的数据。

```
match_header Content-Type image/*
```

在对应的响应头中能发现 `X-Cache-Status: hit` 这一字段，也会在 `/tmp/caddy-cache` 中发现对应的缓存文件。

脱离反代程序本身如果想要测试缓存，可以用 `http://lorempixel.com`，该站有很多常见的占位图片。

然后把 `http://httpbin.org/anything` 换成目标地址 `http://mmbiz.qpic.cn`，并在前端 hack 惰性加载，替换域名完成反代。

完整配置文件如下：

```
:80 {
        proxy /mmbiz_jpg http://mmbiz.qpic.cn {
                header_upstream -Cookie
				header_upstream referer "http://mp.weixin.qq.com"
        }
        cache {
                match_path /
                status_header X-Cache-Status
                default_max_age 60m
                path /tmp/caddy-cache
        }
}
```
这里还用 `header_upstream` 伪造了来自微信公众号平台的头。

## 传统后端网关

因为一般都已经运行了 Apache 或者 Nginx，所以再把上述 Caddyfile "翻译" 成对应的配置脚本。

### Nginx

```
proxy_cache_path /tmp/nginx_cache levels=1:2 keys_zone=my_cache:60m max_size=10g inactive=60m u
se_temp_path=on;
server {
    listen       80;
    listen       [::]:80;

    location / {
        proxy_pass http://mmbiz.qpic.cn;
        proxy_set_header referer "http://mp.weixin.qq.com";

        proxy_set_header   Cookie "";
        proxy_set_header User-Agent $http_user_agent;
        proxy_cache my_cache;
    }
}
```
```
docker run -p 80:80 -v $PWD/nginx.conf:/etc/nginx/conf.d/default.conf:ro -it --rm nginx
```
### Apache[^creating-a-caching-proxy-server-with-apache]

```
<VirtualHost *:80>
	ServerName _

	# Cache
	# Not work
	LoadModule cache_module modules/mod_cache.so

	<IfModule mod_cache.c>
		LoadModule cache_disk_module modules/mod_cache_disk.so
		<IfModule mod_disk_cache.c>
			CacheEnable disk /
			CacheRoot /var/www/example.com/cache/
			CacheIgnoreNoLastMod  On
			CacheDefaultExpire 86400
			Header unset Expires
			Header unset Cache-Control
			Header unset Pragma 
		</IfModule> 
	</IfModule>


	LoadModule proxy_module modules/mod_proxy.so
	LoadModule proxy_connect_module modules/mod_proxy_connect.so
	LoadModule proxy_http_module modules/mod_proxy_http.so

	#Proxy 
	ProxyRequests  On 
	ProxyPass / http://mmbiz.qpic.cn/
	ProxyPassReverse / http://mmbiz.qpic.cn/

	RequestHeader set referer "http://mp.weixin.qq.com"
	RequestHeader unset Cookie
	RequestHeader unset "X-Forwarded-Host"
	RequestHeader unset "X-Forwarded-Server"
</VirtualHost>
```
通过 docker 启动，要不容易污染环境。

```
docker run -p 80:80 -v $PWD/httpd.conf:/usr/local/apache2/conf/httpd.conf -it --rm httpd
```
除了缓存好像没生效，其他没什么问题。


[^creating-a-caching-proxy-server-with-apache]: [Creating a caching proxy server with apache](https://aoeex.com/phile/creating-a-caching-proxy-server-with-apache/)

