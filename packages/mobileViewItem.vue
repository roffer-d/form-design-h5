<template>
    <div>
        <van-field v-if="data.type == 'checkbox'" :label="data.label" :rules="data.rules||[]">
            <template #input>
                <van-checkbox-group @change="valueChange()" v-model="data[data.prop]" direction="horizontal" :disabled="data.disabled" :readonly="data.readonly">
                    <van-checkbox
                            class="option"
                            v-for="(item,index) in data.dicData"
                            :key="index"
                            :name="item.value"
                            shape="square"
                    >{{item.label}}
                    </van-checkbox>
                </van-checkbox-group>
            </template>
        </van-field>

        <van-field
                v-if="data.type == 'time'||data.type == 'date'||data.type == 'datetime'||data.type=='datetimerange'||data.type=='daterange'"
                readonly
                clickable
                :name="data[data.prop]"
                :label="data.label"
                :rules="data.rules||[]"
                v-model="data[data.prop]"
                placeholder="点击选择时间"
                @click="!data.disabled && !data.readonly && (showTimePicker = true)"
        />
        <van-popup v-if="!data.disabled && !data.readonly && (data.type == 'time'||data.type == 'date'||data.type == 'datetime'||data.type=='datetimerange'||data.type=='daterange')" v-model="showTimePicker" position="bottom">
            <van-datetime-picker
                    :type="['date','time','year-month','datetime'].includes(data.type) ? data.type : 'datetime'"
                    @confirm="onDateConfirm"
                    @cancel="showTimePicker = false" />
        </van-popup>

        <van-field
                v-if="data.type == 'input' || data.type == 'password'"
                v-model="data[data.prop]"
                :disabled="data.disabled"
                :readonly="data.readonly"
                :type="data.type"
                :maxlength="data.maxlength"
                :rows="6"
                :name="data[data.prop]"
                :label="data.label"
                :rules="data.rules||[]"
                @blur="valueChange()"
                :placeholder="`请输入${data.label}`"
        />

        <van-field
                v-if="data.type == 'textarea' && !data.disabled && !data.readonly"
                v-model="data[data.prop]"
                :type="data.type"
                :rows="6"
                :maxlength="data.maxlength"
                :name="data[data.prop]"
                :label="data.label"
                :rules="data.rules||[]"
                :placeholder="`请输入`"
                @blur="valueChange()"
        />
        <div class="form-textarea" v-else-if="data.type == 'textarea' && (data.disabled || data.readonly)">
            <div class="title" v-html="data.label"></div>
            <div class="form-disabled-textarea" v-if="data[data.prop]">{{data[data.prop]}}</div>
            <div class="form-disabled-textarea" v-else>请输入{{data.label}}</div>
        </div>

        <van-field v-if="data.type == 'radio'" :label="data.label" :rules="data.rules||[]" v-model="data[data.prop]">
            <template #input>
                <van-radio-group @change="valueChange()" v-model="data[data.prop]" direction="horizontal" :disabled="data.disabled" :readonly="data.readonly">
                    <van-radio
                            class="option"
                            v-for="(item,index) in data.dicData"
                            :key="index"
                            :name="item.value"
                    >{{item.label}}
                    </van-radio>
                </van-radio-group>
            </template>
        </van-field>

        <van-field v-if="data.type == 'rate'" :name="data[data.prop]" :label="data.label" :rules="data.rules||[]" v-model="data[data.prop]">
            <template #input>
                <van-rate @change="valueChange()" v-model="data[data.prop]" :count="data.max" :disabled="data.disabled" :readonly="data.readonly" />
            </template>
        </van-field>

        <van-field v-if="data.type == 'switch'" :name="data[data.prop]" :label="data.label" :rules="data.rules||[]" v-model="data[data.prop]">
            <template #input>
                <van-switch @change="valueChange()" v-model="data[data.prop]" size="20" :disabled="data.disabled" :readonly="data.readonly" />
            </template>
        </van-field>

        <van-field v-if="data.type == 'upload'" :name="data[data.prop]" :label="data.label" @click="showChooseFile=true">
            <template #input>
                <div style="display: table">
                    <div v-for="(item,index) in data[data.prop] || []" :key="index" style="position: relative;">
                        <span style="text-decoration: underline" @click="reviewFile(item)">{{subFileName(item.name)}}</span>
                        <span v-if="!data.disabled" class="del-file" @click="delFile(index)">删除</span>
                        <!--                        <van-icon name="cross" style="position: absolute;right: -40px;top:8px;" color="#c32026"/>-->
                    </div>
                    <van-uploader ref="upload"
                                  v-if="isIOS"
                                  :accept="accept"
                                  :max-count="data.limit||3"
                                  :multiple="data.multiple?true:false"
                                  :disabled="data.disabled?true:false"
                                  :before-read="beforeRead"
                                  :after-read="afterRead" />
                    <div v-else-if="isAndroid" @click="!data.disabled && (showAndroidUpload = true)">
                        <p style="font-size: 0.28rem;color: #00B38A">上传附件</p>
                    </div>
