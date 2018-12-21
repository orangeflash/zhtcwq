// zh_cjdianc/pages/sjzx/dndd/dnddlb.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedindex: 0,
    topnav: [{ img: '../../../img/icon/dzt.png', img1: '../../../img/icon/wdzt.png', name: '全部' },{ img: '../../../img/icon/djd.png', img1: '../../../img/icon/wdjd.png', name: '待支付' },{ img: '../../../img/icon/ywc.png', img1: '../../../img/icon/wywc.png', name: '已完成' }, { img: '../../../img/icon/sh.png', img1: '../../../img/icon/wsh.png', name: '已关闭' },],
    open: false,
    pagenum: 1,
    order_list: [],
    storelist: [],
    mygd: false,
    jzgd: true,
    selecttype:false,
    typename:'选择类型',
    selectdate:false,
    datetype: ['全部', '待核销', '已核销'],
    start: '',
    timestart: "",
    timeend: '',
    start_time:'',
    end_time:'',
  },
  hidemask: function () {
    this.setData({
      selecttype: false,
      selectdate:false,
    })
  },
  choseinfo: function () {
    this.setData({
      selectinfo: !this.data.selectinfo,
      selecttype: false,
    })
  },
  qginfoinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      searchinfo: e.detail.value
    })
  },
  search: function () {
    var that = this, searchinfo = this.data.searchinfo;
    console.log(searchinfo)
    if (searchinfo == null || searchinfo == "") {
      wx.showModal({
        title: '提示',
        content: '请输入查找内容',
      })
      return
    }
    this.setData({
      typename: that.data.datetype[0],
      state: '',
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectinfo: false,
    })
    this.reLoad();
  },
  chosetype: function () {
    this.setData({
      selecttype: !this.data.selecttype,
      selectdate: false,
      selectinfo: false,
    })
  },
  xztype:function(e){
    var that = this, index = e.currentTarget.dataset.index, state;
    console.log(index);
    if (index == 0) { state=''}
    if (index == 1) { state = '2' }
    if (index == 2) { state = '3' }
    this.setData({
      typename: that.data.datetype[index],
      selecttype: false,
      searchinfo:'',
      state: state,
      start_time: '',
      end_time: '',
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: 0,
      status: 1
    })
    this.reLoad();
  },
  bindTimeChange: function (e) {
    console.log('picker 发生选择改变，携带值为', e.detail.value);
    this.setData({
      timestart: e.detail.value
    })
  },
  bindTimeChange1: function (e) {
    console.log('picker  发生选择改变，携带值为', e.detail.value);
    this.setData({
      timeend: e.detail.value
    })
  },
  find:function(){
    var that = this, timestart = this.data.timestart, timeend = this.data.timeend
    console.log(util.validTime(timestart, timeend))
    if (!(util.validTime(timestart, timeend))) {
      wx.showModal({
        title: '提示',
        content: '请选择正确的日期范围',
      })
      return
    }
    this.setData({
      typename: that.data.datetype[0],
      time: '',
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: 0,
      status: 1,
      start_time:timestart,
      end_time:timeend,
      selectdate: false,
    })
    this.reLoad();
  },
  repeat: function () {
    var that = this, start = this.data.start
    console.log(start)
    this.setData({
      typename: that.data.datetype[0],
      time: '',
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: 0,
      status: 1,
      timestart: start,
      timeend: start,
      start_time: '',
      end_time: '',
      selectdate: false,
    })
    this.reLoad();
  },
  chosedate: function () {
    this.setData({
      selectdate: !this.data.selectdate,
      selecttype: false,
    })
  },
  maketel: function (t) {
    var a = t.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  location: function (t) {
    var lat = t.currentTarget.dataset.lat, lng = t.currentTarget.dataset.lng, address = t.currentTarget.dataset.address;
    console.log(lat, lng)
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      address: address,
      name: '位置'
    })
  },
  selectednavbar: function (e) {
    console.log(e)
    this.setData({
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: e.currentTarget.dataset.index,
      status: Number(e.currentTarget.dataset.index) + 1
    })
    this.reLoad();
  },
  doreload: function (status) {
    console.log(status)
    this.setData({
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: status - 1,
      status: status
    })
    this.reLoad();
  },
  kindToggle: function (e) {
    var that = this;
    var index = e.currentTarget.id, list = this.data.order_list;
    console.log(index)
    for (var i = 0, len = list.length; i < len; ++i) {
      if (i == index) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      order_list: list
    });
  },
  reLoad: function () {
    var that = this, status = this.data.status || 1, state = this.data.state || '', searchinfo = this.data.searchinfo || '', store_id = wx.getStorageSync('sjdsjid'), page = this.data.pagenum;
    // var dn_states;
    // if (status == 1) {
    //   dn_states = '1,2,3'
    // }
    // if (status == 2) {
    //   dn_states = '1'
    // }
    // if (status == 3) {
    //   dn_states = '2'
    // }
    // if (status == 4) {
    //   dn_states = '3';
    // }
    console.log(status, state, store_id, page, searchinfo)
    app.util.request({
      'url': 'entry/wxapp/StoreQgOrder',
      'cachetime': '0',
      data: { state: state, keywords: searchinfo, store_id: store_id, page: page, pagesize: 10 },
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid');
    console.log(sjdsjid,options)
    var start = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(start.toString())
    this.setData({
      // table_id: options.table_id,
      // tablestatus: options.status,
      start: start,
      timestart: start,
      timeend: start,
      url: wx.getStorageSync('url')
    })
    wx.setNavigationBarTitle({
      title: '抢购订单',
    })
    this.reLoad();
    app.setNavigationBarColor(this);
    // app.sjdpageOnLoad(this);
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        wx.setStorageSync('system', res.data)
        that.setData({
          xtxx: res.data
        })
      }
    });
  },
  maketel: function (t) {
    var a = t.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  smhx: function (e) {
    var storeid = wx.getStorageSync('sjdsjid');
    // var path = "zh_vip/pages/my/wdck/hx?scene=2"
    // var tnurl = '/' + path
    // wx.navigateTo({
    //   url: tnurl + '&storeid=' + storeid,
    // })
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var path = res.path
        var tnurl = '/' + path
        wx.navigateTo({
          url: tnurl + '&storeid=' + storeid,
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
  // jjtk: function (e) {
  //   var a = this, oid = e.currentTarget.dataset.id;
  //   console.log(oid)
  //   wx.showModal({
  //     title: "提示",
  //     content: "是否拒绝退款？",
  //     cancelText: "否",
  //     confirmText: "是",
  //     success: function (s) {
  //       if (s.cancel) return !0;
  //       s.confirm && (wx.showLoading({
  //         title: "操作中",
  //         mask: !0
  //       }), app.util.request({
  //         'url': 'entry/wxapp/JjTk',
  //         'cachetime': '0',
  //         data: { order_id: oid },
  //         success: function (res) {
  //           console.log(res.data)
  //           if (res.data == '1') {
  //             wx.showToast({
  //               title: '操作成功',
  //               icon: 'success',
  //               duration: 1000,
  //             })
  //             setTimeout(function () {
  //               a.doreload(5)
  //             }, 1000)
  //           }
  //           else {
  //             wx.showToast({
  //               title: '请重试',
  //               icon: 'loading',
  //               duration: 1000,
  //             })
  //           }
  //         },
  //       }))
  //     }
  //   })
  // },
  // tgtk: function (e) {
  //   var a = this, oid = e.currentTarget.dataset.id;
  //   console.log(oid)
  //   wx.showModal({
  //     title: "提示",
  //     content: "是否通过退款？",
  //     cancelText: "否",
  //     confirmText: "是",
  //     success: function (s) {
  //       if (s.cancel) return !0;
  //       s.confirm && (wx.showLoading({
  //         title: "操作中",
  //         mask: !0
  //       }), app.util.request({
  //         'url': 'entry/wxapp/TkTg',
  //         'cachetime': '0',
  //         data: { order_id: oid },
  //         success: function (res) {
  //           console.log(res.data)
  //           if (res.data == '1') {
  //             wx.showToast({
  //               title: '操作成功',
  //               icon: 'success',
  //               duration: 1000,
  //             })
  //             setTimeout(function () {
  //               a.doreload(5)
  //             }, 1000)
  //           }
  //           else {
  //             wx.showToast({
  //               title: '请重试',
  //               icon: 'loading',
  //               duration: 1000,
  //             })
  //           }
  //         },
  //       }))
  //     }
  //   })
  // },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
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
  }
})