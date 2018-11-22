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
    var page = this;
    //应考虑用wx.checkSession（）验证用户登录状态是否过期（也可验证用户是否已登录）
    wx.checkSession({
      success: function(res) {
        //用户登录状态可用
       
        wx.getStorage({
          key: 'uidIndex',
          success: function (res) {
            page.requiredOwnerLove(res.data);
          },
          fail: function (res) {
            //提示用户登录
            wx.showToast({
              title: '检测到您尚未登录或者登录状态过期，请重新登录。',
              icon: 'none',
              duration: 2000,
              mask: true
            });
          },
          // complete: function(res) {},
        });
      },
      fail: function(res) {
        //提示用户登录
        wx.showToast({
          title: '检测到您尚未登录或者登录状态过期，请重新登录。',
          icon: 'none',
          duration: 2000,
          mask: true
        });
      }
    });
      
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
  requiredOwnerLove:function(uidIndex){
    var page = this;
      wx.request({
        url: 'https://www.zbhqx.cn/api/campus_help/ownerLove',
        data: {uidIndex: uidIndex},
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if (res.data.error!=null){
            wx.showToast({
              title: res.data.error,
              icon: 'none',
              duration: 1500,
              mask: true
            });
            return ;
          }
          page.setData({
            ownerLove: res.data.msg
          })
        },
        fail: function(res) {
          wx.showToast({
            title: '网络异常：ownerLove',
            icon: 'none',
            duration: 1500,
            mask: true
          });
          
        }
      });
  },
  deleteMyLove:function(event){
    var arrayIndex = event.currentTarget.dataset.recordIndex;
    var ownerLove = this.data.ownerLove;
    var page = this;
    wx.getStorage({
      key: 'uidIndex',
      success: function(res) {
        var paperId = event.currentTarget.id;
        wx.request({
          url: 'https://www.zbhqx.cn/api/campus_help/deleteMyLove',
          data: { uidIndex: res.data, paperId: paperId },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            if (res.data.error != null) {
              wx.showToast({
                title: res.data.error,
                icon: 'none',
                duration: 1500,
                mask: true
              });
              return;
            }
            //取消喜欢成功
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1500,
              mask: true
            });
            ownerLove.splice(arrayIndex,1);
            page.setData({
              ownerLove: ownerLove
            });
          },
          fail: function (res) {
            wx.showToast({
              title: '网络异常：deleteMyLove',
              icon: 'none',
              duration: 1500,
              mask: true
            });
          }
        });
      },
      fail: function(res) {
        wx.showToast({
          title: '您尚未登录或者登录状态过期，请重新登录',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    });
  }
})