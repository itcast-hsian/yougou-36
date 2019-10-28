import request from "./utils/request.js"

//app.js
App({
  onLaunch: function () {
    
    // 指定基准路径
    request.defaults.baseURL = "https://api.zbztb.cn"
  },
  globalData: {
    
  }
})