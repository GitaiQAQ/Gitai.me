---

layout:     post
title:      "「Kanban」:MVP"
date:       2016-03-04
author:     "Gitai"
categories:
    - Kanban
tags:
    - Kanban

---

## 初代目（ MVP）
> MVP(Minimum Viable Product)/最小化可行产品
> 本版本用于校验可行性

<!--more-->

## 结构树
```
.
├── Constant.java // 常量定义
├── data
│   ├── Message.java    // 反射的消息对象
│   ├── MessageRecord.java  // Message的父级，将来可继承拓展富媒体对象
│   ├── ReflectedObject.java    // 根对象，包含一系列反射方法的定义
│   └── Session.java    // 当前会话
├── util
│   └── Utils.java // 从通用库抽取的几个必要方法
└── xposed
    └── ChatHook.java // Xposed 接口

```

### Sources

#### Constant

```java
import android.os.Environment;
import java.io.File;
import me.gitai.phuckqq.BuildConfig;

/**
 * Created by gitai on 16-1-3.
 */
public class Constant {
    public static final String MODULE_NAME                          = "kanban";
    public static final String MODULE_VERSION                       = "v2";

    public static final String PATH_DATA                            = Environment.getExternalStorageDirectory().getAbsoluteFile() + File.separator + MODULE_NAME;
    public static final String PATH_DATA_LOG                        = PATH_DATA + File.separator + "logs";
    public static final String PATH_DATA_CONFIG                     = PATH_DATA + File.separator + "configs";
    public static final String PATH_DATA_SCRIPT                     = PATH_DATA + File.separator + "script";

    public static final String KEY_ENABLE                           = "enable";
    public static final String KEY_LOG_ENABLE                       = "log_enable";
    public static final String KEY_RES_LIST                         = "reslist";

    public static final String FILE_EXTENSION_LOG                   = ".log";
    public static final String FILE_EXTENSION_CONFIG                = ".cfg";

    public static final String PACKAGENAME                          = com.tencent.qq.kddi;
    public static final String CLASSNAME_MESSAGEHANDLER            = "com.tencent.mobileqq.app.MessageHandler";
    public static final String CLASSNAME_CHATACTIVITY              = "com.tencent.mobileqq.activity.ChatActivity";
    public static final String CLASSNAME_QQMESSAGEFACADE_MESSAGE  = "com.tencent.mobileqq.app.message.QQMessageFacade$Message";
    public static final String CLASSNAME_SESSIONINFO               = "com.tencent.mobileqq.activity.aio.SessionInfo";
}

```

#### data

##### ReflectedObject

```java
import de.robv.android.xposed.XposedHelpers;

/**
 * Created by dphdjy on 16-3-2.
 */
public class ReflectedObject {

    private final Object mObject;

    public ReflectedObject(Object mObject) {
        this.mObject = mObject;
    }

    public Object getObject() {
        return mObject;
    }

    public Object getField(String fieldName){
        return XposedHelpers.getObjectField(mObject, fieldName);
    }

    public boolean getBooleanField(String fieldName){
        return XposedHelpers.getBooleanField(mObject, fieldName);
    }

    public byte getByteField(String fieldName){
        return XposedHelpers.getByteField(mObject, fieldName);
    }

    public char getCharField(String fieldName){
        return XposedHelpers.getCharField(mObject, fieldName);
    }

    public double getDoubleField(String fieldName){
        return XposedHelpers.getDoubleField(mObject, fieldName);
    }

    public float getFloatField(String fieldName){
        return XposedHelpers.getFloatField(mObject, fieldName);
    }

    public int getIntField(String fieldName){
        return XposedHelpers.getIntField(mObject, fieldName);
    }

    public long getLongField(String fieldName){
        return XposedHelpers.getLongField(mObject, fieldName);
    }

    public short getShortField(String fieldName){
        return XposedHelpers.getShortField(mObject, fieldName);
    }

    @Override
    public String toString() {
        return new StringBuilder("--Dump SessionInfo--")
                .toString();
    }
}

```

##### MessageRecord

