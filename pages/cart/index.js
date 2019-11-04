import request from "../../utils/request.js"

// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收货地址
    address: {},
    // 购物车商品列表
    goods: null,
    // 总价格
    allPrice: 0,
    // 是否全选
    allSelected: true
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

    // 计算总价格
    this.handleAllPrice();
    // 判断全选状态
    this.handleAllSelected();
  },

  // 数量减1
  handleReduce(event){
    const { id } = event.target.dataset;
    let { goods } = this.data;

    // 判断数量是否小于1
    if (goods[id].number <= 1){
      wx.showModal({
        title: '提示',
        content: '是否要删除商品？',
        success:(res) => {
          if (res.confirm) {
            // 删除商品
            delete goods[id];
            // 由于showModal是异步执行，所以需要把修改data值的方式放到success中

            // 判断对象是否是一个空对象
            if(Object.keys(goods).length === 0){
              goods = null;
            }

            // 修改data的值
            this.setData({
              goods
            });
            // 保存到本地
            wx.setStorageSync("goods", goods);
            // 计算总价格
            this.handleAllPrice();
          }
        }
      })
    }else{
      // 数量减1
      goods[id].number -= 1;
      // 修改data的值
      this.setData({
        goods
      });

      // 保存到本地
      wx.setStorageSync("goods", goods);
      // 计算总价格
      this.handleAllPrice();
    }
  },

  // 装换是否有小数点
  bindInput(event){
    // 获取输入框的值
    const value = +event.detail.value;
    const { id } = event.target.dataset;
    const { goods } = this.data;

    // 判断是否有小数点
    goods[id].number = Math.floor(value);

    // 修改data的值
    this.setData({
      goods
    });
  },

  // 输入框输入数量
  bindChange(event){
    // 获取输入框的值
    const value = +event.detail.value;
    const { id } = event.target.dataset;
    const { goods } = this.data;

    // 如果是空的或者是0
    // if(value === 0){
    //   goods[id].number = 1;
    // }else{
    //   goods[id].number = value
    // }
    goods[id].number = value === 0 ? 1 : value;

    // 修改data的值
    this.setData({
      goods
    });
    // 保存到本地
    wx.setStorageSync("goods", goods);
    // 计算总价格
    this.handleAllPrice();
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
    // 计算总价格
    this.handleAllPrice();
  },

  // 选中状态取反
  handleSelected(event){
    const {id} = event.target.dataset;
    const {goods} = this.data;

    // 把选中状态取反
    goods[id].selected = !goods[id].selected;

    this.setData({
      goods
    });

    // 保存到本地
    wx.setStorageSync("goods", goods);
    // 计算总价格
    this.handleAllPrice();
    // 判断全选状态
    this.handleAllSelected();
  },

  // 注意小程序没有computed属性，所以需要封装计算总价格的函数
  handleAllPrice(){
    const {goods} = this.data;
    let price = 0;

    // 开始计算, v就是key，也就是商品id
    Object.keys(goods).forEach(v => {
      // 当前商品必须是选中的
      if (goods[v].selected){
        // 单价乘以数量
        price += (goods[v].goods_price * goods[v].number)
      }
    })

    this.setData({
      allPrice: price
    })
  },

  // 判断全选状态
  handleAllSelected(){
    const { goods } = this.data;
    let isSelect = true;

    // 判断是否有一个是没选中
    Object.keys(goods).forEach(v => {
      if(!goods[v].selected){
        isSelect = false;
      }
    })

    this.setData({
      allSelected: isSelect
    })
  },

  // 点击全选按钮的事件
  handleAllSelectedEvent(){
    const { goods, allSelected } = this.data;

    // 循环取反选中状态，取反是根据allSelected
    Object.keys(goods).forEach(v => {
      goods[v].selected = !allSelected
    })

    this.setData({
      goods,
      // 判断全选状态
      allSelected: !allSelected
    });
    // 保存到本地
    wx.setStorageSync("goods", goods);
    // 计算总价格
    this.handleAllPrice();
  },

  // 页面隐藏时候触发
  onHide(){
    // 页面离开时候统一保存到本，上面方法中wx.setStorageSync可以删除掉
    // wx.setStorageSync("goods", goods);
  },

  // 提交
  handleSubmit(){
    // 测试提交
    // const { allPrice, address, goods } = this.data;

    // // 提取对象的value合并成数组
    // const goodsArr = Object.keys(goods).map(v => {
    //   // 把数量赋值给goods_number，接口需要的
    //   goods[v].goods_number = goods[v].number
    //   return goods[v];
    // })

    // // 提交到订单
    // request({
    //   url: "/api/public/v1/my/orders/create",
    //   method: "POST",
    //   data: {
    //     order_price: allPrice,
    //     consignee_addr: address.detail, // 一般情况地址是个对象，而不是一个字符串，接口问题
    //     goods: goodsArr
    //   }
    // }).then(res => {
    //   console.log(res)
    // })

    // 判断本地是否有token，有token就跳转到订单支付页，没有跳转到登录页
    if(wx.getStorageSync("token")){
      wx.navigateTo({
        url: '/pages/order_enter/index',
      })
    }else{
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    }
  }
})