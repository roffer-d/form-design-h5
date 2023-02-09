<template>
    <div class="form-box">
        <div class="title">
            <div>
                <!--        <img :src="textImg" class="icon" />-->
                <span class="label reviewText" v-html="field.displayText"></span>
            </div>
        </div>
        <!--    <div class="content">-->
        <!--      <span class="placeholder">{{field.label}}</span>-->
        <!--    </div>-->
    </div>
</template>

<script>
    import textImg from './images/text.png'

    export default {
        name: "review-text",
        props: ['field'],
        components: {},
        data() {
            return {
                textImg
            }
        },
        mounted() {

        },
        methods: {},
        watch: {}
    }
</script>
<style scoped lang="scss">
  .reviewText{
    img{
      max-width: 100%;
    }
  }
</style>
