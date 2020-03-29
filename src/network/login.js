import {
  request
} from './request'

export function getLoginData(username, password) {
  return request({
    url: '/login',
    method: 'post',
    params: {
      username,
      password
    }
  })
}