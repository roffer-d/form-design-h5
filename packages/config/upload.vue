<template>
  <div>
    <el-form-item label="上传地址"
                  v-if="false && !data.oss">
      <el-input v-model="data.action"
                placeholder="上传地址"></el-input>
    </el-form-item>
    <el-form-item label="接受文件类型" v-if="false && !data.oss">
      <el-input v-model="data.accept"
                placeholder="接受文件类型"></el-input>
    </el-form-item>
    <el-form-item label="oss" v-if="false">
      <a href="https://avuejs.com/doc/form/form-upload-qiniu"
         target="_blank"
         style="color: #409EFF;">请先按照相关文档配置avue七牛/阿里配置</a><br>
      <el-select v-model="data.oss"
                 placeholder="oss不写则为普通上传"
                 clearable
                 style="width: 100%">
        <el-option label="阿里"
                   value="ali"></el-option>
        <el-option label="七牛"
                   value="qiniu"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否拖拽上传" v-if="false">
      <el-switch v-model="data.drag"></el-switch>
    </el-form-item>
    <el-form-item label="文件列表类型"
                  v-if="false && !data.drag">
      <el-select v-model="data.listType" v-if="false"
                 placeholder="文件列表类型"
                 clearable>
        <el-option label="附件"
                   value="text"></el-option>
        <el-option label="照片墙"
                   value="picture-card"></el-option>
        <el-option label="头像"
                   value="picture-img"></el-option>
        <el-option label="缩略图"
                   value="picture"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="参数设置" v-if="false">
      <a href="https://avuejs.com/doc/form/form-upload"
         target="_blank"
         style="color: #409EFF;">详细文档</a><br>
      数据对象的图片地址
      <el-input v-model="data.props.label"
                placeholder="数据对象的图片地址"></el-input>
      数据对象的图片名称
      <el-input v-model="data.props.value"
                placeholder="数据对象的图片名称"></el-input>
      请求头
      <avue-dynamic v-model="data.headers"
                    :children="option"></avue-dynamic>
      请求体
      <avue-dynamic v-model="data.data"
                    :children="option"></avue-dynamic>
    </el-form-item>
    <el-form-item label="服务器返回参数设置" v-if="false"><br>
      <el-input v-model="data.propsHttp.url" placeholder="上传成功返回结构体的图片地址"></el-input>
      <el-input v-model="data.propsHttp.name" placeholder="上传成功返回结构体的图片的姓名"></el-input>
      <el-input v-model="data.propsHttp.res" placeholder="返回结构体的层次"></el-input>
      <el-input v-model="data.propsHttp.fileName" placeholder="fileName"></el-input>
    </el-form-item>
    <el-form-item label="是否显示已上传文件列表" v-if="false">
      <el-switch v-model="data.showFileList"></el-switch>
    </el-form-item>
    <el-form-item label="单个文件大小限制（MB）">
      <el-input-number v-model="data.filesize"
                       controls-position="right"
                       placeholder="单个文件大小限制（MB）"
                       :min="0"
                       @blur="fileSizeBlur"
                       style="width: 100%;"></el-input-number>
    </el-form-item>
    <el-form-item label="上传限制提示">
      <el-input v-model="data.tip"
                :placeholder="`上传的文件不能超过预设大小${data.filesize}MB`"></el-input>
    </el-form-item>
    <el-form-item label="上传中提示" v-if="false">
      <el-input v-model="data.loadText"
                placeholder="上传中提示"></el-input>
    </el-form-item>
    <el-form-item label="是否多文件上传">
      <el-switch v-model="data.multiple"></el-switch>
    </el-form-item>
    <el-form-item label="多文件上传数量限制">
      <el-input-number v-model="data.limit"
                       controls-position="right"
                       placeholder="多文件上传数量限制"
                       :min="1"
                       style="width: 100%;"></el-input-number>
    </el-form-item>
<!--    <el-form-item label="图片水印设置"><br>-->
<!--      水印文字-->
<!--      <el-input v-model="data.canvasOption.text"-->
<!--                placeholder="水印文字"></el-input>-->
<!--      字体类型-->
<!--      <el-input v-model="data.canvasOption.fontFamily"-->
<!--                placeholder="字体类型"></el-input>-->
<!--      字体颜色-->
<!--      <avue-color placeholder="字体颜色"></avue-color>-->
<!--      字体大小-->
<!--      <el-input-number v-model="data.canvasOption.fontSize"-->
<!--                       controls-position="right"-->
<!--                       placeholder="字体大小"-->
<!--                       style="width: 100%;"></el-input-number>-->
<!--      文字的透明度-->
<!--      <el-input-number v-model="data.canvasOption.opacity"-->
<!--                       controls-position="right"-->
<!--                       placeholder="文字的透明度"-->
<!--                       :step="10"-->
<!--                       :min="10"-->
<!--                       :max="100"-->
<!--                       style="width: 100%;"></el-input-number>-->
<!--      文字距离图片底部的距离<br>-->
<!--      <el-input-number v-model="data.canvasOption.bottom"-->
<!--                       controls-position="right"-->
<!--                       placeholder="文字距离图片底部的距离"-->
<!--                       style="width: 100%;"></el-input-number>-->
<!--      文字距离图片右边的距离<br>-->
<!--      <el-input-number v-model="data.canvasOption.right"-->
<!--                       controls-position="right"-->
<!--                       placeholder="文字距离图片右边的距离"-->
<!--                       style="width: 100%;"></el-input-number>-->
<!--      压缩图片比率<br>-->
<!--      <el-input-number v-model="data.canvasOption.ratio"-->
<!--                       controls-position="right"-->
<!--                       placeholder="压缩图片比率"-->
<!--                       :step="0.1"-->
<!--                       :min="0"-->
<!--                       :max="1"-->
<!--                       style="width: 100%;"></el-input-number>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="是否禁用">-->
<!--      <el-switch v-model="data.disabled"></el-switch>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="是否可见">-->
<!--      <el-switch v-model="data.display"></el-switch>-->
<!--    </el-form-item>-->
<!--    <el-form-item label="是否必填">-->
<!--      <el-switch v-model="data.required"></el-switch>-->
<!--    </el-form-item>-->
  </div>
</template>

<script>
export default {
  name: "config-upload",
  props: ['data'],
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
    fileSizeBlur(){
      let fileSize = this.data.filesize
      this.data.filesize = !fileSize || fileSize <=0 ? this.data.defaultFileSize : fileSize;
    },
  },
  watch: {
    'data.required': function (val) {
      if (val) this.validator.required = { required: true, message: `${this.data.label}必须填写` }
      else this.validator.required = null

      this.generateRule()
    },
    'data.drag': function (val) {
      if (val) delete this.data.listType
    }
  }
}
</script>
