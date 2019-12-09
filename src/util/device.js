var ua = navigator.userAgent.toLowerCase()
var iPhone = ua.match(/iPhone/i) == "iphone"
var Wechat = ua.match(/MicroMessenger/i)=="micromessenger"
var mQQ = ua.match(/mqqbrowser/i)=="mqqbrowser"
var device = false
if(iPhone || Wechat || mQQ) {
  device = true
} else {
  device = false
}

export default device