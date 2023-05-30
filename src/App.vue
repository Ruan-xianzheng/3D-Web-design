<template>
  <div style="white-space:pre-line;z-index: 0;">
    <!--3D模型显示-->
    <div v-if="showmodel" class="scene" ref="scene">
      <div class="header" ref="header">
        <!--添加大标题-->
        <h1>ARM系统工作场景定位</h1>
        <!--实时更新时间-->
        <div class="current_time">当前时间:{{time}}</div>
      </div>
      <div class="btn_right">
        <button class="back" @click="back">返回主视角</button>
        <button class="inFactory" @click="inFactory">进入厂区</button>
        <button class="mouseclick" @click="mouseclick">动画控制</button>
      </div>
      <!--创建标签-->
      <div class="label" ref="label">{{text}}</div>
    </div>
    <!-- 登陆页面显示 -->
    <div v-else class="login-container">
      <div class="login-plane">
        <div class="login-plane-container">
          <img class="login-plane-human" src="@/assets/images/login_human.png" alt="" />
          <div class="login-plane-title">
            华理-航天智造 登录
            <img
              class="login-plane-title-line"
              src="@/assets/images/login_horizontal_line.png"
              alt=""
              width= "50%"
            />
          </div>
          <form @submit.prevent="handleSubmit">
            <div>
              <label>Username:</label>
              <input type="text" v-model="username" />
            </div>
            <div>
              <label>Password   :</label>
              <input type="password" v-model="password" />
            </div>
            <button class="login" type="submit">Login</button>
          </form>
        </div>
      </div>
      <!--登录页面的背景-->
      <div class="login-ground"></div>
    </div>
  </div>
</template>

