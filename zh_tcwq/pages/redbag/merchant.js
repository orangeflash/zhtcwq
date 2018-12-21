// zh_tcwq/pages/merchant/merchant.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iszd: false,
    countryIndex: 0,
    countries: ["本地", "全国"],
  },
  cartaddformSubmit: function (e) {
    console.log('formid', e.detail.formId)
    var that = this, user_id = that.data.seller.user_id;
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: { user_id: user_id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
        that.reLoad();
      },
    })
  },
  reLoad: function () {
    var that = this, admin_id = that.data.seller.user_id;
    app.util.request({
      'url': 'entry/wxapp/MyFormId',
      'cachetime': '0',
      data: { user_id: admin_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          sycs: res.data
        })
      },
    })
  },
  bindCountryChange: function (e) {
    var stick = this.data.stick
    console.log('picker country 发生选择改变，携带值为', e.detail.value, stick);
    var that = this;
    this.setData({
      countryIndex: e.detail.value,
    })
  },
  qxzd: function () {
    this.setData({
      iszd: false,
    })
  },
  dkxf: function (e) {
    this.setData({
      iszd: true,
    })
  },
  fbyhq: function () {
    wx.navigateTo({
      url: '../wdq/fbyhq?store_id=' + this.data.seller.id,
    })
  },
  glyhq: function () {
    wx.navigateTo({
      url: '../wdq/glyhq/glyhq?store_id=' + this.data.seller.id,
    })
  },
  hxdd: function () {
    wx.setStorageSync('hxsjid', this.data.seller.id)
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '../' + path.substring(14)
        wx.navigateTo({
          url: tnurl,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        wx.removeStorageSync('hxsjid')
        // wx.showToast({
        //   title: '二维码错误',
        //   image:'../images/x.png'
        // })
      }
    })
  },
  hxyhq: function () {
    wx.setStorageSync('hxsjid', this.data.seller.id)
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '/' + path
        wx.navigateTo({
          url: tnurl,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        wx.removeStorageSync('hxsjid')
        // wx.showToast({
        //   title: '二维码错误',
        //   image:'../images/x.png'
        // })
      }
    })
  },
  //
  fqgsp: function () {
    wx.navigateTo({
      url: '../xsqg/fqgsp?store_id=' + this.data.seller.id,
    })
  },
  wqgsp: function () {
    wx.navigateTo({
      url: '../xsqg/wqpsp?store_id=' + this.data.seller.id,
    })
  },
  wqgdd: function () {
    wx.navigateTo({
      url: '../xsqg/qgdd',
    })
  },
  hxqgdd: function () {
    var sjid = this.data.seller.id
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '/' + path
        wx.navigateTo({
          url: tnurl + '&storeid=' + sjid,
        })
      },
      fail: (res) => {
        console.log('扫码fail')
        // wx.showToast({
        //   title: '二维码错误',
        //   image:'../images/x.png'
        // })
      }
    })
  },
  //
  fptsp: function () {
    wx.navigateTo({
      url: '../collage/fptsp?store_id=' + this.data.seller.id,
    })
  },
  wptsp: function () {
    wx.navigateTo({
      url: '../collage/wptsp?store_id=' + this.data.seller.id,
    })
  },
  ptdd: function () {
    wx.navigateTo({
      url: '../collage/ptdd',
    })
  },
  ptgl: function () {
    wx.navigateTo({
      url: '../collage/ptgl',
    })
  },
  // --------------------------------------选择的置顶信息-------------------------------------
  selected: function (e) {
    var that = this, countryIndex = this.data.countryIndex;
    var index = e.currentTarget.id, openid = wx.getStorageSync("openid"), user_id = wx.getStorageSync('users').id;
    var stick = that.data.stick, money = countryIndex == 0 ? stick[index].money : stick[index].money2, type = stick[index].type, xfid = this.data.seller.id;
    var cityname = that.data.countryIndex == 0 ? '本地' : '全国版', cityname2 = wx.getStorageSync('city');
    console.log('city', cityname,cityname2)
    that.setData({
      iszd: false,
    })
    console.log(money, type, xfid)
    if (Number(money) <= 0) {
      app.util.request({
        'url': 'entry/wxapp/SjXf',
        'cachetime': '0',
        data: { id: xfid, type: type, cityname: cityname, cityname2: cityname2 },
        success: function (res) {
          console.log(res)
          if (res.data == '1') {
            wx.showToast({
              title: '续费成功',
            })
            setTimeout(function () {
              that.refresh1()
            }, 1000)
          }
        },
      })
    }
    else {
      app.util.request({
        'url': 'entry/wxapp/Pay',
        'cachetime': '0',
        data: { openid: openid, money: money },
        success: function (res) {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              wx.showModal({
                title: '提示',
                content: '支付成功',
                showCancel: false,
              })
            },
            'complete': function (res) {
              console.log(res);
              if (res.errMsg == 'requestPayment:fail cancel') {
                wx.showToast({
                  title: '取消支付',
                  icon: 'loading',
                  duration: 1000
                })
              }
              if (res.errMsg == 'requestPayment:ok') {
                app.util.request({
                  'url': 'entry/wxapp/SjXf',
                  'cachetime': '0',
                  data: { id: xfid, type: type, cityname: cityname, cityname2: cityname2 },
                  success: function (res) {
                    console.log(res)
                  },
                })
                app.util.request({
                  'url': 'entry/wxapp/SaveStorePayLog',
                  'cachetime': '0',
                  data: { store_id: xfid, money: money, note: '入驻续费' },
                  success: function (res) {
                    console.log('这是续费成功')
                    console.log(res)
                  },
                })
                app.util.request({
                  'url': 'entry/wxapp/fx',
                  'cachetime': '0',
                  data: { user_id: user_id, money: money },
                  success: res => {
                    console.log(res)
                  }
                })
                setTimeout(function () {
                  that.refresh1()
                }, 1000)
              }
            }
          })
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,userid=wx.getStorageSync('users').id
    console.log(options, userid)
    wx.hideShareMenu()
    app.setNavigationBarColor(this);
    var money = wx.getStorageSync('users').money
    if (money == null) {
      var money = 0
    }
    var url = wx.getStorageSync('url')
    that.setData({
      url: url
    })
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    };
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: options.id },
      success: function (res) {
        console.log(res)
        wx.setStorageSync('sjdsjid', res.data.store[0].id)
        if (userid == res.data.store[0].user_id) {
          that.setData({
            isgly: true
          })
        }
        that.setData({
          seller: res.data.store[0]
        })
        that.refresh()
        that.reLoad();
      },
    })
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          System: res.data
        })
      },
    })
    // -------------------------------获取置顶费用-------------------------
    app.util.request({
      'url': 'entry/wxapp/InMoney',
      'cachetime': '0',
      success: res => {
        console.log(res);
        var stick = res.data
        for (let i in stick) {
          // if (stick[i].money > 0) {
          //   stick[i].money1 = '（收费' + stick[i].money + '元）'
          // } else {
          //   stick[i].money1 = '  免费'
          // }
          stick[i].money1 = '（收费'
          if (stick[i].type == 1) {
            stick[i].array = '一周' + stick[i].money1
            stick[i].hidden1 = false
          } else if (stick[i].type == 2) {
            stick[i].array = '半年' + stick[i].money1
            stick[i].hidden1 = true
          } else if (stick[i].type == 3) {
            stick[i].array = '一年' + stick[i].money1
            stick[i].hidden1 = true
          }
        }
        console.log(stick)
        that.setData({
          stick: stick,
        })
      }
    })
  },
  refresh1: function () {
    var that = this;
    var store_id = that.data.seller.id
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: store_id },
      success: function (res) {
        console.log(res)
        that.setData({
          seller: res.data.store[0]
        })
        that.refresh()

      },
    })
  },
  refresh: function (e) {
    var that = this
    console.log(that.data.seller)
    this.setData({
      dqdate: app.ormatDate(that.data.seller.dq_time).substring(0, 10),
    })
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
    var time = getNowFormatDate().slice(0, 10)
    console.log(time)
    var store_id = that.data.seller.id
    app.util.request({
      'url': 'entry/wxapp/Profit',
      'cachetime': '0',
      data: {
        store_id: store_id
      },
      success: function (res) {
        console.log(res)
        that.setData({
          myye: res.data,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/StoreOrder',
      'cachetime': '0',
      data: {
        store_id: store_id
      },
      success: function (res) {
        console.log(res)
        var order = res.data
        var order_num = []
        for (let i in order) {
          order[i].time = app.ormatDate(order[i].time).slice(0, 10)
          order[i].time = order[i].time.replace(/-/g, "/")
          if (time == order[i].time) {
            order_num.push(order[i])
          }
        }
        that.setData({
          order_num: order_num.length
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  yemx: function (e) {
    var that = this;
    wx.navigateTo({
      url: 'wallet/wallet?store_id=' + that.data.seller.id,
    })
  },
  // 我的店铺
  more: function (e) {
    console.log(e)
    var store_id = this.data.seller.id
    wx: wx.navigateTo({
      url: '../sellerinfo/sellerinfo?id=' + store_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  cash: function (e) {
    wx: wx.navigateTo({
      url: '../logs/cash?&state=' + 2 + '&store_id=' + this.data.seller.id + '&profit=' + this.data.seller.wallet,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ---------------------代发货----------------
  activeIndex_one: function (e) {
    wx: wx.navigateTo({
      url: 'mine_order?activeIndex=' + 1 + '&store_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ---------------------待收货----------------
  activeIndex_two: function (e) {
    wx: wx.navigateTo({
      url: 'mine_order?activeIndex=' + 0 + '&store_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ---------------------已完成----------------
  activeIndex_three: function (e) {
    wx: wx.navigateTo({
      url: 'mine_order?activeIndex=' + 3 + '&store_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ---------------------售后----------------
  activeIndex_four: function (e) {
    wx: wx.navigateTo({
      url: 'mine_order?activeIndex=' + 4 + '&store_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  fuck: function (e) {
    wx: wx.navigateTo({
      url: '../logs/publish?store_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ——————————————
  customer: function (e) {
    wx: wx.navigateTo({
      url: 'customer/customer?user_id=' + this.data.seller.id,
    })
  },
  welfare: function (e) {
    wx: wx.navigateTo({
      url: 'welfare?user_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  sent: function (e) {
    wx: wx.navigateTo({
      url: 'sent?user_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  mechat: function (e) {
    wx: wx.navigateTo({
      url: '../logs/index?user_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  mine_shop: function (e) {
    wx: wx.navigateTo({
      url: 'commodity?store_id=' + this.data.seller.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  interests: function (e) {
    wx: wx.showModal({
      title: '提示',
      content: '此功能暂未开放',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  vip: function (e) {
    wx: wx.showModal({
      title: '提示',
      content: '此功能暂未开放',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  tuichu: function (e) {
    wx.removeStorage({
      key: 'store_info',
      success: function (res) {
        wx.showToast({
          title: '退出登陆',
        })
        setTimeout(function () {
          wx: wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onLoad()
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

  }
})