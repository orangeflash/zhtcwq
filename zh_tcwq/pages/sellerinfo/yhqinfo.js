// zh_zbkq/pages/index/yhqdl.js
var app = getApp();
var dsq;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  phone: function (e) {
    var that = this
    var tel = that.data.store.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  dizhi: function (e) {
    var that = this
    var lat2 = Number(that.data.store.coordinates.split(',')[0])
    var lng2 = Number(that.data.store.coordinates.split(',')[1])
    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.store.store_name,
      address: that.data.store.address
    })
  },
  qrmd: function (e) {
    var xfje = Number(this.data.yhq.money), uid = wx.getStorageSync('users').id, sjid = this.data.store.id, openid = wx.getStorageSync("openid"), form_id = e.detail.formId, coupons_id = this.data.yhq.id;
    console.log(xfje, uid, sjid, openid, form_id, coupons_id)
    // return
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: uid,
        form_id: form_id,
        openid: openid
      },
      success: function (res) {

      },
    })
    this.setData({
      mflqdisabled: true,
    })
    // AddDmOrder
    app.util.request({
      'url': 'entry/wxapp/LqCoupon',
      'cachetime': '0',
      data: {
        user_id: uid,
        coupons_id: coupons_id,
        lq_money: xfje
      },
      success: function (res) {
        console.log(res)
        var orderid = res.data;
        if (res.data != '下单失败') {
          if (xfje == 0) {
            wx.showModal({
              title: '提示',
              content: '领取成功',
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../wdq/wdq',
              })
            }, 1000)
          }
          else {
            app.util.request({
              'url': 'entry/wxapp/pay5',
              'cachetime': '0',
              data: { openid: openid, money: xfje, order_id: orderid },
              success: function (res) {
                console.log(res)
                // 支付
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': res.data.signType,
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    console.log(res)
                  },
                  'complete': function (res) {
                    console.log(res)
                    if (res.errMsg == 'requestPayment:fail cancel') {
                      wx.showToast({
                        title: '取消支付',
                      })
                    }
                    if (res.errMsg == 'requestPayment:ok') {
                      wx.showModal({
                        title: '提示',
                        content: '领取成功',
                      })
                      setTimeout(function () {
                        wx.redirectTo({
                          url: '../wdq/wdq',
                        })
                      }, 1000)
                    }
                  }
                })
              },
            })
          }
        }
        else {
          wx.showToast({
            title: '请重试',
          })
        }
      }
    })
    // this.setData({
    //   showModal: true,
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var uid = wx.getStorageSync('users').id;
    console.log(uid)
    that.setData({
      coupon_img: wx.getStorageSync('System').coupon_img
    })
    //取优惠券详情;
    app.util.request({
      'url': 'entry/wxapp/CouponInfo',
      'cachetime': '0',
      data: { coupon_id: options.yhqid, user_id: uid },
      success: function (res) {
        console.log(res.data)
        res.data.lqrs = Number(res.data.number) - Number(res.data.surplus)
        wx.setNavigationBarTitle({
          title: res.data.name,
        })
        that.setData({
          yhq: res.data,
          url: wx.getStorageSync('url')
        })
      }
    });
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: options.sjid },
      success: function (res) {
        console.log(res.data)
        that.setData({
          store: res.data.store[0],
        })
      }
    });
    if (options.qid != null) {
      //取优惠券码;
      app.util.request({
        'url': 'entry/wxapp/CouponCode',
        'cachetime': '0',
        data: { id: options.qid},
        success: function (res) {
          console.log(res.data)
          that.setData({
            hxm: res.data,
          })
        }
      });
      dsq = setInterval(function () {
        //;
        app.util.request({
          'url': 'entry/wxapp/MyCouponsInfo',
          'cachetime': '0',
          data: { id: options.qid },
          success: function (res) {
            console.log(res.data)
            if (res.data.state == 1) {
              wx.showToast({
                title: '核销成功',
                duration: 1000,
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../index/index',
                })
              }, 1000)
            }
          }
        });
      }, 5000)
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
    clearInterval(dsq)
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
  // onShareAppMessage: function () {

  // }
})