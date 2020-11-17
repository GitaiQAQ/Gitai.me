---

layout:     post
title:      "「Kanban」 Message Handler"
date:       2016-03-12 14:01:24
author:     "Gitai"
categories:
    - Kanban
tags:
    - Kanban

---

> 继续深入吧～新的接口～

<!--more-->

## 调用栈

```
1. mqq.app.MainService$2.run(MainService.java:290)
2. com.tencent.mobileqq.msf.sdk.MsfRespHandleUtil.handlePushMsg
3. mqq.app.MainService$5.onRecvCmdPush(MainService.java:648)
4. mqq.app.MainService.access$200(MainService.java:60)
5. mqq.app.MainService.receiveMessageFromMSF(MainService.java:212)
6. mqq.app.ServletContainer.notifyMSFServlet(ServletContainer.java:156
7. mqq.app.MSFServlet.onReceive(MSFServlet.java:39)
8. com.tencent.mobileqq.compatible.TempServlet.onReceive(TempServlet.java:20)
9. > com.tencent.mobileqq.app.QQAppInterface.a(QQAppInterface.java:3786/3790)
10. com.tencent.mobileqq.service.MobileQQService.a(MobileQQService.java:362)
11. com.tencent.mobileqq.app.MessageHandler.a(MessageHandler.java:632)
12. com.tencent.mobileqq.app.MessageHandler.f(MessageHandler.java:6760)
13. com.tencent.mobileqq.troop.data.TroopMessageProcessor.a
14. com.tencent.mobileqq.troop.data.TroopMessageProcessor.a
15. com.tencent.mobileqq.app.message.QQMessageFacade.a
16. com.tencent.mobileqq.app.message.QQMessageFacade.notifyObservers
17. com.tencent.mobileqq.activity.ChatActivity.update
18. com.tencent.mobileqq.activity.ChatActivity.a
```

## 结构树

```
.
├── Constant.java
├── data
│   ├── Message.java
│   ├── MessageRecord.java
│   ├── ReflectedObject.java
│   ├── ServiceMsg.java
│   └── SessionInfo.java
├── util
│   └── Utils.java
└── xposed
    ├── ChatHook.java
    ├── MessageHandlerHook.java
    └── QLogHook.java
```

## Source

### ServiceMsg

