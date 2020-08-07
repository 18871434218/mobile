<template>
  <div class="home">
    <div style="text-align:center;font-size:22px; padding-top:40px">
      <h1>欢迎{{userName}}接入舜宇车联网</h1>
    </div>
    <div style="font-size:22px; padding-top:30px; text-align:center;">
      <span>模拟接口</span>
    </div>

    <div style="margin-top:30px">
      <mt-cell title="前进">
        <mt-switch v-model="CarAheadState" @change="CarAhead">{{CarAheadmessage}}</mt-switch>
      </mt-cell>

      <mt-cell title="后退">
        <mt-switch v-model="CarBackState" @change="Carback">{{CarBackmessage}}</mt-switch>
      </mt-cell>

      <mt-cell title="左移">
        <mt-switch v-model="CarLeftState" @change="CarLeft">{{CarLeftmessage}}</mt-switch>
      </mt-cell>

      <mt-cell title="右移">
        <mt-switch v-model="CarRightState" @change="CarRight">{{CarRightmessage}}</mt-switch>
      </mt-cell>
 
      <mt-cell title="操作速度">
        <mt-button type="primary" size="small" @click="addCarSpeed">+</mt-button>
        <span style="width:40px">{{ Carspeed }}</span>
        <mt-button type="primary" size="small" @click="slowCarSpeed">-</mt-button>
      </mt-cell>

      <mt-cell title="控制器状态">
        <mt-switch v-model="Controller" @change="changeCtrlStatus">{{Controllermessage}}</mt-switch>
      </mt-cell>

      <mt-cell title="激光雷达状态">
        <mt-switch v-model="Lidar" @change="changeLidarStatus">{{Lidarmessage}}</mt-switch>
      </mt-cell>

      <mt-cell title="毫米波雷达状态">
        <mt-switch v-model="wave_radar" @change="waveStatus">{{wavemessage}}</mt-switch>
      </mt-cell>
    </div>
  </div>
