var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    headImage:'/pages/agency/images/logo.jpg',//头像路径
    requireImgPath:'/pages/agency/images/right.png',//求助记录中的箭头方向
    inforImgPath:'/pages/agency/images/right.png',
    aboutImgPath:'/pages/agency/images/right.png',
    feedbackImgPath:'/pages/agency/images/right.png',
    
    showFeedback:[],
    testPicks: ['删除','确认结帖'],
    userTitle:'修改',
    pwdTitle:'修改',
    emailTitle:'修改',
    disabledUsernameInput:true,
    disabledPwdInput:true,
    disabledEmailInput:true,
    //用户ID，暂时固定，以后做好之后要修改
    userId:3,
    //空格
    space:'\xa0',
    appExplain:'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0校园互助小程序是一款立足于校园，立志为广大校园师生提供一个解决问题的平台。求助方在平台上发帖，并根据自愿原则提供给援助方相应的报酬。援助方通过对发帖方描述的情形进行援助，解决求助方的问题，并获得相应报酬。从而使援助方获益，求助方得以解决问题。'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var page = this;
      wx.getStorage({
        key: 'userInfo',
        success: function(res) {
            page.setData({
              nickName: res.data.nickName,
              headImage: res.data.headImage
            });
        },
        fail: function(res) {
          wx.showToast({
            title: '您尚未登录或者登录状态过期，请重新登录',
            icon: 'none',
            duration: 1500,
            mask: true
          });
        },
        complete: function(res) {},
      })
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
  changePrompt:function(e){
    //此处需要封装
    var childShowVariable = e.currentTarget.dataset.childShowVariable;
    var imgPathName = e.currentTarget.dataset.imgPathName;
    //当提示图标向下时，设置图标方向向上
    var bottomStorageObj = {};
    bottomStorageObj[imgPathName] = '/pages/agency/images/right.png';
    bottomStorageObj[childShowVariable] = [];

    //当提示图标向上时，设置图标方向向下
    var rightStorageObj = {};
    rightStorageObj[imgPathName] = '/pages/agency/images/bottom.png';
    rightStorageObj[childShowVariable] = [1];

    if (this.data[imgPathName] == '/pages/agency/images/bottom.png') {

      this.setData(bottomStorageObj);
      
    } else {
      this.setData(rightStorageObj);
      if (imgPathName == 'requireImgPath'){
        this.requiredRecord();
      }
    }
  },
  arouseMenu: function (event){
    //唤起菜单
    var page = this;    
    wx.showActionSheet({
      itemList: ['删除','确认结帖'],
      itemColor: '#000000',
      success: function(res) {
        console.log('选择了第' + res.tapIndex+'个按钮');
        console.log(event.currentTarget.dataset.title);
        var transTitle = event.currentTarget.dataset.title;
        var data = {};
        switch(res.tapIndex){
          case 0:
            console.log('你欲删除ID为'+event.currentTarget.id+'的帖子');
            data = { transType: 'delete', id: event.currentTarget.id, transTitle: transTitle}
            break;
          case 1:
            console.log('你欲对ID为' + event.currentTarget.id + '的帖子的状态设为【已结帖】');
            data = { transType: 'confirm', id: event.currentTarget.id, transTitle: transTitle}
            break;
        }
        //向后台传送操作类型,处理相关菜单操作-》删除和更新操作
            wx.request({
              url: 'https://www.zbhqx.cn/agency/php/owner/menuOperation.php',
              data: data,
              header: {'Content-Type':'application/x-www-form-urlencoded'},
              method: 'POST',
              success: function(res) {
                //执行删除和更新操作成功之后，提示并刷新页面
                  wx.showToast({
                    title: res.data.res,
                    icon: 'none',
                    duration: 1500,
                    mask: true                 
                  })
                  page.requiredRecord();
              },
              fail: function(res) {
                console.log(res);
              },
            })
      },
      fail: function(res) {
        //菜单唤起故障
        wx.showToast({
          title: '你取消了菜单操作',
          icon: 'none',         
        })
      },
    })
  },
  requiredRecord:function(){
    var page = this;
      //向后台发送请求求助记录的请求
    wx.request({
      url: 'https://www.zbhqx.cn/agency/php/owner/showRequiredRecord.php',
      data: { requireType: 'showRequiredRecord' },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var testArray = [];
        // console.log(res.data);
        for (var i = 0; i < res.data.length; i++) {

          testArray.push(res.data[i]);
        }
        page.setData({ showRequired: testArray});
      },
      fail: function (res) {
        console.log('request请求失败：' + res.data);
      },
    })
      
  },
  
  /**封装向后台发送修改用户信息的请求，包括修改类型、修改后的值、userId以及成功的提示信息 */
  modifyInformation: function (modifyDirection, value, userId, successWord) {
    //向后台发送修改用户名的请求
    wx.request({
      url: 'https://www.zbhqx.cn/agency/php/owner/modifyInformation.php',
      data: { requestType: 'modifyInformation', modifyDirection: modifyDirection, value: value, userId: userId },
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        if (res.data.res == successWord) {
          wx.showToast({
            title: res.data.res,
            icon: 'success',
            duration: 1500,
            mask: true,
          });
        } else {
          wx.showToast({
            title: res.data.res,
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        }
      },
      fail: function (res) {
        console.log(res.data);
      },
    })
  },
  getUsername: function (event) {
    //输入框的值
    var userValue = event.detail.value;
    //输入框字的个数(非长度)
    // console.log(event.detail.cursor);
    this.setData({
      userValue: userValue
    });
  },
  getPassword: function (event) {
    //输入框的值
    var pwdValue = event.detail.value;
    //输入框字的个数(非长度)
    // console.log(event.detail.cursor);
    this.setData({
      pwdValue: pwdValue
    });
  },
  getEmail: function (event) {
    //输入框的值
    var emailValue = event.detail.value;
    //输入框字的个数(非长度)
    // console.log(event.detail.cursor);
    this.setData({
      emailValue: emailValue
    });
  },
  //获取反馈输入框的值
  getFeedbackText: function (event) {
    var feedbackTextValue = event.detail.value;
    //输入框字的个数(非长度)
    // console.log(event.detail.cursor);
    this.setData({
      feedbackTextValue: feedbackTextValue
    });
  },
  modifyUserTitle:function(){
    //修改用户名
    //修改用户名按钮名称
    if (this.data.userTitle=='修改'){
      //点击修改的时候
        this.setData({
          userTitle: '确定',
          disabledUsernameInput:false
      });

    }else{
      //点击【确定】的时候
        this.setData({
          userTitle: '修改',
          disabledUsernameInput: true
        });

        var page = this;
        var modifyDirection = 'username';
        var value = page.data.userValue;
        var userId = page.data.userId;
        var successWord = "更改用户名成功";
        this.modifyInformation(modifyDirection, value, userId, successWord);
    }
    
    
  },
  //修改用户密码
  modifyPassword:function(){
      //修改用户名按钮名称
    if (this.data.pwdTitle == '修改') {
        //点击修改的时候
        this.setData({
          pwdTitle: '确定',
          disabledPwdInput: false
        });

      } else {
        //点击【确定】的时候
        this.setData({
          pwdTitle: '修改',
          disabledPwdInput: true
        });

        var page = this;
        var modifyDirection = 'password';
        var value = page.data.pwdValue;
        var userId = page.data.userId;
        var successWord = "更改密码成功";
        this.modifyInformation(modifyDirection, value, userId, successWord);
      }

  },
  //修改用户邮箱
  modifyEmail:function(){
      //修改用户名按钮名称
    if (this.data.emailTitle == '修改') {
        //点击修改的时候
        this.setData({
          emailTitle: '确定',
          disabledEmailInput: false
        });

      } else {
        //点击【确定】的时候
        this.setData({
          emailTitle: '修改',
          disabledEmailInput: true
        });

        var page = this;
        var modifyDirection = 'email';
        var value = page.data.emailValue;
        var userId = page.data.userId;
        var successWord = "更改邮箱成功";
        this.modifyInformation(modifyDirection, value, userId, successWord);
      }

  },
  feedbackSubmit:function(e){
    var feedbackText = e.detail.value;
    //获取选择的图片路径
    var imgPathArray = this.data.feedbackImg;
    var data = imgPathArray == null ? { feedbackText } : { feedbackText, imgPathArray};  
    console.log(data);
    
    var inputArray = [];
    for(var key in feedbackText){
      inputArray.push(feedbackText[key]);
    }

    if (this.isPutEmpty(inputArray)){
      return wx.showToast({
        title: '请填写信息完整',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }
    //向后台发送提交反馈信息的请求

    wx.request({
      url: 'https://www.zbhqx.cn/agency/php/ownInformation/receivedFeedback.php',
      data: { sendJson: JSON.stringify(data)},
      header: { 'Content-Type':'application/x-www-form-urlencoded'},
      method: 'POST',
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(res);
      },
    })

    },
  isPutEmpty: function (inputValueArray) {
    for (var i = 0; i < inputValueArray.length;i++){
        if (inputValueArray[i].trim().length <= 0){
            return true;
        }
    }
  },
  getUserInfo:function(){
    var page = this;
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function(res) {
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
        page.setData({
          nickName: nickName,
          headImage: headImage
        })
        wx.setStorage({
          key: 'userInfo',
          data: { nickName: nickName, headImage: headImage},
          fail: function(res) {
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
          success: function(res) {
            uidIsExist = 'true';
            wantSendUid = res.data;
          },
          fail: function(res) {
            uidIsExist = 'false';
          },
        });
        wx.login({
          success: function(res) {
            if(res.code){
              wx.request({
                // url: 'https://www.zbhqx.cn/campus_help/php/registerAndLogin/handleWx.php',
                url: 'https://www.zbhqx.cn/api/campus_help/handleWx',
                data: { requestType: 'wxLogin', userCode: res.code, uidIsExist: uidIsExist, wantSendUid: wantSendUid, headImage: headImage, nickName: nickName},
                header: {'Content-Type':'application/x-www-form-urlencoded'},
                method: 'POST',
                success: function(res) {
                  // console.log(res);
                  var updateUid = res.data.uidIndex;
                 //将唯一用户ID查询索引置入本地缓存localstorage
                  wx.setStorage({
                    key: 'uidIndex',
                    data: updateUid,
                    success: function(res) {
                      //重新更新用户的学校
                      //向后台请求用户的学校和QQ邮箱
                      wx.request({
                        url: 'https://www.zbhqx.cn/api/campus_help/checkSchool',
                        data: { uidIndex: updateUid },
                        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        method: 'POST',
                        success: function (res) {
                          var school = res.data.school; 
                          app.globalData.school = school;
                          if (school != '' || school != null) {
                            app.globalData.isLoad = true;
                          }
                        },
                        fail: function (res) {
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
                        title: 'localstorage异常，请重试。若有问题，请联系客服。',
                        icon: 'none',
                        duration: 1500,
                        mask: true,
                      });
                    }
                  });
                },
                fail: function(res) {
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
          fail: function(res) {
            wx.showToast({
              title: '授权登录失败',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
        });
      },
      fail: function(res) {
        wx.showToast({
          title: '用户未授权登录',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    })
  },
  test:function(){
    wx.checkSession({
      success: function(res) {
        wx.showToast({
          title: 'session_key未过期',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      },
      fail: function(res) {
        wx.showToast({
          title: 'session_key已过期',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      },
    })
  },
  exitLogin:function(){
    wx.clearStorage();
    app.globalData.school = '';
    this.setData({
      nickName: '',
      headImage: '/pages/agency/images/logo.jpg'
    });
    
  }
})