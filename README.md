# Environment

- npm:9.6.4
- node:v18.16.0
- vue:2.9.6

---

npm安装步骤参考：[npm安装步骤 ](https://blog.csdn.net/zhouyan8603/article/details/109039732)

# 操作步骤

## 1、以管理员身份打开cmd，输入：

```bash
npm install -g yarn
```

## 2、下载代码

```
可以下载https://github.com/Ruan-xianzheng/3D-Web-design.git

也可以直接用压缩包
```

## 3、进入项目文件(但是上传到github时，发现这个node_modules文件没上传上去)

```bash
cd .\node_modules\
```

## 4、看一下main.js文件中，运行的是哪个代码，其中，仅仅显示3D网页的代码在App.vue中，增加了MQTT服务器的代码在App copy.vue中。根据运行需求修改main.js代码。

## 5、
```bash
yarn add three gsap
yarn add @tweenjs/tween.js
yarn add vuex
```
```bash
如果需要用MQTT服务器，则需要增加以下功能包
yarn add mqtt  # 安装mqtt库
yarn add --dev buffer process
yarn add Buffer
yarn add url
```

## 6、服务器搭建(现在暂时使用EMQX当作MQTT服务器)

### 6.1 下载EMQ
[EMQX](https://www.emqx.io/zh/downloads?os=Windows)

### 6.2 解压下载文件到指定位置

### 6.3 利用管理员身份打开终端

```bash
cd 文件夹下的bin文件
```
```bash
.\emqx install
```
```bash
.\emqx console
```
在终端中会显示可用的端口，例如出现127.0.0.1，这个是本机的IP地址，随后在网页中输入(http://127.0.0.1:18083/)（需根据自己IP地址修改）即可访问服务器。**初始用户名是admin**，**密码是public**
### 6.4 修改相关代码
修改App copy.vue文件中第350行代码（如下），将其中的IP地址换成6.3中得到的
```bash
this.client = mqtt.connect('ws://127.0.0.1:8083/mqtt',options);
```
## 7、运行代码

### 打开网页
```bash
yarn serve
```
### MQTT服务器测试
开启服务器，并点击位置移动按钮后，会在控制台上看到已连接服务器，随后可利用EMQX（之前下好的）软件测试，在EMQX中连接上服务器后，具体页面如下，在WebSocket客户端——>连接——>配置好发布数据格式（按照代码的）——>发送数据

![image](https://github.com/Ruan-xianzheng/3D-Web-design/assets/106811961/857209f6-a3ab-49d1-b098-c1a2ae53f1bd)

## 代码解释

1、源代码是在src/App copy.vue

2、图片以及3D模型资源存放位置：页面设计用到的图片放在src/assets/ images；工厂图片放在public文件夹中model文件夹下。
