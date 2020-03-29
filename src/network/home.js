import {
  request
} from './request'

//获取菜单列表数据
export function getHomeData() {
  return request({
    url: '/menus',
    method: 'get'
  })
}