<script >
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from'three/examples/jsm/loaders/GLTFLoader.js';
//导入动画库
import gsap from "gsap";
export default {
  name: 'ChildComponent',
  data(){
    return {
      publicPath: process.env.BASE_URL,
      scene: null, //场景
      renderer: null, //渲染器
      controls: null, //控制器 
      light: null, //灯光1
      light2:null, //灯光2
      light3:null, //灯光3 
      light4:null, //灯光4
      time: new Date().toLocaleString(),
      // 选中的模型
      selectedObjects: [],
      mouse: new THREE.Vector2(),
      raycaster: new THREE.Raycaster(),
      selectObject: null,
      text: '',
      username: '', //用户名
      password: '', //密码
      showmodel: false, //登录页面和3D模型转换的标志物
      animate2:null, //模型2动画控制
      animate3:null, //模型3动画控制
    }
  },
  created(){
  //利用setInterval回调函数在created生命周期定时读取获取当前时间的方法，每秒触发一次
  setInterval(() => {
      this.time = new Date().toLocaleString()
      this.$forceUpdate()
    }, 1000)
  },
  computed:{
  },
  mounted() {
    //生命周期，一打开页面就会运行这里的代码 初始化一些基本元素
    this.init();
  },
  methods:{
    //初始化场景
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#ccc")
      this.scene.environment = new THREE.Color("#ccc")
    },
    // 初始化相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1, 1000);
      this.camera.position.set(0, 2, 6);
      this.scene.add(this.camera);
    },
    // 初始化灯光
    initLight() {
      this.light = new THREE.DirectionalLight(0xffffff, 1)
      this.light.position.set(150,150,150)
      this.scene.add(this.light)

      this.light2 = new THREE.DirectionalLight(0xffffff, 1)
      this.light2.position.set(400,200,200)
      this.scene.add(this.light2)

      this.light3 = new THREE.DirectionalLight(0xffffff, 1)
      this.light3.position.set(-150,150,150)
      this.scene.add(this.light3)

      this.light4 = new THREE.DirectionalLight(0xffffff, 1)
      this.light4.position.set(150,150,-150)
      this.scene.add(this.light4)
    },
    // 加载渲染器
    initRender() {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染区域尺寸
      //将webgl渲染的canvas内容添加到body 
      document.body.appendChild(this.renderer.domElement); 

    },
    // 加载模型
    initModel() {
      const loader = new GLTFLoader(); //创建一个GLTF加载器
      loader.load("model/工厂/工厂.gltf",(gltf)=>{
      let model = gltf.scene;
      model.scale.set(0.1,0.1,0.1);
      model.name = '工厂',
      this.scene.add(model);
      })
      const loader2 = new GLTFLoader(); //创建一个GLTF加载器
      loader2.load("model/lada.glb",(glb)=>{
      let model2 = glb.scene;
      model2.name = '小车2',
      model2.scale.set(0.1,0.1,0.1);
      model2.position.set(0,0.01,-2);
      this.scene.add(model2);
      // gsap.to(model2.position, {z:2,duration:5,yoyo:true,repeat:-1})
      this.animate2 = gsap.to(model2.position, {z:2,duration:8,yoyo:true,repeat:-1}); //添加移动动画

      })
      const loader3 = new GLTFLoader(); //创建一个GLTF加载器
      loader3.load("model/car.glb",(glb)=>{
      let model3 = glb.scene;
      model3.name = '小车3',
      model3.scale.set(0.1,0.1,0.1); //模型大小控制
      model3.position.set(1,0.01,-2); //模型起始位置
      this.scene.add(model3);
      this.animate3 = gsap.to(model3.position, {z:2,duration:5,yoyo:true,repeat:-1}); //添加移动动画
    })

    },
    //控制动画的启停
    mouseclick(){
        if(this.animate2.isActive() && this.animate3.isActive()){
          this.animate2.pause();
          this.animate3.pause();
        }else{
          this.animate2.resume();
          this.animate3.resume();
        }
    },
    //鼠标点击 显示标签
  mouse_label() {
    window.addEventListener('click', (event) => {
      // 声明 raycaster 和 mouse 变量
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
      // 计算鼠标位置 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 射线拾取  通过鼠标点击的位置和当前相机的矩阵计算出射线位置
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    // console.log('intersects:', intersects);
    // 获取选中最近的 Mesh 对象
    // if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh && intersects[0].object.name=='小车') {
    if (intersects.length != 0 && intersects[0].object instanceof THREE.Object3D && intersects[0].object.name!='') {
            this.selectObject = intersects[0].object;
            // this.changeMaterial(this.selectObject);
            this.renderDiv(this.selectObject);
            // console.log('name:', this.selectObject.name);
        } else {
          // console.log('没有');
          const labelDiv = this.$refs.label;
          labelDiv.style.opacity = 0;
        }
  })
    },

  // 改变对象材质属性
  changeMaterial(object) {
  var material = new THREE.MeshLambertMaterial({
      color: 0xffffff * Math.random(),
      transparent: object.material.transparent ? false : true,
      opacity: 0.8
  });
  object.material = material;
  },
    // 更新div的位置
  // renderDiv(object) {
  renderDiv() {
    // 获取窗口的一半高度和宽度
    // var halfWidth = window.innerWidth / 2;
    // var halfHeight = window.innerHeight / 2;
    // 逆转相机求出二维坐标
    // var vector = object.position.clone().project(this.camera);
    // 修改 div 的位置
    const labelDiv = this.$refs.label;
    labelDiv.style.position = 'absolute';
    // labelDiv.style.left = vector.x * halfWidth + halfWidth+'px';
    // labelDiv.style.top = -vector.y * halfHeight + halfHeight - object.position.y+'px';
    labelDiv.style.left = '50px',
    labelDiv.style.top = '100px',
    labelDiv.style.height = '50px',
    labelDiv.style.width = '100px',
    labelDiv.style.opacity= 1;
    // 显示模型信息
    this.text = this.selectObject.name;
    labelDiv.style.color = 'red';
    labelDiv.style.fontSize = '16px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.fontFamily = 'Arial';
    },

    //添加网格
    initgrid(){
      this.grid= new THREE.GridHelper(10,10);
      this.grid.material.opacity = 0.2;  //网格透明度
      this.grid.material.transparent = true;
      this.scene.add(this.grid);
    },

    // 使用OrbitControls控制三维场景缩放和旋转等功能
    initControls(){
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.update();
      //添加坐标轴辅助器
      this.axesHelper = new THREE.AxesHelper(5);
      this.scene.add(this.axesHelper);
    },
    //渲染场景以及控制
    animate(){
      // if (this.selectObject != undefined && this.selectObject != null) {
      //       this.renderDiv(this.selectObject);
      //   }
      // 使用渲染器，通过相机将场景渲染进来 
      this.renderer.render(this.scene, this.camera);
      this.controls &&  this.controls.update();
      // 渲染下一帧的时候就会调用render函数
      requestAnimationFrame(this.animate);

    },

    // 返回主视角
    back(){
      this.camera.position.set(0,2,6);
    },
    inFactory(){
      this.camera.position.set(0,0.5,1);
    },
    //判断密码是否输入正确
    handleSubmit() {
      // 这里假设正确的密码为'123456'
      if (this.password === '1'&&this.username == '阮咸峥') {
        // this.showlabel = true,
        this.showmodel =  true;
        this.mouse_label(); //鼠标点击 显示标签
        this.initModel(); //加载3D模型
        this.initControls(); //控制代码
        this.animate(); //渲染代码
      } else {
        alert('用户名或密码输入错误！！！')
      }
    },

    //根据浏览器窗口自适应
    onWindowResize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    },
    
    //初始化函数，页面加载完成时调用
    init() {
      this.initScene();
      this.initCamera();
      this.initLight();
      this.initRender();
      this.initgrid();
      // this.initModel(); //加载3D模型
      // this.initControls(); //控制代码
      // this.animate(); //渲染代码
      window.onresize = this.onWindowResize;
    },
    
  }

}
</script >

