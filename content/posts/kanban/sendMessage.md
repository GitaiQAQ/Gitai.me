---

layout:     post
title:      "「Kanban」 Send Message"
date:       2016-03-11 14:01:24
author:     "Gitai"
categories:
    - Kanban
tags:
    - Kanban

---

## 调用栈

```
1. com.tencent.mobileqq.activity.ChatActivity.a(ChatActivity.java:4018) //点击事件，获取 TextView 内容
2. com.tencent.mobileqq.activity.ChatActivityFacade.a(ChatActivityFacade:1532) //sendMessage start
3. com.tencent.mobileqq.activity.ChatActivityFacade.a(ChatActivityFacade:1820) //createTextMessageToshow
4. com.tencent.mobileqq.activity.ChatActivityFacade.a(ChatActivityFacade:1794) //重载函数？
5. com.tencent.mobileqq.activity.ChatActivityFacade.b(ChatActivityFacade:4090) //createMsgQueueAndSend
6. com.tencent.mobileqq.app.QQAppInterface.a(QQAppInterface:2322) //getQQMessageFacade
7. com.tencent.mobileqq.app.message.QQMessageFacade.a(QQMessageFacade:1552) //addAndSendMessage
8. com.tencent.mobileqq.app.message.QQMessageFacade.b(QQMessageFacade:1881) //sendMessage
9. com.tencent.mobileqq.app.MessageHandler.a(MessageHandler:4892)
10. com.tencent.mobileqq.utils.SendMessageHandler.a(SendMessageHandler:189) //增加到发送队列
11. com.tencent.mobileqq.app.MessageHandler.a(MessageHandler:4793)
12. com.tencent.mobileqq.app.MessageHandler.a(MessageHandler:5755)
13. com.tencent.mobileqq.app.MessageHandler.a(MessageHandler:6031)
```

## Source

> 本段只是分析投递流程，并非可用的 `java` 代码段

class `com.tencent.mobileqq.activity.ChatActivityFacade`

