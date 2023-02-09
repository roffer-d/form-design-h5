export default {
    // downloadUrl: `http://10.206.20.48:18000/app/mongodb/download/`,
    uploadPath: '/mongodb/uploadFiles/',
    mapAk: 'O7ssyxgSXGFfQxCHsVmlvhTuKoNKptyI',

    FORM_LIST_API: '/form/formLinkage/findFormList',//查询表单列表
    FORM_FIELDS_API: '/form/formLinkage/getFormDataValueByFormIdAndFieldId',//查询关联的表单字段数据
    REMOTE_DATA_API: '/form/formLinkage/remote/getDictListByType',//远端接口获取数据
    REMOTE_FORM_DATA_API: '/form/formLinkage/getFormDataValueBySourceFormIdAndSourceFieldId',//根据来源表单id和来源字段id和来源值获取联动表单数据
}