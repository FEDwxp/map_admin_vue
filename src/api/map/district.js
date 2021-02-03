/*
 * @Author: your name
 * @Date: 2020-08-23 09:00:10
 * @LastEditTime: 2020-08-23 09:01:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /show-admin-supervise/src/api/map/district.js
 */
import request from '@/utils/request'

// 查询行政区划列表
export function listDistrict(query) {
  return request({
    url: '/map/district/list',
    method: 'get',
    params: query
  })
}

// 获取行政区划整体json
export function allDistrict() {
  return request({
    url: '/map/district/all',
    method: 'get'
  })
}

// 查询行政区划详细
export function getDistrict(id) {
  return request({
    url: '/map/district/' + id,
    method: 'get'
  })
}

// 新增行政区划
export function addDistrict(data) {
  return request({
    url: '/map/district',
    method: 'post',
    data: data
  })
}

// 修改行政区划
export function updateDistrict(data) {
  return request({
    url: '/map/district',
    method: 'put',
    data: data
  })
}

// 删除行政区划
export function delDistrict(id) {
  return request({
    url: '/map/district/' + id,
    method: 'delete'
  })
}

// 导出行政区划
export function exportDistrict(query) {
  return request({
    url: '/map/district/export',
    method: 'get',
    params: query
  })
}