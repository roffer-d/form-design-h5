import Config from './config'
import Extend from './extend'
import FormDesign from './index.vue'
import pcView from "./pcView"
import mobileView from './mobileView'
import formReview from "./extend/formReview"

const components = [
  pcView,
  mobileView,
  formReview
]

export default {
  install (Vue) {
    Vue.use(Config)
    Vue.use(Extend)
    Vue.component('Avue' + FormDesign.name, FormDesign);

    components.map(component => {
      Vue.component(component.name, component);
    })
  }
}
