// var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var sliderWidth = 10; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
  data: {
    tabs: ["求助大厅","搜索"],
    // tabs: ["淮海工学院", "求助大厅", "助客大厅"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    nbsp: '\xa0\xa0',
    requiredReccordArray:[],
    topNeedCount: 5,
    currentPageNumber: 1,
    //上限索引
    topIndex: 5
  },
  onLoad: function () {
    var page = this;
    wx.getSystemInfo({
      success: function (res) {
        page.setData({
          // sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderLeft: 0,
          // sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
          sliderOffset:0
        });
      }
    });
    //判断用户是否设置了学校
    wx.checkSession({
      success: function (res) {
        wx.getStorage({
          key: 'uidIndex',
          success: function (res) {
            var uidIndex = res.data;
            //验证用户是否设置了学校名称
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/checkSchool',
              data: { uidIndex: uidIndex},
              header: { 'Content-Type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                if (res.statusCode != 200) {
                  return wx.showToast({
                    title: '网络异常：publish:' + res.statusCode,
                    icon: 'none',
                    duration: 2000,
                    mask: true
                  })
                }
                //处理返回的消息
                if (res.data.error != null) {
                  return wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 6000,
                    mask: true
                  })
                }
                app.globalData.school = res.data.school;
                var requiredReccordArray = page.data.requiredReccordArray;
                //判断用户是否填写了学校名称,如果没填，则不显示学校数据
                //判断用户school是否为空
                var school = app.globalData.school;
                if (school == '' || school == null) {
                  return;
                }
                //符合发送请求条件
                // var uidIndex = res.data; 此处把学校置入page data中是为了首页方便渲染使用本小程序须知
                page.setData({
                  currentPageNumber: 1,
                  indexSchool: school
                });
                var data = { school: school, pageNumber: 1, uidIndex: uidIndex};
                //向后台请求显示求助信息
                page.getRequiredData(data);
              },
              fail: function (res) {
                page.setData({
                  indexSchool: ''
                });
                wx.showToast({
                  title: '网络异常：checkSchool',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
            })
          },
          fail: function (res) {
            page.setData({
              indexSchool: '',
              requiredReccordArray: []
            });
            wx.showToast({
              title: '检测到您尚未登录或者登录状态过期，请重新登录。',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        })
      },
      fail: function (res) {
        page.setData({
          indexSchool: '',
          requiredReccordArray:[]
        });
        wx.showToast({
          title: '检测到您尚未登录或者登录状态过期，请重新登录。',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    })

  },
  
  onShow: function () {
    if(app.globalData.isLoad){
      this.onLoad();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var page = this;
      //向后台请求显示求助信息
    var requiredReccordArray = page.data.requiredReccordArray;
    wx.checkSession({
      success: function (res) {
        wx.getStorage({
          key: 'uidIndex',
          success: function (res) {
            //符合发送请求条件
            var uidIndex = res.data;
            page.setData({
              currentPageNumber: 1
            });
            var data = { uidIndex: uidIndex, school: app.globalData.school,pageNumber: 1 };
            page.getRequiredData(data);
          },
          fail: function (res) {
            page.setData({
              requiredReccordArray: requiredReccordArray
            })
          }
        })
      },
      fail: function (res) {
        page.setData({
          requiredReccordArray: requiredReccordArray
        })
      }
    })
    wx.stopPullDownRefresh();                
  },
  // **********点击求助大厅的时候**********
  tabClick: function (e) {
    var page = this;
    var navbarId = e.currentTarget.id;
    page.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: navbarId
    });
    if (navbarId == '1'){
      //如果点击的是求助大厅的话
      wx.checkSession({
        success: function (res) {
          wx.getStorage({
            key: 'uidIndex',
            success: function (res) {
              var school = app.globalData.school;
              if (school == '' || school == null) {
                return;
              }
              //符合发送请求条件
              var currentPageNumber = page.data.currentPageNumber;

              //符合发送请求条件
              // var uidIndex = res.data; 此处把学校置入page data中是为了首页方便渲染使用本小程序须知
              page.setData({
                currentPageNumber: 1,
                indexSchool: school
              });
              var data = {school: school, pageNumber: 1, uidIndex: res.data};
              //给后台发送request请求求助数据
              page.getRequiredData(data);
            },
            fail: function (res) {
              wx.showToast({
                title: '检测到您尚未登录或者登录状态已过期，请重新登录。',
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '检测到您尚未登录或者登录状态已过期，请重新登录。',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      })
    }    
    
   
  },
  getRequiredData:function(data){
    var page = this;
    //符合条件，开始获取请求数据
    wx.request({
      url: 'https://www.zbhqx.cn/api/campus_help/showData?page=1',
      data: data,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      success: function (res) {
        if (res.statusCode != 200) {          
          return wx.showToast({
            title: '网络异常：showData，请重试。',
            icon: 'none',
            duration: 1500,
            mask: true
          });
        }
        if (res.data.error != '') {       
          return wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 2000,
            mask: true
          });
        }
        page.setData({
          requiredReccordArray: res.data.recordArray,
          next_page_url: res.data.next_page_url
        })
        app.globalData.isLoad = true;
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }
    });
  },
  //用户执行自增动作
  userAction:function(e){
    //获取页面对象
    var page = this;
    wx.checkSession({
      success: function(res) {
        //登录状态未过期
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            //登录状态合法，可进行下一步操作
            var id = e.currentTarget.id;
            var requestType = e.currentTarget.dataset.requestType;
            var arrayIndex = e.currentTarget.dataset.arrayIndex;
            //判断id是否存在
            if (id.trim().length == 0) {
              return;
            }
            //传递用户唯一Id索引
            var uidIndex = res.data;
            
            //将id传给后台处理
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/userAction',
              data: { requestType: requestType, paperId: id, uidIndex: uidIndex },
              header: {'content-type': 'application/x-www-form-urlencoded'},
              method: 'POST',
              success: function (res) {
                if(res.statusCode!=200){
                    return wx.showToast({
                      title: '网络异常->statusCode:' + res.statusCode,
                      icon: 'nine',
                      duration: 1500,
                      mask: true
                    })
                }
                var requiredReccordArray = page.data.requiredReccordArray;
                var addedType;
                switch (requestType) {
                  case 'favorite':
                    addedType = 'favoriteCount';
                    var isFavorite = requiredReccordArray[arrayIndex]['isFavorite'];
                    isFavorite = isFavorite ? false :true;
                    requiredReccordArray[arrayIndex]['isFavorite'] = isFavorite;                    
                    break;
                  case 'topRecord':
                    addedType = 'topRecordCount';
                    var isTopRecord = requiredReccordArray[arrayIndex]['isTopRecord'];
                    isTopRecord = isTopRecord ? false : true;
                    requiredReccordArray[arrayIndex]['isTopRecord'] = isTopRecord;  
                    break;
                  default:
                    break;
                }
                //将数组遍历，更新数组里的favoriteCount
                for (var i = 0; i < requiredReccordArray.length; i++) {
                  //判断当前数组的ID是否与当前的帖子ID相等
                  if (requiredReccordArray[i].id == id) {
                    //如果相等，更新数组里的favoriteCount
                    requiredReccordArray[i][addedType] = res.data.count;

                  }
                }
                page.setData({
                  requiredReccordArray: requiredReccordArray
                });
                if (res.data.actionType != null) {
                  wx.showToast({
                    title: res.data.actionType,
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                  })
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '执行' + requestType + '动作失败:' + res.data.error,
                  icon: 'none',
                  duration: 1500,
                  mask: true,
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
    });
    

  },
  loadMore:function(){
    var page = this;
    var next_page_url = this.data.next_page_url;
    var school = app.globalData.school;
    wx.getStorage({
      key: 'uidIndex',
      success: function(res) {
        var uidIndex = res.data;

        var data = { school: school, uidIndex: uidIndex };
        //符合条件，开始获取请求数据
        wx.request({
          url: next_page_url,
          data: data,
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: 'POST',
          success: function (res) {
            if (res.statusCode != 200) {
              return wx.showToast({
                title: '网络异常：showData，请重试。',
                icon: 'none',
                duration: 1500,
                mask: true
              });
            }
            if (res.data.error != '') {
              return wx.showToast({
                title: res.data.error,
                icon: 'none',
                duration: 2000,
                mask: true
              });
            }
            page.setData({
              requiredReccordArray: res.data.recordArray,
              next_page_url: res.data.next_page_url
            })
            app.globalData.isLoad = true;
          },
          fail: function (res) {
            wx.showToast({
              title: '网络错误，请重试',
              icon: 'none',
              duration: 1500,
              mask: true,
            });
          }
        });
      },
    })
    
  },
  navigationToAccusation: function (paperId){
    wx.navigateTo({
      url: '/pages/agency/accusation/accusation?paperId='+ paperId,
      fail: function(res) {
        wx.showToast({
          title: '跳转到举报页面失败',
          icon: 'none',
          image: '',
          duration:1500,
          mask: true,
        })
      }
    })
  },
  menuOperator:function(event){
    var page = this;
    // ********数组索引*********
    var arrayIndex = event.currentTarget.id;;
    var title = this.data.requiredReccordArray[arrayIndex].title;
    var paperId = this.data.requiredReccordArray[arrayIndex].id;
    wx.showActionSheet({
      itemList: ['复制标题','举报'],
      itemColor: '#000000',
      success: function(res) {
        //****菜单索引*****
        var menuIndex = res.tapIndex;
        switch(menuIndex){
          case 0:
          //选择的是复制标题
              wx.setClipboardData({
                data: title,
                success: function(res) {
                  wx.showToast({
                    title: '复制标题成功',
                    icon: 'success',
                    duration: 1500,
                    mask: true
                  })
                },
                fail: function(res) {
                  wx.showToast({
                    title: '复制标题失败',
                    icon: 'success',
                    duration: 1500,
                    mask: true
                  })
                },
              });
              break;
           case 1:
              //选择的是举报
              //跳转到举报页面
            page.navigationToAccusation(paperId);
            break;
          default:
            break;
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '您取消了本次操作',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      },
    })
  },
  navigatorToDetail:function(event){
    //帖子ID
    var paperId = event.currentTarget.id;
    wx.navigateTo({
      url: '/pages/agency/detail/detail?paperId=' + paperId,
      fail: function(res) {
        wx.showToast({
          title: '前往详情页面失败',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      },
      complete: function(res) {
        wx.showLoading({
          title: '正在前往详情页面',
          mask: true,
          success: function (res){
              setTimeout(function(){
                wx.hideLoading();
              },2000);
          },
          fail: function(res) {
            wx.showToast({
              title: '显示加载失败',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          },
        })
      },
    })
  }
  
  
});