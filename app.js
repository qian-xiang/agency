//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            
            }
          })
        }
      }
    });
  },
  //获取来源地址
  getRefererUrl: function () {
    var currentPagesArray = getCurrentPages();
    //层数
    var floor = currentPagesArray.length;
    //获取来源url  pages/agency/detail/detail
    if (currentPagesArray[floor - 2]==undefined){
      return null
    }else{
      var jsonStr = JSON.stringify(currentPagesArray[floor - 2]);
      if (jsonStr.indexOf('route') == -1) {
        return null
      } else {
        var refererUrl = currentPagesArray[floor - 2].route;
        return refererUrl;
      }
    } 
  },
  globalData: {
    userInfo: null,
    school: '',
    isLoad: false
  }

})