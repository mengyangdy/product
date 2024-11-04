export const SlideType={
  HORIZONTAL:0,
  VERTICAL:1,
  VERTICAL_INFINITE:2
}

export const DefaultUser = {
  nickname: '',
  unique_id: '',
  certification: '',
  short_id: '',
  province: '',
  city: '',
  school: {},
  uid: '',
  signature: '', //签名
  mplatform_followers_count: '', //粉丝
  following_count: '', //关注
  total_favorited: '', //获赞
  follow_status: '', //1是已关注，0是未关注
  user_age: -1,
  gender: '', //1是男，0是女
  ip_location: '', //ip地址
  aweme_count: '', //视频数量
  //卡片
  card_entries: [
    {
      icon_dark: {
        url_list: []
      },
      icon_light: {
        url_list: []
      },
      sub_title: '',
      title: '',
      type: -1
    }
  ],
  cover_url: [
    {
      url_list: []
    }
  ],
  avatar_168x168: {
    url_list: []
  },
  avatar_300x300: {
    url_list: []
  }
}