<template>
    <div class="form-box">
        <div class="title">
            <div>
<!--                <img :src="inputImg" class="icon"/>-->
                <span class="require" v-if="field.required">*</span>
                <span class="label">{{field.label}}</span>
            </div>
        </div>
        <div class="content">
            <input type="text" v-model="field[field.prop]" :placeholder="`请输入${field.label}`" :disabled="field.disabled" @blur="blur" />
        </div>
    </div>
</template>

<script>
    import inputImg from './images/input.png'
    import dragImg from './images/drop.png'

    export default {
        name: "review-input",
        props: ['field'],
        data() {
            return {
                inputImg, dragImg
            }
        },
        methods: {
            blur(){
                this.$emit('valueChange',this.field)
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
            }

            input {
                width: 100%;
                height: 100%;
                color: #555;
                border: none;
                outline: none;
            }
        }
    }
</style>
