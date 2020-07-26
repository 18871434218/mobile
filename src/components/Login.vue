<template>
  <div class="Login">
    <mt-header fixed title="舜宇车联网平台" style="font-size:24px;height:60px;"></mt-header>
    <mt-header title="车端模拟系统" style="font-size:24px;margin-top:80px"></mt-header>
   <div style="margin-top:60px">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
      <mt-field label="邀请码" placeholder="请输入邀请码" v-model="captcha"></mt-field>
   </div>
    <div style="margin-top:60px; text-align:center"><mt-button plain @click.native="change">接入车联网</mt-button></div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
  inject: ["Login_username", "Login_password"],
  name: 'Login',
  data () {
    return {
      username:"",
      captcha:""
    }
  },
  methods: {
    change() {
      if(this.captcha == this.$root.Login_password && this.username != ""){
        this.$root.Login_username = this.username;
        this.$router.push("/Home");
        Toast({
            message: '接入成功',
            iconClass: 'icon icon-success'
          });
    }else{
         Toast({
            message: '接入失败,验证码错误，请重新输入',
            iconClass: 'icon icon_failure'
          });
        /* alert("输入信息错误，请重新输入"); */
     }
    }
  }
}
</script>

<style>
</style>
