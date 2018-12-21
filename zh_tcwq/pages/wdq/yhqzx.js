// pages/tongcheng/tongcheng.js
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
};
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  inputValue: '',
  data: {
    page: 1,
    refresh_top: false,
    seller: [],
    typeid:'',
    infortype: [{ id: 0, type_name: "推荐" }],
    activeIndex: 0,
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    slide: [
      { img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513057315830&di=28c50097b1b069b2de68f70d625df8e2&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fa8014c086e061d95cb1b561170f40ad162d9cabe.jpg', },
      { img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=570437944,358180613&fm=27&gp=0.jpg', }
    ],
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    app.pageOnLoad(this);
    app.setNavigationBarColor(this);
    if (options.name) {
      wx.setNavigationBarTitle({
        title: options.name,
      })
    }
    else{
      wx.setNavigationBarTitle({
        title: '优惠券中心',
      })
    }
    this.setData({
      store_id: options.storeid,
      titlename:options.name,
      System: wx.getStorageSync('System'),
    })
    var that = this;
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
    var city = wx.getStorageSync('city')
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        console.log(res)
        var slide = []
        for (let i in res.data) {
          if (res.data[i].type == 14) {
            slide.push(res.data[i])
          }
        }
        that.setData({
          slide: slide,
        })
      },
    })
    // ZbOrder
    app.util.request({
      'url': 'entry/wxapp/ZbCoupons',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          ZbOrder: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/CouponType',
      'cachetime': '0',
      success: function (res) {
        var navs = res.data
        if (navs.length <= 5) {
          that.setData({
            height: 165
          })
        } else if (navs.length > 5) {
          that.setData({
            height: 340
          })
        }
        var nav = []
        for (var i = 0, len = navs.length; i < len; i += 10) {
          nav.push(navs.slice(i, i + 10))
        }
        console.log(nav, navs)
        that.setData({
          nav: nav,
          navs: navs
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      },
    })
    this.seller(this.data.typeid)
  },
  tabClick: function (e) {
    console.log(e.currentTarget.id, e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index==0){
      var typeid='';
    }
    else{
      var typeid = e.currentTarget.id;
    }
    this.setData({
      page: 1,
      refresh_top: false,
      seller: [],
      activeIndex: e.currentTarget.dataset.index,
      typeid: typeid,
    });
    setTimeout(()=>{
      this.seller(typeid)
    },300)
  },
  selectednavbar: function (e) {
    console.log(e)
    wx.navigateTo({
      url: 'yhqtype?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name,
    })
  },
  // -----------------------------------帖子信息--------------------------------
  seller: function (typeid) {
    console.log('typeid为', typeid)
    var that = this
    var nowtime = util.formatTime(new Date)
    var date = util.formatTime(new Date).replace(/\//g, "-").toString();
    console.log(nowtime, date)
    var city = wx.getStorageSync('city')
    var page = that.data.page, store_id = that.data.store_id || '', seller = that.data.seller, cityname = this.data.store_id == null ? wx.getStorageSync('city') : '';
    console.log(city, page, store_id, cityname,seller)
    app.util.request({
      'url': 'entry/wxapp/CouponList',
      'cachetime': '0',
      data: { type_id: typeid, store_id: store_id, page: page, pagesize: 10, cityname: cityname },
      success: function (res) {
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].rate = parseInt((1 - Number(res.data[i].surplus) / Number(res.data[i].number)) * 100)
        }
        if (res.data.length < 10) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1
          })
        }
        seller = seller.concat(res.data)
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        seller = unrepeat(seller)
        console.log(seller)
        that.setData({
          seller: seller
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉触底')
    if (this.data.refresh_top == false) {
      this.seller(this.data.typeid)
    } else {
      console.log('没有更多了')
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   var titlename = this.data.titlename;
  //   console.log(titlename)
  //   return {
  //     title: titlename,
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // }
})