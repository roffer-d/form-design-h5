<template>
    <div>
        <el-input v-if="data.type=='input' || data.type == 'password'" @blur="valueChange()" v-model="data[data.prop]"
                  :type="data.type" :maxlength="data.maxlength" :placeholder="`请输入${data.label}`" size="small"></el-input>

        <el-input v-else-if="data.type=='textarea'" @blur="valueChange()" type="textarea" v-model="data[data.prop]"
                  :maxlength="data.maxlength" :placeholder="`请输入${data.label}`" size="small"></el-input>

        <el-radio-group v-else-if="data.type=='radio'" @change="valueChange()" v-model="data[data.prop]">
            <el-radio v-for="(item,index) in data.dicData" :key="index" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>

        <el-checkbox-group v-else-if="data.type=='checkbox'" @change="valueChange()" v-model="data[data.prop]">
            <el-checkbox v-for="(item,index) in data.dicData" :key="index" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>

        <el-select v-else-if="data.type=='select'" @change="valueChange()" v-model="data[data.prop]"
                   :multiple="data.multiple"
                   :placeholder="`请选择${data.label}`" @focus="getSelectData">
            <el-option
                    v-for="item in data.dicData"
                    :key="item.value"
                    :label="item.label.replace(/^(.{23})(.*)$/,'$1...')"
                    :value="item.value">
            </el-option>
        </el-select>

        <el-upload
                v-else-if="data.type=='upload'"
                class="upload-demo"
                :action="data.action"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :before-upload="beforeUpload"
                :multiple="data.multiple"
                :limit="data.limit"
                :name="data.propsHttp.fileName"
                :on-exceed="handleExceed"
                :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>

        <el-date-picker
                v-else-if="data.type=='date' || data.type == 'datetime'"
                @change="valueChange()"
                v-model="data[data.prop]"
                :type="data.type"
                :placeholder="`请选择${data.label}`">
        </el-date-picker>

        <avue-map v-else-if="data.type=='map'" v-model="data[data.prop]"></avue-map>

        <template v-else-if="data.type=='realMap'">
            <div @click="openRealMap" class="location">点击获取位置</div>
            <mobile-map v-if="showRealMap==true" :ak="mapAk" @success="getLocationSuccess"
                        @failed="getLocationFailed"></mobile-map>
        </template>
    </div>
</template>

<script>
    import MobileMap from "./mobileRealMap";
    import MobileRealMap from "./extend/realMap";
    import Const from '../public/js/const';
    import axios from '../public/js/request'

    export default {
        name: "pcViewItem",
        components: {MobileRealMap, MobileMap},
        props: ['data', 'column','baseURL'],
        data() {
            return {
                mapAk: Const.mapAk,
                showRealMap: false,
                fileList: [],
                loadedSelect: {}//标记已加载过的下拉框数据
            }
        },
        created() {
            switch (this.data.type) {
                case 'checkbox':
                    this.$set(this.data, this.data.prop, [])
                    break;
                case 'select':
                    this.getSelectData()
                    break;
                case 'upload':
                    this.$set(this.data, 'propsHttp', {fileName: 'file'})
                    this.$set(this.data, 'action', Const.uploadPath)
                    break;
                default:
                    this.$set(this.data, this.data.prop, '')
                    break;
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
                                axios.post(`${this.baseURL}${Const.REMOTE_FORM_DATA_API}`, params).then(res => {
                                    /** 设置关联的字段值 **/
                                    this.setDataLinkage(index,res.data)
                                })
                            }
                        }
                    })
                }
            },
            getSelectData() {
                this.data.multiple && this.$set(this.data, this.data.prop, [])

                if (this.data.dicOption == 'remote') {
                    let params = {}
                    if (this.data.dicMethod === 'post' && this.data.dicQuery) {
                        params = this.data.dicQuery
                    }
                    axios[this.data.dicMethod](this.data.dicUrl, params).then(res => {
                        this.$set(this.data, 'dicData', res.data.data)
                    })
                } else if (this.data.dicOption == 'form') {
                    let value = this.data.expendKeys
                    if (value.length) {
                        let params = {formId: value[0], fieldId: value[1]}
                        axios.post(`${this.baseURL}${Const.FORM_FIELDS_API}`, params).then(res => {
                            this.$set(this.data, 'dicData', res.data)
                        })
                    }
                }
            },
            getLocationSuccess(data) {
                console.log(data)
                this.showRealMap = false;
            },
            getLocationFailed(error) {
                this.$message.info(error);
                this.showRealMap = false;
            },
            openRealMap() {
                this.$message.info('实时位置获取中，请稍后...');
                this.showRealMap = true
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 ${data.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            beforeUpload(file) {

            }
        }
    }
</script>

<style scoped>
    .location {
        cursor: pointer;
    }
</style>