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
    wx.hideLoading();
    var page = this;
    var app = getApp();
    if (app.getRefererUrl() !='pages/agency/MyRequired/MyRequired'){
      page.setData({
        showHelpButton:false
      })
    }else{
      page.setData({
        showHelpButton: true
      })
    }    
    wx.checkSession({
      success: function(res) {
        //登录状态未过期
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            var uidIndex = res.data;
            //从本地缓存获取头像和昵称
            wx.getStorage({
              key: 'userInfo',
              success: function(res) {
                // app.globalData.nickName = res.data.nickName;
                // app.globalData.headImage = res.data.headImage;
                page.setData({
                  uidIndex: uidIndex,
                  nickName:res.data.nickName,
                  headImage: res.data.headImage
                })
              },
              fail: function(res) {
                wx.showToast({
                  title: '头像和昵称不存在',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                })
              }
            })
            //帖子id
            var id = options.paperId;
            page.setData({
              paperId: id
            });
            //处理浏览量
            var paperId = page.data.paperId;
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/handleBrowseCount',
              data: { requestType: 'browseCount', paperId: paperId, uidIndex: res.data },
              header: { 'Content-Type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              // success: function(res) {},
              // fail: function(res) {},
              // complete: function(res) {},
            })
            
            //向后台请求详情数据
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/detail',
              data: { requireType: 'detail', id: id },
              header: { 'Content-Type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              success: function (res) {
                page.setData({
                  detailData: res.data
                });
              },
              fail: function (res) {
                wx.showToast({
                  title: '网络异常：detail',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                })
              },
            });
          },
          fail: function(res) {
            wx.showToast({
              title: '检测到您尚未登录或者登录状态过期，请重新登录。',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '检测到您尚未登录或者登录状态过期，请重新登录。',
          icon: 'none',
          duration: 2000,
          mask: true
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
  onShareAppMessage: function (event) {
    var page = this;
    var uidIndex = page.data.uidIndex;
    var paperId = page.data.paperId;
    var nickName = page.data.nickName;
    var headImage = page.data.headImage;
    var content = page.data.detailData[0].content;
    // console.log(event);
    // if(event.from=='button'){
      
    // }
    return {
      title: '我在浅香校园互助小程序求助，此刻需要你...(づ｡◕ᴗᴗ◕｡)づ',
      path: '/pages/agency/help/help?ownerUidIndex=' + uidIndex + '&paperId=' + paperId + '&nickName=' + nickName + '&headImage=' + headImage + '&content=' + content,
      imageUrl: '/pages/agency/images/share.jpg',
      success: function (event) {
        wx.showToast({
          title: '分享成功',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      },
      fail: function (event) {
        wx.showToast({
          title: '您取消了分享',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    }
  },
  
})