<!--                    <label v-else>PC端无法显示上传组件,请在移动端查看</label>-->
                </div>
            </template>
        </van-field>

        <van-action-sheet v-model="showAndroidUpload"
                          description="选择操作"
                          cancel-text="取消">
            <div class="content"
                 style="padding-bottom: 0">
                <div style="display: flex;align-items: center;justify-content: center;padding: 0.2rem 0;border-bottom: 1px solid rgb(241,241,241)">
                    <van-uploader :before-read="beforeRead"
                                  :max-count="data.limit||3"
                                  :multiple="data.multiple?true:false"
                                  :disabled="data.disabled?true:false">
                        <p style="font-size: 0.32rem;font-weight: 500">选择照片</p>
                    </van-uploader>
                </div>
                <div style="display: flex;align-items: center;justify-content: center;padding: 0.2rem 0;padding-bottom: 0.4rem">
                    <van-uploader :before-read="beforeRead"
                                  :max-count="data.limit||3"
                                  :multiple="data.multiple?true:false"
                                  :disabled="data.disabled?true:false"
                                  :accept="accept">
                        <p style="font-size: 0.32rem;font-weight: 500">选择附件</p>
                    </van-uploader>
                </div>
                <div style="display: flex;align-items: center;justify-content: center;padding: 0.2rem 0;padding-bottom: 0.4rem">
                    <van-uploader :before-read="beforeRead"
                                  :max-count="data.limit||3"
                                  :multiple="data.multiple?true:false"
                                  :disabled="data.disabled?true:false"
                                  accept="recording">
                        <p style="font-size: 0.32rem;font-weight: 500">录制视频</p>
                    </van-uploader>
                </div>
            </div>
        </van-action-sheet>

        <van-field v-if="data.type == 'slider'" :name="data[data.prop]" :label="data.label" :rules="data.rules||[]" v-model="data[data.prop]">
            <template #input>
                <van-slider
                        v-model="data[data.prop]"
                        active-color="#ee0a24"
                        :step="1"
                        :min="data.min"
                        :max="data.max"
                        :disabled="data.disabled"
                        :readonly="data.readonly"
                        @change="onChange"
                >
                    <template #button>
                        <div class="custom-button">{{ value }}</div>
                    </template>
                </van-slider>
            </template>
        </van-field>

        <van-field v-if="data.type == 'number'" :label="data.label" :rules="data.rules||[]" v-model="data[data.prop]">
            <template #input>
                <van-stepper
                        v-model="data[data.prop]"
                        :step="data.step||1"
                        :min="data.minRows||0"
                        :max="data.maxRows||100"
                        :disabled="data.disabled"
                        :readonly="data.readonly"
                        @change="valueChange()"
                />
            </template>
        </van-field>

        <!-- 选择器 -->
        <van-field
                v-if="data.type == 'select'"
                readonly
                clickable
                :name="data[data.prop]"
                :label="data.label"
                :rules="data.rules||[]"
                v-model="data[data.prop]"
                placeholder="点击下拉选择"
                @click="doShowSelectPicker"
        />
        <van-popup v-if="!data.disabled && !data.readonly && data.type == 'select'" v-model="showSelectPicker" position="bottom">
            <van-picker
                    :title="data.label"
                    show-toolbar
                    :columns="(data.dicData||[]).map(item=>item.label)"
                    @confirm="onSelectConfirm"
                    @cancel="showSelectPicker = false"
                    :disabled="data.disabled"
                    :readonly="data.readonly"
            />
        </van-popup>
        <div v-if="data.type=='text'" v-html="data.displayText"></div>

        <!-- 坐标拾取器 -->
        <van-field
                v-if="data.type == 'map'"
                readonly
                clickable
                :label="data.label"
                :rules="data.rules||[]"
                v-model="data[data.prop]"
                placeholder="获取位置"
                @click="openMap"
        >
            <template #input>
                <span>{{position}}</span>
                <van-icon name="location-o" color="#35a4d0" style="position: absolute;right: 0;" />
            </template>
        </van-field>

        <van-popup v-if="data.type == 'map'" v-model="showMap" style="width: 100%;height: 100%">
            <mobile-map v-model="data[data.prop]" :ak="ak" @cancel="cancelMap" @ok="confirmMap"></mobile-map>
        </van-popup>

        <!-- 实时位置 -->
        <van-field
                v-if="data.type == 'realMap'"
                readonly
                clickable
                :label="data.label"
                :rules="data.rules||[]"
                v-model="data[data.prop]"
                placeholder="获取实时位置"
                @click="openRealMap"
        >
            <template #input>
                <span>{{position}}</span>
                <van-icon name="location-o" color="#35a4d0" style="position: absolute;right: 0;" />
            </template>
        </van-field>
        <mobile-real-map v-if="data.type == 'realMap' && showRealMap" :ak="ak" @success="confirmMap"></mobile-real-map>
    </div>