```java

import me.gitai.phuckqq.util.Utils;

/**
 * Created by dphdjy on 16-3-2.
 */
public class MessageRecord extends ReflectedObject{
    public static final int EXTRA_STREAM_PTT_FLAG = 10001;
    public static final int MIN_VERSION_CODE_SUPPORT_IMAGE_MD5_TRANS = 2;
    public static final int MSG_TYPE_0x7F = -2006;
    public static final int MSG_TYPE_ACTIVITY = -4002;
    public static final int MSG_TYPE_AUTHORIZE_FAILED = -4005;
    public static final int MSG_TYPE_AUTOREPLY = -10000;
    public static final int MSG_TYPE_C2C_CHAT_FREQ_CALL_TIP = -1014;
    public static final int MSG_TYPE_C2C_KEYWORD_CALL_TIP = -1015;
    public static final int MSG_TYPE_C2C_MIXED = -30002;
    public static final int MSG_TYPE_DISCUSS_PUSH = -1004;
    public static final int MSG_TYPE_DISC_CREATE_CALL_TIP = -1016;
    public static final int MSG_TYPE_DISC_PTT_FREQ_CALL_TIP = -1017;
    public static final int MSG_TYPE_ENTER_TROOP = -4003;
    public static final int MSG_TYPE_FAILED_MSG = -2013;
    public static final int MSG_TYPE_FILE_RECEIPT = -3008;
    public static final int MSG_TYPE_FORWARD_IMAGE = -20000;
    public static final int MSG_TYPE_GAME_INVITE = -3004;
    public static final int MSG_TYPE_GAME_SHARE = -3005;
    public static final int MSG_TYPE_GROUPDISC_FILE = -2014;
    public static final int MSG_TYPE_LOCAL_COMMON = -4000;
    public static final int MSG_TYPE_LOCAL_URL = -4001;
    public static final int MSG_TYPE_LONG_MIX = -1036;
    public static final int MSG_TYPE_LONG_TEXT = -1037;
    public static final int MSG_TYPE_MEDIA_EMO = -2001;
    public static final int MSG_TYPE_MEDIA_FILE = -2005;
    public static final int MSG_TYPE_MEDIA_FUNNY_FACE = -2010;
    public static final int MSG_TYPE_MEDIA_MARKFACE = -2007;
    public static final int MSG_TYPE_MEDIA_MULTI09 = -2003;
    public static final int MSG_TYPE_MEDIA_MULTI513 = -2004;
    public static final int MSG_TYPE_MEDIA_PIC = -2000;
    public static final int MSG_TYPE_MEDIA_PTT = -2002;
    public static final int MSG_TYPE_MEDIA_SECRETFILE = -2008;
    public static final int MSG_TYPE_MEDIA_VIDEO = -2009;
    public static final int MSG_TYPE_MIX = -1035;
    public static final int MSG_TYPE_MULTI_TEXT_VIDEO = -4008;
    public static final int MSG_TYPE_MULTI_VIDEO = -2016;
    public static final int MSG_TYPE_MY_ENTER_TROOP = -4004;
    public static final int MSG_TYPE_NEW_FRIEND_TIPS = -1013;
    public static final int MSG_TYPE_NULL = -999;
    public static final int MSG_TYPE_ONLINE_FILE_REQ = -3007;
    public static final int MSG_TYPE_OPERATE_TIPS = -1041;
    public static final int MSG_TYPE_PC_PUSH = -3001;
    public static final int MSG_TYPE_PIC_AND_TEXT_MIXED = -3000;
    public static final int MSG_TYPE_PIC_QSECRETARY = -1032;
    public static final int MSG_TYPE_PLAY_TOGETHER_RESULT = -1038;
    public static final int MSG_TYPE_PTT_QSECRETARY = -1031;
    public static final int MSG_TYPE_PUBLIC_ACCOUNT = -3006;
    public static final int MSG_TYPE_QLINK_AP_CREATE_SUC_TIPS = -3011;
    public static final int MSG_TYPE_QLINK_FILE_TIPS = -3009;
    public static final int MSG_TYPE_QLINK_SEND_FILE_TIPS = -3010;
    public static final int MSG_TYPE_QZONE_NEWEST_FEED = -2015;
    public static final int MSG_TYPE_SHAKE_WINDOW = -2020;
    public static final int MSG_TYPE_SHIELD_MSG = -2012;
    public static final int MSG_TYPE_SINGLE_WAY_FRIEND_MSG = -2019;
    public static final int MSG_TYPE_STRUCT_MSG = -2011;
    public static final int MSG_TYPE_STRUCT_TROOP_NOTIFICATION = -2021;
    public static final int MSG_TYPE_SYSTEM_STRUCT_MSG = -2018;
    public static final int MSG_TYPE_TEXT = -1000;
    public static final int MSG_TYPE_TEXT_FRIEND_FEED = -1034;
    public static final int MSG_TYPE_TEXT_GROUPMAN_ACCEPT = -1021;
    public static final int MSG_TYPE_TEXT_GROUPMAN_ADDREQUEST = -1020;
    public static final int MSG_TYPE_TEXT_GROUPMAN_INVITE = -1023;
    public static final int MSG_TYPE_TEXT_GROUPMAN_REFUSE = -1022;
    public static final int MSG_TYPE_TEXT_QSECRETARY = -1003;
    public static final int MSG_TYPE_TEXT_RECOMMEND_CIRCLE = -1033;
    public static final int MSG_TYPE_TEXT_RECOMMEND_CONTACT = -1030;
    public static final int MSG_TYPE_TEXT_RECOMMEND_TROOP = -1039;
    public static final int MSG_TYPE_TEXT_RECOMMEND_TROOP_BUSINESS = -1040;
    public static final int MSG_TYPE_TEXT_SAFE = -1002;
    public static final int MSG_TYPE_TEXT_SYSTEM_ACCEPT = -1008;
    public static final int MSG_TYPE_TEXT_SYSTEM_ACCEPTANDADD = -1007;
    public static final int MSG_TYPE_TEXT_SYSTEM_ADDREQUEST = -1006;
    public static final int MSG_TYPE_TEXT_SYSTEM_ADDSUCCESS = -1010;
    public static final int MSG_TYPE_TEXT_SYSTEM_OLD_VERSION_ADDREQUEST = -1011;
    public static final int MSG_TYPE_TEXT_SYSTEM_REFUSE = -1009;
    public static final int MSG_TYPE_TEXT_VIDEO = -1001;
    public static final int MSG_TYPE_TROOP_MIXED = -30003;
    public static final int MSG_TYPE_TROOP_OBJ_MSG = -2017;
    public static final int MSG_TYPE_TROOP_TIPS_ADD_MEMBER = -1012;
    public static final int MSG_TYPE_TROOP_UNREAD_TIPS = -4009;
    public static final int MSG_VERSION_CODE = 3;
    public static final int MSG_VERSION_CODE_FOR_PICPTT = 3;
    public static final String QUERY_NEW_TABLE_FIELDS = "_id, extraflag, frienduin, isread, issend, istroop, NULL as msg, msgData, msgId, msgseq, msgtype, selfuin, senderuin, shmsgseq, time, versionCode, longMsgIndex, longMsgId, longMsgCount, isValid, msgUid, vipBubbleID, uniseq, sendFailCode, extStr, extInt, extLong";
    public static final String QUERY_OLD_TABLE_FIELDS = "_id, extraflag, frienduin, isread, issend, istroop, msg, NULL as msgData, msgId, msgseq, msgtype, selfuin, senderuin, shmsgseq, time, 0 as versionCode, NULL as longMsgIndex, NULL as longMsgId, NULL as longMsgCount, 1 as isValid, NULL as msgUid, NULL as vipBubbleID, 0 as uniseq, 0 as sendFailCode, NULL as extStr, 0 as extInt, 0 as extLong";
    public static final String[] QUERY_OLD_TABLE_FIELDS_ARRAY = new String[]{"_id", "extraflag", "frienduin", "isread", "issend", "istroop", "msg", "msgId", "msgseq", "msgtype", "selfuin", "senderuin", "shmsgseq", "time"};
    public static final int SEND_FAIL_CODE_DEFAULT = 0;
    private int extInt;
    private int extLong;
    private String extStr;
    private int extraflag;
    private String frienduin;
    private boolean isValid = true;
    private boolean isread;
    private int issend;
    private int istroop;
    private int longMsgCount;
    private int longMsgId;
    private int longMsgIndex;

    private String msg;
    private byte[] msgData;

    private long msgId;
    private long msgUid;
    private long msgseq;
    private int msgtype;
    private String selfuin;
    private int sendFailCode;
    private String senderuin;
    private long shmsgseq;
    private long time;
    private long uniseq;
    private int versionCode = 3;
    private long vipBubbleID;

    public MessageRecord(Object obj) {
        super(obj);
    }

    public int getExtInt() {
        if (extInt > 0)return extInt;
        return extInt = getIntField("extInt");
    }

    public int getExtLong() {
        if (extLong > 0)return extLong;
        return extLong = getIntField("extLong");
    }

    public String getExtStr() {
        if (!Utils.isEmpty(extStr))return extStr;
        return extStr = (String)getField("extStr");
    }

    public int getExtraflag() {
        if (extraflag > 0)return extraflag;
        return extraflag = getIntField("extraflag");
    }

    public String getFrienduin() {
        if (!Utils.isEmpty(frienduin))return frienduin;
        return frienduin = (String)getField("frienduin");
    }

    public boolean isValid() {
        if (isValid)return isValid;
        return isValid = getBooleanField("isValid");
    }

    public boolean isread() {
        if (isread)return isread;
        return isread = getBooleanField("isread");
    }

    public int getIssend() {
        if (issend > 0)return issend;
        return issend = getIntField("issend");
    }

    public int getIstroop() {
        if (istroop > 0)return istroop;
        return istroop = getIntField("istroop");
    }

    public int getLongMsgCount() {
        if (longMsgCount > 0)return longMsgCount;
        return longMsgCount = getIntField("longMsgCount");
    }

    public boolean isLongMsg() {
        if (this.longMsgCount > 1) {
            return true;
        }
        return false;
    }

    public int getLongMsgId() {
        if (longMsgId > 0)return longMsgId;
        return longMsgId = getIntField("longMsgId");
    }

    public int getLongMsgIndex() {
        if (longMsgIndex > 0)return longMsgIndex;
        return longMsgIndex = getIntField("longMsgIndex");
    }

    public String getMsg() {
        if (!Utils.isEmpty(msg))return msg;
        return msg = (String)getField("msg");
    }

    public byte[] getMsgData() {
        if (msgData != null && msgData.length > 0)return msgData;
        return msgData = (byte[])getField("msgData");
    }

    public long getMsgId() {
        if (msgId > 0) return msgId;
        return msgId = getLongField("msgId");
    }

    public long getMsgUid() {
        if (msgUid > 0) return msgUid;
        return msgUid = getLongField("msgUid");
    }

    public long getMsgseq() {
        if (msgseq > 0) return msgseq;
        return msgseq = getLongField("msgseq");
    }

    public int getMsgtype() {
        if (msgtype > 0) return msgtype;
        return msgtype = getIntField("msgtype");
    }

    public String getSelfuin() {
        if (!Utils.isEmpty(selfuin))return selfuin;
        return selfuin = (String)getField("selfuin");
    }

    public int getSendFailCode() {
        if (sendFailCode > 0) return sendFailCode;
        return sendFailCode = getIntField("sendFailCode");
    }

    public String getSenderuin() {
        if (!Utils.isEmpty(senderuin))return senderuin;
        return senderuin = (String)getField("senderuin");
    }

    public long getShmsgseq() {
        if (shmsgseq > 0) return shmsgseq;
        return shmsgseq = getLongField("shmsgseq");
    }

    public long getTime() {
        if (time > 0) return time;
        return time = getLongField("time");
    }

    public long getUniseq() {
        if (uniseq > 0) return uniseq;
        return uniseq = getLongField("uniseq");
    }

    public int getVersionCode() {
        if (versionCode > 0) return versionCode;
        return versionCode = getIntField("versionCode");
    }

    public long getVipBubbleID() {
        if (vipBubbleID > 0) return vipBubbleID;
        return vipBubbleID = getLongField("vipBubbleID");
    }

    @Override
    public String toString() {
        StringBuilder stringBuilder = new StringBuilder("--Dump MessageRecord--,")
                .append(super.toString())
                .append(",selfUin:").append(getSelfuin())
                .append(",friendUin:").append(getFrienduin())
                .append(",senderUin:").append(getSenderuin())
                .append(",shmsgseq:").append(getShmsgseq())
                .append(",uid:").append(getMsgUid())
                .append(",time:").append(getTime())
                .append(",isRead:").append(isread())
                .append(",isSend:").append(getIssend())
                .append(",extraFlag:").append(getExtraflag())
                .append(",sendFailCode:").append(getSendFailCode())
                .append(",istroop:").append(getIstroop())
                .append(",msgType:").append(getMsgtype())
                .append(",msg:").append(getMsg())
                .append(",bubbleid:").append(getVipBubbleID())
                .append(",uniseq:").append(getUniseq());
        if (isLongMsg()) {
            stringBuilder.append(",longMsgId:").append(getLongMsgId())
                    .append(",longMsgCount:").append(getLongMsgCount())
                    .append(",longMsgIndex:").append(getLongMsgIndex());
        }
        return stringBuilder.toString();
    }
}

```

