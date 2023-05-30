# Environment

- npm:9.6.4
- node:v18.16.0
- vue:2.9.6

---

npm安装步骤参考：[npm安装步骤 ](https://blog.csdn.net/zhouyan8603/article/details/109039732)

# 操作步骤

1、以管理员身份打开cmd，输入：

```bash
npm install -g yarn
```

2、下载代码

```
可以下载https://github.com/Ruan-xianzheng/3D-Web-design.git

也可以直接用压缩包
```

3、进入项目文件(但是上传到github时，发现这个node_modules文件没上传上去)

```bash
cd .\node_modules\
```

4、

```bash
yarn add three gsap
yarn add @tweenjs/tween.js
yarn add vuex
```

5、运行代码

```bash
yarn serve
```

6、如果没有问题的话，会出来两个地址，点击local那个打开网站即可

## 代码解释

1、源代码是在src/App.vue

2、图片以及3D模型资源存放位置：页面设计用到的图片放在src/assets/ images；工厂图片放在public文件夹中model文件夹下。
