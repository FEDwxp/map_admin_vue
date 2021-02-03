import request from '@/utils/request'

// 查询商家字段权限列表
export function listMerchantField(query) {
  return request({
    url: '/map/merchantField/list',
    method: 'get',
    params: query
  })
}

// 查询商家字段权限详细
export function getMerchantField(id) {
  return request({
    url: '/map/merchantField/' + id,
    method: 'get'
  })
}

// 新增商家字段权限
export function addMerchantField(data) {
  return request({
    url: '/map/merchantField',
    method: 'post',
    data: data
  })
}

// 修改商家字段权限
export function updateMerchantField(data) {
  return request({
    url: '/map/merchantField',
    method: 'put',
    data: data
  })
}

// 删除商家字段权限
export function delMerchantField(id) {
  return request({
    url: '/map/merchantField/' + id,
    method: 'delete'
  })
}

// 导出商家字段权限
export function exportMerchantField(query) {
  return request({
    url: '/map/merchantField/export',
    method: 'get',
    params: query
  })
}