##### Message

```java

import me.gitai.phuckqq.util.Utils;

/**
 * Created by dphdjy on 16-3-2.
 */
public class Message extends MessageRecord{
    private String actMsgContentValue;
    private String action = null;
    private int bizType = -1;
    private int counter = 0;
    private CharSequence emoRecentMsg;
    private long fileSize = -1;
    private int fileType = -1;
    private boolean hasReply;

    private boolean isCacheValid = true;
    //private Boolean isInWhisper = false;
    private String latestNormalMsgString;
    private String nickName = null;
    private String pttUrl;
    private long shareAppID;

    private int unReadNum;

    public Message(Object obj) {
        super(obj);
    }

    public CharSequence getMessageText() {
        if (getEmoRecentMsg() == null) {
            return getMsg();
        }
        return getEmoRecentMsg();
    }

    public String getActMsgContentValue() {
        if (!Utils.isEmpty(actMsgContentValue))return actMsgContentValue;
        return actMsgContentValue = (String)getField("actMsgContentValue");
    }

    public String getAction() {
        if (!Utils.isEmpty(action))return action;
        return action = (String)getField("action");
    }

    public int getBizType() {
        if (bizType > 0)return bizType;
        return bizType = getIntField("bizType");
    }

    public int getCounter() {
        if (counter > 0)return counter;
        return counter = getIntField("counter");
    }

    public CharSequence getEmoRecentMsg() {
        if (!Utils.isEmpty(emoRecentMsg))return emoRecentMsg;
        return emoRecentMsg = (CharSequence)getField("emoRecentMsg");
    }

    public long getFileSize() {
        if (fileSize > 0)return fileSize;
        return fileSize = getLongField("fileSize");
    }

    public int getFileType() {
        if (fileType > 0)return fileType;
        return fileType = getIntField("fileType");
    }

    public boolean isHasReply() {
        if (hasReply)return hasReply;
        return hasReply = getBooleanField("hasReply");
    }

    public boolean isCacheValid() {
        if (isCacheValid)return isCacheValid;
        return isCacheValid = getBooleanField("isCacheValid");
    }

    /*public Boolean getIsInWhisper() {
        if (isInWhisper)return isInWhisper;
        return isInWhisper = getBooleanField("isInWhisper");
    }*/

    public String getLatestNormalMsgString() {
        if (!Utils.isEmpty(latestNormalMsgString))return latestNormalMsgString;
        return latestNormalMsgString = (String)getField("latestNormalMsgString");
    }

    public String getNickName() {
        if (!Utils.isEmpty(nickName))return nickName;
        return nickName = (String)getField("nickName");
    }

    public String getPttUrl() {
        if (!Utils.isEmpty(pttUrl))return pttUrl;
        return pttUrl = (String)getField("pttUrl");
    }

    public long getShareAppID() {
        if (shareAppID > 0)return shareAppID;
        return shareAppID = getLongField("shareAppID");
    }

    public int getUnReadNum() {
        if (unReadNum > 0)return unReadNum;
        return unReadNum = getIntField("unReadNum");
    }

    @Override
    public String toString() {
        return new StringBuilder("--Dump Message--,")
                .append(",actMsgContentValue:").append(getActMsgContentValue())
                .append(",action:").append(getAction())
                .append(",bizType:").append(getBizType())
                .append(",counter:").append(getCounter())
                .append(",emoRecentMsg:").append(getEmoRecentMsg())
                .append(",fileSize:").append(getFileSize())
                .append(",fileType:").append(getFileType())
                .append(",hasReply:").append(isHasReply())
                .append(",isCacheValid:").append(isCacheValid())
                //.append(",isInWhisper:").append(getIsInWhisper())
                .append(",latestNormalMsgString:").append(getLatestNormalMsgString())
                .append(",nickName:").append(getNickName())
                .append(",pttUrl:").append(getPttUrl())
                .append(",shareAppID:").append(getShareAppID())
                .append(",unReadNum:").append(getUnReadNum())
                .toString();
    }

}

```

