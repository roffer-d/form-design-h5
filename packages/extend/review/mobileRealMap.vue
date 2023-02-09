<template>
    <div class="map-box">
        <div id="realMap"></div>
    </div>
</template>

<script>
    import axios from "axios";
    import {MP} from './utils/baiduMap'

    export default {
        name: "mobile-map",
        props: {
            ak: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                location: {},
            }
        },
        mounted() {
            MP(this.ak).then(BMap => {
                this.initMap()
            })
        },
        methods: {
            initMap() {
                let _this = this;

                let map = new BMap.Map('realMap')
                let point = new BMap.Point(116.404, 39.915);
                map.centerAndZoom(point, 18);

                let geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        let mk = new BMap.Marker(r.point);
                        map.addOverlay(mk);
                        map.panTo(r.point);
                        console.log('您的位置：' + r.point.lat + ',' + r.point.lng);
                        let res = {
                            ...r.address,
                            ...r.point
                        }

                        _this.getPostionInfo(r.point.lng,r.point.lat).then(res=>{
                            let info = res.data.result;
                            let location = info.location;

                            let cityInfo = info.addressComponent
                            let {province,city,district,street,street_number} = cityInfo

                            let data = {province, city, district,street,street_number, lat: location.lat, lng: location.lng,formatted_address:info.formatted_address}

                            _this.$emit('success',data)
                        })
                    } else {
                        console.log('failed' + this.getStatus());
                        _this.$emit('failed','获取实时位置失败，错误代码：' + this.getStatus())
                        this.$toast && this.$toast('获取实时位置超时！')
                    }
                });
            },
            //根据经纬度获取位置信息
            getPostionInfo(lng,lat){
                let url = `/geocoder?location=${lat},${lng}&output=json&key=${this.ak}`
                return axios.create()({url,baseURL:'/'})
            }
        }
    };
</script>