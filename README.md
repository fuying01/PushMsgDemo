# PushMsgDemo

## 使用NodeJS net模块中的socket实现的小推送demo

service:
	开启socket服务, 并通过线程通信, 推送消息.

server:
	监听client端的请求, 根据socketId消费消息队列.

client:
	访问server, 一开始发送用户信息, 然后不停发送心跳包, 保持连接并取到推送的消息.
