<template>
  <div class="config-text">
    <template v-if="options.editorType == 'quill'">
      <input type="file" class="file" ref="file" @change="uploadFile" accept="image/jpg,image/png,.jpg,.png"/>
      <quill-editor class="ql-editor"
                    ref="myTextEditor"
                    v-model.trim="data.displayText"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    @change="onEditorChange($event)">
      </quill-editor>
    </template>
    <template v-else>
      <vue-ueditor-wrap v-model="data.displayText"
                        :ref="ueditorRef"
                        :config="myConfig"
                        @beforeInit="beforeInit"
                        @ready="ready"></vue-ueditor-wrap>
    </template>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: "config-text",
  props: ['data', 'column', 'options'],
  components: {quillEditor,VueUeditorWrap},
  data() {
    let that = this;

    return {
      ueditorRef:`ueditor_${Date.now()}`,
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 340,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: this.options.ueditor.configUrl,
        // serverUrl: '/test/ueditor/config',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: this.options.ueditor.homePath,
        uploadUrl: this.options.ueditor.uploadUrl,
        toolbars: [[
          'undo', 'redo', '|', 'customstyle', 'fontfamily', 'indent', 'fontsize',
          'bold', 'italic', 'underline', 'fontborder',
          'strikethrough',
          'insertorderedlist', 'insertunorderedlist', 'cleardoc', 'simpleupload', 'insertvideo'
        ]]
      },
      editorOption: {
        modules: {
          toolbar: {
            container:[
              ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
              // ["blockquote", "code-block"], // 引用  代码块
              [{header: 1}, {header: 2}], // 1、2 级标题
              // [{list: "ordered"}, {list: "bullet"}], // 有序、无序列表
              // [{script: "sub"}, {script: "super"}], // 上标/下标
              [{indent: "-1"}, {indent: "+1"}], // 缩进
              // [{'direction': 'rtl'}],                         // 文本方向
              [{size: ["small", false, "large", "huge"]}], // 字体大小
              [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题
              [{color: []}, {background: []}], // 字体颜色、字体背景颜色
              [{font: []}], // 字体种类
              [{align: []}], // 对齐方式
              ["clean"], // 清除文本格式
              // ["link", "image", "video"], // 链接、图片、视频
              ["link", "image"] // 链接、图片、视频
            ],
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  that.$refs.file.click();//自定义元素的点击事件
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }, //工具菜单栏配置
        },
        placeholder: '请输入...', //提示
        readyOnly: false, //是否只读
        theme: 'snow', //主题 snow/bubble
        syntax: true, //语法检测
      },
    }
  },
  mounted() {

  },
  methods: {
    // 失去焦点
    onEditorBlur(editor) {},
    // 获得焦点
    onEditorFocus(editor) {},
    // 开始
    onEditorReady(editor) {},
    // 值发生变化
    onEditorChange(editor) {
      this.data.displayText = editor.html;
    },
    uploadFile(e){
      let xhr = new XMLHttpRequest();
      let formData = new FormData()
      formData.append('file',e.target.files[0])
      // xhr.upload.addEventListener('progress',process,false); //上传监听过程
      xhr.addEventListener('load',this.uploadSuccess,false);//上传成功
      // xhr.addEventListener('error',error,false);//上传出错
      // xhr.addEventListener('abort',abort,false);//上传退出
      xhr.open('POST',this.options.quill.uploadUrl);
      xhr.send(formData);
    },
    uploadSuccess(e){
      let res = JSON.parse(e.target.responseText)
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myTextEditor.quill;
      // 如果上传成功
      if (res.code == 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", this.options.quill.downloadUrl + res.data);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    beforeInit(id,opt){
      let editor = window.UE.getEditor(id, opt)
      // console.log(editor.loadServerConfig())
    },
    ready(editor) {
      let that = this

      /**
       * 这步神操作，由于下边的 自定义上传地址覆盖了 原型链上的 getActionUrl() 方法
       * 导致再次初始化ueditor的时候，获取config配置的方法变成了上传的地址，就会报错：后端配置项没有正常加载，上传插件不能正常使用！
       * 所以这里，初始化的时候，先获取之前默认的 getActionUrl方法(_bkGetActionUrl,在替换的时候，赋了值的)，重新从后端获取一次配置，
       * 获取完成之后，再次把 getActionUrl 方法替换成上传的url地址
       */
      if(editor._bkGetActionUrl){
        editor.getActionUrl = editor._bkGetActionUrl
        editor.loadServerConfig()
      }

      // let editor = this.$refs[this.ueditorRef].editor

      !editor._bkGetActionUrl && (editor._bkGetActionUrl = UE.Editor.prototype.getActionUrl);
      editor.getActionUrl = function (action) {
        return that.options.ueditor.uploadUrl;//这就是自定义的上传地址
      }
      editor.addListener('blur', function () {
        // let dom = editor.form.querySelector('.edui-editor')
        // dom.style.zIndex = 1
      });
      editor.addListener('focus', function () {
        // let dom = editor.form.querySelector('.edui-editor')
        // dom.style.zIndex = 9999
      });
    },
    generateRule() {
      const rules = [];
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) rules.push(this.validator[key])
      })
      this.data.rules = rules
    }
  },
  watch: {
    'data.displayText': function (val) {

    }
  }
}
</script>

<style scoped lang="scss">
.config-text{
  .file{
    display: none;
  }
  ::v-deep .ql-container{
    height: calc(100vh - 280px);
  }
}
</style>
