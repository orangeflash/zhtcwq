var app = getApp();
var util = require('../../../we7/resource/js/util.js');
Page({
  data: {
    color: '#34aaff',
    state: 1,
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
      title: '我的拼团',
    })
    app.setNavigationBarColor(this);
    var that = this;
    that.setData({
      url:wx.getStorageSync('url')
    })
    // app.util.request({
    //   'url': 'entry/wxapp/System',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //     var xtxx = res.data
    //     // getApp().xtxx = xtxx
    //     if (xtxx.model == '2') {
    //       getApp().sjid = xtxx.default_store
    //     }
    //     if (xtxx.model == '4') {
    //       getApp().sjid = xtxx.default_store
    //     }
    //     // app.pageOnLoad(that);
    //     if (res.data.dc_name == '') {
    //       res.data.dc_name = '店内'
    //     }
    //     if (res.data.wm_name == '') {
    //       res.data.wm_name = '外卖'
    //     }
    //     if (res.data.yd_name == '') {
    //       res.data.yd_name = '预定'
    //     }
    //     that.setData({
    //       System: res.data,
    //     })
    //   }
    // });
    //
    var r = this;
    console.log(t)
    r.setData({
      state: t.state
    })
    if (t.state != 4) {
      this.reLoad();
    } else {
      this.order()
    }
    // o = !1,
    //   a = !1,
    //   s = 2,
    //   r.loadOrderList(t.status || -1),
    //   getCurrentPages().length < 2 && r.setData({
    //     show_index: !0
    //   })
  },
  reLoad: function () {
    var that = this, state = this.data.state || 1, user_id = wx.getStorageSync('users').id, page = this.data.pagenum;
    console.log(page)
    app.util.request({
      'url': 'entry/wxapp/MyGroupOrder',
      'cachetime': '0',
      data: { state: state, user_id: user_id, page: page },
      success: function (res) {
        console.log('分页返回的列表数据', res)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].status = state
          res.data[i].xf_time = app.ormatDate(res.data[i].xf_time)
          res.data[i].pay_time = app.ormatDate(res.data[i].pay_time)
          // if (res.data[i].receive_address.length >= 15) {
          //   res.data[i].receive_address = res.data[i].receive_address.slice(0, 15) + '...'
          // }
        }
        // if (res.data.length < 10) {
        //   that.setData({
        //     mygd: true,
        //     jzgd: true,
        //   })
        // }
        // else {
        //   that.setData({
        //     jzgd: true,
        //     pagenum: page + 1,
        //   })
        // }
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
          storelist: storelist,
          pagenum: page + 1,
        })
        console.log(storelist)
      }
    });
  },
  order: function () {
    var that = this, state = this.data.state || 1, user_id = wx.getStorageSync('users').id, page = this.data.pagenum;
    app.util.request({
      'url': 'entry/wxapp/MyGroupOrder',
      'cachetime': '0',
      data: { type: 1, user_id: user_id, page: page },
      success: function (res) {
        console.log('分页返回的列表数据', res)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].status = state
          res.data[i].xf_time = app.ormatDate(res.data[i].xf_time)
          res.data[i].pay_time = app.ormatDate(res.data[i].pay_time)
          if (res.data[i].receive_address.length >= 15 && res.data[i].receive_address != '') {
            res.data[i].receive_address = res.data[i].receive_address.slice(0, 15) + '...'
          }
        }
        // if (res.data.length < 10) {
        //   that.setData({
        //     mygd: true,
        //     jzgd: true,
        //   })
        // }
        // else {
        //   that.setData({
        //     jzgd: true,
        //     pagenum:page + 1,
        //   })
        // }
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
          storelist: storelist,
          pagenum: page + 1,
        })
        console.log(storelist)
      }
    });
  },
  onReachBottom: function () {
    console.log('上拉加载', this.data.pagenum)
    var that = this
    if (that.data.state != 4) {
      that.reLoad();
    } else {
      that.order();
    }
    // var that = this;
    // if (!this.data.mygd && this.data.jzgd) {
    //   this.setData({
    //     jzgd: false
    //   })
    //   this.reLoad();
    // }
    // else {
    // }
  },
  // 前进到订单详情
  order_info:function(e){
    var a = e.currentTarget.dataset
      console.log(a.info)
      wx.setStorageSync('order_info', a.info);
      wx.navigateTo({
        url: 'order_info'
      });
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
      'url': 'entry/wxapp/OrderCode',
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