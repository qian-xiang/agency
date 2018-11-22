Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      recommend: options.recommend,
      assist: options.assist
    })
    //获取当前页面层
    // console.log(getCurrentPages());
    // console.log(getCurrentPages().pop());
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
    
  },
  recommend:function(){
    //页面主操作
    var recommend = this.data.recommend;
    switch (recommend){
        case '返回主页':
            wx.switchTab({
              url: '/pages/agency/index/index',
              success: function(res) {
                //刷新主页数据
                // var page = getCurrentPages().pop();
                // if(page==undefined ||page==null) return ;
                // page.onShow();
              },
              fail: function (res) {
                wx.showToast({
                  title: '进入小程序失败',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                })
              },
              complete: function (res) {
                wx.showLoading({
                  title: '正在前往...',
                  mask: true,
                  // success: function(res) {},
                  fail: function (res) {
                    wx.showToast({
                      title: '显示正在前往失败',
                      icon: 'none',
                      duration: 1500,
                      mask: true
                    })
                  },
                  complete: function (res) {
                    setTimeout(function () {
                      wx.hideLoading();
                        }, 1500);
                      },
                    })
                  },
                });
              break;
        case '返回个人中心':
            wx.switchTab({
              url: '/pages/agency/owner/owner',
              // success: function(res) {},
              fail: function (res) {
                wx.showToast({
                  title: '进入小程序失败',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                })
              },
              complete: function (res) {
                wx.showLoading({
                  title: '正在前往...',
                  mask: true,
                  // success: function(res) {},
                  fail: function (res) {
                    wx.showToast({
                      title: '显示正在前往失败',
                      icon: 'none',
                      duration: 1500,
                      mask: true
                    })
                  },
                  complete: function (res) {
                    setTimeout(function () {
                      wx.hideLoading();
                    }, 1500);
                  },
                })
              },
            });
            break;
        default:
          break;
              
      }
  },
  assist:function(){
    //页面辅助操作
    var assist = this.data.assist;
    switch (assist){
        case '返回上一页':
            wx.switchTab({
              url: '/pages/agency/publish/publish',
              // success: function(res) {},
              fail: function (res) {
                wx.showToast({
                  title: '进入小程序失败',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                })
              },
              complete: function (res) {
                wx.showLoading({
                  title: '正在前往...',
                  mask: true,
                  // success: function(res) {},
                  fail: function (res) {
                    wx.showToast({
                      title: '显示正在前往失败',
                      icon: 'none',
                      duration: 1500,
                      mask: true
                    })
                  },
                  complete: function (res) {
                    setTimeout(function () {
                      wx.hideLoading();
                    }, 1500);
                  },
                })
              },
            });
            break;
        case '返回个人中心':
            wx.switchTab({
              url: '/pages/agency/owner/owner',
              // success: function(res) {},
              fail: function (res) {
                wx.showToast({
                  title: '进入小程序失败',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                })
              },
              complete: function (res) {
                wx.showLoading({
                  title: '正在前往...',
                  mask: true,
                  // success: function(res) {},
                  fail: function (res) {
                    wx.showToast({
                      title: '显示正在前往失败',
                      icon: 'none',
                      duration: 1500,
                      mask: true
                    })
                  },
                  complete: function (res) {
                    setTimeout(function () {
                      wx.hideLoading();
                    }, 1500);
                  },
                })
              },
            });
            break;
        case '返回发帖页面':
          wx.switchTab({
            url: '/pages/agency/publish/publish',
            success: function (res) {
              //刷新数据
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
                page.onShow();
            },
            fail: function (res) {
              wx.showToast({
                title: '进入小程序失败',
                icon: 'none',
                duration: 1500,
                mask: true
              })
            },
            complete: function (res) {
              wx.showLoading({
                title: '正在前往...',
                mask: true,
                // success: function(res) {},
                fail: function (res) {
                  wx.showToast({
                    title: '显示正在前往失败',
                    icon: 'none',
                    duration: 1500,
                    mask: true
                  })
                },
                complete: function (res) {
                  setTimeout(function () {
                    wx.hideLoading();
                  }, 1500);
                },
              })
            },
          });
          break;
        default:
          break;    
    }
  }
})