
// request = axios这样运行

// 1.基础功能
// request({
//   url: "xxx"
// }).then(res => {

// }).catch(res => {

// })

// 2.指定基准路径
// request.defaults.baseURL = "xxx"

// 3.拦截器
// request.onError(res => {
  // 根据res拦截错误
// })


/**
 * @desc
 * @param 请求对象 | Object
 * @return Promise对象
 */
const request = (config) => {

  // 判断config是否是一个对象,两种方法都可以使用
  // if (!config || typeof config !== "object" && Array.isArray(config)) {
  if ( !(config && typeof config === "object" && !Array.isArray(config)) ){
    console.error("参数不是对象 ！");
    return;
  }

  // 参数中必须包含url
  if(!config.url){
    console.error("URL不能为空 ！");
    return;
  }

  // 判断url前面是否带有http，如果有不加上基准路径，反之就加上
  const reg = /^http/

  // 不是http开头的
  if ( !reg.test(config.url) ){
    config.url = request.defaults.baseURL + config.url;
  }

  // 返回promise
  return new Promise((resolve, reject) => {
    // wx.request发起请求
    wx.request({
      ...config,
      success(res){
        // 请求成功之后执行resolve，并且返回成功的结果
        resolve(res)
      },
      fail(res){
        // 请求失败执行catch函数
        reject(res);
      },
      complete(res){
        // 执行错误的拦截器
        if(typeof request.errors === 'function'){
          request.errors(res)
        }
      }
    })
  })
}

// 指定request默认配置
request.defaults = {
  baseURL: "" // "https://api.github.com"
};

// 用来缓存拦截器的函数
request.errors = null;

// request拦截函数
request.onError = ( callback ) => {
  request.errors = callback;
}

export default request;