``` java

public static void createTextMessageToshow(QQAppInterface qQAppInterface, Context context, SessionInfo sessionInfo, String string, ArrayList arrayList) {
    String[] arrstring;
    if (string.trim().startsWith("#conn#") && (arrstring = string.trim().split("#")).length > 2) {
        try {
            ConnManager.DEBUG_CONN_NUM = Integer.parseInt(arrstring[3].trim());
        }
        catch (Exception execution) {}
    }
    if (QLog.isColorLevel()) {
        QLog.d("SendMsgBtn", 2, " sendMessage start currenttime:" + System.currentTimeMillis());
    }
    if (string == null) return;
    if (string.length() == 0) {
        return;
    }
    //ChatActivityFacade.a(qQAppInterface, sessionInfo, string, arrayList);
    //Start
    {
	    	if (QLog.isColorLevel()) {
			QLog.d("SendMsgBtn", 2, " createTextMessageToshow start currenttime:" + System.currentTimeMillis());
		}
		int seq = MobileQQService.c;
		MobileQQService.c = seq + 1;
		ArrayList partAtInfoArrayLists = new ArrayList();
		ArrayList partArray = Utils.a(string, 560, 20, arrayList, partAtInfoArrayLists);
		boolean isDivide = partArray.size() > 1;
		Random localRandom = new Random();
		int intMsgId;
		short longMsgId = 0;
		if (QLog.isColorLevel()) {
			QLog.d("SendMsgBtn", 2, " createTextMessageToshow step 1 seq = " + seq + " partAtInfoArrayLists.size() = " + partAtInfoArrayLists.size()
			 + " partArray.size() = " + partArray.size() + " isDivide = " + isDivide + " currenttime:" + System.currentTimeMillis());
		}
		if (!isDivide) {
			if (QLog.isColorLevel()) {
				QLog.d("SendMsgBtn", 2, " createTextMessageToshow step 2 currenttime:" + System.currentTimeMillis());
			}
			intMsgId = Math.abs(localRandom.nextInt());
		}
		int var18_12 = 0;
		short s2 = (byte)seq;
		do{
			if (!qQAppInterface.a().a(qQAppInterface.getAccount(), sessionInfo.a, s2)) {
				qQAppInterface.a().a(qQAppInterface.getAccount(), sessionInfo.a, s2);
                	longMsgId = s2;
			}
			int var19_13 = var18_12 + 1;
			if (var18_12 > 10) {
				s2 = (byte)qQAppInterface.a().a(qQAppInterface.getAccount(), sessionInfo.a);
				qQAppInterface.a().a(qQAppInterface.getAccount(), sessionInfo.a, s2);
				longMsgId = s2;
				if (QLog.isColorLevel()) {
					QLog.d("SendMsgBtn", 2, " createTextMessageToshow step 2 currenttime:" + System.currentTimeMillis());
				}
				intMsgId = Math.abs(localRandom.nextInt());
				break;
			}
			s2 = (byte)Math.abs(var10_9.nextInt());
			var18_12 = var19_13;
		}while(true)
		for (int longMsgIndex = 0; longMsgIndex < partArray.size(); ++longMsgIndex) {
			String str1 = (String)partArray.get(longMsgIndex);
			ArrayList partArray1 = partAtInfoArrayLists.size() > longMsgIndex?(ArrayList)partAtInfoArrayLists.get(longMsgIndex) : null;
			if (sessionInfo.a == 3000 || sessionInfo.a == 1) {
				intMsgId= Math.abs(localRandom.nextInt());
			}
			//ChatActivityFacade.a/b(qQAppInterface, sessionInfo, str1, seq, -1000, isDivide, (byte)partArray.size(), (byte)longMsgIndex, longMsgId, intMsgId, partArray1);
			//Start
			{
				if (QLog.isColorLevel()) {
					QLog.d("SendMsgBtn", 2, " createMsgQueueAndSend start currenttime:" + System.currentTimeMillis() + " sessionInfo.entrance:" + sessionInfo.c);
				}
				String string2 = "";
				if (str1 != null) {
					string2 = MessageUtils.a(str1, true, partArray1);
				}
				if (QLog.isColorLevel()) {
					QLog.d("SendMsgBtn", 2, " createMsgQueueAndSend step 1  currenttime:" + System.currentTimeMillis());
				}
				int time = (int)MessageCache.a();
				String selfUin = qQAppInterface.a();
				long msgUid = MessageUtils.a(intMsgId);
				String senderUin = sessionInfo.a == 1004 || sessionInfo.a == 1020 || sessionInfo.a == 1000 ? sessionInfo.b : (sessionInfo.a == 1006 ? sessionInfo.e : selfUin);
				if (QLog.isColorLevel()) {
					QLog.d("SendMsgBtn", 2, " createMsgQueueAndSend step 2 time = " + time + " selfUin = " + selfUin + " senderUin = " + senderUin + " msgUid = " + msgUid + " currenttime:" + System.currentTimeMillis());
				}
				ChatMessage chatMessage = (ChatMessage)MessageRecordFactory.a(-1000);
				chatMessage.init(selfUin, /* long frienduin */sessionInfo.a, senderUin, string2, (long)time, -1000, /* int istroop */ sessionInfo.a , seq);
				chatMessage.longMsgCount = (byte)partArray.size();
				chatMessage.longMsgIndex = (byte)longMsgIndex;
				chatMessage.longMsgId = longMsgId;
				chatMessage.isread = true;
				chatMessage.msgUid = msgUid;
				chatMessage.shmsgseq = MessageUtils.a(seq, sessionInfo.a);
				chatMessage.issend = 1;
				chatMessage.mAnimFlag = true;
				MessageForText messageForText = (MessageForText)chatMessage;
				messageForText.msgVia = sessionInfo.c;
				if (partArray1 != null) {
					messageForText.atInfoList = partArray1;
				}
				if (QLog.isColorLevel()) {
					QLog.d("SendMsgBtn", 2, " createMsgQueueAndSend step 3  currenttime:" + System.currentTimeMillis());
				}
				// QQAppInterface.a/getQQMessageFacade(2322) -> QQMessageFacade.a(1552)
				//qQAppInterface.a().a((MessageRecord)chatMessage, (MessageObserver)null);
				{
					QQMessageFacade qQMessageFacade = getQQMessageFacade(); //QQAppInterface.java(2322)
					//qQMessageFacade.send((MessageRecord)chatMessage, (MessageObserver)null); //QQMessageFacade.java(1552)
					{
						MessageRecord messageRecord = (MessageRecord)chatMessage;
						if (messageRecord == null) {
							return;
						}
						if (QLog.isColorLevel()) {
							QLog.d("SendMsgBtn", 2, " addAndSendMessage addSendMessage start currenttime:" + System.currentTimeMillis());
						}
						if (messageRecord instanceof ChatMessage) {
							((ChatMessage)messageRecord).mPendantAnimatable = true;
						}
						//this.b(messageRecord, this.a.a());
						if (QLog.isColorLevel()) {
							QLog.d("SendMsgBtn", 2, " addAndSendMessage addSendMessage end and sendMessage start currenttime:" + System.currentTimeMillis());
						}
						//this.b(messageRecord, messageObserver); //QQMessageFacade.java(1881)
						{
							if (QLog.isColorLevel()) {
								QLog.d("Q.msg.QQMessageFacade", 2, "sendMessage: mr_uinType:" + messageRecord.istroop + " mr_msgType:" + messageRecord.msgtype);
							}
							//this.a.a().b(messageRecord.msgtype);
							try {
								if (messageRecord.msgUid == 0) {
									messageRecord.msgUid = MessageUtils.a(MessageUtils.a());
								}
								if (messageRecord.msgtype != -1000) break block10;
									if (messageRecord.istroop == 1001) {
										if (!this.a.b(messageRecord.frienduin)) {
											this.a.a().a((MessageForText)messageRecord);
											return;
										}
									//this.a.a().a(messageRecord, (BusinessObserver)null);//MessageHandler.java (4892)
									{
										SendMessageHandler.a(paramSendMessageRunnable);//SendMessageHandler.java (189)
									}
									return;
									}
								if (messageRecord.istroop == 1003) {
									//this.a.a().a((MessageForText)messageRecord);//MessageHandler.java (4793)
									{	
										//MessageHandler.java (5755)
										//MessageHandler.java (6031)
									}
									return;
								}
							}catch(Exception ex){
								if (!QLog.isColorLevel()) return;
								QLog.e("Q.msg.QQMessageFacade", 2, "sendMessage ERROR:" + var3_3.getMessage(), var3_3);
								return;
							}
							this.a.a().a(messageRecord, (BusinessObserver)null);
							return;
						}
					}
					if (!QLog.isColorLevel()) return;
					QLog.d("SendMsgBtn", 2, " addAndSendMessage sendMessage end currenttime:" + System.currentTimeMillis());
					}
				}
				if (QLog.isColorLevel()) {
					QLog.d("SendMsgBtn", 2, " createMsgQueueAndSend end currenttime:" + System.currentTimeMillis());
				}
			}
			//End
			seq = MobileQQService.c;
			MobileQQService.c = seq + 1
		}
		if (QLog.isColorLevel()) {
			QLog.d("SendMsgBtn", 2, " createTextMessageToshow step 3 currenttime:" + System.currentTimeMillis());
		}
		if (QLog.isColorLevel() == false) return;
		QLog.d("SendMsgBtn", 2, " createTextMessageToshow end currenttime:" + System.currentTimeMillis());
    }
    //End
    //AsyncTask
    //Start
    //new cfn(qQAppInterface, string).execute((Object[])new Void[0]);
	EntityManager localEntityManager = paramQQAppInterface.a().createEntityManager();
	Object localObject = localEntityManager.a(RecentEmotionData.class, false, null, null, null, null, null, null);
	if (localObject == null) {
		localObject = new ArrayList();
	}

	if (a((List)localObject, 3, 0, paramString) < 0) {
		b(paramQQAppInterface, localEntityManager, 3, 0, paramString, (List)localObject);
	}
	localEntityManager.a();
    //End

    qQAppInterface.a().f(sessionInfo.a, sessionInfo.a);
    if (!QLog.isColorLevel()) return;
    QLog.d("SendMsgBtn", 2, " sendMessage end currenttime:" + System.currentTimeMillis());
}
```

## 构造消息对象

``` java
// 构造消息对象
ChatMessage chatMessage = (ChatMessage)MessageRecordFactory.a(-1000);
chatMessage.init(selfUin, /* long frienduin */sessionInfo.a, senderUin, string2, (long)time, -1000, /* int istroop */ sessionInfo.a , seq);
chatMessage.longMsgCount = (byte)partArray.size();
chatMessage.longMsgIndex = (byte)longMsgIndex;
chatMessage.longMsgId = longMsgId;
chatMessage.isread = true;
chatMessage.msgUid = msgUid;
chatMessage.shmsgseq = MessageUtils.a(seq, sessionInfo.a);
chatMessage.issend = 1;
chatMessage.mAnimFlag = true;

MessageForText messageForText = (MessageForText)chatMessage;
messageForText.msgVia = sessionInfo.c;
if (partArray1 != null) {
	messageForText.atInfoList = partArray1;
}
```