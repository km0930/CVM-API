import request from '@/utils/request';

export function connectionClients(data) {
  return request({
    url: '/connection-client',
    method: 'post',
    data
  })
}

export function connectionProviders(data) {
  return request({
    url: '/connection-provider',
    method: 'post',
    data
  })
}
