title:   ChromeBook 开放外网访问
date: 2016-12-25 10:10:36
tags:
---

尝试在 Dell ChromeBook 11 i3 版本塞了一个不是那么大的 MC 服务器。 

```shell
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 34:68:95:82:e5:cd brd ff:ff:ff:ff:ff:ff
    inet 192.168.10.139/24 brd 192.168.10.255 scope global wlan0
    inet6 fdd4:64d:dd09:0:511b:d75b:e0f:b043/64 scope global temporary dynamic 
       valid_lft 603780sec preferred_lft 84780sec
    inet6 fdd4:64d:dd09:0:3668:95ff:fe82:e5cd/64 scope global dynamic 
       valid_lft forever preferred_lft forever
    inet6 fe80::3668:95ff:fe82:e5cd/64 scope link 
       valid_lft forever preferred_lft forever
```

<!--more-->

然而外面完全无法链接

![disconnect](https://ws4.sinaimg.cn/large/690c6f7cgw1fb2tgu4ctaj211y0lcn32.jpg)

再打开 Hexo 服务器看看

![hexo s e r v e r](https://ws4.sinaimg.cn/large/690c6f7cgw1fb2tmamxbvj20mn0e8jum.jpg)

内网完全正常

![localhost](https://ws3.sinaimg.cn/large/690c6f7cgw1fb2tovcn28j211y0lcq5i.jpg)

从局域网其他设备，只留下连接超时

为什么会这样？明明，啪

考虑 Chromebook 的市场定位... 完全没必要暴露对外接口... 

默默查了一波 ip table

```shell
$ sudo iptables -L INPUT --line-numbers
Chain INPUT (policy DROP)
num  target     prot opt source               destination         
1    ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
2    ACCEPT     all  --  anywhere             anywhere            
3    ACCEPT     icmp --  anywhere             anywhere            
4    ACCEPT     udp  --  anywhere             224.0.0.251          udp dpt:mdns
5    ACCEPT     udp  --  anywhere             239.255.255.250      udp dpt:1900
6    NFQUEUE    udp  --  anywhere             anywhere             NFQUEUE num 10000
```

补了一句 `iptables -A INPUT -p tcp --dport 4000 -j ACCEPT`

Hexo 成功解封

之后在加上 `iptables -A INPUT -p tcp --dport 25565 -j ACCEPT` 


![done](https://ws2.sinaimg.cn/large/690c6f7cgw1fb2tgt7mrcj211y0lc0yl.jpg)

附赠 iptables 参考：

封单个IP的命令：`iptables -I INPUT -s 124.115.0.199 -j DROP`    
封IP段的命令：`iptables -I INPUT -s 124.115.0.0/16 -j DROP`    
封整个段的命令：`iptables -I INPUT -s 194.42.0.0/8 -j DROP`    
封几个段的命令：`iptables -I INPUT -s 61.37.80.0/24 -j DROP`    
只封80端口：`iptables -I INPUT -p tcp –dport 80 -s 124.115.0.0/24 -j DROP`    
解封：`iptables -F`    
清空：`iptables -D INPUT 数字`    

列出 INPUT链 所有的规则：`iptables -L INPUT --line-numbers`    
删除某条规则，其中5代表序号（序号可用上面的命令查看）：`iptables -D INPUT 5`    
开放指定的端口：`iptables -A INPUT -p tcp --dport 80 -j ACCEPT`    
禁止指定的端口：`iptables -A INPUT -p tcp --dport 80 -j DROP`    
拒绝所有的端口：`iptables -A INPUT -j DROP`    

以上都是针对 INPUT 链的操作，即是外面来访问本机的方向，配置完之后 需要保存，否则 iptables 重启之后以上设置就失效    

```shell
service iptables save
```    

iptables 对应的配置文件  `/etc/sysconfig/iptables`

注意：iptables 的规则匹配顺序上从上到下的，也就是说如果上下两条规则有冲突时，将会以上面的规则为准。