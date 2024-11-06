import MockAdapter from 'axios-mock-adapter'

import { axiosInstance } from '@/utils/request.ts'

import posts6 from './data/posts6.json'

const mock = new MockAdapter(axiosInstance)

const allRecommendPosts = []
const userVideos = []
const allRecommendVideos = posts6.map(v => {
  v.type = 'recommend-video'
  return v
})

export async function startMock() {
  mock.onGet(/video\/recommended/).reply(async config => {
    const { start, pageSize } = config.params
    return [
      200,
      {
        data: {
          total: 844,
          list: allRecommendVideos.slice(start, start + pageSize)
        },
        code: 200,
        msg: '请求成功'
      }
    ]
  })
}
