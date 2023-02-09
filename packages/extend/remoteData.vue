<template>
    <el-form-item label="选项配置" v-if="dataLinkTypes.includes(data.type)"><br>
        <el-tabs v-model="data.dicOption" stretch @tab-click="handleTabClick">
            <el-tab-pane label="静态数据" name="static" v-if="staticDataTypes.includes(data.type)">
                <draggable tag="ul"
                           :list="data.dicData"
                           :group="{ name: 'dic' }"
                           ghost-class="ghost"
                           handle=".drag-item">
                    <li v-for="(item, index) in data.dicData"
                        :key="index">
                        <i class="drag-item el-icon-s-operation"
                           style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
                        <el-input style="margin-right: 5px;"
                                  size="mini"
                                  class="form-designer-static-item"
                                  v-model="item.label"
                                  @blur="selectBlur(item)"
                                  placeholder="label"></el-input>
                        <el-input size="mini" v-show="false"
                                  v-model="item.value"
                                  placeholder="value"></el-input>
                        <el-button @click="handleRemoveFields(index)" v-if="data.dicData.length > 1"
                                   circle
                                   plain
                                   type="danger"
                                   size="mini"
                                   icon="el-icon-minus"
                                   style="padding: 4px;margin-left: 5px;"></el-button>
                    </li>
                </draggable>
                <div style="margin-left: 22px;">
                    <el-button type="text"
                               @click="handleAddFields">添加列
                    </el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="远端数据" name="remote" v-if="false && staticDataTypes.includes(data.type)">
                网址
                <el-input v-model="data.dicUrl" placeholder="远端数据字典网址"></el-input>
                请求方法
                <el-select v-model="data.dicMethod" placeholder="请求方法" style="width: 100%;">
                    <el-option label="POST" value="post"></el-option>
                    <el-option label="GET" value="get"></el-option>
                </el-select>
                <p v-if="data.dicMethod == 'post'">
                    请求参数
                    <avue-dynamic v-model="data.dicQuery" :children="option"></avue-dynamic>
                </p>
            </el-tab-pane>
            <el-tab-pane label="关联表单" name="form" v-if="false && data.type === 'select'">
                <el-popover ref="tree-popover"
                            placement="bottom-start"
                            width="360"
                            trigger="click">
                    <el-input slot="reference" placeholder="选择表单" :readonly="true" v-model="data.treeText"/>

                    <el-input prefix-icon="el-icon-search"
                              v-model="searchTreeName"
                              placeholder="表单名称"
                              style="margin: 0 15px 10px 0;width:240px;"
                              @keyup.native.enter="getRemoteTreeData(true)"
                    >
                    </el-input>
                    <el-button icon="el-icon-search" size="small" type="primary" @click="getRemoteTreeData(true)">搜索</el-button>
                    <el-tree
                            style="height: 300px;overflow-y: auto"
                            :data="formList"
                            :props="defaultProps"
                            :default-expanded-keys="data.expendKeys"
                            accordion
                            @node-click="handleNodeClick">
                    </el-tree>
                </el-popover>
                <div style="text-decoration: underline;color:#409EFF;font-size:12px;cursor: pointer;text-align: center"
                     @click="clearDataLinkage">
                    清除关联表单
                </div>
            </el-tab-pane>
            <el-tab-pane label="数据联动" name="data" v-if="false && data.type !== 'checkbox' && data.type !== 'radio'">
                <div style="color: #555">
                    <el-row>
                        <el-col :span="24">联动表单</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-select
                                    filterable remote clearable
                                    :remote-method="remoteMethod"
                                    @clear="remoteMethod"
                                    @change="dataSelectChange"
                                    placeholder="选择表单"
                                    style="width: 100%"
                                    v-model="data.sourceFormId">
                                <el-option v-for="item in treeList" :key="item.id" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="24">数据联动</el-col>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="12">
                                <el-select style="width: 66%" v-model="data.sourceProp">
                                    <el-option v-if="item.prop !== data.prop && item.type !== 'text'"
                                               v-for="item in column"
                                               :key="item.prop"
                                               :value="item.prop"
                                               :label="item.label">
                                    </el-option>
                                </el-select> 值等于
                            </el-col>
                            <el-col :span="12">
                                <el-select style="width: 74%" v-model="data.sourceFieldId">
                                    <el-option v-for="item in fieldList"
                                               :key="item.id"
                                               :value="item.value"
                                               :label="item.label.replace(/^(.{23})(.*)$/,'$1...')">
                                    </el-option>
                                </el-select> 的值时
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-col :span="12">
                                <el-input v-model="data.label" disabled style="width: 66%"></el-input> 联动显示
                            </el-col>
                            <el-col :span="12">
                                <el-select style="width: 74%" v-model="data.targetFieldId">
                                    <el-option v-for="item in fieldList"
                                               :key="item.id"
                                               :value="item.value"
                                               :label="item.label.replace(/^(.{23})(.*)$/,'$1...')">
                                    </el-option>
                                </el-select> 的值
                            </el-col>
                        </el-col>
                    </el-row>
                    <div style="text-decoration: underline;color:#FF974C;font-size:12px;cursor: pointer;text-align: center"
                        @click="clearDataLinkage();getRemoteTreeData()">
                        清除数据联动
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-form-item>
</template>

