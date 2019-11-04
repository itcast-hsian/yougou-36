import request from "../../utils/request.js"

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

  // 发起支付
  handlePay(){
    const {allPrice, address, goods} = this.data;

    // 把goods对象的值合并成数组，并且给对象添加goods_number属性
    const newGoods = Object.keys(goods).map(v => {
      goods[v].goods_number = goods[v].number;
      return goods[v];
    })
    
    // 创建订单成功
    request({
      url: "/api/public/v1/my/orders/create",
      method: "POST",
      data: {
        order_price: allPrice,
        consignee_addr: address.detail,
        goods: newGoods
      },
      header: {
        Authorization: wx.getStorageSync('token')
      }
    }).then(res => {
       // 获取订单编号
      const {order_number} = res.data.message;
  
      // 请求支付的参数
      request({
        url: "/api/public/v1/my/orders/req_unifiedorder",
        method: "POST",
        data: {
          order_number
        },
        header: {
          Authorization: wx.getStorageSync('token')
        }
      }).then(res => {
        // pay是对象，对象里面包含了所有的支付参数
        const {pay} = res.data.message;
        // 发起支持，调用微信原生的支付窗口
        wx.requestPayment({
          ...pay,
          success: () => {
            // 把本地的goods列表中selected为true的商品删除掉
          }
        })
      })
    })
  }
})