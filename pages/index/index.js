import request from "../../utils/request.js"

Page({

  data: {
    // 轮播图数据
    banners: [],

    menus: [
      "../../images/cart_empty@2x.png",
      "../../images/cart_empty@2x.png",
      "../../images/cart_empty@2x.png",
      "../../images/cart_empty@2x.png",
    ]
  },
  
  onLoad(){

    // 请求轮播图数据
    request({
      url: "/api/public/v1/home/swiperdata"
    }).then(res => {
      const {message} = res.data;
      // 赋值给data
      this.setData({
        banners: message
      })
    });

    // 请求菜单数据
    request({
      url: "/api/public/v1/home/catitems"
    }).then(res => {
      const  {message} = res.data;

      // 赋值给data中menus
      this.setData({
        menus: message
      })
    })

  }

})