<script>
    import axios from '../../public/js/request'
    import Const from "../../public/js/const";
    import Draggable from 'vuedraggable'

    export default {
        name: "remoteData",
        props: ['data','column','options'],
        components:{Draggable},
        data(){
            return{
                formList: [],
                treeList: [],
                fieldList:[],
                typeList:[
                    {value:'static',label:'静态数据'},
                    {value:'remote',label:'远端数据'},
                    {value:'form',label:'关联表单'},
                    {value:'data',label:'数据联动'}
                ],
                searchTreeName:'',
                staticDataTypes: ['select', 'checkbox', 'radio'],
                dataLinkTypes: ['select', 'checkbox', 'radio'],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                seq:4
            }
        },
        created() {
            /** 如果当前元素为下拉选择，并且是关联表单，初始化选中的key **/
            if(this.data.type == 'select' && this.data.dicOption == 'form' && !this.data.expendKeys){
                this.$set(this.data,'expendKeys',[])
            }
            if (this.data.type == 'select' && this.data.dicOption == 'data' && !this.data.treeText) {
                this.$set(this.data, 'treeText', '')
            }

            if(!this.data.dicOption){
                if(this.staticDataTypes.includes(this.data.type)){
                    /** 如果是下拉框、单选、多选组件,默认显示静态数据选项卡 **/
                    this.$set(this.data,'dicOption','static')
                }else{
                    /** 如果是输入框、多行文本、日期空间,默认显示数据联动选项卡 **/
                    this.$set(this.data,'dicOption','data')
                    this.getRemoteTreeData()
                }
            }else if(['form','data'].includes(this.data.dicOption)){
                this.getRemoteTreeData()
            }

            this.seq = this.data.dicData ? this.data.dicData.length + 1 : 4
        },
        methods:{
            remoteMethod(query) {
                this.resetFieldData()

                this.searchTreeName = query;
                this.getRemoteTreeData(true)
            },
            resetFieldData(){
                this.$set(this.data,'sourceFieldId','')
                this.$set(this.data,'targetFieldId','')
                this.fieldList = []
            },
            dataSelectChange(val){
                this.resetFieldData()

                this.resetFileds(val)

                this.data.targetFormId = val
            },
            resetFileds(val){
                let list = this.data.dicOption === 'form' ? this.formList : this.treeList
                list.forEach(form=>{
                    if(form.value === val){
                        this.fieldList = form.children
                        return
                    }
                })
            },
            handleNodeClick(data, node, href) {
                if (node.isLeaf) {//叶子结点
                    let treePopover = this.$refs['tree-popover'];
                    treePopover.doClose()

                    let list = this.data.dicOption === 'form' ? this.formList : this.treeList
                    let parent = list.filter(tree => tree.value === data.parent)[0]

                    this.$set(this.data, 'treeText', `${parent.label} / ${data.label}`)
                    this.$set(this.data,'expendKeys',[parent.value,data.value])
                }
            },
            selectBlur(item) {
                if (!item.label) {
                    let label = `选项${this.seq}`
                    item.label = label
                    item.value = label
                    this.seq += 1
                }else{
                    item.value = item.label
                }
            },
            generateRule() {
                const rules = [];
                Object.keys(this.validator).forEach(key => {
                    if (this.validator[key]) rules.push(this.validator[key])
                })
                this.data.rules = rules
            },
            handleRemoveFields(index) {
                this.data.dicData.splice(index, 1)
            },
            handleAddFields() {
                let label = `选项${this.seq}`
                this.seq += 1

                // let gen = ()=>{
                //     this.data.dicData.forEach(item=>{
                //         if(label === item.label){
                //             label = `选项${this.data.dicData.length + 2}`
                //         }
                //     })
                // }
                // gen()

                // let label = `选项_${Date.now()}`

                this.data.dicData.push({
                    label: label,
                    value: label
                })
            },
            handleTabClick({name}) {
                this.$set(this.data,'multiple',undefined)
                switch (name) {
                    case 'static':
                        this.clearDataLinkage()
                        break;
                    case 'remote':
                        this.clearDataLinkage()
                        !this.data.dicQuery && (this.data.dicQuery = [])
                        break;
                    case 'form':
                        this.clearDataLinkage()
                        //调用接口查询表单及字段数据，回显到下拉框中
                        this.getRemoteTreeData()
                        break;
                    case 'data':
                        this.searchTreeName = ''
                        delete this.data.expendKeys
                        this.getRemoteTreeData()
                        break;
                    default:break;
                }
            },
            /** 清除绑定的数据联动字段 **/
            clearDataLinkage(){
                delete this.data.sourceFormId
                delete this.data.sourceFieldId
                delete this.data.sourceProp
                delete this.data.targetFormId
                delete this.data.targetFieldId
                delete this.data.expendKeys
                delete this.data.treeText

                this.fieldList = []

                this.treeList = []
                this.searchTreeName = ''
                // this.$set(this.data,'treeText','')
            },
            getRemoteTreeData(formSearch = false){
                let params = {current:1,size:10,name:this.searchTreeName}
                if(this.data.expendKeys && this.data.expendKeys.length){
                    params.formId = this.data.expendKeys[0]
                }else if(this.data.sourceFormId){
                    params.formId = this.data.sourceFormId
                }

                if(formSearch){
                    params.size = this.searchTreeName ? 100000000 : 100
                }else{
                    params.size = 100
                }

                axios.post(`${this.options.baseURL||''}${Const.FORM_LIST_API}`,params).then(res=>{
                    let formList = res.data.records
                    let resultList = []
                    formList.forEach(item=>{
                        let children = []
                        let list = JSON.parse(item.json).column

                        list.forEach(child=>{
                            children.push({
                                value:child.id,
                                label:child.label,
                                parent:item.id
                            })
                        })

                        resultList.push({
                            value:item.id,
                            label:item.name,
                            children
                        })
                    })

                    if(this.data.dicOption === 'form'){
                        this.formList = resultList
                    }else{
                        this.treeList = resultList
                    }

                    if(params.formId){
                        /** 重新赋值字段列表 **/
                        this.resetFileds(params.formId)
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .el-row {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
</style>