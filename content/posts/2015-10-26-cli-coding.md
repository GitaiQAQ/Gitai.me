---

layout:     project
title:	"Cli-Coding"
subtitle:   "A simple command-line tool for coding.net by nodejs."
date:       2015-10-26
author:     "Gitai"
categories:
    - Nodejs
tags:
    - Nodejs
    - Coding.net

githubRepo: gitaiQAQ/Node-Coding
---
# Cli-Coding

![MIT](https://img.shields.io/dub/l/vibe-d.svg)

A simple command-line tool for coding.net by nodejs

<!--more-->

## Use

```
bin/coding [options] [command]

OR

npm start [options] [command]

OR

MOD=[MODs] bin/coding [options] [command]

OR

MOD=[MODs] npm start [options] [command]
```

## MODs

`Blobs`,`Branchs`,`Commits`,`Depots`,`Files`,`Historys`,`Keys`,`MergeRequests`,`OAuth`,`Projects`,`ProjectTopics`,`PullRequests`,`RepoFiles`,`Tags`,`Tasks`,`Trees`,`Tweets`,`Users`

## Login

```
gitai@debian:~/workspace/Coding/Cli-Coding$ bin/coding login
Coding: Enter email:  dphdjy
Coding: Enter password:  ********
Coding: Enter j_captcha:  
Coding: Enter remember_me:  
Coding: Enter sid:  
Coding: Enter realRemoteAddress:  
╔══════════════════════════╤══════════════════════════════════════════════════════════════════════════════════════════╗
║ Users.tags_str           │ Ｃ++, 技术宅, Node.js, PHP, 学生党, Android, Linux, C, Python, Java                         ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.tags               │ 44,25,12,4,48,14,10,1,6,2                                                                ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.job                │ 0                                                                                        ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.sex                │ 0                                                                                        ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.phone              │ ***********                                                                              ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.birthday           │ 1996-12-03                                                                               ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.location           │ 安徽 合肥                                                                                  ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.company            │                                                                                          ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.slogan             │ :D                                                                                       ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.introduction       │                                                                                          ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.avatar             │ https://dn-coding-net-production-static.qbox.me/a2f3e185-c762-4bb6-917a-cc47399df31e.jpg ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.gravatar           │                                                                                          ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.lavatar            │ https://dn-coding-net-production-static.qbox.me/a2f3e185-c762-4bb6-917a-cc47399df31e.jpg ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.created_at         │ 1416112039000                                                                            ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.last_logined_at    │ 1446127484181                                                                            ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.last_activity_at   │ 1446122776432                                                                            ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.global_key         │ dphdjy                                                                                   ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.name               │ 断片                                                                                       ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.name_pinyin        │ |dp|duanpian                                                                             ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.updated_at         │ 1416112039000                                                                            ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.path               │ /u/dphdjy                                                                                ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.status             │ 1                                                                                        ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.email              │ dphdjy@qq.com                                                                            ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.is_member          │ 0                                                                                        ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.id                 │ 44455                                                                                    ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.follows_count      │ 0                                                                                        ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.fans_count         │ 15                                                                                       ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.tweets_count       │ 71                                                                                       ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.followed           │ false                                                                                    ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.follow             │ false                                                                                    ║
╟──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────╢
║ Users.is_phone_validated │ true                                                                                     ║
╚══════════════════════════╧══════════════════════════════════════════════════════════════════════════════════════════╝

```


```
.
├── config.js //配置文件
├── locales //多语言包
│   ├── en.js
│   ├── Jpan.js
│   ├── zh-CN.js
│   └── zh-TW.js
├── package.json
├── README.md
├── src //CoffeeScript源码
│   ├── BaseModel.coffee
│   ├── CmdBase.coffee
│   ├── index.coffee
│   └── models
│       ├── Blobs.coffee
│       ├── Branchs.coffee
│       ├── Commits.coffee
│       ├── Depots.coffee
│       ├── Files.coffee
│       ├── Historys.coffee
│       ├── Keys.coffee
│       ├── MergeRequests.coffee
│       ├── OAuth.coffee
│       ├── Projects.coffee
│       ├── ProjectTopics.coffee
│       ├── PullRequests.coffee
│       ├── RepoFiles.coffee
│       ├── Tags.coffee
│       ├── Tasks.coffee
│       ├── Trees.coffee
│       ├── Tweets.coffee
│       └── Users.coffee
├── bin //编译后的文件
│   ├── BaseModel.js
│   ├── CmdBase.js
│   ├── coding
│   ├── index.js
│   └── models
│       ├── Blobs.js
│       ├── Branchs.js
│       ├── Commits.js
│       ├── Depots.js
│       ├── Files.js
│       ├── Historys.js
│       ├── Keys.js
│       ├── MergeRequests.js
│       ├── OAuth.js
│       ├── Projects.js
│       ├── Project_topics.js
│       ├── ProjectTopics.js
│       ├── PullRequests.js
│       ├── Repo_files.js
│       ├── RepoFiles.js
│       ├── Tags.js
│       ├── Tasks.js
│       ├── Trees.js
│       ├── Tweets.js
│       └── Users.js
├── test
└── temp
```

## Config

```
{
    "url": "https://coding.net",
    "cache": "./temp",

    "clientId": "2deaa488ed11bf3d1c7f37bdfd58ec54",
    "clientSecret": "37124c46b1105ce9f0495259e5c08e0465a045d5",

    "port": 8001, // OAuth回调服务器端口
    "modules": [
            "Users",
            "OAuth",
            "Projects",
            "Tasks",
            "Tweets",
            "Files",
            "Depots",
            "Blobs",
            "Branchs",
            "Commits",
            "Historys",
            "Repo_files",
            "Merge_requests",
            "Pull_requests",
            "Tags",
            "Trees",
            "Project_topics",
            "Keys"],
    "scope": [
            "user",
            "user:email",
            "notification",
            "social",
            "social:tweet",
            "social:message",
            "project",
            "project:members",
            "project:task",
            "project:file",
            "project:depot",
            "project:key"],
    "lang":"en", // 默认语言
    "transport":function(data){
        // 自定义输出样式
        console.log(data);
    }
}
```

## OAuth

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=OAuth bin/coding

  Usage: coding [options] [command]


  Commands:

    authorize|auth
    clean

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```

## Users

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Users bin/coding

  Usage: coding [options] [command]


  Commands:

    activate                    账户激活
    generateActivatePhoneCode   获取激活账号的手机验证码
    activatePhone               激活用手机注册的用户
    avatar                      获取头像
    avatar                      上传设置头像
    captcha <action>            检查是否需要验证码
    changeNoticeSetting         修改通知设置
    checkEmail                  检查email是否没有被注册过
    checkPhone                  检查手机是否没有被注册过
    checkTwoFactorAuthCode      登录时的两步验证
    currentUser                 获取当前登录用户信息
    email                       获取当前用户的email
    changeNoticeSetting         获取通知设置
    gravatar                    获取Gravatar头像
    getUserByGlobalKey <user>   通过个性后缀获取用户信息
    login                       登录
    generateLoginPhoneCode      获取登录的手机验证码
    loginByPhone                使用绑定过的手机号码登录
    logout                      注销登录
    getUserByName <name>        通过昵称获取用户信息
    register                    注册
    generateRegisterPhoneCode   获取注册的手机验证码
    phoneRegister               使用手机注册
    avatar                      更新用户信息
    updatePwd                   修改用户密码
    avatar                      更新头像
    follow                      关注用户
    follower                    关注我的用户
    follower <user>             获取关注默认的用户
    friends                     我关注的用户列表
    friends <user>              指定用户的关注列表
    relationship <user>         是否关注了该用户
    changeNoticeSetting         获取我关注和关注我的用户列表
    changeNoticeSetting         获取我关注和关注我的用户列表包含成员列表
    search                      搜索用户
    unfollow                    取消关注
    unreadCount                 未读消息通知

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## Projects

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Projects bin/coding

  Usage: coding [options] [command]


  Commands:

    pinProject                       获取常用项目列表
    pinProject                       设置常用项目
    pinProject                       取消常用项目
    update                           更新项目信息
    recommendedList                  推荐项目list
    publicProjects                   公有项目列表
    queryByName <user> <project>     通过名称查询
    deleteProject <user> <project>   删除项目
    setProjectIcon <user> <project>  设置项目图标
    star <user> <project>            收藏项目
    stared <user> <project>          项目是否被收藏
    unstar <user> <project>          项目取消收藏
    unwatch <user> <project>         项目取消关注
    visitProject <user> <project>    更新项目阅读时间
    watch <user> <project>           关注项目
    watched <user> <project>         项目是否被关注
    watched <user> <project>         项目关注者
    projectList                      我的项目列表
    privateProjects                  私有项目列表
    privateProjects                  私有项目列表
    privateProjects                  私有项目列表
    privateProjects                  私有项目列表
    privateProjects                  私有项目列表
    privateProjects                  私有项目列表
    createProject <user>             创建项目
    publicProjects <user>            公有项目列表
    publicProjects <user>            公有项目列表
    publicProjects <user>            公有项目列表
    publicProjects <user>            公有项目列表
    publicProjects <user>            公有项目列表
    publicProjects <user>            公有项目列表

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

## ProjectTopics

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=ProjectTopics bin/coding

  Usage: coding [options] [command]


  Commands:

    list <user> <project>                             项目讨论列表
    create <user> <project>                           创建讨论/发表评论
    count <user> <project>                            所有讨论的个数和我的讨论的个数
    getProjectTopicByLabel <user> <project> <id>      通过标签获得讨论列表
    count <user> <project>                            所有讨论的个数和我的讨论的个数
    list <user> <project>                             我的讨论
    watchedProjectTopicList <user> <project>          获取我关注的讨论列表
    detail <user> <project> <id>                      讨论详情
    update <user> <project> <id>                      更新讨论
    del <user> <project> <id>                         删除讨论/删除讨论评论
    comments <user> <project> <id>                    讨论评论列表
    addTopicLabel <user> <project> <id> <labelId>     讨论添加标签
    deleteTopicLabel <user> <project> <id> <labelId>  删除讨论标签
    operateTopicLabel <user> <project> <id>           批量操作讨论标签
    watch <user> <project> <id>                       关注讨论
    watchers <user> <project> <id>                    获取关注该讨论的用户

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```

## Branchs

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Branchs bin/coding

  Usage: coding [options] [command]


  Commands:

    default <user> <project>          设置默认分支
    listBranches <user> <project>     分页显示分支列表
    create <user> <project>           新建分支
    del <user> <project>              删除分支
    addMember <user> <project>        添加保护分支成员
    protectedBranch <user> <project>  取消保护分支
    protectedBranch <user> <project>  设置保护分支
    members <user> <project>          列出保护分支中的成员
    deleteMember <user> <project>     删除保护分支成员

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```

## MergeRequests

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=MergeRequests bin/coding

  Usage: coding [options] [command]


  Commands:

    create <user> <project>         创建 MergeRequest
    get <user> <project> <iid>      显示某个 MergeRequest
    update <user> <project> <iid>   更新某个 MergeRequest
    cancel <user> <project> <iid>   取消 MergeRequest
    merge <user> <project> <iid>    合并某个 MergeRequest
    refuse <user> <project> <iid>   拒绝某个 MergeRequest
    list <user> <project> <status>  MergeRequest 列表

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```

## PullRequests

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=PullRequests bin/coding

  Usage: coding [options] [command]


  Commands:

    create <user> <project>          创建 PullRequest
    get <user> <project> <iid>       获取某个 PullRequest
    cancle <user> <project> <iid>    取消 PullRequest
    comments <user> <project> <iid>  PullRequest 评论列表
    commits <user> <project> <iid>   获取某个 PullRequest 的评论
    merge <user> <project> <iid>     合并 PullRequest
    refuse <user> <project> <iid>    拒绝 PullRequest
    list <user> <project> <status>   PullRequest 列表

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```

## Tags

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Tags bin/coding

  Usage: coding [options] [command]


  Commands:

    list <user> <project>    标签列表
    create <user> <project>  创建标签
    del <user> <project>     删除标签

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```

## Trees

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Trees bin/coding

  Usage: coding [options] [command]


  Commands:

    webhook <user> <project> <tree>  目录

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```

## Historys

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Historys bin/coding

  Usage: coding [options] [command]


  Commands:

    get <user> <project> <commits>  获取代码的历史

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```

## Blobs

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Blobs bin/coding

  Usage: coding [options] [command]


  Commands:

    get <user> <project> <blob>  获取 blob

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```

## Depots

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Depots bin/coding

  Usage: coding [options] [command]


  Commands:

    get <user> <project>                 获取仓库信息
    fork <user> <project>                fork
    forkList <user> <project>            项目被fork的列表
    createWebhook <user> <project>       创建 webhook
    getWebhook <user> <project> <id>     获取 webhook
    updateWebhook <user> <project> <id>  编辑 webhook
    deleteWebhook <user> <project> <id>  删除 webhook
    list <user> <project>                列出项目设置的 webhook
    importRepo <user> <project>          导入仓库
    importRepo <user> <project>          导入仓库
    initDepot <user> <project>           初始化仓库

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


```

## RepoFiles

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=RepoFiles bin/coding

  Usage: coding [options] [command]


  Commands:

    del <user> <project> <file>     删除文件
    update <user> <project> <file>  更新文件
    create <user> <project> <file>  新建文件

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```

## Commits

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Commits bin/coding

  Usage: coding [options] [command]


  Commands:

    show <user> <project> <commit>  commit 列表

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```

## Tasks

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Tasks bin/coding

  Usage: coding [options] [command]


  Commands:

    create <project>                                 创建任务
    create <project> <id>                            创建任务
    del <project> <id>                               删除任务
    list <project> <owner> <status>                  列出某人的任务列表
    create                                           全局任务创建
    count <user> <project>                           任务统计信息
    update <user> <project> <id>                     修改任务
    createComment <user> <project> <id>              创建任务评论
    createComment <user> <project> <id> <commentId>  删除任务评论
    comment <user> <project> <id>                    获取任务评论
    update <user> <project> <id>                     修改任务内容
    update <user> <project> <id>                     修改任务截止日期
    watch <user> <project> <id>                      获取任务描述
    update <user> <project> <id>                     修改任务描述
    label <user> <project> <id> <labelId>            添加任务标签
    watch <user> <project> <id> <labelId>            删除任务标签
    watch <user> <project> <id>                      批量操作任务标签
    update <user> <project> <id>                     修改任务执行者
    update <user> <project> <id>                     修改任务优先级
    update <user> <project> <id>                     修改任务状态
    watch <user> <project> <id>                      关注任务
    watch <user> <project> <id>                      取消任务关注
    getTaskListByLabel <user> <project> <id>         关注该任务的用户
    count <user> <project>                            获取当前用户项目的已完成、正在进行的、关注的数值
    count <user> <project>                           统计所有 已完成 和 正在处理 的任务数
    getTaskListByLabel <user> <project> <id>         查询标签下的任务列表
    count <user> <project> <status>                  列出当前用户某项目某状态的任务列表
    list <user> <project> <status>                   任务列表
    count <user> <status>                            当前用户某状态的任务列表

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```

## Tweets

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Tweets bin/coding

  Usage: coding [options] [command]


  Commands:

    create                     发送冒泡
    bestUser                   热门用户
    comment <id>               获取某个评论
    image                      冒泡插入图片
    lastTweetList              查询last_id以后的最新冒泡
    list                       冒泡列表
    userPublic                 用户冒泡列表
    detail <user> <tweet_id>   获取冒泡详情
    comment <id>               冒泡评论
    comment <id> <comment_id>  删除冒泡评论
    comment <id>               获取冒泡评论列表
    del <tweet_id>             删除冒泡
    like <tweet_id>            冒泡点赞
    likeTweetList <tweet_id>   赞过的冒泡列表
    unlike <tweet_id>          冒泡取消点赞
    publicTweets               冒泡广场列表

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```

## Files

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Files bin/coding

  Usage: coding [options] [command]


  Commands:

    checkExisted <user> <project> <dir>                       检查目录下是否有同名的文件
    uploadNewVersion <user> <project>                         上传文件新版本
    view <user> <project>                                     删除文件
    history <user> <project> <id>                             删除文件历史
    download <user> <project> <id>                            下载历史文件版本
    upload <user> <project>                                   上传私有项目的图片
    download <user> <project> <fileId>                        文件下载
    download <user> <project> <fileId>                        文件下载URL
    edit <user> <project> <fileId>                            编辑文件
    view <user> <project> <fileId>                            查看文件
    preview <user> <project> <fileId>                         图片预览
    updateFileRemark <user> <project> <file_id> <history_id>  修改历史版本备注
    create <user> <project> <folderId>                        创建文件
    history <user> <project> <id>                             文件历史
    mkdir <user> <project>                                    创建文件夹
    mkdir <user> <project>                                    删除文件夹
    move <user> <project> <dirId>                             移动文件
    renameFolder <user> <project> <dir>                       重命名文件夹
    files <user> <project> <dir>                              列出某目录下的文件
    folders <user> <project>                                  列出所有一级目录
    folders <user> <project>                                  列出所有目录
    count <user> <project>                                    获取文件夹的文件数

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```

## Keys

```
gitai@debian:~/workspace/Coding/Cli-Coding$ MOD=Keys bin/coding

  Usage: coding [options] [command]


  Commands:

    get <user> <keyId>             通过KeyId获取个人公钥
    key <user> <keyId>             删除个人公钥
    list <user>                    列出个人公钥
    create <user>                  创建个人公钥
    webhook <user> <project> <id>  绑定部署公钥
    webhook <user> <project>       新建部署公钥
    list <user> <project>          列出部署公钥
    webhook <user> <project> <id>  解绑部署公钥

  A simple command-line tool for coding.net by nodejs

  Options:

    -h, --help     output usage information
    -V, --version  output the version number



```