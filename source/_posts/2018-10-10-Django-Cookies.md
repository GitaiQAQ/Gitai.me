---
layout:     post
title:      "Django 下同名 Cookies 的一个小问题"
date:       2018-10-10
author:     "Gitai"
tags:
    - Django
    - Hack
---

Django 作为一个非常友好的框架，提供了各种层级的封装，基本上文档看完就能直接开发出很多有意思的东西。

但是因为被高度封装，开发中的很多奇葩的操作则被官方的规范代替，若只使用 Django 会很友好，如果和其他语言和库整合，那就是另一个问题了。

本篇就是因为一个 Cookies 的特性问题，和 Django 的封装出现冲突。我们先从 Cookies 的属性开始说起。

<!-- more -->

| 属性 | 描述 |
| -- | -- |
| name | Cookie的名称，Cookie一旦创建，名称便不可更改 |
| value | Cookie的值。如果值为Unicode字符，需要为字符编码。如果值为二进制数据，则需要使用BASE64编码 |
| maxAge | Cookie失效的时间，单位秒。如果为正数，则该Cookie在maxAge秒之后失效。如果为负数，该Cookie为临时Cookie，关闭浏览器即失效，浏览器也不会以任何形式保存该Cookie。如果为0，表示删除该Cookie。默认为-1。 |
| secure | 该Cookie是否仅被使用安全协议传输。安全协议。安全协议有HTTPS，SSL等，在网络上传输数据之前先将数据加密。默认为false。 |
| path | Cookie的使用路径。如果设置为“/sessionWeb/”，则只有contextPath为“/sessionWeb”的程序可以访问该Cookie。如果设置为“/”，则本[域名](https://dnspod.cloud.tencent.com/)下contextPath都可以访问该Cookie。注意最后一个字符必须为“/”。 |
| domain | 可以访问该Cookie的域名。如果设置为“.google.com”，则所有以“google.com”结尾的域名都可以访问该Cookie。注意第一个字符必须为“.”。 |
| comment | 该Cookie的用处说明，浏览器显示Cookie信息的时候显示该说明。 |
| version | Cookie使用的版本号。0表示遵循Netscape的Cookie规范，1表示遵循W3C的RFC 2109规范 |

本表截取自[Cookie出现两个同名Key的问题](http://blog.51cto.com/wangzhichao/1751685))

由上我们不难发现 Cookies 并不是一个简单的 KV map，而是以 nama, domain, path 联合建立的表。

但是在 Django 的 Cookies 实现上，仅仅使用了一个 KV map，虽然从原理上解决了 Cookies 的冲突问题，但是对于已有的冲突则难以解决。

我们来看看 `response.set_cookie` 和 `response.delete_cookie` 产生的 Header

### `response.delete_cookie`

```
set-cookie:

cookie_name=""; Domain=www.example.com; expires=Thu, 01-Jan-1970 00:00:00 GMT; Max-Age=0; Path=/
```

### `response.set_cookie`

```
set-cookie:

cookie_name="test_cookies"; Domain=www.example.com; expires=Fri, 12-Oct-2018 02:00:40 GMT; Path=/
```

参照 `django.http.reponse.py:211` 中的 `delete_cookie` 方法

```python
def delete_cookie(self, key, path='/', domain=None):
    self.set_cookie(key, max_age=0, path=path, domain=domain,
  expires='Thu, 01-Jan-1970 00:00:00 GMT')
```

其实只是设置了已经过期的留存时间，让浏览器自动销毁。

如果这时候有这样一个需求，需要移动 `www.example.com` 的 Cookies 到 `example.com`，为了轻松的处理子域的跨域问题。

不难发现只需要移动对应的 Cookies 到对应的根域下。但是 Cookies 并没有这方面的方法。于是通过删除和新建来完成转移。

对此可能会有如下操作：

```python
response.delete_cookie(AUTH_COOKIE, domain="www.example.com")
response.set_cookie(AUTH_COOKIE, cookies, expires=3600 * 24 * 14, domain="example.com")
```

逻辑上看似没问题，一般也的确可以这么处理。

但是在 Django 中是这样实现 Cookies 管理的。

```python
self.cookies[key] = value
...
if path is not None:
    self.cookies[key]['path'] = path
if domain is not None:
    self.cookies[key]['domain'] = domain
if secure:
    self.cookies[key]['secure'] = True if httponly:
    self.cookies[key]['httponly'] = True
```

相信这几行已经能完全看明白，这就是个 Map，而且以 name 为键。

这时候我们再回去看看上面的 Cookies 转移问题。

在 `delete_cookie` 时会设置一个即将过期的 `maxAge`，而随后的 `set_cookie` 并不会初始化这个字段。

并且 `maxAge` 作为 `expires` 的替代，有足够高的优先级来覆盖过去。所以这个转移将永远不会生效，为了达成那个目的，需要这么改。

```python
response.delete_cookie(AUTH_COOKIE, domain="www.example.com")
response.set_cookie(AUTH_COOKIE, cookies, max_age=3600 * 24 * 14, domain="example.com")
```

但是这样只是成功保存了 Cookies 而并没有删除子域的 Cookies，并且子域的 Cookies 在多数浏览器中有着相对较高的优先级。而服务端也只会接受第一个 Cookies，所以还需要设法清理掉这个遗留问题。

或许可以直接构造一个自定义的 Header 来处理。直到看了看。。。Response 对象的构造。。。

![](https://i.loli.net/2018/10/10/5bbd6b8f72983.jpg)

```python
def setdefault(self, key, value):
    """Set a header unless it has already been set."""
  if key not in self:
        self[key] = value
```

你咋也是个字典嘞。。。

那么。。。我们继续往下看，既然理解了意思，概括一下 Google 一下，发现这个问题，挺贴切的。。。

[Response.set_cookie should allow setting two cookies of the same name.set multiple cookies with the same name but different domains/paths](https://code.djangoproject.com/ticket/10554)

> Servers SHOULD NOT include more than one Set-Cookie header field in the same response with the same cookie-name. [#rfc6265](https://tools.ietf.org/html/rfc6265)

emmm...

原来这是 Python 内建的。。。 在 [wsgi.py#L148]（https://github.com/django/django/blob/8ef8bc0f64c463684268a7c55f3d3da4de066c0d/django/core/handlers/wsgi.py#L148）上生成的。

```python
response_headers = list(response.items())
for c in response.cookies.values():
    response_headers.append(('Set-Cookie', c.output(header='')))
```

而 `output` 是

```python
def output(self, attrs=None, header="Set-Cookie:"):
    return "%s %s" % (header, self.OutputString(attrs))
```

接下来得思考怎么优雅的覆盖过去。。。

嗯~ o(*￣▽￣*)o，瞅了几眼，继承重写一个比较快。

```python
import django
from django.core.handlers.wsgi import WSGIHandler

class WSGICookiesHandler(WSGIHandler):
    def __call__(self, environ, start_response):
        def _start_response(status, response_headers):
            response_headers = list(
                map(lambda v: (v[0], v[1].strip(" _") if v[0] == "Set-Cookie" and v[1].strip(" _") else v[1]),
  response_headers))
            print(response_headers)
            start_response(status, response_headers)
        response = super(WSGICookiesHandler, self).__call__(environ, _start_response)
        return response

def get_wsgi_application():
    django.setup(set_prefix=False)
    return WSGICookiesHandler()
```

之后用这个 `get_wsgi_application` 覆盖原有的，它会把 `_` 开头的 `Key` 去除后，再输出。虽然逻辑上有大问题，但是暂时够用了。。。如果要优雅的解决，应该把 `name`，`domain`，`path` 作为组合构成 `Key`。