```java

import me.gitai.phuckqq.util.Utils;
import java.util.HashMap;
import android.os.Bundle;

/**
 * Created by dphdjy on 16-3-12.
 */
public class ServiceMsg extends ReflectedObject{
    private String tag = "ToServiceMsg";// ToServiceMsg || FromServiceMsg merge sign
    //public IBaseActionListener actionListener;
    private int appId;
    private int appSeq = -1;
    public HashMap attributes = new HashMap();
    public Bundle extraData = new Bundle();
    //TODO:
    //import com.tencent.mobileqq.msf.sdk.MsfCommand;
    //private MsfCommand msfCommand = MsfCommand.unknown;
    private String serviceCmd;
    private int ssoSeq = -1;
    private String uin;
    private byte[] wupBuffer = new byte[0];

    // FromServiceMsg only
    private String errorMsg = "";
    private int flag;
    private byte fromVersion = 1;
    private byte[] msgCookie = new byte[0];
    private int resultCode;

    // ToServiceMsg only
    private boolean needResp = true;
    private long sendTimeout = -1L;
    private String serviceName;
    private long timeout = -1L;
    private byte toVersion = 1;
    private byte uinType = 0;

    public ServiceMsg(Object obj) {
        super(obj);
    }

    public ServiceMsg(String tag,Object obj) {
        super(obj);
        if(!Utils.isEmpty(tag))this.tag = tag;
    }

    public String getTag() {
        return tag;
    }

    public int getAppId() {
        if (appId > 0)return appId;
        return appId = getIntField("appId");
    }

    public int getAppSeq() {
        if (appSeq > -1)return appSeq;
        return appSeq = getIntField("appSeq");
    }

    public HashMap getAttributes() {
        if (attributes != null && attributes.size() > 0)return attributes;
        return attributes = (HashMap)getField("attributes");
    }

    public Bundle getExtraData() {
        if (extraData != null)return extraData;
        return extraData = (Bundle)getField("extraData");
    }

    //TODO:

    public String getServiceCmd() {
        if (!Utils.isEmpty(serviceCmd))return serviceCmd;
        return serviceCmd = (String)getField("serviceCmd");
    }

    public int getSsoSeq() {
        if (ssoSeq > -1)return ssoSeq;
        return ssoSeq = getIntField("ssoSeq");
    }

    public String getUin() {
        if (!Utils.isEmpty(uin))return uin;
        return uin = (String)getField("uin");
    }

    public byte[] getWupBuffer() {
        if (wupBuffer != null)return wupBuffer;
        return wupBuffer = (byte[])getField("wupBuffer");
    }

    // FromServiceMsg only
    public String getErrorMsg() {
        if (!Utils.isEmpty(errorMsg))return errorMsg;
        return errorMsg = (String)getField("errorMsg");
    }

    public int getFlag() {
        if (flag > 0)return flag;
        return flag = getIntField("flag");
    }

    public byte getFromVersion() {
        if (fromVersion != 1)return fromVersion;
        return fromVersion = getByteField("fromVersion");
    }

    public byte[] getMsgCookie() {
        if (msgCookie != null)return msgCookie;
        return msgCookie = (byte[])getField("msgCookie");
    }

    public int getResultCode() {
        if (resultCode > 0)return resultCode;
        return resultCode = getIntField("resultCode");
    }

    // ToServiceMsg only
    public boolean isNeedResp() {
        if (needResp)return needResp;
        return needResp = getBooleanField("needResp");
    }

    public long getSendTimeout() {
        if (sendTimeout > 0)return sendTimeout;
        return sendTimeout = getLongField("sendTimeout");
    }

    public String getServiceName() {
        if (!Utils.isEmpty(serviceName))return serviceName;
        return serviceName = (String)getField("serviceName");
    }

    public long getTimeout() {
        if (timeout > 0)return timeout;
        return timeout = getLongField("timeout");
    }

    public byte getToVersion() {
        if (toVersion != 1)return toVersion;
        return toVersion = getByteField("toVersion");
    }

    public byte getUinType() {
        if (uinType != 1)return uinType;
        return uinType = getByteField("uinType");
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("--Dump " + getTag() + "--,")
                .append(",appId:").append(getAppId())
                .append(",appSeq:").append(getAppSeq())
                .append(",attributes:").append(getAttributes())
                .append(",extraData:").append(getExtraData())
                //.append(",msfCommand:").append(getMsfCommand())
                .append(",serviceCmd:").append(getServiceCmd())
                .append(",ssoSeq:").append(getSsoSeq())
                .append(",uin:").append(getUin())
                .append(",wupBuffer:").append(getWupBuffer());

        // FromServiceMsg only
        if ("FromServiceMsg".equals(getTag())) {
            sb.append(",errorMsg:").append(getErrorMsg())
                .append(",flag:").append(getFlag())
                .append(",fromVersion:").append(getFromVersion())
                .append(",msgCookie:").append(getMsgCookie())
                .append(",resultCode:").append(getResultCode());
        }

        // ToServiceMsg only
        if ("ToServiceMsg".equals(getTag())) {
            sb.append(",needResp:").append(isNeedResp())
                .append(",sendTimeout:").append(getSendTimeout())
                .append(",serviceName:").append(getServiceName())
                .append(",timeout:").append(getTimeout())
                .append(",toVersion:").append(getToVersion())
                .append(",uinType:").append(getUinType());
        }

        return sb.toString();
    }

}

```

### MessageHandlerHook