##### Session

```java

import me.gitai.phuckqq.util.Utils;

/**
 * Created by dphdjy on 16-3-2.
 */
public class SessionInfo extends ReflectedObject{
    private String uin; //a
    private int uintype;    //a
    private String phonenum;    //e
    //private int entrance;
    private String uinname; //d
    private String troop_uin;   //b

    public SessionInfo(Object obj) {
        super(obj);
    }

    public String getUin() {
        if (!Utils.isEmpty(uin))return uin;
        return uin = (String)getField("a");
    }

    public int getUintype() {
        if (uintype > 0)return uintype;
        return uintype = getIntField("a");
    }

    public String getPhonenum() {
        if (!Utils.isEmpty(phonenum))return phonenum;
        return phonenum = (String)getField("e");
    }

    /*public int getEntrance() {
        if (entrance > 0)return entrance;
        return entrance = getIntField("a");
    }*/

    public String getUinnamer() {
        if (!Utils.isEmpty(uinname))return uinname;
        return uinname = (String)getField("d");
    }

    public String getTroopUin() {
        if (!Utils.isEmpty(troop_uin))return troop_uin;
        return troop_uin = (String)getField("b");
    }

    @Override
    public String toString() {
        return new StringBuilder("--Dump SessionInfo--,")
                .append(super.toString())
                .append(",uin:").append(getUin())
                .append(",uintype:").append(getUintype())
                .append(",uinname:").append(getUinnamer())
                .append(",phonenum:").append(getPhonenum())
                .append(",troop_uin:").append(getTroopUin())
                .toString();
    }
}
```

