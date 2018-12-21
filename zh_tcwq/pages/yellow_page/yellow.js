// zh_tcwq/pages/active/active.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['附近发现', '最新收录', '热门推荐'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 35,
    currentTab: 0,
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    refresh_top: false,
    yellow_list: [],
    page: 1
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = wx.getStorageSync('url')
    that.setData({
      url: url,
      system: wx.getStorageSync('System')
    })
    wx.setNavigationBarTitle({
      title: getApp().xtxx.hy_title,
    })
    app.setNavigationBarColor(this);
    // ----------------------------------获取分类的集合----------------------------------
    app.util.request({
      'url': 'entry/wxapp/yellowType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var store = res.data
        // ----------------------------------高度随分类的数量去改变----------------------------------
        if (store.length <= 5) {
          that.setData({
            height: 165
          })
        } else if (store.length > 5) {
          that.setData({
            height: 340
          })
        }
        // ----------------------------------把分类以10个位一组分隔开----------------------------------
        var nav = []
        for (var i = 0, len = store.length; i < len; i += 10) {
          nav.push(store.slice(i, i + 10))
        }
        console.log(nav)
        that.setData({
          nav: nav
        })
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })

    //---------------------------------- 获取轮播图集合----------------------------------

    var city = wx.getStorageSync('city')
    console.log('轮播图的城市为' + city)
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        var slide = []
        for (let i in res.data) {
          if (res.data[i].type == 6) {
            slide.push(res.data[i])
          }
        }
        that.setData({
          slide: slide
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Llz',
      'cachetime': '0',
      data: { cityname: wx.getStorageSync('city'), type: 3 },
      success: function (res) {
        console.log(res)
        that.setData({
          unitid: res.data,
        })
      },
    })
    app.getLocation(function (location) {
      console.log(location)
      that.setData({
        lat: location.latitude,
        lng: location.longitude,
      })
      that.refresh()
    })
  },
  refresh: function (e) {
    var that = this
    var city = wx.getStorageSync('city')
    console.log('城市为' + city)
    var page = that.data.page, type = that.data.type || 1;
    var yellow_list = that.data.yellow_list1
    if (page == null) {
      page = 1
    }
    if (yellow_list == null) {
      yellow_list = []
    }
    console.log('page为' + city)
    // 商家行业分类
    app.util.request({
      'url': 'entry/wxapp/YellowPageList',
      'cachetime': '0',
      data: { type: type, lat: that.data.lat, lng: that.data.lng,page: page, cityname: city },
      success: function (res) {
        console.log(res)
        if (res.data == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          yellow_list = yellow_list.concat(res.data)
          for (let x in res.data) res.data[x].distance = (parseFloat(res.data[x].juli) / 1000).toFixed(2)
          that.setData({
            yellow_list: yellow_list,
            yellow_list1: yellow_list,
            page: page + 1,
            refresh_top: false
          })
        }
      }
    })
  },
  search: function (e) {
    var that = this
    console.log(e)
    var value = e.detail.value
    if (value == '') {
      that.setData({
        search_yellow: []
      })
    } else {
      app.util.request({
        'url': 'entry/wxapp/YellowPageList',
        'cachetime': '0',
        data: { keywords: value },
        success: function (res) {
          console.log(res)
          that.setData({
            search_yellow: res.data
          })
        }
      })
    }
  },

  tabClick: function (e) {
    var index = e.currentTarget.id
    console.log(index)
    var yellow_list1 = this.data.yellow_list1
    console.log(this.data, yellow_list1, index)
    this.setData({
      refresh_top: false,
      page: 1,
      type: parseInt(index) + 1,
      yellow_list1: [],
      activeIndex: e.currentTarget.id
    });
    this.refresh()
  },
  yellow_info: function (e) {
    var id = e.currentTarget.dataset.id
    var user_id = e.currentTarget.dataset.user_id
    console.log(user_id)
    wx: wx.navigateTo({
      url: 'yellowinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // app.util.request({
    //   'url': 'entry/wxapp/MyStore',
    //   'cachetime': '0',
    //   data: { user_id: user_id },
    //   success: function (res) {
    //     console.log(res)
    //     if (res.data == false) {
    //       wx: wx.navigateTo({
    //         url: 'yellowinfo?id=' + id,
    //         success: function (res) { },
    //         fail: function (res) { },
    //         complete: function (res) { },
    //       })
    //     } else {
    //       var seller = res.data
    //       wx: wx.navigateTo({
    //         url: '../sellerinfo/sellerinfo?id=' + seller.id,
    //         success: function (res) { },
    //         fail: function (res) { },
    //         complete: function (res) { },
    //       })
    //     }
    //   }
    // })

  },
  sellted: function (e) {
    wx: wx.navigateTo({
      url: 'settled',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  store_type_id: function (e) {
    var id = e.currentTarget.dataset.id, typename = e.currentTarget.dataset.typename
    wx: wx.navigateTo({
      url: 'yellowtype?id=' + id + '&typename=' + typename,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 我入驻的114
  mine_yellow: function (e) {
    wx.redirectTo({
      url: 'mine_yellow',
    })
  },
  // 返回首页
  shouye: function (e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  jumps: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src
    var ggid = e.currentTarget.dataset.id
    var sjtype = e.currentTarget.dataset.sjtype
    console.log(ggid)
    var type = e.currentTarget.dataset.type
    if (type == 1) {
      console.log(src)
      if (src == '../distribution/jrhhr') {
        that.redinfo();
        return false
      }
      wx: wx.navigateTo({
        url: src,
        success: function (res) {
          that.setData({
            averdr: true
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (type == 2) {
      wx: wx.navigateTo({
        url: '../car/car?vr=' + ggid + '&sjtype=' + sjtype,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (type == 3) {
      wx.navigateToMiniProgram({
        appId: appid,
        path: '',
        extraData: {
          foo: 'bar'
        },
        // envVersion: 'develop',
        success(res) {
          // 打开成功
          that.setData({
            averdr: true
          })
        }
      })
    }
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
    this.setData({
      page: 1,
      yellow_list: []
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
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})