<template>
    <div class="form-box">
        <div class="title">
            <div>
<!--                <img :src="textareaImg" class="icon"/>-->
                <span class="require" v-if="field.required">*</span>
                <span class="label">{{field.label}}</span>
            </div>
        </div>
        <div class="content">
            <textarea :disabled="field.disabled" style="width: 100%;height: 2rem" :placeholder="`请输入${field.label}`"></textarea>
        </div>
    </div>
</template>

<script>
    import textareaImg from './images/textarea.png'

    export default {
        name: "review-textarea",
        props: ['field'],
        data() {
            return {
                textareaImg
            }
        },
        methods: {},
        watch: {}
    }
</script>

<style scoped lang="less">
    .form-box {
        .content {
            margin-top: .3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 2rem;
            margin-top: .3rem;

            span {
                color: #A8B1BB;
            }

            textarea {
                width: 100%;
                height: 100%;
                color: #555;
                border: .01rem solid #d2d2d2;
                border-radius: .08rem;
                outline: none;
            }
        }
    }
</style>
