import Text from './text.vue'
import checkbox from './checkbox.vue'
import RealMap from './realMap.vue'
import remoteData from "./remoteData";
import review from './review/'

const components = [
    Text,
    checkbox,
    RealMap,
    remoteData
]

const Config = {
    install (Vue) {
        if (this.installed) return
        this.installed = true

        Vue.use(review)

        components.map(component => {
            Vue.component(component.name, component);
        })
    }
}

export default Config
