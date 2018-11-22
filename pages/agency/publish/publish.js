var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nbsp:'\xa0\xa0',
    currentPickerValue:'点此选择',
    checkboxItems: [
      // { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: '我已阅读发帖须知并同意相关细则', value: '0',checked:false }
    ],
    sort: ['帮买', '帮办', '帮取', '其它'],
    currentSortIndex: 0,
    contacts: ["微信", "QQ", "手机号码",'Email'],
    currentContactsIndex: 0,
    tempFilesPath:[],
    percentValue:0,
    

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
  published:function(e){
    var page = this;
    wx.checkSession({
      success: function(res) {
        //用户已登录或者登录状态未过期
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            //判断登录者是否已设置学校名称
            var school = app.globalData.school;
            if (school=='' || school==null){
              return wx.showToast({
                title: '检测到您尚未设置学校名称，请前往【个人中心】->【我的资料】填写。',
                icon: 'none',
                duration: 3000,
                mask: true
              });
            }
            //符合发帖条件
            var form = e.detail.value;
            // console.log(form);
            //未勾选发帖须知
            if (page.data.checkboxItems[0].checked == false) {
              return wx.showToast({
                title: '请先阅读并同意相关细则之后再发帖',
                icon: 'none',
                duration: 1500,
                mask: true
              });
            }
            //判断是否已选择了类别
            if (form.sort == null) {
              return wx.showToast({
                title: '请选择求助类别',
                icon: 'none'
              });
            }
            for (var key in form) {
              if (key != 'rule' && key != 'sort' && key != 'contactsType') {
                //******判断表单是否为空 */
                if (form[key].trim().length == 0) {
                  return wx.showToast({
                    title: '请填写信息完整',
                    icon: 'none',
                    duration: 1500,
                    mask: true
                  });
                }
              }
            }
            //把value类型的类别改为name类型的，即正常人所看到的类别名称
            form.sort = page.data.sort[form.sort];
            form.school = school;
            form.contactsType = page.data.contacts[form.contactsType];
            //判断用户是否选择发送图片
            if (page.data.tempFilesPath.length > 0) {
              form.isChoosedImg = true;
            } else {
              form.isChoosedImg = false;
            }
            delete form.rule;
            //获取Page数据对象
           
            form.uniqueId = res.data;
            // **********满足条件，向后台发送发帖请求**********
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/publish',
              method: 'POST',
              data: form,
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (response) {
                // console.log(response);
                if (response.statusCode == 200) {
                  var respon = response.data.res;
                  //插入记录不成功的话
                  if (response.data.error != null) {
                    wx.showToast({
                      title: response.data.error,
                      icon: 'none',
                      duration: 1500,
                      mask: true,
                    });

                  } else {
                    //插入记录成功
                    wx.showToast({
                      title: response.data.msg,
                      icon: 'success',
                      duration: 2000,
                      mask: true,
                    });
                    //如果用户选择图片的话
                    if (form.isChoosedImg) {
                      //保存帖子ID
                      var postedId = response.data.returnId;
                      page.setData({
                        postedId: postedId,
                        percentValue:0
                      });
                      //处理图片上传逻辑
                      //计算上传失败的图片
                      var uploadSuccessCount = 0;
                      //进度条每次增长的值
                      var increaseCount = 100 / page.data.tempFilesPath.length;
                      //用于计算当前进度条所在的位置
                      var total = 0;

                      for (var i = 0; i < page.data.tempFilesPath.length; i++) {
                        var imgPath = page.data.tempFilesPath[i];
                        wx.uploadFile({
                          url: 'https://www.zbhqx.cn/api/campus_help/postImagesUpload',
                          filePath: imgPath,
                          name: 'postImg',
                          formData: {
                            sendType: 'postedImagesUpload',
                            //传递文件的序号
                            num: i + 1,
                            postedId: postedId
                          },
                          success: function (res) {
                            if (res.data.res != '上传成功') {
                              uploadSuccessCount += 1;
                            }
                          },
                          fail: function (res) {
                            console.log(res.data.res);
                          },
                          complete: function (res) {
                            total = total + increaseCount;
                            //更新进度条的位置
                            page.setData({
                              percentValue: total
                            });
                          }
                        })
                      }
                      page.setData({
                        postedId: null,
                        percentValue: 0
                      });
                      wx.showToast({
                        title: '图片上传完毕。上传图片总计：' + page.data.tempFilesPath.length + '，失败：' + uploadSuccessCount,
                        icon: 'none',
                        duration: 1500,
                      });
                    
                    }
                    //跳转到成功页面
                    wx.navigateTo({
                      url: '/pages/agency/success/success?recommend=返回主页&assist=返回发帖页面',
                      fail: function(res) {
                        wx.showToast({
                          title: '跳转到成功页面失败',
                          icon: 'none',
                          duration: 1500,
                        });
                      },
                      complete: function(res) {
                        wx.showLoading({
                          title: '正在前往',
                          mask: true,
                          fail: function(res) {
                            wx.showToast({
                              title: '显示正在加载失败',
                              icon: 'none',
                              duration: 1500,
                            });
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

                } else {
                  wx.showToast({
                    title: '网络故障或服务器故障,状态码:' + response.statusCode,
                    icon: 'none'
                  });
                }
              },
              fail: function () {
                wx.showToast({
                  title: '网络故障或服务器故障，发帖失败',
                  icon: 'none'
                });
              }
            })

            // console.log(form);
          },
          fail: function(res) {
            wx.showToast({
              title: '检测到您尚未登录或者登录状态过期，请重新登录。',
              icon: 'none',
              duration: 2000,
              mask: true
            });
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '检测到您尚未登录或者登录状态过期，请重新登录。',
          icon: 'none',
          duration: 2000,
          mask: true
        });
      }
    })
  
  },
  reset:function(){
    var checkboxItems = this.data.checkboxItems;
    checkboxItems[0].checked = false;
    this.setData({
      checkboxItems: checkboxItems
    })
  },
  setCurrentPickerValue:function(e){
    this.setData({
      currentPickerValue: this.data.sort[e.detail.value]
    });
  },
  //用户点击开启或关闭【发送图片】开关时
  getSwitchValueAndChooseImg:function(event){
    //****获取switch的值***
    var switchValue = event.detail.value;
    wx.showToast({
      title: '系统将自动选取第一张图片作为标题图片',
      icon: 'none',
      duration: 1500,
      mask: true
    });

    //获取page对象
    var page = this;
    if (page.data.tempFilesPath != null) {
      page.setData({
        tempFilesPath:[]
      });
    }
    //如果开启发送图片开关的话
    if (switchValue){
      
      wx.chooseImage({
        count: 5,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // console.log(res);
          //将选择的图片路径置入页面对象的data对象中
          page.setData({
            tempFilesPath: res.tempFilePaths
          });
          // console.log(res.tempFiles["0"].size/1024/1024+'M')
          wx.showToast({
            title: '你选择了' + res.tempFilePaths.length + '张图片',
            icon: 'none',
            duration: 1500,
          });
        },
        fail: function (res) {
          wx.showToast({
            title: '你取消了图片上传',
            icon: 'none'
          });
      }
    });
  }

},
  //获取发帖须知复选框的索引
  checkboxChange:function(event){
    //这是checkbox被点击时，当前CheckBox的value值
    // console.log(event.detail.value);
      if (this.data.checkboxItems[0].checked){
        this.setData({
          checkboxItems: [{ name: '我已阅读发帖须知并同意相关细则', value: '0', checked: false }]
        });
      }else{
        this.setData({
          checkboxItems: [{name: '我已阅读发帖须知并同意相关细则', value: '0', checked: true}]
        });
      }
  },
  //类别点击事件发生时，改变当前显示的类别
  bindSortChange:function(event){
    var currentSortIndex = event.detail.value;
    this.setData({
      currentSortIndex: currentSortIndex
    });
  },
  //联系方式点击事件发生时，改变当前显示的联系方式
  bindContactsChange: function (event) {
    var currentContactsIndex = event.detail.value;
    this.setData({
      currentContactsIndex: currentContactsIndex
    });
  }
})