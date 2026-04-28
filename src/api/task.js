import request from '@/utils/request'

const REAL_API_BASE = 'http://localhost:3000/task'

export function getList(data) {
  return request({
    url: `${REAL_API_BASE}/getList`,
    method: 'get',
    params: data,
  })
}

export function doAdd(data) {
  return request({
    url: `${REAL_API_BASE}/doAdd`,
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: `${REAL_API_BASE}/doEdit`,
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: `${REAL_API_BASE}/doDelete`,
    method: 'post',
    data,
  })
}