#### util

##### Utils

```java

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.TreeSet;


/**
 * Miscellaneous {@link String} utility methods.
 * <p/>
 * <p/>
 * Mainly for internal use within the framework; consider <a
 * href="http://jakarta.apache.org/commons/lang/">Jakarta's Commons Lang</a> for
 * a more comprehensive suite of String utilities.
 * <p/>
 * <p/>
 * This class delivers some simple functionality that should really be provided
 * by the core Java <code>String</code> and {@link StringBuilder} classes, such
 * as the ability to {@link #replace} all occurrences of a given substring in a
 * target string. It also provides easy-to-use methods to convert between
 * delimited strings, such as CSV strings, and collections and arrays.
 *
 * @author Rod Johnson
 * @author Juergen Hoeller
 * @author Keith Donald
 * @author Rob Harrop
 * @author Rick Evans
 * @author Arjen Poutsma
 * @since 1.0
 */
public abstract class Utils {
    public static boolean isEmpty(CharSequence text) {
        return text == null || text.length() == 0;
    }

    public static boolean isEmpty(Object[] array) {
        return (array == null || array.length == 0);
    }
}
```

#### xposed

##### ChatHook

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
import me.gitai.phuckqq.data.Message;
import me.gitai.phuckqq.data.Session;


/**
 * Created by gitai on 16-2-29.
 */
