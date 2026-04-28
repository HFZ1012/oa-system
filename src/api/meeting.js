import request from '@/utils/request'

const REAL_API_BASE = 'http://localhost:3000'

export function getMeetingList(data) {
  return request({
    url: `${REAL_API_BASE}/meeting/getList`,
    method: 'post',
    data,
  })
}

export function doMeetingAdd(data) {
  return request({
    url: `${REAL_API_BASE}/meeting/doAdd`,
    method: 'post',
    data,
  })
}

export function updateMeetingStatus(data) {
  return request({
    url: `${REAL_API_BASE}/meeting/updateStatus`,
    method: 'post',
    data,
  })
}

export function doMeetingDelete(data) {
  return request({
    url: `${REAL_API_BASE}/meeting/doDelete`,
    method: 'post',
    data,
  })
}
