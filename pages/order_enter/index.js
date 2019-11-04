// pages/order_enter/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: wx.getStorageSync("address") || {},
    goods: wx.getStorageSync("goods") || {},
    // 总价格
    allPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handleAllPrice();
  },

  // 注意小程序没有computed属性，所以需要封装计算总价格的函数
  handleAllPrice() {
    const { goods } = this.data;
    let price = 0;

    // 开始计算, v就是key，也就是商品id
    Object.keys(goods).forEach(v => {
      // 当前商品必须是选中的
      if (goods[v].selected) {
        // 单价乘以数量
        price += (goods[v].goods_price * goods[v].number)
      }
    })

    this.setData({
      allPrice: price
    })
  },
})