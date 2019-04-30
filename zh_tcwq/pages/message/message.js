// zh_tcwq/pages/message/message.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    types: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
        that.setData({
          system: res.data
        })
      },
    })
    app.pageOnLoad(this);
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // ---------------------------------- 异步保存网址前缀----------------------------------
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    // -----------------------------
    // 获取资讯分类
    // -----------------------------
    app.util.request({
      'url': 'entry/wxapp/ZxType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          zx: res.data
        })
      }
    })
    // -----------------------------
    // 获取轮播图
    // -----------------------------
    var city = wx.getStorageSync('city')
    console.log('轮播图的城市为' + city)
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        console.log(res)
        var slide = []
        for (let i in res.data) {
          if (res.data[i].type == 3) {
            slide.push(res.data[i])
          }
        }
        console.log(slide)
        var top = 0
        if (slide.length != 0) {
          that.setData({
            top: 600
          })
        } else {
          that.setData({
            top: 300
          })
        }
        console.log(top)
        that.setData({
          slide: slide
        })
      },
    })
    // -----------------------------
    // 获取资讯列表
    // -----------------------------

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
    var time = getNowFormatDate()

    var asp = /<img +src=\\?"([^"\\]+)\\?"/i
    var city = wx.getStorageSync('city')
    console.log('城市为' + city)
    var page = that.data.page
    var info = that.data.info
    if (page == null) {
      page = 1
    }
    if (info == null) {
      info = []
    }
    app.util.request({
      'url': 'entry/wxapp/ZxList',
      'cachetime': '0',
      data: { page: that.data.page, cityname: city },
      success: function (res) {
        console.log(res)
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1
          })
          info = info.concat(res.data)
          for (let i in res.data) {
            res.data[i].time = res.data[i].time.slice(0, 16)
            if (res.data[i].img == null) {
              res.data[i].type = 1
            } else {
              res.data[i].type = 2
            }
            var dt1 = time;
            var dt2 = res.data[i].time.replace(/-/g, "/")
            var regTime = /(\d{4})-(\d{1,2})-(\d{1,2})( \d{1,2}:\d{1,2})/g;
            var interval = Math.abs(Date.parse(dt1.replace(regTime, "$2-$3-$1$4")) - Date.parse(dt2.replace(regTime, "$2-$3-$1$4"))) / 1000;
            var h = Math.floor(interval / 3600);
            var m = Math.floor(interval % 3600 / 60);
            res.data[i].m = h
            res.data[i].h = m
            console.log(h + " 小时 " + m + " 分钟");
            res.data[i].imgs = res.data[i].imgs.split(",").slice(0, 3)
          }

        }

        console.log(info)
        that.setData({
          info: info,
          info1: info
        })
      },
    })
  },
  jumps: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src

    if (src == '') {
      console.log('没有商家地址')
      if (appid != '') {
        wx: wx.showModal({
          title: '提示',
          content: '是否跳转到' + name,
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '',
          success: function (res) {
            if (res.confirm == true) {
              wx.navigateToMiniProgram({
                appId: appid,
                path: '',
                extraData: {
                  foo: 'bar'
                },
                envVersion: 'develop',
                success(res) {
                  // 打开成功
                  that.setData({
                    averdr: true
                  })
                }
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        that.setData({
          averdr: true
        })
      }

    } else {
      if (appid == '') {
        console.log('没有小程序地址')
        var s1 = src.replace(/[^0-9]/ig, "");
        src = src.replace(/(\d+|\s+)/g, "");
        src = src
        console.log(src)
        wx: wx.navigateTo({
          url: src + Number(s1),
          success: function (res) {
            that.setData({
              averdr: true
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        console.log('两个都有')
        wx: wx.showModal({
          title: '提示',
          content: '是否跳转到' + name,
          showCancel: true,
          cancelText: '取消',
          cancelColor: '',
          confirmText: '确定',
          confirmColor: '',
          success: function (res) {
            if (res.confirm == true) {
              wx.navigateToMiniProgram({
                appId: appid,
                path: '',
                extraData: {
                  foo: 'bar'
                },
                envVersion: 'develop',
                success(res) {
                  // 打开成功
                  that.setData({
                    averdr: true
                  })
                }
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }

  },
  click: function (e) {
    console.log(e)
    var that = this
    var zx = that.data.zx
    var info1 = that.data.info1
    var info = that.data.info
    var index = e.currentTarget.dataset.index
    var active_index = index
    console.log(zx)
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
    var time = getNowFormatDate()
    var city = wx.getStorageSync('city')
  
    app.util.request({
      'url': 'entry/wxapp/ZxList',
      'cachetime': '0',
      data: { type_id: zx[index].id, cityname: city },
      success: function (res) {
        console.log(res)
        var info = res.data
        for (let i in info) {
          var reg = /<img[^>]*src[=\'\"\s]+([^\"\']*)[\"\']?[^>]*>/gi;
          info[i].time = info[i].time.slice(0, 16)
          if (info[i].img == null) {
            info[i].type = 1
          } else {
            info[i].type = 2
          }
          var dt1 = time;
          var dt2 = info[i].time.replace(/-/g, "/")
          var regTime = /(\d{4})-(\d{1,2})-(\d{1,2})( \d{1,2}:\d{1,2})/g;
          var interval = Math.abs(Date.parse(dt1.replace(regTime, "$2-$3-$1$4")) - Date.parse(dt2.replace(regTime, "$2-$3-$1$4"))) / 1000;
          var h = Math.floor(interval / 3600);
          var m = Math.floor(interval % 3600 / 60);
          info[i].m = h
          info[i].h = m
          console.log(h + " 小时 " + m + " 分钟");
          info[i].imgs = info[i].imgs.split(",").slice(0, 3)
        }
        console.log(info)
        that.setData({
          info: info
        })
      },
    })
    that.setData({
      zx: zx,
      types: 2,
      active_index: active_index,
      index: index
    })
  },
  click1: function (e) {
    var that = this
    var zx = that.data.zx
    var info1 = that.data.info1
    that.setData({
      types: 1,
      zx: zx,
      index: -1,
      info: info1,
      active_index: -1
    })
  },
  message: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: 'message_info?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  release: function (e) {
    wx: wx.navigateTo({
      url: 'release',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    // this.refresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.setData({
    //   page: 1,
    //   info: []
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.setData({
    //   page: 1,
    //   info: []
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      index: 0,
      types: 1,
      info: [],
      active_index: -1
    })
    this.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.refresh_top == false) {
      this.refresh()
    } else {

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})