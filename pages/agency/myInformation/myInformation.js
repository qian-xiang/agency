var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolButton:'修改',
    emailButton: '修改',
    school:'',
    email:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.checkSession({
      success: function(res) {
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {       
            //向后台请求用户的学校和QQ邮箱
              wx.request({
                url: 'https://www.zbhqx.cn/api/campus_help/getUserInformation',
                data: { uidIndex:res.data},
                header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                success: function(res) {
                 page.setData({
                   school: res.data.msg.school,
                   email: page.base64_decode(res.data.msg.email)
                 });
                 app.globalData.school = res.data.msg.school;
                 if (res.data.msg.school != '' || res.data.msg.school!=null){
                   app.globalData.isLoad = true;
                 }
                },
                fail: function(res) {
                  wx.showToast({
                    title: '网络异常：getUserInformation',
                    icon: 'none',
                    duration: 1500,
                    mask: true
                  });
                }
              });
          },
          fail: function(res) {
            wx.showToast({
              title: '尚未登录或者登录状态已过期，请重新登录',
              icon: 'none',
              duration: 1500,
              mask: true
            });
          }
        });
      },
      fail: function(res) {
        setTimeout(function () {
          wx.hideLoading();
        }, 5000);
        wx.showToast({
          title: '尚未登录或者登录状态已过期，请重新登录',
          icon: 'none',
          duration: 1500,
          mask: true
        });
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
  getSchool:function(event){
    var school = event.detail.value;
    this.setData({
      school: school
    });
  },
  getEmail:function(event){
    var email = event.detail.value;
    this.setData({
      email: email
    });
  },
  modifyInformation:function(event){
    var page = this;
    console.log(event);
    var email = event.detail.value.email;
    var school = event.detail.value.school;

    if (email == undefined || school == undefined || email.trim().length == 0 || school.trim().length == 0){
        wx.showToast({
          title: '用户信息不能设置为空',
          icon: 'none',
          duration: 1500,
          mask: true
        });
        return ;
    }

    wx.getStorage({
      key: 'uidIndex',
      success: function(res) {
        wx.request({
          url: 'https://www.zbhqx.cn/api/campus_help/modifyInformation',
          data: { uidIndex: res.data, email: email, school: school },
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            console.log(res);
            if (res.data.error != '') {
              wx.showToast({
                title: res.data.error,
                icon: 'none',
                duration: 1500,
                mask: true
              });
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1500,
                mask: true
              });
              page.setData({
                school: school,
                email: email
              });
              app.globalData.school = school;
              app.globalData.isLoad = true;
              //跳转到成功页面
              wx.navigateTo({
                url: '/pages/agency/success/success?recommend=返回主页&assist=返回个人中心',
                fail: function (res) {
                  wx.showToast({
                    title: '跳转到成功页面失败',
                    icon: 'none',
                    duration: 1500,
                  });
                },
                complete: function (res) {
                  wx.showLoading({
                    title: '正在前往',
                    mask: true,
                    fail: function (res) {
                      wx.showToast({
                        title: '显示正在加载失败',
                        icon: 'none',
                        duration: 1500,
                      });
                    },
                    complete: function (res) {
                      setTimeout(function () {
                        wx.hideLoading();
                      }, 1500);
                    },
                  })
                },
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '网络异常：modifyInformation',
              icon: 'none',
              duration: 1500,
              mask: true
            });
          }
          
        });
        //request完毕
      },
      fail: function(res) {
        wx.showToast({
          title: '检测到你尚未登录或者登录状态过期，请重新登录',
          icon: 'none',
          duration: 2000,
          mask: true
        });
      },
    });
    
  },
  base64_decode: function (input) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = base64EncodeChars.indexOf(input.charAt(i++));
      enc2 = base64EncodeChars.indexOf(input.charAt(i++));
      enc3 = base64EncodeChars.indexOf(input.charAt(i++));
      enc4 = base64EncodeChars.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    return this.utf8_decode(output);
  },
  utf8_decode: function (utftext) {
    var string = '';
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c1 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
        i += 2;
      } else {
        c1 = utftext.charCodeAt(i + 1);
        c2 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
        i += 3;
      }
    }
    return string;
  }
})