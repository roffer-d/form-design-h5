<template>
  <div class="pc-review-window">
    <el-form
        :model="pcForm"
        :rules="pcRules"
        ref="pcForm"
        :label-position="option.labelPosition"
        style="padding:10px"
        label-width="100%"
        @submit.native.prevent
    >
      <template v-for="(data,index) in option.column">
        <div class="reviewText" v-if="data.type=='text'" v-html="data.displayText"></div>
        <el-form-item v-else :label="data.label" :prop="data.prop">
          <pc-view-item :data="data" :column="option.column" @linkage="linkage" :baseURL="baseURL"></pc-view-item>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import pcViewItem from "./pcViewItem";

export default {
  name: "pcView",
  props: ['option', 'baseURL'],
  components: {pcViewItem},
  data() {
    return {
      pcForm: {},
      pcRules: {}
    }
  },
  watch: {
    option: {
      handler() {
        this.generateForm()
      },
      deep: true
    }
  },
  created() {
    if (this.option) {
      this.generateForm()
    }
  },
  mounted() {

  },
  methods: {
    generateForm() {
      this.option.column.forEach(column => {
        this.pcForm[column.prop] = column[column.prop] ? column[column.prop] : ''
        this.pcRules[column.prop] = column.rules
      })

      this.pcForm = JSON.parse(JSON.stringify(this.pcForm))
      this.pcRules = JSON.parse(JSON.stringify(this.pcRules))
    },
    resetForm() {

    },
    linkage(ret) {
      this.option.column = JSON.parse(JSON.stringify(this.option.column))
    }
  }
}
</script>

<style lang="scss" scoped>
.pc-review-window {
  ::v-deep .reviewText {
    img {
      max-width: 100%;
    }
  }

  ::v-deep .el-form-item__label {
    width: max-content;
  }

  ::v-deep .el-form-item {
    display: flex;
    flex-flow: column;
  }

  ::v-deep .el-form-item__label {
    text-align: left;
  }

  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
<style scoped>

</style>