public class ChatHook implements IXposedHookLoadPackage {

    private HashMap<String, String> uins = new HashMap<>();

    private Object mRuntime = null;
    private HashMap<String, SessionInfo> sessionInfos = new HashMap<>();

    private Class<?> QQAppInterface,SessionInfo,ChatActivityFacade;

    private Context mContext;

    private static void printDeviceInfo() {
        XposedBridge.log("Phone manufacturer: " + Build.MANUFACTURER);
        XposedBridge.log("Phone model: " + Build.MODEL);
        XposedBridge.log("Android version: " + Build.VERSION.RELEASE);
        XposedBridge.log("Xposed bridge version: " + XposedBridge.XPOSED_BRIDGE_VERSION);
        XposedBridge.log("PhuckQQ version: " + BuildConfig.VERSION_NAME);
    }

    private void a1392(XC_LoadPackage.LoadPackageParam lpparam) throws ClassNotFoundException,NoSuchFieldException,IllegalAccessException{
        String methodName = "a";

        Class<?> SessionInfo = lpparam.classLoader.loadClass(Constant.CLASSNAME_SESSIONINFO);

        XposedBridge.log("Hooking a(SessionInfo sessionInfo, Intent intent)[1392]");

        XposedHelpers.findAndHookMethod(Constant.CLASSNAME_CHATACTIVITY, lpparam.classLoader, methodName,
                SessionInfo, Intent.class,
                new XC_MethodHook() {
                    @Override
                    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
                        SessionInfo sessionInfo = new SessionInfo(param.args[0]);
                        //sessionInfos.put(uin, sessionInfos);
                        XposedBridge.log(sessionInfo.toString());
                    }
                });
    }

    private void a1405(final XC_LoadPackage.LoadPackageParam lpparam) throws ClassNotFoundException,NoSuchFieldException,IllegalAccessException{
        String methodName = "a";

        Class<?> message = lpparam.classLoader.loadClass("com.tencent.mobileqq.app.message.QQMessageFacade$Message");

        XposedBridge.log("Hooking a(QQMessageFacade$Message qQMessageFacade$Message)[1405]");

        XposedHelpers.findAndHookMethod(Constant.CLASSNAME_CHATACTIVITY, lpparam.classLoader, methodName,
                message,
                new XC_MethodHook() {
            @Override
            protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
                Message message = new Message(param.args[0]);

                XposedBridge.log(message.toString());

                if (mContext == null) {
                    mContext = (Context)param.thisObject;
                }

                if(QQAppInterface == null){
                    QQAppInterface = lpparam.classLoader.loadClass("com.tencent.mobileqq.app.QQAppInterface");
                }

                if(SessionInfo == null){
                    SessionInfo = lpparam.classLoader.loadClass("com.tencent.mobileqq.activity.aio.SessionInfo");
                }

                if(mRuntime == null){
                    mRuntime = XposedHelpers.getObjectField(mContext, "mRuntime");
                }

                SessionInfo sessionInfo = null;
                if (!sessionInfos.containsKey(message.getSenderuin())){
                    Field[] fields = mContext.getClass().getDeclaredFields();
                    for (int i = 0; i < fields.length; i++) {
                        if (fields[i].getType().equals(SessionInfo)){
                            sessionInfo = new SessionInfo(fields[i].get(mContext));
                            sessionInfos.put(message.getSenderuin(), sessionInfo);
                        }
                    }
                }else{
                    sessionInfo = sessionInfos.get(message.getSenderuin());
                }

                if(ChatActivityFacade == null){
                    ChatActivityFacade = lpparam.classLoader.loadClass("com.tencent.mobileqq.activity.ChatActivityFacade");
                }

                sendBySessionInfo(sessionInfo, message.toString().replace(",", "\n"));
            }
        });
    }



    private void e2474(XC_LoadPackage.LoadPackageParam lpparam) {
        String methodName = "e";

        XposedBridge.log("Hooking e(Intent intent)[2474]");

        XposedHelpers.findAndHookMethod(Constant.CLASSNAME_CHATACTIVITY, lpparam.classLoader, methodName,
                Intent.class,
                new XC_MethodHook() {
                    @Override
                    protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
                        Intent intent = (Intent)param.args[0];
                        String uin = intent.getStringExtra("uin");
                        int uintype = intent.getIntExtra("uintype", -1);
                        String phonenum = intent.getStringExtra("phonenum");
                        int entrance = intent.getIntExtra("entrance", 0);
                        String troop_uin = intent.getStringExtra("troop_uin");
                        XposedBridge.log("Intent " +intent.toString());
                        sendByUid(uin, "uin: " + uin + ", uintype: " + uintype + ", phonenum: " + phonenum + ", entrance: " + entrance
                                + ", troop_uin: " + troop_uin);
                    }
                });
    }

    private void a3625(XC_LoadPackage.LoadPackageParam lpparam) {
        String methodName = "a";

        XposedBridge.log("Hooking a(String string)[3625]");

        XposedHelpers.findAndHookMethod(Constant.CLASSNAME_MESSAGEHANDLER, lpparam.classLoader, methodName,
                String.class,
                new XC_MethodHook() {
            @Override
            protected void beforeHookedMethod(MethodHookParam param) throws Throwable {
                String type = (String)param.args[0];
                XposedBridge.log("MsgType:" + type);
            }
        });
    }

    private void sendByUid(String uin, String message){
        if (sessionInfos.containsKey(uin))
            sendBySessionInfo(sessionInfos.get(uin), message);
    }

    private void sendBySessionInfo(SessionInfo sessionInfo, String message){
        XposedHelpers.callStaticMethod(ChatActivityFacade, "a",
                new Class<?>[]{QQAppInterface, Context.class, SessionInfo, String.class, ArrayList.class},
                mRuntime, AndroidAppHelper.currentApplication(), sessionInfo.getObject(), message, null);
    }

    @Override
    public void handleLoadPackage(XC_LoadPackage.LoadPackageParam lpparam) throws Throwable {
        if (constant.PACKAGENAME.equals(lpparam.packageName)) {
            XposedBridge.log("PhuckQQ initializing...");
            printDeviceInfo();
            try {
                a1392(lpparam);
            } catch (Throwable e) {
                XposedBridge.log("Failed to hook QQ handler" + "\n" + Log.getStackTraceString(e));
                throw e;
            }
            try {
                a1405(lpparam);
            } catch (Throwable e) {
                XposedBridge.log("Failed to hook QQ handler" + "\n" + Log.getStackTraceString(e));
                throw e;
            }
            try {
                e2474(lpparam);
            } catch (Throwable e) {
                XposedBridge.log("Failed to hook QQ handler" + "\n" + Log.getStackTraceString(e));
                throw e;
            }
            try {
                a3625(lpparam);
            } catch (Throwable e) {
                XposedBridge.log("Failed to hook QQ handler" + "\n" + Log.getStackTraceString(e));
                throw e;
            }
            XposedBridge.log("PhuckQQ initialization complete!");
        }
    }
}

