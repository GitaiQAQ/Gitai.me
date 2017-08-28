---

layout:     post
title:      "网易云音乐播放器全屏化自定义 CSS"
date:       2017-08-26
author:     "Gitai"
categories:
    - 杂项

---

服务商为了安利客户端，简直丧心病，比如网易云音乐，无论移动设备还是 PC，总有那么点反人类的地方。遂随手改个 CSS 姑且算是增加了全屏显示歌词之类的。

![netease_music_full_player.png](https://i.loli.net/2017/08/26/59a12932b29f9.png)

配合 [User CSS](https://chrome.google.com/webstore/detail/user-css/okpjlejfhacmgjkmknjhadmkdbcldfcb) 食用，估计没什么问题。

<!-- more -->

```css
#g_playlist {
    position: fixed !important;
    left: 0px !important;
    bottom: 47px !important;
    right: 0px !important;
    top: 0px !important;
    margin: 0px;
    height: auto;
    width: auto;
}

#g_playlist .listhd {
    background: #000;
}

#g_playlist .listbd {
    height: auto;
    bottom: 0px;
    width: auto;
    right: 0;
    background: #000;
}

#g_playlist .listbdc, #g_playlist .bline, #g_playlist .msk, #g_playlist .msk2{
  height: auto;
  bottom: 0;
}

.m-playbar .listhdc .lytit {
  right: 0;
  width: auto;
}


#g_playlist .listbd .imgbg {
  display: none;
}

#g_playlist .listlyric {
    left: 563px;
    right: 0px;
    width: auto;
    top: 0;
    bottom: 0px;
    font-size: large;
    height: auto;
}

#g_playlist .listlyric p.z-sel {
    font-size: x-large;
}

#g_playlist  .bg {
  background: #000;
}
```

以上
