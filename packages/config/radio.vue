<template>
  <div>
    <remote-data :data="data" :key="data.prop" :column="column" :options="options"></remote-data>

    <el-form-item label="默认值" v-if="false">
      <el-input v-model="data.valueDefault"
                placeholder="默认值"></el-input>
    </el-form-item>
    <el-form-item label="边框" v-if="false">
      <el-switch v-model="data.border"></el-switch>
    </el-form-item>
    <el-form-item label="尺寸"
                  v-if="data.border">
      <el-radio-group v-model="data.size"
                      size="mini">
        <el-radio-button label="medium">正常</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="mini">超小</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否禁用" v-if="false">
      <el-switch v-model="data.disabled"></el-switch>
    </el-form-item>
    <el-form-item label="是否可见" v-if="false">
      <el-switch v-model="data.display"></el-switch>
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="data.required"></el-switch>
    </el-form-item>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'


export default {
  name: "config-radio",
  props: ['data','column','options'],
  components: { Draggable },
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
    }
  },
  watch: {
    'data.required': function (val) {
      if (val) this.validator.required = { required: true, message: `请选择${this.data.label}` }
      else this.validator.required = null

      this.generateRule()
    }
  }
}
</script>
