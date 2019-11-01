// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示取消按钮
    showCancel: false,
    // 输入框的值
    searchValue: "",
    // 搜素历史列表
    keywords: wx.getStorageSync("search") || []
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
      showCancel,
      // 输入框的值
      searchValue: value
    })
  },

  // 点击取消按钮时候触发
  handleCancel(){

    this.setData({
      showCancel: false,
      searchValue: ""
    })
  },

  // 点击键盘右下角确定按钮时候触发
  handlleConfirm(){
    // 先从本地存储拿出来数组，没有的等于空的数组
    const arr = wx.getStorageSync('search') || [];

    // 判断本地是否有数据，有的话就追加unshift
    arr.unshift(this.data.searchValue);

    // 保存到本地
    wx.setStorageSync('search', arr);

    // 跳转到搜索列表页
    // wx.navigateTo({
    //   url: "/pages/goods_list/index?query=" + this.data.searchValue
    // })
  }
})