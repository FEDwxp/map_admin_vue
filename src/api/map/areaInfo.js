import request from '@/utils/request'

// 查询区域划分信息列表
export function listAreaInfo(query) {
  return request({
    url: '/map/areaInfo/list',
    method: 'get',
    params: query
  })
}

// 查询区域划分信息详细
export function getAreaInfo(id) {
  return request({
    url: '/map/areaInfo/' + id,
    method: 'get'
  })
}

// 新增区域划分信息
export function addAreaInfo(data) {
  return request({
    url: '/map/areaInfo',
    method: 'post',
    data: data
  })
}

// 修改区域划分信息
export function updateAreaInfo(data) {
  return request({
    url: '/map/areaInfo',
    method: 'put',
    data: data
  })
}

// 删除区域划分信息
export function delAreaInfo(id) {
  return request({
    url: '/map/areaInfo/' + id,
    method: 'delete'
  })
}

// 导出区域划分信息
export function exportAreaInfo(query) {
  return request({
    url: '/map/areaInfo/export',
    method: 'get',
    params: query
  })
}