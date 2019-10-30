import request from "../../utils/request.js"

Page({

  data: {
    banners: [],

    menus: [
      "../../images/cart_empty@2x.png",
      "../../images/cart_empty@2x.png",
      "../../images/cart_empty@2x.png",
      "../../images/cart_empty@2x.png",
    ]
  },
  
  onLoad(){

    // 测试
    request({
      url: "/api/public/v1/home/swiperdata"
    }).then(res => {
      const {message} = res.data;
      // 赋值给data
      this.setData({
        banners: message
      })
    })
  }

})
