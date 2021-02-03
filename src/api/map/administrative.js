/*
 * @Author: 王新鹏
 * @Date: 2020-10-12 20:56:50
 * @LastEditTime: 2020-10-12 20:59:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /show-admin-supervise/src/api/map/administrative.js
 */
import request from '@/utils/request'

// 获取行政区划整体json
export function administrativeJson(query) {
  return request({
    url: '/map/district/all',
    method: 'get',
    params: query
  })
}

// 查询商标注册详细
export function getBrandRegister(id) {
  return request({
    url: '/map/brandRegister/' + id,
    method: 'get'
  })
}

// 新增商标注册
export function addBrandRegister(data) {
  return request({
    url: '/map/brandRegister',
    method: 'post',
    data: data
  })
}

// 修改商标注册
export function updateBrandRegister(data) {
  return request({
    url: '/map/brandRegister',
    method: 'put',
    data: data
  })
}

// 删除商标注册
export function delBrandRegister(id) {
  return request({
    url: '/map/brandRegister/' + id,
    method: 'delete'
  })
}

// 导出商标注册
export function exportBrandRegister(query) {
  return request({
    url: '/map/brandRegister/export',
    method: 'get',
    params: query
  })
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: '/map/brandRegister/importTemplate',
    method: 'get'
  })
}