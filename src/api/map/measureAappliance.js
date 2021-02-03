import request from '@/utils/request'

// 查询计量器具列表
export function listMeasureAappliance(query) {
  return request({
    url: '/map/measureAappliance/list',
    method: 'get',
    params: query
  })
}

// 查询计量器具详细
export function getMeasureAappliance(id) {
  return request({
    url: '/map/measureAappliance/' + id,
    method: 'get'
  })
}

// 新增计量器具
export function addMeasureAappliance(data) {
  return request({
    url: '/map/measureAappliance',
    method: 'post',
    data: data
  })
}

// 修改计量器具
export function updateMeasureAappliance(data) {
  return request({
    url: '/map/measureAappliance',
    method: 'put',
    data: data
  })
}

// 删除计量器具
export function delMeasureAappliance(id) {
  return request({
    url: '/map/measureAappliance/' + id,
    method: 'delete'
  })
}

// 导出计量器具
export function exportMeasureAappliance(query) {
  return request({
    url: '/map/measureAappliance/export',
    method: 'get',
    params: query
  })
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: '/map/measureAappliance/importTemplate',
    method: 'get'
  })
}
