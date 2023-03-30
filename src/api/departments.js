import request from '@/utils/request'
/* 
*获取组织架构数据
*/
export function getDepartmentsAPI() {
    return request({
        url: '/company/department'
    })
}

/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
export function delDepartmentsAPI(id) {
    return request({
        method: 'delete',
        url: `/company/department/${id}`
    })
}

/**
 *  新增部门接口
 * ****/
export function addDepartmentsAPI(data) {
    return request({
        url: '/company/department',
        method: 'post',
        data
    })
}

/** *
 * 获取部门详情
 * ***/
export function getDepartDetailAPI(id) {
    return request({
        url: `/company/department/${id}`
    })
}

/**
 * 编辑部门
 * ***/
export function updateDepartmentsAPI(data) {
    return request({
        url: `/company/department/${data.id}`,
        method: 'put',
        data
    })
}