// require输入nodejs最早引入模块的标准commonjs
// var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

// es2015(es6)的标准使用import from
import QQMapWX from "../../common/qqmap-wx-jssdk.min.js"
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "23.1066805",
    longitude: "113.3245904",
    markers: [{
      iconPath: "../../images/icon_show_active@3x.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 20,
      height: 20
    }],
    // 搜索关键字
    keyword: "",
    // 根据关键字搜索回来的结果列表
    suggestion: [],
    // 输入的关键字
    backfill: "",
    backfill2: "",
    // 路线
    polyline: {},
    type: "start",
    start: "",
    end: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'XXDBZ-ANTC4-UINUN-XJCJM-5IV63-C3FMJ'
    });
  },
  onShow: function () {
    // 调用接口
    qqmapsdk.search({
      keyword: '酒店',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
    });
  },

  // 事件触发，调用接口
  nearby_search: function () {

    // 调用接口
    qqmapsdk.search({
      keyword: this.data.keyword,  //搜索关键词
      location: `${this.data.latitude},${this.data.longitude}`,  //设置周边搜索中心点
      success: (res) => { //搜索成功后的回调
        var mks = []

       

        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../images/icon_show_active@3x.png", //图标路径
            width: 20,
            height: 20
          })
        }

        console.log(mks)
        this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
        })
      },
    });
  },

  // 输入框input事件
  handleInput(event){
    const {value} = event.detail;

    // 把关键字赋值给data
    this.setData({
      keyword: value
    })
  },

  formSubmit(e) {
    var _this = this;

    console.log(_this.data.start, _this.data.end)

    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: _this.data.start, // 开始的坐标
      to: _this.data.end,    // 到达的坐标
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
    });
  },

  // 搜索回来的列表中选中触发
  backfill: function (e) {
    var id = e.currentTarget.id;
    // 循环判断点击选中是哪一个地址
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        this.setData({
          [this.data.type == 'start' ? 'backfill' : 'backfill2']: this.data.suggestion[i].title,
          // 确定地址后把数组列表清空 + 
          suggestion: []
        });

        console.log(this.data.type == 'start' ? this.data.backfill : this.data.backfill2)

        // 把地址backfill换坐标（重点）
        var _this = this;
        qqmapsdk.geocoder({
          //获取表单传入地址
          address: this.data.type == 'start' ? this.data.backfill : this.data.backfill2, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
          success: function (res) {//成功后的回调
            console.log(res, 345);
            var res = res.result;
            var latitude = res.location.lat;
            var longitude = res.location.lng;

            console.log(_this.data.type, latitude, longitude)

            //根据地址解析在地图上标记解析地址位置
            _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
              markers: [{
                id: 0,
                title: res.title,
                latitude: latitude,
                longitude: longitude,
                iconPath: "../../images/icon_show_active@3x.png",//图标路径
                width: 20,
                height: 20,
                callout: { //可根据需求是否展示经纬度
                  content: latitude + ',' + longitude,
                  color: '#000',
                  display: 'ALWAYS'
                }
              }],
              poi: { //根据自己data数据设置相应的地图中心坐标变量名称
                latitude: latitude,
                longitude: longitude
              },
              // 出发的坐标
              [_this.data.type == 'start' ? 'start' : 'end']: `${latitude},${longitude}`
            });
          },
        })
      }
    }
  },

  //触发关键词输入提示事件
  getsuggest: function (e) {

    const {type} = e.target.dataset;

    // 保存当前输入的哪个输入框,是起点还是终点
    this.setData({
      type
    })

    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) {//搜索成功后的回调
        console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
    });
  }
})