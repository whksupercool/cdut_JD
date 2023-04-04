import request from '@/utils/request'

/**
 *  获取员工的简单列表
 **/
export function getEmployeeSimpleAPI() {
    return request({
        url: '/sys/user/simple'
    })
}

/**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeListAPI(params) {
    return request({
        url: '/sys/user',
        params
    })
}

/**
 * 删除员工接口
 * ****/
export function delEmployeeAPI(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete'
    })
}

/** **
 *  新增员工的接口
 * **/
export function addEmployeeAPI(data) {
    return request({
        method: 'post',
        url: '/sys/user',
        data
    })
}

/** *
 *  封装一个导入员工的接口 data是一个数组
 * ***/

export function importEmployeeAPI(data) {
    return request({
        url: '/sys/user/batch',
        method: 'post',
        data
    })
}

/** *
 * 保存员工的基本信息
 * **/
export function saveUserDetailByIdAPI(data) {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'put',
        data
    })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetailAPI(id) {
    return request({
        url: `/employees/${id}/personalInfo`
    })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonalAPI(data) {
    return request({
        url: `/employees/${data.userId}/personalInfo`,
        method: 'put',
        data
    })
}


/** **
 * 获取用户的岗位信息
 * ****/
export function getJobDetailAPI(id) {
    return request({
        url: `/employees/${id}/jobs`
    })
}


/**
 * 保存岗位信息
 * ****/
export function updateJobAPI(data) {
    return request({
        url: `/employees/${data.userId}/jobs`,
        method: 'put',
        data
    })
}