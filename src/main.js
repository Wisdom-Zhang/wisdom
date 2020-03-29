import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入基础样式
import('../src/assets/css/base.css')
//导入字体图标
import('../src/assets/fonts/iconfont.css')

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')