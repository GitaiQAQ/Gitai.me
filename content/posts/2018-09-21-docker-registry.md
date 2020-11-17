---
layout:     post
title:      "私有 Docker Registry 配置的一个小坑"
date:       2018-09-21
author:     "Gitai"
tags:
    - Docker
---

```shell
$ sudo docker sudo docker login -u username -p password example.com:5000
Error response from daemon: Get https://example:5000/v2/: x509: certificate signed by unknown authority

```

对此问题 Google 和 Github 已经有了很多资料，只是证书问题或者配置问题，然后遇上两端都是被高度封装的系统，相比直接遇上稍微复杂一点点。所以在此只是记下分析的过程。

<!-- more -->

## 使用 `Let's Encrypt` 签发的证书

通过 `acme.sh` 会生成如下文件目录，对于我这种完全不知道 TSL/SSL 协议啥子原理的，就开始蒙了。

```shell
$ tree
.
├── ca.cer
├── fullchain.cer
├── example.com.cer
├── example.com.conf
├── example.com.csr
├── example.com.csr.conf
└── example.com.key

0 directories, 7 files

```

于是会在参照 [Docker Doc](https://docs.docker.com/engine/security/certificates/#creating-the-client-certificates) 配置的时候，遇上上述问题。

```
REGISTRY_HTTP_TLS_CERTIFICATE: /certs/domain.crt
REGISTRY_HTTP_TLS_KEY: /certs/domain.key
```

该配置是在 [registry.go#L135](https://github.com/docker/distribution/blob/059f301d548d58085032e6af149a08352221f792/registry/registry.go#L135) 中被使用的。

DER、CER、CRT以二进制形式存放证书，只有公钥，不包含私钥。[^1]

所以直接导入。

于是遇上导入哪个的问题，先来看看之前申请的证书文件。

* CSR 证书请求
* CER 证书文件

然后通过以下命令。

```shell
$ cat example.cer.cer ca.cer > test.cer
$ diff test.cer fullchain.cer

```

那这个 `fullchain` 有啥用？

自然我们已经绑定了 IP，并启动 `registry` 了，可以先通过一个 [SSL 服务](https://myssl.com/ssl.html)检测证书状态。 

并按照上述建议修改问题，提供安全性。

如果之前用的是 example.cer 就会遇到这提示。

![RSA 证书, 证书链不完整](https://i.loli.net/2018/09/21/5ba483d416a94.png)

虽然不明白为什么没有详情可以看。

于是替换成 fullchain 就能解决这个问题。

最后就会变成这样：

```shell
/etc/docker/certs.d tree
.
└── example.com:5000
    ├── ca.crt     --> ca.cer
    ├── client.crt --> fullchain.cer
    └── client.key --> example.com.key

1 directory, 2 files
```

## 自签名证书

> 相比 `Let's Encrypt` 签发的证书，自签发的只有需要来回复制证书这个缺点。

```shell
$ sudo openssl req -newkey rsa:4096 -nodes -sha256 -keyout client.key -x509 -days 365 -out ca.crt

```

导入 registry 内，即可使用。

## 脱离 Docker 的测试

但是通过最开始的错误报告，能发现有这么个接口

```shell
$ curl --cacert ca.crt -u username:password https://example.com:5000/v2/

```

当接口能直接访问的时候，就说明调试成功了

[^1]: [SSL 证书格式普及，PEM、CER、JKS、PKCS12](https://blog.freessl.org/ssl-cert-format-introduce/)

[^2]: [Sign server and client certificates](https://jamielinux.com/docs/openssl-certificate-authority/sign-server-and-client-certificates.html)