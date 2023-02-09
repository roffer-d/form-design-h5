<template>
    <div class="form-review mobile-box">
        <div class="ctx">
            <component :is="`review-${item.type}`"
                       :field="item"
                       v-for="(item,index) in fields"
                       :key="index"
                       :baseURL="baseURL||''"
                       @valueChange="valueChange"
                       :upload-option="uploadOption" />
        </div>
    </div>
</template>

<script>
    import backImg from './extend/review/images/back.png'
    import rightImg from './extend/review/images/right.png'
    import axios from "./extend/review/utils/request";
    import Const from "./extend/review/utils/const";

    export default {
        name: "mobileView",
        props: ['fields','uploadOption','baseURL'],
        data() {
            return {
                backImg, rightImg
            }
        },
        computed: {
            who() {
                return `config-${this.field.type}`
            }
        },
        watch:{
            fields(){
                this.isValidForm()
            }
        },
        created() {

        },
        methods: {
            back() {
                this.$emit('update:visible', false)
            },
            isValidForm() {
                let ret = {
                    valid: true,
                    validFields: []
                }

                this.fields.forEach(field => {
                    if (field.required && !field[field.prop]) {
                        ret.valid = false
                        ret.validFields.push(JSON.parse(JSON.stringify(field)))
                    }
                })

                this.$emit('update:validate',ret)

                return ret
            },
            setDataLinkage(columnIndex,data){
                let item = JSON.parse(JSON.stringify(this.fields[columnIndex]))

                if(['select'].includes(item.type)){
                    item.dicData = data ? data : []
                }else{
                    item[item.prop] = data ? data[0].value.replace(/\[|\]/g,'') : ''
                }

                this.$set(this.fields,columnIndex,item)

                /** 赋值了关联的字段后，继续调用方法，找到跟当前字段有数据联动的字段，循环赋值 **/
                this.valueChange(item)
            },
            valueChange(field) {
                let sourceFieldValue = field[field.prop]

                /** 数据联动 **/
                if (sourceFieldValue) {
                    this.fields.forEach((item,index)=>{
                        if(item.sourceProp == field.prop){
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
            }
        }
    }
</script>

<style lang="less">
    .form-design {
        .van-popup {
            background: #F7F9FB;
        }

        .form-review {
            .ctx {
                .content {
                    padding: 0;
                }
            }
        }
    }
</style>
<style>
    html, body {
        /*font-size: 62.5%;*/
        /*font-size: 50px;*/
        padding: 0;
        margin: 0;
    }
</style>
<style scoped lang="less">
    .form-review {
        .bar {
            height: .94rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
            position: fixed;
            top: 0;
            z-index: 1;
            width: 100%;

            img {
                width: .4rem;
                height: .4rem;
                margin-left: .3rem;
                vertical-align: middle;
            }

            span {
                font-size: .3rem;
                margin-left: .3rem;
                color: #434B65;
            }

            .back {
                flex: 1;
            }

            .title {
                flex: 11;
                text-align: center;
                font-size: .34rem;
                font-weight: 500;
                color: rgba(18, 27, 48, 1);
            }
        }

        .trip {
            margin: .3rem;

            span {
                color: #434B65;
                font-size: .3rem;
            }
        }

        .ctx {
            /*margin-top: .94rem;*/
            height: 52vh;
            overflow: auto;

            .form-box {
                background: #fff;
                padding: .3rem;
                font-size: .26rem;
                margin: .1rem 0;

                .title {
                    display: flex;
                    justify-content: space-between;

                    .require {
                        color: #ff5855;
                        margin-right: .1rem;
                    }

                    .icon {
                        margin-right: .1rem;
                    }

                    .label {
                        color: #434B65;
                    }

                    img {
                        width: .3rem;
                        height: .3rem;
                        vertical-align: sub;
                    }
                }

                .content {
                    padding-left: .4rem;
                    margin: .2rem 0;

                    .placeholder {
                        color: #A1A5B2;
                    }
                }
            }

            .form-item {
                background: #fff;
                padding: .3rem;

                &:first-child {
                    border-bottom: .01rem solid #EFF1F4;
                }

                .title {
                    color: #434B65;
                    font-size: .24rem;
                    font-weight: 400;
                }

                .content {
                    margin-top: .3rem;
                    width: 100%;
                    height: .5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    span {
                        color: #A8B1BB;
                    }

                    img {
                        width: .2rem;
                        height: .2rem;
                    }

                    input {
                        width: 100%;
                        height: 100%;
                        color: #555;
                        border: none;
                        outline: none;
                    }
                }
            }
        }
    }
</style>