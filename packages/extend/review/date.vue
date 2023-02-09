<template>
    <div class="form-box">
        <div class="title">
            <div>
                <!--        <img :src="dateImg" class="icon"/>-->
                <span class="require" v-if="field.required">*</span>
                <span class="label">{{field.label}}</span>
            </div>
        </div>
        <div class="content" @click="showPicker">
            <span class="placeholder">{{this.field[this.field.prop]||'请选择'}}</span>
            <img :src="rightImg"/>
        </div>

        <van-popup v-model="visible" position="bottom">
            <van-datetime-picker
                    v-model="selectedDate"
                    :type="field.type"
                    :title="field.label"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :formatter="formatter"
                    @confirm="confirm"
                    @cancel="visible=false"
            />
        </van-popup>
    </div>
</template>

<script>
    import dateImg from './images/date.png'
    import rightImg from './images/right.png'
    import {dateFormat} from "./utils";

    export default {
        name: "review-date",
        props: ['field'],
        data() {
            return {
                dateImg, rightImg,
                visible: false,
                selectedDate: null,
                minDate: new Date(),
                maxDate: new Date(2100, 11, 30),
                covert: {
                    year: '年',
                    month: '月',
                    day: '日',
                    hour: '时',
                    minute: '分'
                }
            }
        },
        methods: {
            formatter(type, val) {
                return `${val}${this.covert[type]}`
            },
            confirm(date) {
                this.field[this.field.prop] = dateFormat(date, this.field.valueFormat)
                this.visible = false

                this.$emit('valueChange',this.field)
            },
            showPicker(){
                !this.field.disabled && (this.visible = true)
            }
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
                margin-left: .1rem;
            }

            img {
                width: .2rem;
                height: .2rem;
            }
        }
    }
</style>