```

### 验证

![Logs](http://i.imgur.com/iv6cGKA.png)
![转发](http://i.imgur.com/l6PRz4a.png)

### 补充

#### 接受消息的调用栈

1. mqq.app.MainService$2.run(MainService.java:290) 
2. com.tencent.mobileqq.msf.sdk.MsfRespHandleUtil.handlePushMsg 
3. mqq.app.MainService$5.onRecvCmdPush(MainService.java:648) 
4. mqq.app.MainService.access$200(MainService.java:60) 
5. mqq.app.MainService.receiveMessageFromMSF(MainService.java:212) 
6. mqq.app.ServletContainer.notifyMSFServlet(ServletContainer.java:156 
7. mqq.app.MSFServlet.onReceive(MSFServlet.java:39) 
8. com.tencent.mobileqq.compatible.TempServlet.onReceive 
9. com.tencent.mobileqq.app.QQAppInterface.a 
10. com.tencent.mobileqq.service.MobileQQService.a 
11. com.tencent.mobileqq.app.MessageHandler.a 
12. com.tencent.mobileqq.app.MessageHandler.f 
13. com.tencent.mobileqq.troop.data.TroopMessageProcessor.a 
14. com.tencent.mobileqq.troop.data.TroopMessageProcessor.a 
15. com.tencent.mobileqq.app.message.QQMessageFacade.a 
16. com.tencent.mobileqq.app.message.QQMessageFacade.notifyObservers 
17. com.tencent.mobileqq.activity.ChatActivity.update 
18. > com.tencent.mobileqq.activity.ChatActivity.a

### 发送消息的调用栈

1. com.tencent.mobileqq.activity.ChatActivity.b(ChatActivity.java:4015)
1. > com.tencent.mobileqq.activity.ChatActivityFacade.a(ChatActivityFacade.java:1533)
2. com.tencent.mobileqq.activity.ChatActivityFacade.a(ChatActivityFacade.java:1820)
3. com.tencent.mobileqq.activity.ChatActivityFacade.a(ChatActivityFacade.java1794:)
4. com.tencent.mobileqq.activity.ChatActivityFacade.b(ChatActivityFacade.java:4090)

详细分析： [「Kanban」:createTextMessageToshow](../11/createTextMessageToshow)

#### 备注

当前Hook的方法为`com.tencent.mobileqq.activity.ChatActivity.a `

此方法大概为 `QQToast` 的接口

所以产生以下 **2** 点影响

1. 只有在 `ChatActivity` 生命周期内才有效
2. 只有后台的 `SessionInfo` 拥有的消息才能收到，当前 `ChatActivity` 的消息直接调用 `ChatActivityFacade` 绘制View

**EOF**
