Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.checkSession({
      success: function(res) {
        //登录状态未过期
        // 再检测uidIndex是否存在
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            //符合条件，开始向后台请求问题列表
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/getQuestionList',
              data: { requestType:'getQuestionList'} ,
              header: { 'Content-Type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function(res) {
                if (res.data.error!=null){
                  wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                  });
                }else{
                  page.setData({
                    questionArray: res.data.msg
                  });
                }
              },
              fail: function(res) {
                wx.showToast({
                  title: '网络异常：getQuestionList',
                  icon: 'none',
                  duration: 1500,
                  mask: true,
                });
              }
            })
          },
          fail: function(res) {
            wx.showToast({
              title: '检测到您尚未登录或者登录状态已过期，请重新登录',
              icon: 'none',
              duration: 1500,
              mask: true,
            });
          }
        });
      },
      fail: function(res) {
        wx.showToast({
          title: '检测到您尚未登录或者登录状态已过期，请重新登录',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})