<template>
  <div>
    <el-form-item label="最大长度">
      <el-input-number v-model="data.maxlength"
                       :min="1"
                       controls-position="right"
                       placeholder="最大长度"></el-input-number>
    </el-form-item>

    <remote-data :data="data" :key="data.prop" :column="column" :options="options"></remote-data>

    <el-form-item label="占位内容" v-if="false">
      <el-input v-model="data.placeholder"
                placeholder="占位内容"></el-input>
    </el-form-item>
    <el-form-item label="默认值" v-if="false">
      <el-input v-model="data.valueDefault"
                placeholder="默认值"></el-input>
    </el-form-item>
    <el-form-item label="显示计数" v-if="false">
      <el-switch v-model="data.showWordLimit"></el-switch>
    </el-form-item>
    <el-form-item label="最小行" v-if="false">
      <el-input-number v-model="data.minRows"
                       controls-position="right"
                       placeholder="最小行"
                       :min="1"></el-input-number>
    </el-form-item>
    <el-form-item label="最大行" v-if="false">
      <el-input-number v-model="data.maxRows"
                       controls-position="right"
                       placeholder="最大行"
                       :min="2"></el-input-number>
    </el-form-item>
    <el-form-item label="是否只读" v-if="false">
      <el-switch v-model="data.readonly"></el-switch>
    </el-form-item>
    <el-form-item label="是否可见" v-if="false">
      <el-switch v-model="data.display"></el-switch>
    </el-form-item>
    <el-form-item label="校验"><br>
      <span style="color:#555">是否必填：</span>
      <el-switch v-model="data.required"></el-switch>
      <el-input v-model.lazy="data.pattern" v-if="false"
                placeholder="正则表达式"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "config-textarea",
  props: ['data','column','options'],
  data () {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null
      }
    }
  },
  methods: {
    generateRule () {
      const rules = [];
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) rules.push(this.validator[key])
      })
      this.data.rules = rules
    },
  },
  watch: {
    'data.required': function (val) {
      if (val) this.validator.required = { required: true, message: `${this.data.label}必须填写` }
      else this.validator.required = null

      this.generateRule()
    },
    'data.pattern': function (val) {
      if (val) this.validator.pattern = { pattern: new RegExp(val), message: `${this.data.label}格式不匹配` }
      else this.validator.pattern = null

      // delete this.data.pattern
      this.generateRule()
    }
  }
}
</script>
