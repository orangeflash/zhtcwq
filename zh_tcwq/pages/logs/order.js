// zh_tcwq/pages/logs/order.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['待付款', '待发货', '待收货', '已完成', '退货/售后'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 35,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var url = wx.getStorageSync('url')
    if (options.activeIndex == null) {
      that.setData({
        activeIndex: 0,
        url: url,
        System: wx.getStorageSync('System'),
      })
    } else {
      that.setData({
        activeIndex: options.activeIndex,
        url: url
      })
    }
    that.refresh()
  },
  refresh: function (e) {
    var that = this

    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
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
    function transferCouponValueTime(startDate, valueTime) {
      var date = new Date(startDate);
      var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + valueTime);
      var year1 = date.getFullYear();
      var month1 = date.getMonth() + 1;
      var day1 = date.getDate();
      var year2 = newDate.getFullYear();
      var month2 = newDate.getMonth() + 1;
      var day2 = newDate.getDate();
      return year2 + "-" + month2 + "-" + day2

    }
    var activeIndex = that.data.activeIndex
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/MyOrder',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        var order1 = [], order2 = [], order3 = [], order4 = [], order5 = []
        for (let i in res.data) {
          res.data[i].time = app.ormatDate(res.data[i].time)
          if (res.data[i].state == 1) {
            order1.push(res.data[i])
          } else if (res.data[i].state == 2) {
            order2.push(res.data[i])
          } else if (res.data[i].state == 3) {
            res.data[i].time = transferCouponValueTime(res.data[i].time, 7)
            console.log(time)
            if (res.data[i].time >= time) {
              console.log(res.data[i])
            } else {
              app.util.request({
                'url': 'entry/wxapp/CompleteOrder',
                'cachetime': '0',
                data: { order_id: res.data[i].id },
                success: function (res) {
                  console.log(res)
                  that.refresh()
                },
              })
            }
            order3.push(res.data[i])
          } else if (res.data[i].state == 4) {
            order4.push(res.data[i])
          } else if (res.data[i].state == 5 || res.data[i].state == 6 || res.data[i].state == 7) {
            order5.push(res.data[i])
          }
        }
        if (activeIndex == 0) {
          that.setData({
            order: order1
          })
        } else if (activeIndex == 1) {
          that.setData({
            order: order2
          })
        } else if (activeIndex == 2) {
          that.setData({
            order: order3
          })
        } else if (activeIndex == 3) {
          that.setData({
            order: order4
          })
        } else if (activeIndex == 4) {
          that.setData({
            order: order5
          })
        }
        console.log(order1)

      },
    })
  },
  tabClick: function (e) {
    var that = this
    var activeIndex = e.currentTarget.id
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/MyOrder',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        var order1 = [], order2 = [], order3 = [], order4 = [], order5 = []
        for (let i in res.data) {
          if (res.data[i].state == 1) {
            order1.push(res.data[i])
          }
          if (res.data[i].state == 2) {
            order2.push(res.data[i])
          }
          if (res.data[i].state == 3) {
            order3.push(res.data[i])
          }
          if (res.data[i].state == 4) {
            order4.push(res.data[i])
          }
          if (res.data[i].state == 5 || res.data[i].state == 6 || res.data[i].state == 7) {
            order5.push(res.data[i])
          }
        }

        if (activeIndex == 0) {
          that.setData({
            order: order1
          })
        } else if (activeIndex == 1) {
          that.setData({
            order: order2
          })
        } else if (activeIndex == 2) {
          that.setData({
            order: order3
          })
        } else if (activeIndex == 3) {
          that.setData({
            order: order4
          })
        } else if (activeIndex == 4) {
          that.setData({
            order: order5
          })
        }
      },
    })
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // -----------------------------确认收货----------------------------
  complete: function (e) {
    wx.showLoading({
      title: '',
    })
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    // setTimeout(function(){
    //   wx.hideLoading()
    // },4000)
    app.util.request({
      'url': 'entry/wxapp/CompleteOrder',
      'cachetime': '0',
      data: { order_id: id },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        that.refresh()
      },
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
        that.refresh()
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
        wx: wx.showModal({
          title: '提示',
          content: '是否删除订单，删除后不可恢复',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定',
          success: function (res) {
            if (res.confirm) {
              that.refresh()
            }

          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
    })
  },
  // -------------------------付款-------------------------------------
  pay: function (e) {
    var that = this
    var openid = wx.getStorageSync("openid")
    var id = e.currentTarget.dataset.id, store_id = e.currentTarget.dataset.storeid;
    console.log(store_id)
    var money = e.currentTarget.dataset.money
    app.util.request({
      'url': 'entry/wxapp/Pay',
      'cachetime': '0',
      data: { openid: openid, money: money, order_id: id },
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
                that.refresh()
              },
            })
            app.util.request({
              'url': 'entry/wxapp/sms2',
              'cachetime': '0',
              data: { store_id: store_id },
              success: function (res) {
                console.log(res)
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
  // ----------------跳转订单详情------------
  order_info: function (e) {
    var id = e.currentTarget.dataset.id
    var store_id = e.currentTarget.dataset.store_id
    wx: wx.navigateTo({
      url: 'order_info?id=' + id + '&store_id=' + store_id,
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
    })
    this.refresh()
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
  onShareAppMessage: function () {

  }
})