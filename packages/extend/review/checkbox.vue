<template>
    <div class="form-box">
        <div class="title">
            <div>
<!--                <img :src="checkboxImg" class="icon"/>-->
                <span class="require" v-if="field.required">*</span>
                <span class="label">{{field.label}}</span>
                <span class="tag">多选</span>
            </div>
        </div>
        <div class="content">
            <van-checkbox-group
                    :disabled="field.disabled"
                    v-model="field[field.prop]"
                    v-for="(item,index) in field.dicData"
                    :key="index"
                    class="group">
                <van-checkbox :name="item.value">
                    {{item.label}}
                    <template #icon="props">
                        <img class="img-icon" :src="props.checked ? checkedImg : uncheckedImg" />
                    </template>
                </van-checkbox>
            </van-checkbox-group>
        </div>
    </div>
</template>

<script>
    import checkboxImg from './images/checkbox.png'
    import uncheckedImg from './images/unchecked.png'
    import checkedImg from './images/checkbx-checked.png'

    export default {
        name: "review-checkbox",
        props: ['field'],
        components: {},
        data() {
            return {
                checkboxImg, uncheckedImg,checkedImg
            }
        },
        methods: {},
        watch: {}
    }
</script>

<style scoped lang="less">
    .form-box {
        .title{
            img{
                vertical-align: text-top;
            }

            .tag{
                margin-left: .3rem;
                background: rgba(255,133,35,.15);
                padding: .02rem .2rem;
                border-radius: .04rem;
                color: #FF8523;
            }
        }
        .content {
            padding-left: 0;

            .group{
                margin:.3rem 0;
            }

            .img-icon{
                width: .3rem;
                height: .3rem;
                vertical-align: middle;
            }
        }
    }
</style>
