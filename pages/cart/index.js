// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收货地址
    address: {},
    // 购物车商品列表
    goods: null
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
  },

  onShow(){
    // 每次打开页面时候都在本地获取购物车的数据
    const goods= wx.getStorageSync("goods") || null;

    this.setData({
      goods
    });
  },

  // 数量减1
  handleReduce(){

  },

  // 输入框输入数量
  handleInput(){

  },

  // 数量加1
  handleAdd(event) {
    const {id} = event.target.dataset;
    const {goods} = this.data;

    // 数量加一
    goods[id].number += 1;

    // 修改data的值
    this.setData({
      goods
    });

    // 保存到本地
    wx.setStorageSync("goods", goods);
  },
})