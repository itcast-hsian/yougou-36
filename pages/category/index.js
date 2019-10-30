import request from "../../utils/request.js"

// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前选中的索引
    current: 0,
    // 分类列表
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求分类页数据
    request({
      url: "/api/public/v1/categories"
    }).then(res => {
      // 保存数据到data
      const {message} = res.data;
      this.setData({
        list: message
      })
    })
  },

  // 点击左侧的菜单时候触发
  handleChange(event){
    // 获取index
    const {index} = event.target.dataset;

    this.setData({
      current: index
    })
  }
})