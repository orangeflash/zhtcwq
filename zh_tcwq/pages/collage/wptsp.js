var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    color: '#34aaff',
    tablist: ['已通过','待审核','已拒绝'],
    status: 0,
    order_list: [],
    show_no_data_tip: !1,
    hide: 1,
    qrcode: "",
    pagenum: 1,
    storelist: [],
    mygd: false,
    jzgd: true,
  },
  tabclick:function(e){
    console.log(e)
    this.setData({
      status: e.currentTarget.dataset.index,
      order_list: [],
      pagenum: 1,
      storelist: [],
      mygd: false,
      jzgd: true,
    })
    this.reLoad();
  },
  onLoad: function (t) {
    wx.setNavigationBarTitle({
      title: '我的拼团商品',
    })
    app.setNavigationBarColor(this);
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
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
      store_id: t.store_id
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
    var that = this, status = this.data.status, store_id = this.data.store_id, page = this.data.pagenum;
    var qgstate
    if (status == 0) {
      qgstate = '2'
    }
    if (status == 1) {
      qgstate = '1'
    }
    if (status == 2) {
      qgstate = '3'
    }
    console.log(status,qgstate, store_id, page)
    app.util.request({
      'url': 'entry/wxapp/GroupGoodsList',
      'cachetime': '0',
      data: { state: qgstate, store_id: store_id, page: page, pagesize: 10 },
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
  sjxj: function (e) {
    var a = this, oid = e.currentTarget.dataset.id, state = e.currentTarget.dataset.state;
    console.log(oid, state)
    wx.showModal({
      title: "提示",
      content: "是否执行上架下架操作？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          'url': 'entry/wxapp/OperateGood',
          'cachetime': '0',
          data: { goods_id: oid, is_shelves:state=='1'?2:1 },
          success: function (res) {
            console.log(res.data)
            if (res.data == '1') {
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 1000,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: 'wptsp?store_id=' + a.data.store_id,
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
      content: "是否删除该商品？",
      cancelText: "否",
      confirmText: "是",
      success: function (s) {
        if (s.cancel) return !0;
        s.confirm && (wx.showLoading({
          title: "操作中"
        }), app.util.request({
          'url': 'entry/wxapp/DelGroupGood',
          'cachetime': '0',
          data: { goods_id: oid },
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
                  url: 'wptsp?store_id=' + a.data.store_id,
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
  bjsp: function (e) {
    wx.navigateTo({
      url: 'bjptsp?spid=' + e.currentTarget.dataset.id,
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