import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import {
  judgeLogin,
} from '@/api/index'
import '@fortawesome/fontawesome-free/css/all.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.$api=api;
import 'highlight.js/styles/vs2015.css'
router.beforeEach((to, from, next)=>{
  judgeLogin().then(res=>{
    if (to.name == 'login') {
      next()
    } else {
      if (res.state == 0 ) {
        next({
          path: '/'
        })
      } else {
        next()
      }
    }
  })
    
})
/** 富文本编辑器 */
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

import log from './util/log'

// Vue.use(VueQuillEditor)
Vue.use(iView)

window.log = log

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