</template>

<script>
    import axios from "../public/js/request";
    import mobileMap from './mobileMap'
    import mobileRealMap from './mobileRealMap'

    import Const from '../public/js/const'
    // import {Toast} from 'vant'

    export default {
        props: {
            data: {
                type: Object
            },
            column:{
                type:Array
            }
        },
        components: {
            mobileMap,
            mobileRealMap
        },
        name: "mobile-view-item",
        data() {
            return {
                position:'',
                isIOS:false,
                isAndroid:false,
                showAndroidUpload:false,
                accept:"*.pdf,*.PDF,*.txt,*.TXT,*.doc,*.DOC,*.docx,*.DOCX,*.xls,*.XLS,*.xlsx,*.XLSX,*.png,*.PNG,*.jpg,*.JPG",
                ak:Const.mapAk,
                showMap:false,
                showRealMap:false,
                showDatePicker: false,
                //时间选择
                minDate: new Date(2020, 0, 1),
                maxDate: new Date(2025, 10, 1),
                showTimePicker: false,
                //开关
                checked: true,
                showSelectPicker: false,
                columns: [],
                showChooseFile:false,
                loadedSelect:{},//标记已加载过的下拉框数据
                tempFiles:{}//临时存放上传文件的信息，上传之后清空
            };
        },
        created() {
            this.isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
            this.isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

            switch (this.data.type) {
                case 'checkbox':
                    !this.data[this.data.prop] && this.$set(this.data,this.data.prop,[])
                    break;
                case 'select':
                    this.getSelectData()
                    break;
                case 'upload':
                    this.$set(this.data,'action',Const.uploadOnePath)
                    break;
                default:
                    break;
            }
        },
        mounted() {
            if(this.data.type === 'map' || this.data.type === 'realMap'){
                let prop = this.data.prop
                let location = JSON.parse(this.data[prop])
                this.data[prop] && (this.position = location.formatted_address || location.district)
            }
        },
        methods: {
            resetDataLinkage(){
                this.column.forEach((item,index)=>{
                    if(item.sourceProp == this.data.prop){
                        if(['select','radio','checkbox'].includes(item.type)){
                            item.dicData = []
                            item[item.prop] = item.multiple ? [] : ''
                        }else{
                            item[item.prop] = ''
                        }
                    }
                })
            },
            setDataLinkage(columnIndex,data){
                let item = this.column[columnIndex]

                if(['select','radio','checkbox'].includes(item.type)){
                    item.dicData = data ? data : []
                }else{
                    item[item.prop] = data ? data[0].value.replace(/\[|\]/g,'') : ''
                }

                this.$set(this.column,columnIndex,item)

                this.$emit('linkage',{data,columnIndex,column:this.column})

                /** 赋值了关联的字段后，继续调用方法，找到跟当前字段有数据联动的字段，循环赋值 **/
                this.valueChange(item)
            },
            valueChange(data) {
                data = data || this.data
                let sourceFieldValue = data[data.prop]

                /** 数据联动 **/
                if (sourceFieldValue) {
                    // this.resetDataLinkage()

                    this.column.forEach((item,index)=>{
                        if(item.sourceProp == data.prop){
                            let {sourceFormId, sourceFieldId, targetFormId, targetFieldId} = item
                            if (sourceFormId && sourceFieldId && targetFormId && targetFieldId) {
                                let params = {sourceFormId, sourceFieldId, targetFormId, targetFieldId, sourceFieldValue}
                                axios.post(Const.REMOTE_FORM_DATA_API, params).then(res => {
                                    /** 设置关联的字段值 **/
                                    this.setDataLinkage(index,res.data.data)
                                })
                            }
                        }
                    })
                }
            },
            doShowSelectPicker(){
                if(!this.data.disabled && !this.data.readonly){
                    this.getSelectData();
                    this.showSelectPicker = true
                }
            },
            getSelectData(){
                if(!this.loadedSelect[this.data.prop]){
                    this.data.multiple && this.$set(this.data,this.data.prop,[])

                    if(this.data.dicOption == 'remote'){
                        let params = {}
                        if(this.data.dicMethod === 'post' && this.data.dicQuery){
                            params = this.data.dicQuery
                        }
                        axios[this.data.dicMethod](this.data.dicUrl,params).then(res=>{
                            this.$set(this.data,'dicData',res.data.data)
                        })
                    }else if(this.data.dicOption == 'form'){
                        let value = this.data.expendKeys
                        if(value.length){
                            let params = {formId:value[0],fieldId:value[1]}
                            axios.post(Const.FORM_FIELDS_API,params).then(res=>{
                                this.$set(this.data,'dicData',res.data.data)
                            })
                        }
                    }

                    this.loadedSelect[this.data.prop] = true
                }
            },
            openMap(){
                !this.data.disabled && !this.data.readonly && (this.showMap = true)
            },
            openRealMap(){
                if(this.data.disabled || this.data.readonly)return;

                this.position = '';
                this.showRealMap = true
                this.$toast && this.$toast('实时位置获取中，请稍后...')
            },
            cancelMap(){
                this.showMap = false
                this.showRealMap = false
            },
            confirmMap(result){
                this.position = result.formatted_address || result.district
                this.data[this.data.prop] = JSON.stringify(result)
                this.showMap = false
                this.showRealMap = false
            },
            getLocation(){
                console.log(this.data[this.data.prop])
            },
            //输入框
            inputText(value) {
                console.log(value)
            },
            delFile(index){
                this.data[this.data.prop].splice(index,1)
            },
            subFileName(fileName){
                return fileName.replace(/^(.{16})(.*)(.{3})(\.\w+)$/g,'$1...$3$4')
            },
            beforeRead(e){
                let formData = new FormData();
                if(!(e instanceof Array)){
                    let prop = this.data.prop;
                    let fileList = this.data[prop]||[];
                    if(fileList.length >= this.data.limit){
                        alert(this.data.tip || `上传的文件数量不能大于${this.data.limit}个`)
                        return;
                    }

                    let flag = this.appendToFormData(formData,e);
                    if(!flag){
                        return;
                    }
                }else{
                    if(this.data.multiple){
                        let prop = this.data.prop;
                        let fileList = this.data[prop]||[];
                        if((this.data.limit && this.data.limit < e.length) || fileList.length >= this.data.limit){
                            alert(this.data.tip || `上传的文件数量不能大于${this.data.limit}个`)
                            return;
                        }
                    }else{
                        alert(`只能选择单个文件！`)
                        return;
                    }

                    e.forEach(item=>{
                        let flag = this.appendToFormData(formData,item);
                        if(!flag){
                            return;
                        }
                    })
                }

                this.showAndroidUpload = false

                this.uploadFile(formData)
            },
            appendToFormData(formData,file){
                if(file.size > this.data.filesize * 1024 * 1024){
                    alert(this.data.tip);
                    return false;
                }
                let index = file.name.lastIndexOf('.')
                let name = file.name.substring(0,index)
                let suffix = file.name.substring(index)
                let fileName = `${name}_${Date.now()}${suffix}`;
                let newFile = new File([file], fileName, { type: file.type, lastModified: file.lastModified })

                let postFileName = this.data.propsHttp && this.data.propsHttp.fileName ? this.data.propsHttp.fileName : 'files'
                formData.append(postFileName,newFile)
                let type = newFile.name.substr(newFile.name.lastIndexOf('.')+1)
                this.tempFiles[fileName] = {
                    name:newFile.name,
                    size:newFile.size,
                    lastModified:newFile.lastModified,
                    type
                }

                return true;
            },
            uploadFile(formData){
                // Toast.loading({
                //     duration: 0, // 持续展示 toast
                //     forbidClick: false, //禁止背景点击
                //     message: '文件上传中...',
                //     overlay: false, //背景遮罩层打开,
                //     loadingType: 'spinner' //加载图形
                // });
                axios.post(this.data.action||Const.uploadPath,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                ).then(res=>{
                    let resFileList = res.data.data;
                    let prop = this.data.prop;
                    let fileList = this.data[prop]||[];

                    resFileList.forEach(file=>{
                        let obj = this.tempFiles[file.key];
                        obj.serverId = file.value;
                    })

                    for(let key in this.tempFiles)
                        fileList.push(this.tempFiles[key])

                    this.$set(this.data,prop,fileList);
                    // this.data = JSON.parse(JSON.stringify(this.data))
                }).catch(e=>{
                    console.log(e)
                    this.$dialog.alert({title:'上传出错',message:e.message})
                }).finally(()=>{
                    this.tempFiles = {}
                    // Toast.clear()
                })
            },
            //文件上传
            afterRead(file) {
                // 此时可以自行将文件上传至服务器
                console.log(file);
            },
            //下载预览文件
            reviewFile(item){
                download && download(item.name,item.serverId)
            },
            //滑块事件
            onChange() {
            },
            //选择器
            onSelectConfirm(value) {
                this.data[this.data.prop] = value;
                this.showSelectPicker = false;
                this.valueChange()
            },
            //时间选择器
            onDateConfirm(date) {
                let format = this.data.type === 'datetime' ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd'
                this.data[this.data.prop] = this.dateFormat(date,format.replace('HH','hh'));
                this.showTimePicker = false;
                this.valueChange();
            },
            dateFormat(date,format) {
                if(date){
                    date = date instanceof Date ? date : new Date(date);
                    let o = {
                        "M+" : date.getMonth()+1,                 //月份
                        "d+" : date.getDate(),                    //日
                        "h+" : date.getHours(),                   //小时
                        "m+" : date.getMinutes(),                 //分
                        "s+" : date.getSeconds(),                 //秒
                        "q+" : Math.floor((date.getMonth()+3)/3), //季度
                        "S"  : date.getMilliseconds()             //毫秒
                    };

                    format = (format || 'yyyy-MM-dd hh:mm:ss').replace(/y+/i,date.getFullYear());
                    for(let i in o)format = format.replace(new RegExp('(' + i + ')'),('0' + o[i]).slice(-2));
                    return format;
                }
                return '';
            }
        }
    };
</script>
<style scoped>
    .content {
        padding: 0rem 0rem 3.2rem;
    }
    .content .van-sidebar-item--select {
        color: #323233;
        font-weight: 500;
        border-color: rgba(0, 179, 138, 1) !important;
    }
    .content .van-tree-select__item--active {
        color: rgba(0, 179, 138, 1) !important;
    }
</style>
<style scoped lang="scss">
    .title {
        margin-bottom: 20px;
    }

    .option {
        margin-bottom: 10px;
    }

    .custom-button {
        width: 26px;
        color: #fff;
        font-size: 10px;
        line-height: 18px;
        text-align: center;
        background-color: #ee0a24;
        border-radius: 100px;
    }

    .del-file{
        text-decoration: underline;
        color: #c32624;
        position: absolute;
        right: -55px;
        top:3px;
    }

    .form-textarea{
        .title{
            padding-left: .3rem;
            color: #555;
            margin:.3rem 0 0 0;
            font-size: 14px;
        }
        .form-disabled-textarea{
            width: 90%;
            margin: .2rem auto;
            height: 3rem;
            border: 1px solid #eee;
            border-radius: .1rem;
            padding: .1rem;
            color: #ccc;
            font-size: 14px;
            overflow-y: auto;
        }
    }
</style>
