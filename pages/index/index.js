import request from "../../utils/request.js"

Page({

  data: {
    banners: [
      "https://cdn.pinduoduo.com/home/static/img/subject/girlclothes.jpg",
      "https://cdn.pinduoduo.com/home/static/img/subject/boyshirt.jpg",
      "https://cdn.pinduoduo.com/home/static/img/subject/medical.jpg"
    ],

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
      console.log(res)
    })
  }

})
