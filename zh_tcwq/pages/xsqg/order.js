var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    color: '#34aaff',
    status: 1,
    order_list: [],
    show_no_data_tip: !1,
    hide: 1,
    qrcode: "",
    pagenum: 1,
    storelist: [],
    mygd: false,
    jzgd: true,
  },
  onLoad: function (t) {
    wx.setNavigationBarTitle({
      title: '我的抢购',
    })
    app.setNavigationBarColor(this);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var xtxx = res.data
        // getApp().xtxx = xtxx
        if (xtxx.model == '2') {
          getApp().sjid = xtxx.default_store
        }
        if (xtxx.model == '4') {
          getApp().sjid = xtxx.default_store
        }
        // app.pageOnLoad(that);
        if (res.data.dc_name==''){
          res.data.dc_name='店内'
        }
        if (res.data.wm_name == '') {
          res.data.wm_name = '外卖'
        }
        if (res.data.yd_name == '') {
          res.data.yd_name = '预定'
        }
        that.setData({
          System: res.data,
        })
      }
    });
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data,
        })
      },
    })
    //
    var r = this;
    console.log(t)
    r.setData({
      status: t.status
    })
    this.reLoad();
    // o = !1,
    //   a = !1,
    //   s = 2,
    //   r.loadOrderList(t.status || -1),
    //   getCurrentPages().length < 2 && r.setData({
    //     show_index: !0
    //   })
  },
  reLoad: function () {
    var that = this, status = this.data.status || 1, user_id = wx.getStorageSync('users').id, page = this.data.pagenum;
    var qgstate
    if(status==1){
      qgstate='2'
    }
    if (status == 2) {
      qgstate = '3'
    }
    if (status == 3) {
      qgstate = '4'
    }
    // if (status == '4') {
    //   status = '4,5';
    //   dnstatus = '2'
    // }
    // if (status == '5') {
    //   status = '6,7,8,9,10';
    //   dnstatus = '3'
    // }
    console.log(qgstate, user_id, page)
    app.util.request({
      'url': 'entry/wxapp/MyQgOrder',
      'cachetime': '0',
      data: { state: qgstate,type:qgstate==4?1:'', user_id: user_id, page: page, pagesize: 10 },
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].dq_time = util.ormatDate(res.data[i].dq_time)
        }
        if (res.data.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var storelist = that.data.storelist;
        storelist = storelist.concat(res.data);
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        storelist = unrepeat(storelist)
        that.setData({
          order_list: storelist,
          storelist: storelist
        })
        console.log(storelist)
      }
    });
  },
  // loadOrderList: function (o) {
  //   void 0 == o && (o = -1);
  //   var a = this;
  //   a.setData({
  //     status: o
  //   }),
  //     wx.showLoading({
  //       title: "正在加载",
  //       mask: !0
  //     }),
  //     e.request({
  //       url: t.order.list,
  //       data: {
  //         status: a.data.status
  //       },
  //       success: function (t) {
  //         0 == t.code && a.setData({
  //           order_list: t.data.list
  //         }),
  //           a.setData({
  //             show_no_data_tip: 0 == a.data.order_list.length
  //           })
  //       },
  //       complete: function () {
  //         wx.hideLoading()
  //       }
  //     })
  // },
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.reLoad();
    }
    else {
    }
    // var r = this;
    // a || o || (a = !0, e.request({
    //   url: t.order.list,
    //   data: {
    //     status: r.data.status,
    //     page: s
    //   },
    //   success: function (t) {
    //     if (0 == t.code) {
    //       var e = r.data.order_list.concat(t.data.list);
    //       r.setData({
    //         order_list: e
    //       }),
    //         0 == t.data.list.length && (o = !0)
    //     }
    //     s++
    //   },
    //   complete: function () {
    //     a = !1
    //   }
    // }))
  },
  orderPay: function (e) {
    var openid = getApp().getOpenId;
    var uid = wx.getStorageSync('users').id, oid = e.currentTarget.dataset.id, money = e.currentTarget.dataset.money, type = e.currentTarget.dataset.type;
    console.log(openid, uid, oid, money,type)
    if (type == '5') {
      wx.showModal({
        title: '提示',
        content: '您的支付方式为餐后支付，请到收银台付款',
      })
    }
    else{
    wx.showLoading({
      title: "正在提交",
      mask: !0
    }),
      app.util.request({
      'url': 'entry/wxapp/QgPay',
        'cachetime': '0',
        data: { openid: openid, money: money, order_id: oid },
        success: function (res) {
          console.log(res)
          wx.hideLoading()
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': res.data.signType,
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log(res.data)
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
                wx.showToast({
                  title: '支付成功',
                  duration: 1000
                })
                if (type == 1) {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: 'order?status=2',
                    })
                  }, 1000)
                }
                if (type == 2) {
                  setTimeout(function () {
                    wx.redirectTo({
                      url: 'order?status=4',
                    })
                  }, 1000)
                }
              }
            }
          })
        },
      })
    }
  },
  canceldd: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否取消该订单？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          'url': 'entry/wxapp/CancelOrder',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'order?status=5',
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  orderRevoke: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否删除该订单？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          'url': 'entry/wxapp/DelQgOrder',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'order?status=3',
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  txsj: function (e) {
    var that = this;
    console.log('提醒商家' + e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  //申请退款
  sqtk: function (e) {
    var that = this;
    console.log('申请退款' + e.currentTarget.dataset.id)
    wx.showModal({
      title: '提示',
      content: '申请退款么',
      success: function (res) {
        if (res.cancel) return !0;
        res.confirm && (wx.showLoading({
          title: "操作中"
        }),
          app.util.request({
          'url': 'entry/wxapp/TkOrder',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.id },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '申请成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: 'order?status=5',
                  })
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          }))
      }
    })
  },
  qrsh: function (e) {
    var a = this, oid = e.currentTarget.dataset.id;
    console.log(oid)
    wx.showModal({
      title: "提示",
      content: "是否确认已收到货？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          'url': 'entry/wxapp/OkOrder',
          'cachetime': '0',
          data: { order_id: oid },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '收货成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'order?status=4',
                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试',
                icon: 'loading',
                duration: 1000,
              })
            }
          },
        }))
      }
    })
  },
  orderQrcode: function (o) {
    var a = this,
      s = a.data.order_list,
      r = o.target.dataset.index;
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }),
      a.data.order_list[r].offline_qrcode ? (a.setData({
        hide: 0,
        qrcode: a.data.order_list[r].offline_qrcode
      }), wx.hideLoading()) : e.request({
        url: t.order.get_qrcode,
        data: {
          order_no: s[r].order_no
        },
        success: function (t) {
          0 == t.code ? a.setData({
            hide: 0,
            qrcode: t.data.url
          }) : wx.showModal({
            title: "提示",
            content: t.msg
          })
        },
        complete: function () {
          wx.hideLoading()
        }
      })
  },
  hide: function (t) { this.setData({ hide: 1 }) },
  hxqh: function (e) {
    var a = this, oid = e.currentTarget.dataset.id, sjid = e.currentTarget.dataset.sjid;
    console.log(oid, sjid)
    wx.showLoading({
      title: "加载中",
      mask: !0
    }), app.util.request({
      'url': 'entry/wxapp/QgOrderCode',
      'cachetime': '0',
      data: { order_id: oid },
      success: function (res) {
        console.log(res.data)
        a.setData({
          hx_code: res.data,
          hide: 2
        })
      },
    })
  },
});