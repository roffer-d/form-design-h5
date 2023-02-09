<template>
    <div class="form-checkbox-item">
        <el-checkbox :label="n.label" v-for="(n,i) in item.dicData" :key="i"></el-checkbox>
    </div>
</template>

<script>
    export default {
        name: "form-checkbox",
        props: ['item'],
        data () {
            return {

            }
        },
    }
</script>
<style scoped lang="scss">

</style>