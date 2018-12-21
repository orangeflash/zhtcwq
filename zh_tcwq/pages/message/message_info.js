// zh_tcwq/pages/message/message_info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    speak: false,
    hydl: false,
  },
  updateUserInfo: function (res) {
    console.log(res)
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        hydl: false,
      })
      this.getuserinfo();
    }
  },
  // --------------------------------------------图片预览
  previewImage: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var inde = e.currentTarget.dataset.inde
    var pictures = that.data.info.imgs

    for (let i in pictures) {
      urls.push(url + pictures[i]);
    }
    wx.previewImage({
      current: url + pictures[inde],
      urls: urls
    })
  },
  getuserinfo:function(){
    var that = this
    wx.login({
      success: function (res) {
        console.log('这是登录所需要的code')
        console.log(res.code)
        var code = res.code
        wx.setStorageSync("code", code)
        wx.getSetting({
          success: function (res) {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  var nickName = res.userInfo.nickName
                  var avatarUrl = res.userInfo.avatarUrl
                  app.util.request({
                    'url': 'entry/wxapp/openid',
                    'cachetime': '0',
                    data: { code: code },
                    success: function (res) {
                      var img = avatarUrl
                      var name = nickName
                      var openid = res.data.openid
                      app.util.request({
                        'url': 'entry/wxapp/Login',
                        'cachetime': '0',
                        data: { openid: openid, img: img, name: name },
                        success: function (res) {
                          console.log(res)
                          that.setData({
                            username: res.data.name,
                            user_id: res.data.id
                          })
                          that.refresh()
                        },
                      })
                    },
                  })
                }
              })
            }
            else {
              console.log('未授权过')
              that.setData({
                hydl: true,
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var id = options.id
    var that = this
    that.setData({
      id: id,
    })
    if (wx.getStorageSync('users')) {
      var user_info = wx.getStorageSync('users')
      var user_id = wx.getStorageSync('users').id
      that.setData({
        username: user_info.name,
        user_id: user_id
      })
      that.refresh()
    }
    else{
      this.getuserinfo()
    }
    if (wx.getStorageSync('System')) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: wx.getStorageSync('System').color,
      })
      that.setData({
        system: wx.getStorageSync('System')
      })
    }
    else {
      app.util.request({
        'url': 'entry/wxapp/System',
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          that.setData({
            system: res.data,
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: res.data.color,
          })
          var system = res.data
          console.log(system)
          that.setData({
            system: system
          })
        }
      })
    }
    //---------------------------------- 获取网址----------------------------------
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      },
    })
  },
  refresh: function (e) {
    var that = this
    var id = that.data.id
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "/";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
      return currentdate;
    }
    var user_id = that.data.user_id
    var time = getNowFormatDate()
    app.util.request({
      'url': 'entry/wxapp/ZxInfo',
      'cachetime': '0',
      data: { id: id, user_id: user_id },
      success: function (res) {
        console.log(res)
        var info = res.data
        if (info.img == null) {
          info.type = 1
        } else {
          info.type = 2
        }
        info.content = info.content.replace("↵", "\n");
        var dt1 = time;
        var dt2 = info.time.replace(/-/g, "/")
        var regTime = /(\d{4})-(\d{1,2})-(\d{1,2})( \d{1,2}:\d{1,2})/g;
        var interval = Math.abs(Date.parse(dt1.replace(regTime, "$2-$3-$1$4")) - Date.parse(dt2.replace(regTime, "$2-$3-$1$4"))) / 1000;
        var h = Math.floor(interval / 3600);
        var m = Math.floor(interval % 3600 / 60);
        info.m = Number(h)
        info.h = Number(m)
        console.log(h + " 小时 " + m + " 分钟");
        console.log(time)
        if (info.imgs != null) {
          info.imgs = info.imgs.split(",")
        }
        console.log(info)
        info.time = info.time.slice(0, 16)
        app.util.request({
          'url': 'entry/wxapp/ZxPlList',
          'cachetime': '0',
          data: { zx_id: info.id },
          success: function (res) {
            console.log(res)
            info.pl = res.data
            that.setData({
              info: info
            })
          },
        })
        app.util.request({
          'url': 'entry/wxapp/ZxLikeList',
          'cachetime': '0',
          data: { zx_id: info.id },
          success: function (res) {
            console.log(res)
            that.setData({
              thumbs_up: res.data
            })
          },
        })
        app.util.request({
          'url': 'entry/wxapp/Footprint',
          'cachetime': '0',
          data: { zx_id: info.id, user_id: user_id },
          success: function (res) {
            console.log(res)

          },
        })
      },

    })
  },
  speak: function (e) {
    this.setData({
      speak: true,
      speak_type: 1
    })
  },
  speak1: function (e) {
    this.setData({
      speak: false
    })
  },
  speak3: function (e) {
    console.log(e)
    var user_id = wx.getStorageSync("users").id
    if (user_id != this.data.info.user_id) {
      wx: wx.showModal({
        title: '提示',
        content: '只有管理员才可以回复',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      this.setData({
        speak: true,
        speak_type: 2,
        speak_id: e.currentTarget.id
      })

    }
  },
  speaks: function (e) {
    console.log(e)
    var that = this
    var value = e.detail.value
    that.setData({
      value: value
    })
  },
  Collection: function (e) {
    var that = this
    var info = that.data.info
    var user_id = that.data.user_id
    app.util.request({
      'url': 'entry/wxapp/ZxLike',
      'cachetime': '0',
      data: { zx_id: info.id, user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data == 1) {
          wx: wx.showToast({
            title: '点赞成功',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          setTimeout(function () {
            that.refresh()
          }, 2000)
        } else {
          wx: wx.showModal({
            title: '提示',
            content: res.data,
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        that.setData({
          Collection: res.data
        })
      },
    })
  },
  speak2: function (e) {
    var that = this
    var value = that.data.value
    console.log(value)
    if (value == null || value == '') {
      wx: wx.showModal({
        title: '提示',
        content: '还没输入内容哦',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      var user_id = that.data.user_id
      var zx_id = that.data.info.id
      var speak_type = that.data.speak_type
      var speak_id = that.data.speak_id
      if (speak_type == 1) {
        app.util.request({
          'url': 'entry/wxapp/ZxPl',
          'cachetime': '0',
          data: { zx_id: zx_id, content: value, user_id: user_id },
          success: function (res) {
            console.log(res)
            if (res.data == 1) {
              wx: wx.showToast({
                title: '发布成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
              setTimeout(function (e) {
                that.refresh()
                that.setData({
                  speak: false
                })
              }, 2000)
            }
          },
        })
      } else {
        app.util.request({
          'url': 'entry/wxapp/ZxHf',
          'cachetime': '0',
          data: { id: speak_id, reply: value },
          success: function (res) {
            console.log(res)
            if (res.data == 1) {
              wx: wx.showToast({
                title: '回复成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
              setTimeout(function (e) {
                that.refresh()
                that.setData({
                  speak: false
                })
              }, 2000)
            }
          },
        })
      }
    }

  },
  shouye: function (e) {
    // wx:wx.navigateTo({
    //   url: 'footprint',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    wx: wx.reLaunch({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // share:function(e){
  //   wx.showShareMenu({
  //     withShareTicket: true
  //   })
  // },
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
    this.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var info = this.data.info, username = this.data.username;
    console.log(info)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      // title: username + '邀请你来看看' + info.title,
      path: 'zh_tcwq/pages/message/message_info?id=' + info.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})