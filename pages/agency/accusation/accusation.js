Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '色情低俗', value: '0', checked: true },
      { name: '政治敏感', value: '1' },
      { name: '违法', value: '2'},
      { name: '广告', value: '3' },
      { name: '病毒木马', value: '4'},
      { name: '侵犯未成年人承诺', value: '5' },
      { name: '其他', value: '6' }
    ],
    showInput: false,
    currentRadioItem:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading();
    //取出帖子ID
    this.setData({
      paperId: options.paperId
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
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
    if (e.detail.value==6){
      this.setData({
        showInput: true
      });
    } else if (this.data.showInput == true){
      
      this.setData({
        showInput: false
      });

    }   
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      currentRadioItem: e.detail.value
    });
  },
  getInputValue:function(event){
    this.setData({
      inputValue:event.detail.value
    });
  },
  submitAccusation:function(){
    var page = this;
    //检测举报内容是否为空
    wx.checkSession({
      success: function(res) {
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            var uidIndex = res.data;
            var data;
            if (page.data.currentRadioItem == 6) {
              if (page.data.inputValue == undefined || page.data.inputValue.trim().length == 0) {
                wx.showToast({
                  title: '输入内容为空',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                });
                return;
              }
              //根据选项的不同赋不同的值,属性：请求类型，举报类型[，举报内容]
              data = { requestType: 'submitAccusation', accusationType: page.data.radioItems[page.data.currentRadioItem].name, content: page.data.inputValue, paperId: page.data.paperId, uidIndex: uidIndex};
            } else {
              data = { requestType: 'submitAccusation', accusationType: page.data.radioItems[page.data.currentRadioItem].name, paperId: page.data.paperId, uidIndex: uidIndex};
            }

            //向后台发送举报内容
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/submitAccusation',
              data: data,
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              success: function (res) {
                //显示成功信息
                if (res.data.msg != null) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 1500,
                    mask: true,
                  })
                } else {
                  //显示报错信息
                  wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                  })
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '网络异常：submitAccusation',
                  icon: 'none',
                  duration: 1500,
                  mask: true,
                })
              }
            });
          },
          fail: function(res) {
            wx.showToast({
              title: '检测到您尚未登录或者登录状态已过期，请重新登录。',
              icon: 'none',
              duration: 1500,
              mask: true,
            })
          },
          // complete: function(res) {},
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '检测到您尚未登录或者登录状态已过期，请重新登录。',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      },
      // complete: function(res) {},
    })
    
  },
 
})