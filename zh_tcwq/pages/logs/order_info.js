// zh_tcwq/pages/logs/order_info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  tzkf: function () {
    wx.navigateTo({
      url: '../content/content',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    var url = wx.getStorageSync('url')
    that.setData({
      id:options.id,
      store_id:options.store_id,
      url: url
    })
    that.refresh()
  },
  refresh:function(e){
    var that = this
    var id = that.data.id
    var store_id = that.data.store_id
    console.log(store_id)
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: store_id },
      success: res => {
        console.log(res);
      }
    })
    app.util.request({
      'url': 'entry/wxapp/OrderInfo',
      'cachetime': '0',
      data: { order_id: id },
      success: res => {
        console.log(res);
        res.data.time = app.ormatDate(res.data.time).slice(0, 16)
        var shop_price = res.data.good_money * res.data.good_num

        that.setData({
          order: res.data,
          shop_price: shop_price.toFixed(2)
        })
      }
    })
  },
  // -----------------------------申请退款----------------------------
  toorder: function (e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    app.util.request({
      'url': 'entry/wxapp/TuOrder',
      'cachetime': '0',
      data: { order_id: id },
      success: function (res) {
        console.log(res)
        wx: wx.showToast({
          title: '发起退款申请',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        setTimeout(function () {
          wx: wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      },
    })
  },
  // -----------------------------删除订单----------------------------
  delorder: function (e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    app.util.request({
      'url': 'entry/wxapp/DelOrder',
      'cachetime': '0',
      data: { order_id: id },
      success: function (res) {
        console.log(res)
        wx: wx.showToast({
          title: '订单删除成功',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        setTimeout(function () {
          wx: wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      },
    })
  },
  // -------------------------付款-------------------------------------
  pay: function (e) {
    var that = this
    var openid = wx.getStorageSync("openid")
    var id = e.currentTarget.dataset.id
    var money = e.currentTarget.dataset.money
    app.util.request({
      'url': 'entry/wxapp/Pay',
      'cachetime': '0',
      data: { openid: openid, money: money},
      success: function (res) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            console.log('这里是支付成功')
            console.log(res)
            app.util.request({
              'url': 'entry/wxapp/PayOrder',
              'cachetime': '0',
              data: { order_id: id },
              success: function (res) {
                console.log('改变订单状态')
                console.log(res)
                wx:wx.showToast({
                  title: '付款成功',
                  icon: '',
                  image: '',
                  duration: 2000,
                  mask: true,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
                setTimeout(function(){
                  wx:wx.navigateBack({
                    delta: 1,
                  })
                },2000)
              },
            })
          },

          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              duration: 1000
            })
          },
        })
      },
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
    app.setNavigationBarColor(this);
    app.getUrl(this)
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