```java
import java.io.File;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;

import android.annotation.TargetApi;
import android.app.AndroidAppHelper;
import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.UserHandle;
import android.util.Log;
import android.widget.Toast;

import de.robv.android.xposed.IXposedHookLoadPackage;
import de.robv.android.xposed.XC_MethodHook;
import de.robv.android.xposed.XSharedPreferences;
import de.robv.android.xposed.XposedBridge;
import de.robv.android.xposed.XposedHelpers;
import de.robv.android.xposed.callbacks.XC_LoadPackage;

import me.gitai.phuckqq.BuildConfig;
import me.gitai.phuckqq.Constant;
import me.gitai.phuckqq.data.ServiceMsg;

/**
 * Created by gitai on 16-2-29.
 */
public class MessageHandlerHook implements IXposedHookLoadPackage {

    private Class<?> QQAppInterface,SessionInfo,ChatActivityFacade;

    private void hook1(XC_LoadPackage.LoadPackageParam lpparam) throws ClassNotFoundException,NoSuchFieldException,IllegalAccessException{
        String className = "com.tencent.mobileqq.app.QQAppInterface";
        String methodName = "a";

        Class<?> ToServiceMsg = lpparam.classLoader.loadClass("com.tencent.qphone.base.remote.ToServiceMsg");

        XposedBridge.log("Hooking a(ToServiceMsg toServiceMsg)");

        XposedHelpers.findAndHookMethod(className, lpparam.classLoader, methodName,
                ToServiceMsg,
                new XC_MethodHook() {
                    @Override
                    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
                        ServiceMsg toServiceMsg = new ServiceMsg(param.args[0]);
                        XposedBridge.log(toServiceMsg.toString().replace(",", "\n"));
                    }
                });
    }

    private void hook2(XC_LoadPackage.LoadPackageParam lpparam) throws ClassNotFoundException,NoSuchFieldException,IllegalAccessException{
        String className = "com.tencent.mobileqq.app.QQAppInterface";
        String methodName = "a";

        Class<?> FromServiceMsg = lpparam.classLoader.loadClass("com.tencent.qphone.base.remote.FromServiceMsg");
        Class<?> ToServiceMsg = lpparam.classLoader.loadClass("com.tencent.qphone.base.remote.ToServiceMsg");

        XposedBridge.log("Hooking a(ToServiceMsg toServiceMsg, FromServiceMsg fromServiceMsg)");

        XposedHelpers.findAndHookMethod(className, lpparam.classLoader, methodName,
                ToServiceMsg, FromServiceMsg,
                new XC_MethodHook() {
                    @Override
                    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
                        ServiceMsg toServiceMsg = new ServiceMsg(param.args[0]);
                        ServiceMsg fromServiceMsg = new ServiceMsg("FromServiceMsg", param.args[1]);
                        XposedBridge.log(toServiceMsg.toString().replace(",", "\n") + "\n" + fromServiceMsg.toString().replace(",", "\n"));
                    }
                });
    }

    @Override
    public void handleLoadPackage(XC_LoadPackage.LoadPackageParam lpparam) throws Throwable {
        //initConfig();
        //&& mConfig.getBoolean(Constant.KEY_ENABLE, false)
        if ("com.tencent.qq.kddi".equals(lpparam.packageName)) {
            XposedBridge.log("PhuckQQ initializing...");
            //printDeviceInfo();
            try {
                hook1(lpparam);
            } catch (Throwable e) {
                XposedBridge.log("Failed to hook1 QQ handler" + "\n" + Log.getStackTraceString(e));
                throw e;
            }
            try {
                hook2(lpparam);
            } catch (Throwable e) {
                XposedBridge.log("Failed to hook1 QQ handler" + "\n" + Log.getStackTraceString(e));
                throw e;
            }
            XposedBridge.log("PhuckQQ initialization complete!");
        }
    }
}
```

### 运行 logs

