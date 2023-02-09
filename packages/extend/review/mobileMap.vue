<template>
    <div class="map-box">
        <div class="top-btn">
            <div><span @click="cancel">取消</span></div>
            <div><span @click="ok">确定</span></div>
        </div>
        <div id="map" ref="map-dom"></div>
        <div class="search-box">
            <!--            <input class="search-text" type="text" placeholder="输入检索"/>-->
            <van-search v-model="value" placeholder="请输入搜索关键词" width="80%"
                        @input.native="onSearch"/>
            <ul class="search-result">
                <li v-for="(item,index) in (sResult.length?sResult:nearbyList)" :key="index" @click="getResult(item)">
                    <div class="name" :class="{active:item.active}">{{item.name}}</div>
                    <div class="more-info">{{item.province}}{{item.city}}{{item.district}}</div>
                </li>
            </ul>
        </div>
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
            },
            lng: {
                type: Number,
                default: 116.404
            },
            lat: {
                type: Number,
                default: 39.915
            }
        },
        components: {},
        watch: {},
        data() {
            return {
                map: null,
                location: {},
                sResult: [],
                nearbyList: [],
                value: ''
            };
        },
        mounted() {
            MP(this.ak).then(BMap => {
                this.initMap()

                let mapDom = this.$refs['map-dom']
                let height = document.body.offsetHeight;
                //动态计算地图的高度
                mapDom.style.height = `${height/3.5}px`;
            })
        },
        methods: {
            initMap() {
                let _this = this;

                let map = new BMap.Map('map')
                let point = new BMap.Point(this.lng, this.lat);
                map.centerAndZoom(point, 18);

                map.addEventListener("dragend", function(){
                    let center = map.getCenter();
                    let mk = new BMap.Marker(center);

                    let point = new BMap.Point(center.lng, center.lat);
                    map.centerAndZoom(point, 18);

                    map.clearOverlays();
                    map.addOverlay(mk);
                    map.panTo(point);

                    // _this.moveToCenter(center.lng, center.lat)

                    console.log("地图中心点变更为：" + center.lng + ", " + center.lat);

                    _this.location = center;

                    _this.getNearby().then(res => {
                        _this.nearbyList = res
                    })
                })

                let geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        let mk = new BMap.Marker(r.point);
                        map.addOverlay(mk);
                        map.panTo(r.point);

                        _this.moveToCenter(r.point.lng,r.point.lat)

                        console.log('您的位置：' + r.point.lat + ',' + r.point.lng);
                        let res = {
                            ...r.address,
                            ...r.point
                        }

                        _this.location = res;

                        _this.getNearby().then(res => {
                            _this.nearbyList = res
                        })
                    } else {
                        console.log('failed' + this.getStatus());
                    }
                });

                this.map = map;
            },
            //移动到地图中心点
            moveToCenter(lng,lat){
                let center = this.map.getCenter();
                let point = new BMap.Point(lng, lat);

                let mk = new BMap.Marker(center);
                this.map.centerAndZoom(point, 18);

                this.map.clearOverlays();
                this.map.addOverlay(mk);
                this.map.panTo(point);
            },
            //根据定位的当前位置获取周边信息
            getNearby(r = 1000) {
                return new Promise((resolve, reject) => {
                    let _this = this
                    let option = {
                        poiRadius: r,
                        numPois: 12
                    }

                    let point = new BMap.Point(this.location.lng, this.location.lat)

                    let geo = new BMap.Geocoder();
                    geo.getLocation(point, function (rs) {
                        let allPois = rs.surroundingPois; //获取全部POI(半径R的范围 最多12个点)

                        let resList = []
                        allPois.forEach(poi=>{
                            let pointA = new BMap.Point(poi.point.lng, poi.point.lat);
                            poi.distance = _this.map.getDistance(pointA, point)
                            // _this.map.addOverlay(new BMap.Marker(pointA));

                            resList.push({
                                name:poi.title,
                                lat:poi.point.lat,
                                lng:poi.point.lng
                            })
                        })

                        resolve(resList);
                    }, option)
                })
            },
            //根据经纬度获取位置信息
            getPostionInfo(lng,lat){
                let url = `/geocoder?location=${lat},${lng}&output=json&key=${this.ak}`
                return axios.create()({url,baseURL:'/'})
            },
            //点击搜索列表，获取点击的位置信息
            getResult(item){
                let list = (this.sResult.length ? this.sResult : this.nearbyList)
                list.forEach(obj => {
                    this.$set(obj, 'active', false)
                })
                this.$set(item, 'active', true)

                //调用百度api获取省市区
                let lng = item.lng || item.location.lng
                let lat = item.lat || item.location.lat

                let point = new BMap.Point(lng, lat);
                this.map.centerAndZoom(point, 18);

                this.getPostionInfo(lng,lat).then(res=>{
                    let info = res.data.result;
                    let location = info.location;

                    let cityInfo = info.addressComponent
                    let {province,city,district,street,street_number} = cityInfo

                    this.$set(item, 'province', province)
                    this.$set(item, 'city', city)
                    this.$set(item, 'district', district)
                    this.$set(item, 'street', street)
                    this.$set(item, 'street_number', street_number)

                    let data = {province, city, district,street,street_number, lat: location.lat, lng: location.lng,formatted_address:info.formatted_address}
                    this.location = data

                    this.moveToCenter(location.lng,location.lat)

                    console.log(info)
                })
            },
            //搜索
            async onSearch(e) {
                let value = e.target.value;
                let url = `/place/v2/suggestion?query=${value}&region=四川省&output=json&ak=${this.ak}`

                let res = await axios.create()({url,baseURL:'/'})

                this.sResult = res.data.result || []
            },
            onCancel() {

            },
            cancel() {
                this.$emit('cancel')
            },
            ok() {
                this.$emit('ok', this.location)
            }
        }
    };
</script>
<style lang="less">
    .search-box{
        .van-cell{
            display: inherit !important;
        }
        .van-cell__value{
            margin-top:0 !important;
        }
    }
</style>
<style scoped lang="less">
    .map-box {
        .top-btn {
            padding: .2rem 0;
            background: #2c3e50;
            color: #d0cfcf;
            position: fixed;
            /*top: .8rem;*/
            z-index: 999;
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 14px;
            div{
                padding: 0 .2rem;
            }
            div:last-child{
                text-align: right;
            }
        }

        #map {

        }

        .search-box {
            .search-text {
                border-radius: 8px;
                border: 1px solid #ccc;
                padding: 5px;
                margin: 5px;
                outline: none;
                height: 25px;
                font-size: 12px;
                width: 100%;
            }

            .search-result {
                height: 5.5rem;
                overflow: auto;

                li {
                    padding: 8px 12px;
                    font-size: 13px;
                    color: #555;
                    .active {
                        position: relative;

                        &:after {
                            content: '√';
                            position: absolute;
                            right: 0;
                            color: #00a680;
                        }
                    }

                    .more-info {
                        font-size: 13px;
                        color: #b5b5b5;
                        margin-left: 5px;
                    }
                }
            }
        }
    }
</style>
