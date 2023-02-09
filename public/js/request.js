import axios from 'axios'
import VueCookies from 'vue-cookies';
import qs from 'qs'
axios.defaults.transformRequest = function (data) {
    return qs.stringify(data);
}
// http request 拦截器
axios.interceptors.request.use(
    config => {
        let token = VueCookies.get('token')
        // config.headers.systemType = configs.systemType;
        config.headers.Authorization = token || 'Basic Y2Nzcm9ib3Q6MTIzNDU2'

        return config;

    },
    error => {
        return Promise.reject(error.response);
    }
)
// http response 拦截器
// axios.interceptors.response.use(
//     response => {
//         return response.data;
//     },
//     error => {
//
//         return Promise.reject(error)   // 返回接口返回的错误信息
//     }
// )

export default axios