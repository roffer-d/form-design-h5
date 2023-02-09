import Vue from 'vue'
import App from './App'

import AvueFormDesign from '../packages/';
// import AvueFormDesign from '../lib/index.umd.min';
// import AvueUeditor from 'avue-plugin-ueditor'
import AvueMap from 'avue-plugin-map'
import Vant from 'vant';
import 'vant/lib/index.css';
import '../public/js/request'

Vue.use(window.AVUE)
Vue.use(AvueFormDesign)
// Vue.use(AvueUeditor)
Vue.use(AvueMap)
Vue.use(Vant)

Vue.config.productionTip = false

Vue.prototype.downloadAttachUrl = 'http://10.206.20.48:18000/app/mongodb/download/'

new Vue({
  render: h => h(App),
}).$mount('#app')
