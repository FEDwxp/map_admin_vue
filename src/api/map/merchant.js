/*
 * @Author: your name
 * @Date: 2020-08-23 09:00:10
 * @LastEditTime: 2020-09-14 13:40:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /show-admin-supervise/src/api/map/merchant.js
 */
import request from '@/utils/request'

// 查询商家信息列表
export function listMerchant(query) {
  return request({
    url: '/map/merchant/list',
    method: 'get',
    params: query
  })
}

// 查询商家信息详细
export function getMerchant(id) {
  return request({
    url: '/map/merchant/' + id,
    method: 'get'
  })
}

// 新增商家信息
export function addMerchant(data) {
  return request({
    url: '/map/merchant',
    method: 'post',
    data: data
  })
}

// 修改商家信息
export function updateMerchant(data) {
  return request({
    url: '/map/merchant',
    method: 'put',
    data: data
  })
}

// 删除商家信息
export function delMerchant(id) {
  return request({
    url: '/map/merchant/' + id,
    method: 'delete'
  })
}

// 导出商家信息
export function exportMerchant(query) {
  return request({
    url: '/map/merchant/export',
    method: 'get',
    params: query
  })
}

// 下载导入模板
export function merchantimportTemplate() {
  return request({
    url: 'map/merchant/importTemplate',
    method: 'get'
  })
}

// 下载经纬度导入模板
export function merchantimportLongitudeTemplate() {
  return request({
    url: 'map/merchant/importLongitudeTemplate',
    method: 'get'
  })
}

// 下载导入模板
export function disCode(code) {
  return request({
    url: 'map/district/code/' + code,
    method: 'get'
  })
}