> 以下 `log` 均省略格式如：`03-13 \d+:\d+:\d+.\d+ I/Xposed  \( \d+\): ` 的标记
>
> 为了保护个人隐私 `uin` 均用 `*` 替换

```
root@NX505J:/d/d/d/log # cat error.log
MsgType:troop_processor

--Dump ToServiceMsg--
appId:0
appSeq:-1
attributes:{}
extraData:Bundle[{}]
serviceCmd:friendlist.GetSimpleOnlineFriendInfoReq
ssoSeq:-1
uin:**********
wupBuffer:[B@1cc6e997
needResp:true
sendTimeout:-1
serviceName:mobileqq.service
timeout:120000
toVersion:1
uinType:0

--Dump ToServiceMsg--
appId:0
appSeq:-1
attributes:{appTimeoutReq=28
 to_SendTime=1457837737028
 to_SenderProcessName=com.tencent.qq.kddi}
extraData:Bundle[{}]
serviceCmd:friendlist.GetSimpleOnlineFriendInfoReq
ssoSeq:-1
uin:**********
wupBuffer:[B@9068833
needResp:true
sendTimeout:-1
serviceName:mobileqq.service
timeout:120000
toVersion:1
uinType:0

--Dump FromServiceMsg--
appId:537042075
appSeq:26
attributes:{__timestamp_net2msf=1457837737089
 __timestamp_msf2app=1457837737091
 _tag_localsocket=/192.168.1.6:58156|58156
 __timestamp_net2msf_boot=300097
 _tag_socket=183.60.38.56:8080
 FromServiceMsg=ToServiceMsg msName:unknown ssoSeq:-1 appId:0 appSeq:-1 sName:mobileqq.service uin:********** sCmd:friendlist.GetSimpleOnlineFriendInfoReq t:120000 needResp:true
 _tag_LOGSTR=183.60.38.56:8080|58876|friendlist.GetSimpleOnlineFriendInfoReq|}
extraData:Bundle[{}]
serviceCmd:friendlist.GetSimpleOnlineFriendInfoReq
ssoSeq:58876
uin:**********
wupBuffer:[B@1fb9b7f0
errorMsg:
flag:0
fromVersion:1
msgCookie:[B@bbea169
resultCode:1000


MsgType:troop_processor

--Dump ToServiceMsg--
appId:0
appSeq:-1
attributes:{}
extraData:Bundle[{}]
serviceCmd:OnlinePush.PbPushGroupMsg
ssoSeq:-1
uin:**********
wupBuffer:[B@19fb289e
needResp:true
sendTimeout:-1
serviceName:
timeout:-1
toVersion:1
uinType:0

--Dump FromServiceMsg--
appId:-1
appSeq:-156508923
attributes:{__timestamp_net2msf=1457837797602
 _tag_socket=183.60.38.56:8080
 __attribute_tag_sid=Ae3bfvyI4oYwUYncrnPXLlsd
 _tag_LOGSTR=183.60.38.56:8080|-156508923|OnlinePush.PbPushGroupMsg|
 __timestamp_msf2app=1457837797614
 _tag_localsocket=/192.168.1.6:58156|58156
 resp_needBootApp=1
 __timestamp_net2msf_boot=360610
 to_SenderProcessName=com.tencent.qq.kddi}
extraData:Bundle[{}]
serviceCmd:OnlinePush.PbPushGroupMsg
ssoSeq:-156508923
uin:**********
wupBuffer:[B@1e849f7f
errorMsg:
flag:0
fromVersion:1
msgCookie:[B@24acb4c
resultCode:1000
```

## 补充

### 备注

当前Hook的方法为`com.tencent.mobileqq.app.QQAppInterface.a `

解决以下问题：

1. 只有在 `ChatActivity` 生命周期内才有效
2. 只有后台的 `SessionInfo` 拥有的消息才能收到，当前 `ChatActivity` 的消息直接调用 `ChatActivityFacade` 绘制View

**EOF**
