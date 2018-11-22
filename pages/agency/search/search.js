var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    keyWordArray:[],
    topNeedCount:5,
    pageNumber:1,
    //上限索引
    topIndex:5
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    //判断用户是否填写了学校,如若未填写，则提醒
    var page = this;
    page.setData({
      inputVal: e.detail.value
    });
    if (app.globalData.school == '' || app.globalData.school==null){
      page.setData({
        keyWordArray: [{ title: '检测到您尚未在【个人中心】的【我的资料】设置要查看的学校名称，请前往设置。' }],
        allDataShow: false
      })
      return ;
    }
    wx.checkSession({
      success: function(res) {
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
            //符合发送请求条件
            //向后台发送查询帖子信息的请求，看看是否有包含该关键词的帖子
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/getKeyWords',
              data: { actionType: 'getKeyWord', school: app.globalData.school, keyword: e.detail.value, uidIndex: res.data},
              header: { 'Content-Type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                //出现异常
                if (res.statusCode != 200) {
                  wx.showToast({
                    title: '网络异常：getAllKeyWords',
                    icon: 'none',
                    duration: 1500,
                    mask: true
                  });
                  return;
                }

                if (res.data.error != '' || res.data.recordArray.length == 0) {
                  page.setData({
                    keyWordArray: [{ title: '没有该关键词的记录' }],
                    allDataShow: false
                  })

                } else {
                  page.setData({
                    // keyWordArray: res.data.slice(0, count),
                    keyWordArray: res.data.recordArray,
                    allDataShow: false
                  });
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '发送显示候选词的请求失败',
                  icon: 'none',
                  duration: 1500,
                  mask: true,
                });
              }
            })
          },
          fail: function(res) {
            wx.showToast({
              title: '检测到您尚未登录或者登录状态过期，请到【个人中心】重新登录',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '检测到您尚未登录或者登录状态过期，请重新到【个人中心】登录。',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    })

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
    var school = app.globalData.school;
    if (school == '' || school==null){
      return wx.showToast({
        title: '检测到您尚未在【个人中心】的【我的资料】设置要查看的学校名称，请前往设置。',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
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
  // getSearchAlldata:function(){
  //   var page = this;
  //   //向后台发送查询帖子信息的请求，看看是否有包含该关键词的帖子
  //   wx.request({
  //     url: 'https://www.zbhqx.cn/agency/php/search/showSearchCandidateWords.php',
  //     data: { actionType: 'showSearchCandidateWords', keyword: page.data.inputVal },
  //     header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     method: 'POST',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: function (res) {
  //       page.setData({
  //         searchAllData: res.data
  //       })
  //     },
  //     fail: function (res) {
  //       wx.showToast({
  //         title: '发送显示候选词的请求失败',
  //         icon: 'none',
  //         duration: 1500,
  //         mask: true,
  //       })

  //     }

  //   })
  // },
  // showSearchData:function(){
  //   var inputValue = this.data.inputVal;
  //   if (inputValue == null || inputValue.trim().length <= 0){
  //     wx.showToast({
  //       title: '请输入关键词',
  //       icon: 'none',
  //       duration: 1500,
  //       mask: true,
  //     });
  //   }else{
  //     //由于未能有效处理request的异步请求导致调用含有request的方法出现返回值等于undefined，因此暂时采用“麻烦处理”      
  //       //使用【加载更多】显示数据
  //     this.setData({
  //       allDataShow:true
  //     });
  //     this.hideInput();
  //   }
  // },
  navigatorToDetail:function(e){
    //传递帖子id到帖子详情页
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/agency/detail/detail?id=' + id,
      success: function(res) {
        wx.showLoading({
          title: '正在前往...',
          mask: true,
          fail: function (res) {
            wx.showToast({
              title: '显示加载提示失败',
              icon: 'none',
              duration: 1500,
              mask: true
            });

          },
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '跳转到详情页失败',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      },

    })
  },
  showPapaerInformation:function(event){
    console.log(event.target.id);
    var paperId = event.target.dataset.paperId;
    var arrayIndex = event.target.id;
    var newArray = new Array(this.data.keyWordArray[arrayIndex]);
    this.setData({
      requiredReccordArray: newArray
    })
  },
  getAllKeyWords:function(){
    var page =this;
    var school = app.globalData.school;
    var inputValue = page.data.inputVal;
    if(school==''||school==null){
      return wx.showToast({
        title: '检测到您尚未登录或者登录状态过期，请到【个人中心】重新登录。',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
    wx.checkSession({
      success: function(res) {
        wx.getStorage({
          key: 'uidIndex',
          success: function(res) {
              //符合发送请求条件
            wx.request({
              url: 'https://www.zbhqx.cn/api/campus_help/getKeyWords?page=1',
              data: { actionType: 'getAllKeyWords', school: school, keyword: inputValue, uidIndex: res.data},
              header: { 'Content-Type': 'application/x-www-form-urlencoded'},
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
                //出现异常
                if (res.statusCode != 200) {
                  wx.showToast({
                    title: '网络异常：getAllKeyWords',
                    icon: 'none',
                    duration: 1500,
                    mask: true
                  });
                  return;
                }
                if (res.data.error != '') {
                  wx.showToast({
                    title: res.data.error,
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                  });
                  return;
                }
                page.setData({
                  requiredReccordArray: res.data.recordArray,
                  inputShowed: false,
                  keyWordArray: [],
                  next_page_url: res.data.next_page_url ? res.data.next_page_url : null
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '网络异常：getAllKeyWords',
                  icon: 'none',
                  duration: 1500,
                  mask: true
                });
              }
            });
          },
          fail: function(res) {
            wx.showToast({
              title: '检测到您尚未登录或者登录状态过期，请重新到【个人中心】登录。',
              icon: 'none',
              duration: 2000,
              mask: true
            })
          }
          
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '检测到您尚未登录或者登录状态过期，请重新到【个人中心】登录。',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
      })
  },
  menuOperator: function (event) {
    var page = this;
    // ********数组索引*********
    var arrayIndex = event.currentTarget.id;;
    var title = this.data.requiredReccordArray[arrayIndex].title;
    var paperId = this.data.requiredReccordArray[arrayIndex].id;
    wx.showActionSheet({
      itemList: ['复制标题', '举报'],
      itemColor: '#000000',
      success: function (res) {
        //****菜单索引*****
        var menuIndex = res.tapIndex;
        switch (menuIndex) {
          case 0:
            //选择的是复制标题
            wx.setClipboardData({
              data: title,
              success: function (res) {
                wx.showToast({
                  title: '复制标题成功',
                  icon: 'success',
                  duration: 1500,
                  mask: true
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '复制标题失败',
                  icon: 'success',
                  duration: 1500,
                  mask: true
                })
              },
            });
          case 1:
            //选择的是举报
            //跳转到举报页面
            page.navigationToAccusation(paperId);
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '您取消了本次操作',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      },
    })
  },
  //用户执行自增动作
  userAction: function (e) {
    //获取页面对象
    var page = this;
    wx.checkSession({
      success: function (res) {
        //登录状态未过期
        wx.getStorage({
          key: 'uidIndex',
          success: function (res) {
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
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              method: 'POST',
              success: function (res) {
                // wx.hideLoading();
                // console.log('错误信息：' + res.data.error);
                // console.log('喜欢数量：' + res.data.count);
                var requiredReccordArray = page.data.requiredReccordArray;
                var addedType;
                switch (requestType) {
                  case 'favorite':
                    addedType = 'favoriteCount';
                    var isFavorite = requiredReccordArray[arrayIndex]['isFavorite'];
                    isFavorite = isFavorite ? false : true;
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
                console.log(addedType);
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
          fail: function (res) {
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
        wx.showToast({
          title: '检测到您尚未登录或者登录状态过期，请重新登录。',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    });
  },
  loadMore: function () {
    var page = this;
    var school = app.globalData.school;
    var inputValue = page.data.inputVal;
    var next_page_url = page.data.next_page_url;
    wx.getStorage({
      key: 'uidIndex',
      success: function (res) {
        //符合发送请求条件
        wx.request({
          url: next_page_url,
          data: { actionType: 'getAllKeyWords', school: school, keyword: inputValue, uidIndex: res.data},
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            //出现异常
            if (res.statusCode != 200) {
              wx.showToast({
                title: '网络异常：getAllKeyWords',
                icon: 'none',
                duration: 1500,
                mask: true
              });
              return;
            }
            if (res.data.error != '') {
              wx.showToast({
                title: res.data.error,
                icon: 'none',
                duration: 1500,
                mask: true,
              });
              return;
            }
            page.setData({
              requiredReccordArray: res.data.recordArray,
              inputShowed: false,
              keyWordArray: [],
              next_page_url: res.data.next_page_url ? res.data.next_page_url : null
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '网络异常：getAllKeyWords',
              icon: 'none',
              duration: 1500,
              mask: true
            });
          }
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '检测到您尚未登录或者登录状态过期，请重新到【个人中心】登录。',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }

    })
  },
  navigationToAccusation: function (paperId) {
    wx.navigateTo({
      url: '/pages/agency/accusation/accusation?paperId=' + paperId,
      fail: function (res) {
        wx.showToast({
          title: '跳转到举报页面失败',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: true,
        })
      }
    })
  }

})