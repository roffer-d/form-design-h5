<template>
  <div id="app">
    <avue-form-design :options="options" :fieldList="fieldList" showGenerator @submit="handleSubmit"></avue-form-design>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      baseFieldList: ["group", "dynamic", "input", "password", "textarea", "number", "url", "array", "img", "radio", "checkbox", "select", "cascader", "tree", "upload", "year", "month", "week", "date", "time", "datetime", "daterange", "timerange", "datetimerange", "ueditor", "map", "switch", "rate", "slider", "color"],
      fieldList: ['input', 'dynamic','map', 'realMap', 'text', 'textarea', 'radio', 'checkbox', 'select', 'upload', 'date', 'datetime'],
      options: {
        baseURL: '/assembly-form',
        // editorType:'quill',//quill、ueditor
        quill:{
          uploadUrl: `/ccstaglib-new/abilityFunc/mongodb/upload/file`,//上传地址
          downloadUrl: `https://ccstaglib.ccsiot.com/ccstaglib-new/abilityFunc/mongodb/images/`,//下载图片地址
        },
        ueditor: {
          homePath: `/static/ueditor/`,//ueditor本地资源目录
          configUrl: `/assembly-form/form/ue/config?action=config`,//获取上传配置的接口地址
          uploadUrl: `/assembly-form/form/ue/upload`,//上传地址
        },
        column: [
          // {
          //   type: 'url',
          //   prop: 'url',
          //   label: '超链接',
          //   icon: 'icon-url',
          //   valueDefault: 'http://www.baidu.com',
          //   span: 24,
          //   display: true
          // },
          // {
          //   prop: 'img',
          //   type: 'img',
          //   label: '图片',
          //   span: '24',
          //   display: true
          // }
        ]
      }
    }
  },
  methods: {
    handleSubmit(val) {
      console.log(val);
    }
  }
}
</script>
