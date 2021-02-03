/*
 * @Author: your name
 * @Date: 2020-08-23 09:00:10
 * @LastEditTime: 2020-11-10 21:12:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /show-admin-supervise/src/api/map/businessRound.js
 */
import request from '@/utils/request'

// 查询商圈列表
export function listBusinessRound(query) {
  return request({
    url: '/map/businessRound/list',
    method: 'get',
    params: query
  })
}
// 查询商圈树列表
export function listBusinessRoundtree(query) {
  return request({
    url: '/map/businessRound/county/get',
    method: 'get',
    params: query
  })
}

// 查询商圈详细
export function getBusinessRound(id) {
  return request({
    url: '/map/businessRound/' + id,
    method: 'get'
  })
}

// 新增商圈
export function addBusinessRound(data) {
  return request({
    url: '/map/businessRound',
    method: 'post',
    data: data
  })
}

// 修改商圈
export function updateBusinessRound(data) {
  return request({
    url: '/map/businessRound',
    method: 'put',
    data: data
  })
}

// 删除商圈
export function delBusinessRound(id) {
  return request({
    url: '/map/businessRound/' + id,
    method: 'delete'
  })
}

// 导出商圈
export function exportBusinessRound(query) {
  return request({
    url: '/map/businessRound/export',
    method: 'get',
    params: query
  })
}