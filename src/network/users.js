import {
  request
} from './request'

export function getUsersData(query) {
  return request({
    url: '/users',
    params: query
  })
}

//发送用户修改状态
export function getStatusChange(url) {
  return request({
    url: url,
    method: 'put',
  })
}

//添加用户
export function addUsers(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

//根据用户id查询
export function editUserId(url) {
  return request({
    url: url,
    method: 'get',
  })
}

//根据用户ID 修改
export function editByUserId(url, email, mobile) {
  return request({
    url: url,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}
//根据用户id 删除
export function removeUerById(url) {
  return request({
    url: url,
    method: 'delete'
  })

}