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
    console.log(options);
    var ownerUidIndex = options.ownerUidIndex;
    var paperId = options.paperId;
    var ownerNickName = options.nickName;
    var ownerHeadImage = options.headImage;
    var content = options.content;
    var page = this;
    var app = getApp();
    // console.log(app.getRefererUrl());
    if (app.getRefererUrl() != 'pages/agency/detail/detail' || app.getRefererUrl()==null){
      page.setData({
        appearYouButton:false,
        appearYouText: false,
        paperId: paperId,
        ownerNickName: ownerNickName,
        ownerHeadImage: ownerHeadImage,
        content: content,
        ownerUidIndex: ownerUidIndex
      })
    }{
      page.setData({
        appearYouButton: true,
        appearYouText: true,
        paperId: paperId,
        ownerNickName: ownerNickName,
        ownerHeadImage: ownerHeadImage,
        content: content,
        ownerUidIndex: ownerUidIndex
      })
    }
    //后台获取帖子的助力数据
    wx.request({
      url: 'https://www.zbhqx.cn/api/campus_help/getHelpData',
      data: options,
      header: {'Content-Type':'application/x-www-form-urlencoded'},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode!=200){
          return wx.showToast({
            title: '网络异常：' + res.statusCode,
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }
        if (res.data.error != null){
          return wx.showToast({
            title: '网络异常：' + res.data.error,
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }
        page.setData({
          count: res.data.count
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '网络异常：getHelpData',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    });

    //判断用户是否之前已登录过小程序
    wx.checkSession({
      success: function(res) {
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            page.setData({
              logined: true,
              uidIndex:res.data
            })
          },
          fail: function(res) {
            page.setData({
              logined: false
            })
          }
        })
      },
      fail: function(res) {
        page.setData({
          logined:false
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
    return{
      title:'我在浅香校园互助小程序发了一条求助帖，特别需要你助力...呜呜呜',
      path:'/pages/agency/help/help?nickName={{nickName}}&headImage={{headImage}}&content={{content}}&paperId=paperId'
    }
  },
  help:function(){
    wx.checkSession({
      success: function(res) {
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            //符合助力条件，开始处理助力请求

          },
          fail: function(res) {
            // wx.showToast({
            //   title: '检测到您尚未登录或者登录状态过期，请重新登录',
            //   icon: 'none',
            //   duration: 2000,
            //   mask: true
            // })
          }
        })
      },
      fail: function(res) {
        // wx.showToast({
        //   title: '检测到您尚未登录或者登录状态过期，请重新登录',
        //   icon: 'none',
        //   duration: 2000,
        //   mask: true
        // })
      }
    })
  },
  getUserInfoAndHelp:function(){
    var page = this;
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function (res) {
        wx.showToast({
          title: '用户已授权登录',
          icon: 'none',
          duration: 1500,
          mask: true
        });
        //在获取用户公开信息之后进行授权登录
        console.log(res);
        var nickName = res.userInfo.nickName;
        var headImage = res.userInfo.avatarUrl;
        //将昵称和头像置入本页面的data和本地缓存localstorage中
        // page.setData({
        //   nickName: nickName,
        //   headImage: headImage
        // })
        wx.setStorage({
          key: 'userInfo',
          data: { nickName: nickName, headImage: headImage },
          fail: function (res) {
            wx.showToast({
              title: 'localstorage异常：nickName and headImg',
              icon: 'none',
              duration: 1500,
              mask: true
            });
          }
        });
        var uidIsExist;
        var wantSendUid = 'none';
        wx.getStorage({
          key: 'uidIndex',
          success: function (res) {
            uidIsExist = 'true';
            wantSendUid = res.data;
          },
          fail: function (res) {
            uidIsExist = 'false';
          },
        });
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.request({
                url: 'https://www.zbhqx.cn/api/campus_help/handleWxp',
                data: { requestType: 'wxLogin', userCode: res.code, uidIsExist: uidIsExist, wantSendUid: wantSendUid, headImage: headImage, nickName: nickName },
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                success: function (res) {
                  if(res.statusCode!=200){
                    return wx.showToast({
                      title: '网络异常：'+res.statusCode,
                      icon: 'none',
                      duration: 1500,
                      mask: true,
                    });
                  }
                  console.log(res);
                  var uidIndex = res.data.uidIndex;
                  //将唯一用户ID查询索引置入本地缓存localstorage
                  wx.setStorage({
                    key: 'uidIndex',
                    data: uidIndex,
                    success: function(res) {
                      var ownerUidIndex = page.data.ownerUidIndex;
                      var paperId = page.data.paperId;
                      //开始处理助力的后台流程
                      wx.request({
                        url: 'https://www.zbhqx.cn/api/campus_help/handleHelp',
                        //发帖人的ID，帖子的ID，助力者ID
                        data: { ownerUidIndex: ownerUidIndex, paperId: paperId, uidIndex: uidIndex},
                        header: { 'Content-Type': 'application/x-www-form-urlencoded'},
                        method: 'POST',
                        dataType: 'json',
                        responseType: 'text',
                        success: function(res) {
                          if(res.statusCode!=200){
                            return wx.showToast({
                              title: '网络异常：handleHelp->' + res.statusCode,
                              icon: 'none',
                              duration: 2000,
                              mask: true
                            })
                          }
                          wx.showToast({
                            title: res.data.success,
                            icon: 'none',
                            duration: 2000,
                            mask: true
                          })
                        },
                        fail: function(res) {
                          wx.showToast({
                          title: '网络异常：handleHelp',
                            icon: 'none',
                              duration: 2000,
                                mask: true
                          })
                        }
                      })
                    },
                    fail: function (res) {
                      wx.showToast({
                        title: 'Storage program异常，请重试。若有问题，请联系客服。',
                        icon: 'none',
                        duration: 1500,
                        mask: true,
                      });
                    }
                  });
                },
                fail: function (res) {
                  wx.showToast({
                    title: '网络异常：handleWx',
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                  });
                },
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '授权登录失败',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '用户未授权登录',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    })
  },
  help:function(){
    var page = this;
    var ownerUidIndex = page.data.ownerUidIndex;
    var uidIndex = page.data.uidIndex;
    var paperId = page.data.paperId;
    //开始处理助力的后台流程
    wx.request({
      url: 'https://www.zbhqx.cn/api/campus_help/handleHelp',
      //发帖人的ID，帖子的ID，助力者ID
      data: { ownerUidIndex: ownerUidIndex, paperId: paperId, uidIndex: uidIndex },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.statusCode != 200) {
          return wx.showToast({
            title: '网络异常：handleHelp->' + res.statusCode,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
        if (res.data.error!=null){
          return wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
        wx.showToast({
          title: res.data.success,
          icon: 'none',
          duration: 2000,
          mask: true
        });
        //更新页面上的助力人数
        page.setData({
          count: page.data.count + 1
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常：handleHelp',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    })
  },
  navigationToIndex:function(){
    wx.switchTab({
      url: '/pages/agency/index/index',
      // success: function(res) {},
      fail: function(res) {
        wx.showToast({
          title: '进入小程序失败',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      },
      complete: function(res) {
        wx.showLoading({
          title: '正在前往...',
          mask: true,
          // success: function(res) {},
          fail: function(res) {
            wx.showToast({
              title: '显示正在前往失败',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          },
          complete: function(res) {
            setTimeout(function(){
              wx.hideLoading();
            },1500);
          },
        })
      },
    })
  }
})