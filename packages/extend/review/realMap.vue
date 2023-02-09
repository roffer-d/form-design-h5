<template>
    <div class="form-box">
        <div class="title">
            <div>
                <!--        <img :src="locationImg" class="icon"/>-->
                <span class="require" v-if="field.required">*</span>
                <span class="label">{{field.label}}</span>
            </div>
        </div>
        <div class="content" @click="visible=true">
            <span class="placeholder">{{position||'点击获取位置'}}</span>
            <span class="action-btn">获取位置</span>
        </div>

        <mobile-real-map v-if="visible" :ak="ak" @success="confirmMap"></mobile-real-map>
    </div>
</template>

<script>
    import locationImg from './images/location.png'
    import mobileRealMap from "./mobileRealMap"
    import Const from './utils/const'

    export default {
        name: "review-realMap",
        props: ['field'],
        components:{mobileRealMap},
        data() {
            return {
                locationImg,
                visible: false,
                position: '',
                ak: Const.mapAk
            }
        },
        methods: {
            confirmMap(result) {
                this.position = result.formatted_address || result.district
                this.field[this.field.prop] = JSON.stringify(result)
                this.visible = false
            },
        },
        watch: {}
    }
</script>

<style scoped lang="less">
    .form-box {
        .content {
            margin-top: .3rem;
            height: .5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                color: #A8B1BB;
            }

            .action-btn {
                color: #40C273;
            }
        }
    }
</style>
