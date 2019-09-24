import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import Axios from 'axios'
import store from './store'
import router from './router'
import VueCookies from 'vue-cookies'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueCookies)

Vue.config.productionTip = false
Vue.prototype.$http = Axios;
const token = $cookies.get('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