<style lang="less" scoped>
//大标题和时间样式设置
.header{
  position: absolute;
  z-index: 2;
  height: 100px;
  width: 850px;
  top: 0px;

  h1{
    position: relative;
    bottom: 10px;
    left: 350px;
    font-size: 4vh;
    text-align: center;
    line-height: 2.5vh;
    color: #0b0a0a;
    padding-top: 1vh;
  }
  .current_time{
    position: absolute;
    left: 0px;
    top:25px;
    line-height: 0vh;
    color: #0b0a0a;
    font-size: 3vh;

  }
  
}

//按钮样式设置
.btn_right{
    position: absolute;
    z-index: 3;
    top: 2vh;
    right: 0px;
    width: 18vh;
    height: 12vh;
    .back{
      height:30px;
      width: 100px;
      padding-right: 5px;
    }
    .inFactory{
      height:30px;
      width: 100px;
      padding-right: 5px;
    }
    .mouseclick{
      height:30px;
      width: 100px;
      padding-right: 5px;
    }
  }

  .label{
    position: absolute;
    padding: 10px;
    background: rgba(255, 255, 255, 0.6);
    line-height: 1;
    border-radius: 5px;
    top: 100px;
    opacity: 0;
  }
  //登录页面设置
.login-container {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    .login-plane{
      position: absolute;
      z-index: 2;
      width: 600px;
      height: 500px;
      background-image: url('~@/assets/images/login_border.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  .login-plane-container{
  width: 100%;
        height: 100%;
        border-radius: 18px;
        background-color: #007eff2e;
        position: relative;
        @keyframes humanMove {
          0% {
            top: -100px;
          }
          25% {
            top: -120px;
          }
          50% {
            top: -100px;
          }
          75% {
            top: -80px;
          }
          100% {
            background: -100px;
          }
        }
  }
  .login-plane-human{
  position: absolute;
          width: 260px;
          right: -120px;
          top: -100px;
          animation: humanMove 8s linear 0s infinite normal;
  }
 
  .login-plane-title{
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 35px;
  color: #060606;
  font-weight: 700;
 
  }
  .login-plane-title-line {
  width: 80%;
  position: absolute;
  bottom: 0;
  }
 
 
  form{
  position: relative;
  text-align: center;
  width: 100%;
  height: 300px;
  top: 100px;
  }
  .login{
  position: relative;
  left: 40px;
  top: 10px;
  }
 
  .login-ground {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 400px;
      background-image: url('~@/assets/images/ground.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      bottom: 0;
      left: 0;
    }
 
}


</style>
