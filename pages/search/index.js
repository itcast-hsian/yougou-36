// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCancel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 监听输入框输入时候的事件
  handleInput( event ){
    // 输入框的值
    const {value} = event.detail;
    let showCancel;

    // 判断输入框有没值, value.trim()去除前后空格
    showCancel = value.trim() ? true : false

    this.setData({
      showCancel
    })
  }
})