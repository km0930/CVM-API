import request from '@/utils/request';

export function reportCountries(data) {
  return request({
    url: '/report-countries',
    method: 'post',
    data
  })
}

export function reportProviders(data) {
  return request({
    url: '/report-providers',
    method: 'post',
    data
  })
}

export function reportCustomers(data) {
  return request({
    url: '/report-customers',
    method: 'post',
    data
  })
}

export function reportMccmncs(data) {
  return request({
    url: '/report-mccmnc',
    method: 'post',
    data
  })
}

export function reportSenders(data) {
  return request({
    url: '/report-senders',
    method: 'post',
    data
  })
}
