import qs from 'qs'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// http: //aa.76ab.com/littleGame/

  // var uri = 'https://www.cicigirl.com/Admin/'
  // var uploadUri = "https://www.cicigirl.com/Admin/Game/add"
  // var modUri = "https://www.cicigirl.com/Admin/Game/update"
  // var classAddUri = "https://www.cicigirl.com/Admin/Class/add"
  // var classup = "https://www.cicigirl.com/Admin/Class/update"
  // var PinjieUrl = "https://www.cicigirl.com/";

  var uri = 'http://little.game.com/Admin/'
  var uploadUri = "http://little.game.com/Admin/Game/add"
  var modUri = "http://little.game.com/Admin/Game/update"
  var classAddUri = "http://little.game.com/Admin/Class/add"
  var classup = "http://little.game.com/Admin/Class/update"
  var PinjieUrl = "http://little.game.com/";

  // // var uri = 'http://www.cicigirl.com/Admin/'
  // var uri = 'http://little.game.com/Admin/'
  // // var uploadUri = "http://www.cicigirl.com/Admin/Game/add"
  // var uploadUri = "http://little.game.com/Admin/Game/add"
  // // var modUri = "http://www.cicigirl.com/Admin/Game/update"
  // var modUri = "http://little.game.com/Admin/Game/update"
  // // var classAddUri = "http://www.cicigirl.com/Admin/Class/add"
  // var classAddUri = "http://little.game.com/Admin/Class/add"
  // // var classup = "http://www.cicigirl.com/Admin/Class/update"
  // var classup = "http://little.game.com/Admin/Class/update"

export default uri

const Http = (params, data) => {
  let option = {
    method: params.method || 'get',
    url: params.url,
    baseURL: uri,
    params: data,
    data: qs.stringify(data),
    withCredentials: true
  }
  if(params.method === 'post') {
    delete option.params
  } else {
    delete option.data
  }
  return new Promise((resolve, reject) => {
    axios(option)
    .then(res => {
      resolve(res.data)

    })
    .catch(err => {
      reject(err)
    })
  })
}

// 分类管理
export const classIndex = params => {
  return Http({
    url: 'Class/index'
  })
}
// 添加分类
export const classAdd = classAddUri

// 删除分类
export const classDelete = params => {
  return Http({
    method: "post",
    url: 'Class/delete'
  }, params)
}
// 修改分类
export const classUpdate = classup

// 标签管理
export const labelIndex = params => {
  return Http({
    url: 'Label/index'
  })
}
// 删除标签
export const labelDelete = params => {
  return Http({
    method: "post",
    url: 'Label/delete'
  }, params)
}
// 添加标签
export const labelAdd = params => {
  return Http({
    method: "post",
    url: 'Label/add'
  }, params)
}
// 修改标签
export const labelUpdate = params => {
  return Http({
    method: "post",
    url: 'Label/update'
  }, params)
}

// 游戏管理
export const gameIndex = params => {
  return Http({
    url: 'Game/index'
  })
}
// 添加游戏

//待处理游戏管理
export const gamePending = params => {
  return Http({
    url: 'Game/handleIndex'
  },params)
}
//标记游戏
export const mark = (params) => {
  return Http({
    method: "post",
    url: 'Game/handleGame',
  },params)
}

//标记游戏原因
export const problemReason = (params) => {
  return Http({
    method: "post",
    url: 'Game/getTab',
  },params)
}
// 删除分类
export const gameDelete = params => {
  return Http({
    method: "post",
    url: 'Game/delete'
  }, params)
}
//登录
export const login = params => {
  return Http({
      method: "post",
      url: 'Login/login'
  }, params)
}
//修改密码
export const changeWord = params =>{
  return Http({
    method: "post",
    url: 'Index/pass'
  }, params)
}
// 判断登录
export const judgeLogin = params => {
  return Http({
    url: 'Login/judgeLogin'
  })
}
// 退出登录
export const loginOut = params => {
  return Http({
    url: 'Index/loginOut'
  })
}

//上传压缩包
export const uploadzip = params =>{
    return Http({
      method: "post",
      url: 'Game/uploadZip'
    }, params)
}

//判断名字是否重复
export const judgeName = params => {
  return Http({
    method: "post",
    url: 'Game/catName'
  }, params)
}
//监听聚焦事件
export const onfocus = (obj,fun)=>{
   obj.addEventListener('focus', fun)
}

//监听失焦事件
export const onblur = (obj, fun) => {
  obj.addEventListener('blur', fun)
}
//清除缓存
export const clear = params => {
  return Http({
    method: "post",
    url: 'Index/dbClear'
  }, params)
}


//------------------------游戏推荐------------------------------
// 游戏列表
export const gameRecommend = params => {
  return Http({
    url: 'Recommend/game_list'
  })
}
// // 修改游戏
// export const editgameRecommend = params => {
//   return Http({
//     url: 'Recommend/game_update'
//   })
// }
// 平台列表
export const platformRecommend = params => {
  return Http({
    url: 'Recommend/platform_list'
  })
}
// 添加平台
export const addplatform = params => {
  return Http({
    method: "post",
    url: 'Recommend/platform_add'
  }, params)
}
// 修改平台
export const editplatform = params => {
  return Http({
    method: "post",
    url: 'Recommend/platform_update'
  }, params)
}
//推荐游戏列表
export const recomRecommend = params => {
  return Http({
    url: 'Recommend/recommend_list'
  })
}

//添加推荐游戏
export const addrecomRecommend = params => {
  return Http({
    method:"post",
    url: 'Recommend/recommend_add'
  }, params)
}
//修改推荐游戏
export const editrecomRecommend = params => {
  return Http({
    method: "post",
    url: 'Recommend/recommend_update'
  }, params)
}
//删除推荐游戏
export const deleterecomRecommend = params => {
  return Http({
    method: "post",
    url: 'Recommend/recommend_delete'
  }, params)
}
export const gameImgurl = "https://cicigirl.833223.com/" //拼接
export const gameLabelupate = uri +"Label/update"  //修改游戏
export const gameLabeladd = uri+"Label/add"     //添加标签
export const zipuploadUrl = uri+"Game/uploadZip" //压缩上上传
export const yanzhengcode =uri+"Login/verify"  //获取验证码
export const gameUpload = uri
export const gameuploadUri = uploadUri
export const gameUpdate = modUri

export const recomGameadd = uri + "Recommend/game_add"; // 添加游戏
export const recomGameedit = uri + "Recommend/game_update"; // 修改游戏
export const uploadqrcodeurl = uri + "Recommend/upload_qrcode";
export const pinjieUrl = PinjieUrl;
// export const recomPlatformadd = uri + "Recommend/platform_add";
