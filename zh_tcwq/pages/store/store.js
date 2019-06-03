// pages/seller/seller.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    djss:false,
    luntext: ['附近', '新入', '热门'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 35,
    currentTab: 0,
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    refresh_top: false,
    star: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }
    ],
    star1: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }
    ],
    star2: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }
    ],
    star3: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }
    ],
    star4: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/star_none.png'
      }
    ],
  },
  hddb: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })

  },
  // ————————————热门附近的点击事件——————————————————
  tabClick: function (e) {
    var index = e.currentTarget.id
    console.log(this.data, this.data.business, index)
    var store = this.data.business
    this.setData({
      refresh_top: false,
      page: 1,
      type: parseInt(index) + 1,
      business: [],
      // sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.refresh()
  },
  // ----------------------------------同城合伙人----------------------------------
  redinfo: function (e) {
    var that = this, user_id = wx.getStorageSync('users').id;
    //用户是否申请
    app.util.request({
      'url': 'entry/wxapp/MyDistribution',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if (res.data.state == '2') {
          console.log('是分销商')
          wx.navigateTo({
            url: '../distribution/yaoqing',
          })
        }
        else if (res.data.state == '1') {
          wx.showModal({
            title: '提示',
            content: '您的申请正在审核中，请耐心等待',
          })
        }
        else {
          wx.navigateTo({
            url: '../distribution/jrhhr',
          })
        }
      }
    });
  },
  jumps: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src
    var wb_src = e.currentTarget.dataset.wb_src
    var ggid = e.currentTarget.dataset.id
    var sjtype = e.currentTarget.dataset.sjtype
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
        url: '../car/car?vr='  + ggid + '&sjtype=' + sjtype,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.pageOnLoad(this);
    app.setNavigationBarColor(this);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    that.setData({
      store_name: wx.getStorageSync('System').link_name,
      msgList1: wx.getStorageSync('msgList1'),
      System: wx.getStorageSync('System'),
      userinfo: wx.getStorageSync("users"),
    })
    app.getLocation(function (location) {
      console.log(location)
      that.setData({
        lat: location.latitude,
        lng: location.longitude,
      })
      that.refresh()
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    var url = wx.getStorageSync('url')
    that.setData({
      url: url
    })
    // ----------------------------------获取分类的集合----------------------------------
    app.util.request({
      'url': 'entry/wxapp/StoreType',
      'cachetime': '0',
      success: function (res) {
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
        that.setData({
          nav: nav
        })
      },
    })

    //---------------------------------- 获取轮播图集合----------------------------------
    var city = wx.getStorageSync('city')
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        var slide = []
        for (let i in res.data) {
          if (res.data[i].type == 2) {
            slide.push(res.data[i])
          }
        }
        that.setData({
          slide: slide
        })
      },
    })
  },
  refresh: function () {
    var that = this
    var city = wx.getStorageSync('city'), page = that.data.page || 1, type = that.data.type || 1, business = that.data.business || [];
    console.log('城市为' + city, page, type, business)
    // ----------------------------------获取商家列表----------------------------------
    app.util.request({
      'url': 'entry/wxapp/StoreList',
      'cachetime': '0',
      data: { type: type, lat: that.data.lat, lng: that.data.lng, page: page, cityname: city },
      success: function (res) {
        console.log(res)
        for (let x in res.data){
          res.data[x].distance = (parseFloat(res.data[x].juli) / 1000).toFixed(2)
          res.data[x].ad = res.data[x].ad.split(",")
        } 
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
          if (page == 1) {
            that.setData({
              store: [],
              business: [],
              fjpx: [],
              store1: []
            })
          }
        } else {
          that.setData({
            page: page + 1,
            refresh_top: false
          })
          business = business.concat(res.data)
          that.setData({
            store: business,
            business: business,
          })
        }
      },
    })
    app.util.request({
      'url': 'entry/wxapp/news',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        var msgList1 = []
        for (let i in res.data) {
          if (res.data[i].type == 2) {
            msgList1.push(res.data[i])
          }
        }
        that.setData({
          msgList: msgList1
        })
      },
    })
  },
 
  // -----------------------------------跳转入驻界面-------------------------------
  sellted: function (e) {
    wx: wx.navigateTo({
      url: '../settled/settled',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // -----------------------------------跳转商家详情界面-------------------------------
  store: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../sellerinfo/sellerinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ----------------------------------发帖----------------------------------
  notice: function (e) {
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../notice/notice?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ----------------------------------拨打电话----------------------------------
  phone: function (e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  store_type_id: function (e) {
    var id = e.currentTarget.dataset.id, name = e.currentTarget.dataset.name;
    wx: wx.navigateTo({
      url: 'business?id=' + id + '&typename=' + name,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  bindinput: function (e) {
    var that = this
    var value = e.detail.value

    that.setData({
      value: value
    })
  },
  sqss:function(){
    this.setData({
      djss:false,
    })
  },
  search: function (e) {
    var value = this.data.value,that=this;
    console.log(value)
    that.setData({
      ssjgarr: [],
      djss: false,
    })
    if (value != '') {
      app.util.request({
        'url': 'entry/wxapp/StoreList',
        'cachetime': '0',
        data: { keywords: value, page: 1, pagesize: 50 },
        success: function (res) {
          console.log(res)
          that.setData({
            djss:true,
            ssjgarr:res.data,
          })
        }
      })
    }
    else{
      wx.showToast({
        title: '请输入内容',
        icon:'loading'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      first: 1
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
    // this.setData({
    //   page:1,
    //   business: [],
    //   store: []
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.setData({
    //   page: 1,
    //   business: [],
    //   store:[]
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.reload()
    this.setData({
      page: 1,
      business: [],
      store: []
    })
    var that = this;
    app.getLocation(function (location) {
      console.log(location)
      that.setData({
        lat: location.latitude,
        lng: location.longitude,
      })
      that.refresh()
    })
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