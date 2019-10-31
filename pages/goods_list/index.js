// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options是页面的传参数，比如 {query: "曲面电视"}
    const {query} = options;

    this.setData({
      query
    });

    // 请求列表数据 123
    console.log(options)
  },

})