<template>
  <div>
    <remote-data :data="data" :key="data.prop" :column="column" :options="options"></remote-data>

    <el-form-item label="占位内容" v-if="false">
      <el-input v-model="data.placeholder"
                placeholder="占位内容"></el-input>
    </el-form-item>
    <el-form-item label="默认值" v-if="false">
      <el-input v-model="data.valueDefault"
                placeholder="默认值"></el-input>
    </el-form-item>
<!--    <el-form-item label="是否多选">-->
<!--      <el-switch v-model="data.multiple"></el-switch>-->
<!--    </el-form-item>-->
    <el-form-item label="是否可拖拽（需引入sortable.js）"
                  v-if="false && data.multiple">
      <el-switch v-model="data.drag"></el-switch>
    </el-form-item>
    <el-form-item label="多选数量限制" v-if="false && data.multiple">
      <el-input-number v-model="data.limit"
                       controls-position="right"
                       placeholder="多选限制"
                       :min="0"
                       :max="data.dicData.length"></el-input-number>
    </el-form-item>
    <el-form-item label="尺寸" v-if="false">
      <el-radio-group v-model="data.size"
                      size="mini">
        <el-radio-button label="medium">正常</el-radio-button>
        <el-radio-button label="small">小</el-radio-button>
        <el-radio-button label="mini">超小</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否可清空" v-if="false">
      <el-switch v-model="data.clearable"></el-switch>
    </el-form-item>
    <el-form-item label="是否可搜索" v-if="false">
      <el-switch v-model="data.filterable"></el-switch>
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
  name: "config-select",
  props: ['data','column','options'],
  components: { Draggable },
  data () {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null
      },
      option: {
        column: [{
          type: 'input',
          prop: 'key',
          label: 'key'
        }, {
          type: 'input',
          prop: 'value',
          label: 'value'
        }]
      },
      treeData: [
        {
          value:'1',
          label: '维修工单处理',
          children: [
              {
                value:'1-1',
                parent:'1',
                label: '产品分类'
              },
              {
                value:'1-1',
                parent:'1',
                label: '产品名称'
              }
          ]
        },
        {
          value:'2',
          parent:'2',
          label: '客户档案',
          children: [
            {
              value:'2-1',
              parent:'2',
              label: '客户编号'
            },
            {
              value:'2-2',
              parent:'2',
              label: '客户名称'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    if(this.data.dicOption === 'data' && !this.data.treeText)
      this.$set(this.data,'treeText','')
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
