<template>
    <div>
      <div v-if="dialog">
        <el-dialog
            :title="title"
            :visible.sync="visible"
            center
            :fullscreen="fullscreen"
            class="preview-dialog"
            :modal="true"
            :before-close="reviewBeforeClose"
        >
          <div class="review-head" align="center" v-if="showMobileView">
            <div><i class="el-icon-s-platform pc-preview" :class="{active:previewVisible}" @click="previewVisible=true;mobilePreviewVisible=false"></i></div>
            <div><i class="el-icon-mobile-phone mobile-preview" :class="{active:mobilePreviewVisible}" @click="mobilePreviewVisible=true;previewVisible=false"></i></div>
          </div>
          <div class="review-content" :class="{pc:previewVisible,mobile:mobilePreviewVisible}">
            <pc-view v-if="previewVisible" ref="form" class="preview-form" :option="option" :baseURL="baseURL||''" />
            <mobile-view v-if="mobilePreviewVisible" :fields="option.column"  :baseURL="baseURL||''" :upload-option="uploadOption" />
          </div>
        </el-dialog>
      </div>
      <div v-else>
        <div class="review-head" align="center" v-if="showMobileView">
          <div><i class="el-icon-s-platform pc-preview" :class="{active:previewVisible}" @click="previewVisible=true;mobilePreviewVisible=false"></i></div>
          <div><i class="el-icon-mobile-phone mobile-preview" :class="{active:mobilePreviewVisible}" @click="mobilePreviewVisible=true;previewVisible=false"></i></div>
        </div>
        <div class="review-content" :class="{pc:previewVisible,mobile:mobilePreviewVisible}">
          <pc-view v-if="previewVisible" ref="form" class="preview-form" :option="option" :baseURL="baseURL||''" />
          <mobile-view v-if="mobilePreviewVisible" :fields="option.column"  :baseURL="baseURL||''" :upload-option="uploadOption" />
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "form-review",
        props:{
            dialog:{//弹窗模式
                type:Boolean,
                default:true
            },
            visible:{
                type:Boolean,
                default:false
            },
            fullscreen:{
                type:Boolean,
                default:false
            },
            option:{
                type:Object,
                default:()=>{}
            },
            baseURL:{
                type:String,
                default:''
            },
            showMobileView:{
                type:Boolean,
                default:true
            },
            title:{
              type:String,
              default:'标准预览'
            }
        },
        data(){
            return{
                previewVisible: true,
                mobilePreviewVisible: false,
                /**
                 * 如需用到上传，可配置上传项
                 * 目前上传固定返回数组对象,此处后期会改成可制定内容，敬请期待...
                 * [{key:'文件名称',value:'mongoId'},...]
                 **/
                uploadOption: {
                    action: '/app/mongodb/uploadFiles/',
                    headers: [
                        {key:'Authorization',value:'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOm51bGwsInVzZXJfaWQiOiI2ODI1MzAxMjQzNjAzMTg5NzYiLCJ1c2VyX25hbWUiOiLlkJXmmYvotoUiLCJsb2dpbl90aW1lIjoiNTAwIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTU5Nzg5NjIwMywianRpIjoiODNiMGRjZTYtMWMyYi00NzZjLTliYTktNGQ1M2VmNjNkOTdmIiwiY2xpZW50X2lkIjoiY2Nzcm9ib3QifQ.Bdm007tW3v5Z9fGPhj8fj8u-LqP42yBNbBrGW62DidqT3eY5EsBojv76SgnsMFhGvw9XTNJIt6zbQ1WeXEJ-HiCniWMPEtmDIgnSJ-WL4GaocDz7p3TBWW1C_XFJUVBdUczggEHDJ8KwYZkptKLGli-Yw5ea3JLazIsG4_7M0iU'}
                    ],
                    data: [//其他附加上传属性
                        {key: 'other', value: '123'}
                    ],
                    limit: 10,//多文件上传最大个数
                    defaultLimit: 10,//多文件上传默认最大个数
                    filesize: 50,//单个文件最大值（MB）
                    defaultFileSize: 50,//单个文件默认最大值（MB）
                    tip: ``,//单个文件超过预设大小值的提示信息
                    propsHttp: {
                        fileName: 'files',//上传的文件名称
                        dataField: 'data'//如果返回的格式有多级可以使用：'data.xxx.xxx'
                    },
                },
            }
        },
        methods:{
            reviewBeforeClose(){
                this.previewVisible = true;
                this.mobilePreviewVisible = false;
                this.$emit('update:visible',false)
                this.$emit('close')
                this.resetUeditorZIndex()
            },
            resetUeditorZIndex() {
                let ueditorDom = document.querySelector('.edui-editor');
                ueditorDom && (ueditorDom.style.zIndex = 9999);
            },
        }
    }
</script>

<style scoped lang="scss">
  .preview-dialog{
    ::v-deep .el-dialog{
      margin-top: 5vh !important;
    }
  }
</style>