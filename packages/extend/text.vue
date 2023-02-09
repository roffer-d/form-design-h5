<template>
    <div class="form-text-item" v-html="item.displayText"></div>
</template>

<script>
    export default {
        name: "mobile-text",
        props: ['item'],
        data () {
            return {

            }
        },
    }
</script>
<style scoped lang="scss">
    .form-text-item{
        border-bottom: 1px dashed #ccc;
    }
</style>