<template>
    <div class="home">
          <div style="text-align:center;font-size:22px; padding-top:40px"><h1>欢迎{{userName}}接入舜宇车联网</h1></div>
          <div style="font-size:22px; padding-top:30px; text-align:center;"><span>模拟接口</span></div>
          
          <div style="margin-top:30px">
            <mt-cell title="开关状态">
                <mt-switch v-model="CarState" @change="changeCarStatus">{{Carmessage}}</mt-switch>
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
import mqtt from 'mqtt'
export default {
    name: 'Home',
    inject: ["Login_username"],
    data () {
      return {
        userName: "",

        CarState: false,     //设置车状态
        Carmessage:"停止",

        Controller: false,   //控制器
        Controllermessage:"关闭",

        Lidar: false,         // 激光雷达
        Lidarmessage: "关闭",

        wave_radar: false,   //毫米波雷达
        wavemessage:"故障",

        client: null,     

        message:{
                "baseState":[1.000000,40.800000,0.4],
                "vehicleInfo":[0.000000,"002",0.000000,120.199000,30.281000,40.000000,20.000000,0.500000],
                "errorInfo":[1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000,1.000000]
            },
        }
    },

    methods:{
        Send(){
            var topic = "testProject/clientSub/baseState";                    //发布主题
            var qtt = JSON.stringify(this.message); 

            this.client.publish(topic, qtt,  { qos: 0, retain: false }, function(err){
              if(err == undefined){
                console.log("Publish finished");
              }else{
                console.log("publish failed");
              }
            });
        },

        changeCarStatus(){
            if(this.CarState == true){
                this.Carmessage = "移动";

                var r = 10;
                var pointCount=Math.round(2*Math.PI*r);
                    //循环算出每一个点的坐标 
                for (var i=0; i<=pointCount; i++){
                    var a=(i*2*Math.PI)/(pointCount);
                    this.message.vehicleInfo[3]=(this.message.vehicleInfo[3]+Math.cos(a)*r);   //根据圆心 半径 和三角函数

                    this.message.vehicleInfo[4]=(this.message.vehicleInfo[4]+Math.sin(a)*r);   //同计算x
                        
                    this.message.vehicleInfo[5] =  Math.sqrt((Math.pow(Math.cos(a)*r, 2) + Math.pow(Math.sin(a)*r, 2))) / 0.002;
                }
            }else{
                this.Carmessage = "停止";
            }
        },

        changeCtrlStatus(){
            if(this.Controller == true){
                 this.Controllermessage = "开启";
                 this.message.errorInfo[-1] = 0;
            }else{
                 this.Controllermessage = "关闭";
            }
        },

        changeLidarStatus(){
            if(this.Lidar == true){
                this.Lidarmessage = "开启";
                this.message.errorInfo[2] = 0;
            }else{
                this.Lidarmessage = "关闭";
            }
        },

        waveStatus(){
            if(this.wave_radar == true){
                this.wavemessage = "正常";
                this.message.errorInfo[3] = 0;
            }else{
                this.wavemessage = "故障";
            }
        }
    },
    
    mounted(){
      this.userName = this.$root.Login_username;
      
      const options = {
         connectTimeout: 40000,
         clientId: "mqtitId-_client",
         clean: true,
         keepAliveInterval: 5000,
       };

      this.client = mqtt.connect("wss://www.sunnyiov.com/mqtt", options);

      this.client.on("connect", e => {
        console.log("连接成功");

        setInterval(this.Send(), 5000);            //定时 
       }); 

      this.client.on("reconnect", error => {
        console.log("正在重连：", error);
      });

      this.client.on("error", error => {
        console.log("连接失败", error);
      });
    },
}
</script>
<style>
/* .mint-cell {
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    min-height: 48px;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;
} */
</style>