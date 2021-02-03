import request from '@/utils/request'

// 查询证件信息列表
export function listCertificate(query) {
  return request({
    url: '/map/certificate/list',
    method: 'get',
    params: query
  })
}

// 查询预警证件信息列表
export function listWarning() {
  return request({
    url: '/map/certificate/warning',
    method: 'get'
  })
}


// 查询证件信息详细
export function getCertificate(id) {
  return request({
    url: '/map/certificate/' + id,
    method: 'get'
  })
}

// 新增证件信息
export function addCertificate(data) {
  return request({
    url: '/map/certificate',
    method: 'post',
    data: data
  })
}

// 修改证件信息
export function updateCertificate(data) {
  return request({
    url: '/map/certificate',
    method: 'put',
    data: data
  })
}

// 删除证件信息
export function delCertificate(id) {
  return request({
    url: '/map/certificate/' + id,
    method: 'delete'
  })
}

// 导出证件信息
export function exportCertificate(query) {
  return request({
    url: '/map/certificate/export',
    method: 'get',
    params: query
  })
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: '/map/certificate/importTemplate',
    method: 'get'
  })
}
