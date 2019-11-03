// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收货地址
    address: {},
  },

  // 获取收货地址
  handleAddress(){
    wx.chooseAddress({
      // 成功的方法
      success: (res) => {
        // 设置收货地址
        this.setData({
          address: {
            userName: res.userName,
            telNumber: res.telNumber,
            detail: res.provinceName + res.cityName + res.countyName + res.detailInfo
          }
        })
      }
    })
  }
})