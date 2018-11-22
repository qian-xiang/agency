Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRequired:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.checkSession({
      success: function(res) {
        //登录状态未过期
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            page.requiredRecord(res.data);
          },
          fail: function(res) {
            wx.showToast({
              title: '检测到您尚未登录或者登录状态过期，请重新登录。',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          },
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
  onShareAppMessage: function () {
    
  },
  //满足获取请求记录的条件，接下来向后台发送请求数据的条件
  requiredRecord: function (uidIndex) {
    var page = this;
    //向后台发送请求求助记录的请求
    wx.request({
      url: 'https://www.zbhqx.cn/api/campus_help/showRequiredRecord',
      data: { requireType: 'showRequiredRecord', uidIndex: uidIndex},
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.error != null) {
          wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 1500,
            mask: true,
          });
          return;
        }
        page.setData({showRequired: res.data.msg});
      },
      fail: function (res) {
        console.log('request请求失败：' + res.data);
        wx.showToast({
          title: '网络或服务器异常',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      },
    });

  },
  confirmFinish:function(event){
    //当前存储的记录数组索引
    var recordArrayIndex = event.currentTarget.dataset.recordIndex;
    //帖子标识
    var paperId = event.currentTarget.id;
    var showRequiredArray = this.data.showRequired;
    var page = this;
    //向后台请求更改帖子的状态为已结帖,需加个模态框让用户确认
    wx.showModal({
      title: '状态修改确认',
      content: '确认结帖之后将无法再次更改帖子状态，你确定要结帖么？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: function(res) {
        if (res.confirm){
          wx.request({
            url: 'https://www.zbhqx.cn/api/campus_help/confirmFinish',
            data: { paperId: paperId},
            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            success: function(res) {
              if(res.data.error!=null){
                wx.showToast({
                  title: res.data.error,
                  icon: 'none',
                  duration: 1500,
                  mask: true
                });
              }else{
                wx.showToast({
                  title: res.data.success,
                  icon: 'success',
                  duration: 1500,
                  mask: true
                });
                showRequiredArray[recordArrayIndex].status = '已结帖';
                page.setData({
                  showRequired: showRequiredArray
                });
              }
            },
            fail: function(res) {
              wx.showToast({
                title: '网络异常：confirmFinish',
                icon: 'none',
                duration: 1500,
                mask: true,
              })
            },
            // complete: function(res) {},
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '显示模态框失败',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      }
    })
  },
  //删除指定的求助记录
  deletePaper:function(event){
    var page = this;
    wx.showModal({
      title: '提示',
      content: '你真的要删除此条记录么？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '删除',
      confirmColor: '#3CC51F',
      success: function(res) {
        if (res.cancel){
          wx.showToast({
            title: '你取消了删除该记录的操作',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
          return ;
        }
        //用户确定要删除
        //当前存储的记录数组索引
        var recordArrayIndex = event.currentTarget.dataset.recordIndex;
        //帖子标识
        var paperId = event.currentTarget.id;
        var showRequiredArray = page.data.showRequired;
        //向后台请求删除数据库的指定求助记录，若记录有图片，还需把图片都删掉
        wx.request({
          url: 'https://www.zbhqx.cn/api/campus_help/deleteRequiredRecord',
          data: { paperId: paperId },
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          success: function (res) {
            if(res.statusCode!=200){
              wx.showToast({
                title: '网络或服务器异常：deleteRequiredRecord',
                icon: 'none',
                duration: 1500,
                mask: true,
              })
              return ;
            }
            
            //出现错误或者异常的话
            if (res.data.error != null) {
              wx.showToast({
                title: res.data.error,
                icon: 'none',
                duration: 1500,
                mask: true,
              });
            } else {
              wx.showToast({
                title: res.data.deleteRecord,
                icon: 'success',
                duration: 1500,
                mask: true,
              });

              //更新this.data中的数据
              showRequiredArray.splice(recordArrayIndex, 1);
              page.setData({
                showRequired: showRequiredArray
              });
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '网络异常：deleteRequiredRecord',
              icon: 'none',
              duration: 1500,
              mask: true
            });
          },
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '你取消了删除该记录的操作',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    })
    
  }
})