</template>
<script>
import mqtt from "mqtt";
export default {
  name: "Home",
  inject: ["Login_username"],
  data() {
    return {
      userName: "",
      /* CarState: false, //设置车状态
      Carmessage: "停止", */
      templelongitude: 0,     //临时经度
      templelatitude: 0,      //临时纬度

      CarAheadState: false,   //车前进
      CarAheadmessage: "停止",

      CarBackState: false,   //车后退
      CarBackmessage: "停止",

      CarLeftState: false,   //车左移
      CarLeftmessage: "停止",

      CarRightState: false,
      CarRightmessage: "停止", //车右移

      Carspeed: 0, //速度

      Controller: false,  //控制器
      Controllermessage: "关闭",

      Lidar: false, // 激光雷达
      Lidarmessage: "关闭",

      wave_radar: false, //毫米波雷达
      wavemessage: "故障",

      client: null,

      flag: false,

      cnt: 0,
      
      message: {"baseState":[1.000000,40.800000,0.4],
      "vehicleInfo":[1.000000,"002",0.000000,120.199000,30.281000,40.000000,20.000000,0.500000],
      "errorInfo":[1.000000,0.000000,1.000000,2.000000,0.000000,0.000000,0.000000,1.000000]}
    };
  },

  methods: {
    Send() {
      var topic = "testProject/clientSub/baseState";     //发布主题
      var qtt = JSON.stringify(this.message);

    /* var qtt = this.message; */
      this.client.publish(topic, qtt, { qos: 0, retain: false }, function(err) {
        if (err == undefined) {
          console.log("Publish finished");
          console.log("qttdata", qtt);
        } else {
          console.log("publish failed");
         }
      });
    },

   /*  changeCarStatus() {
      if (this.CarState == true) {
        this.Carmessage = "移动";

        var r = 10;
        var pointCount = Math.round(2 * Math.PI * r);
        //循环算出每一个点的坐标
        for (var i = 0; i <= pointCount; i++) {
          var a = (i * 2 * Math.PI) / pointCount;
          this.message.vehicleInfo[3] =
            this.message.vehicleInfo[3] + Math.cos(a) * r; //根据圆心 半径 和三角函数

          this.message.vehicleInfo[4] =
            this.message.vehicleInfo[4] + Math.sin(a) * r; //同计算x

          this.message.vehicleInfo[5] =
            Math.sqrt(
              Math.pow(Math.cos(a) * r, 2) + Math.pow(Math.sin(a) * r, 2)
            ) / 0.002;
        }
      } else {
        this.Carmessage = "停止";
      }
    }, */

    CarAhead() {
      if (this.CarAheadState == true) {
        this.CarAheadmessage = "启动";
        var ahead1 = setInterval(() => {
          this.message.vehicleInfo[4] = this.message.vehicleInfo[4] + 0.001;
          if(this.CarAheadState == false){
            this.CarAheadmessage = "停止";
            clearInterval(ahead1);
          }
        }, 1000);
      } 
    },

    Carback() {
      if (this.CarBackState == true) {
        this.CarBackmessage = "启动";
        var back1 = setInterval(() => {
           this.message.vehicleInfo[4] = this.message.vehicleInfo[4] - 0.001;
           if(this.CarBackState == false){
             this.CarBackmessage = "停止";
             clearInterval(back1);
           }
        }, 1000);
      }
    },

    CarLeft() {
      if (this.CarLeftState == true) {
        this.CarLeftmessage = "启动";
        var left1 =  setInterval(() => {
           this.message.vehicleInfo[3] = this.message.vehicleInfo[3] - 0.001;
           if(this.CarLeftState == false){
                this.CarLeftmessage = "停止";
                clearInterval(left1);
           }
        }, 1000);
      }
    },

    CarRight() {
      if (this.CarRightState == true) {
        this.CarRightmessage = "启动";
         var right1 = setInterval(() => {
          this.message.vehicleInfo[3] = this.message.vehicleInfo[3] + 0.001;
          if(this.CarRightState == false){
            this.CarRightmessage = "停止";
            clearInterval(right1);
          }
        }, 1000);
      } 
    },

    addCarSpeed() {  
      this.Carspeed += 5;
      this.message.vehicleInfo[6] = this.Carspeed;
    },

    slowCarSpeed() {
      this.Carspeed -= 5;
      this.message.vehicleInfo[6] = this.Carspeed;
    },

    changeCtrlStatus() {
      if (this.Controller == true) {
        console.log("con", this.Controller);
        this.Controllermessage = "开启";
        this.message.errorInfo[this.message.errorInfo.length - 1] = 0;
      } else {
        this.Controllermessage = "关闭";
        this.message.errorInfo[this.message.errorInfo.length - 1] = 1;
        console.log("con1", this.Controller);
      }
    },

    changeLidarStatus() {
      if (this.Lidar == true) {
        this.Lidarmessage = "开启";
        this.message.errorInfo[2] = 0;
      } else {
        this.Lidarmessage = "关闭";
        this.message.errorInfo[2] = 1;
      }
    },

    waveStatus() {
      if (this.wave_radar == true) {
        this.wavemessage = "正常";
        this.message.errorInfo[3] = 0;
      } else {
        this.wavemessage = "故障";
        this.message.errorInfo[3] = 2;
      }
    }
  },

  mounted() {
    this.Carspeed = this.message.vehicleInfo[6];

    this.userName = this.$root.Login_username;      

    const options = {
      connectTimeout: 4000,
      clientId: "mqtitId-_client_monitor",
      clean: true,
      keepAliveInterval: 5000
    };

    this.client = mqtt.connect("wss://www.sunnyiov.com/mqtt", options);    

    this.client.on("connect", e => {
        setInterval(() => {
            this.Send();
        }, 5000);     
    });
   
    this.client.on("reconnect", error => {
        console.log("正在重连：", error);
      });

    this.client.on("error", error => {
      console.log("连接失败", error);
    });
  }
};
</script>
<style>
</style>