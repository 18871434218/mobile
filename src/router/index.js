import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.use(Mint);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/', 
      redirect: '/Login' 
  }
  ]
})
