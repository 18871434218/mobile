// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  provide(){
    return{
      Login_username: this.Login_username,
      Login_password: this.Login_password
    }
  },
  data(){
    return{
      Login_username: "",
      Login_password: 123456
    }
  },
  router,
  components: { App },
  template: '<App/>'
})
