import request from "../../utils/request.js"

// pages/goods_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    // 获取id
    const { goods_id } = options;

    // 请求商品详情
    request({
      url: "/api/public/v1/goods/detail",
      data: {
        goods_id
      }
    }).then(res => {
      const {message} = res.data;

      // detail是商品详情
      this.setData({
        detail: message
      })
    })
  }
})