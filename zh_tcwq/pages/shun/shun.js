// zh_tcwq/pages/shun/shun.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slide: [
      { logo: 'http://opocfatra.bkt.clouddn.com/images/0/2017/10/tdJ70qw1fEfjfVJfFDD09570eqF28d.jpg' },
      { logo: 'http://opocfatra.bkt.clouddn.com/images/0/2017/10/k5JQwpBfpb0u8sNNy5l5bhlnrhl33W.jpg' },
      { logo: 'http://opocfatra.bkt.clouddn.com/images/0/2017/10/zUeEednDedmUkIUumN9XI6IXU91eko.jpg' }
    ],
    release: [
      {
        name: '人找车',
        id: 0,
      },
      {
        name: '车找人',
        id: 1,
      },
      {
        name: '车找货',
        id: 2,
      },
      {
        name: '货找车',
        id: 3,
      },
    ],
    shunfabu: ['人找车', '车找人', '车找货', '货找车'],
    index: 0,
    foot: false,
    pc: [],
    refresh_top: false
  },
  notice: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../notice/notice?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ———————跳转到顺风车发布页面—————————
  shunfabu: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.id
    that.setData({
      foot: false
    })
    wx: wx.navigateTo({
      url: 'shunfabu/shunfabu?id=' + id,
    })
  },
  // 拨打电话
  call_phone: function (e) {
    var that = this
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  //选择分类
  footbtn: function (e) {
    var that = this
    var foot = that.data.foot
    if (foot == false) {
      that.setData({
        foot: true
      })
    } else {
      that.setData({
        foot: false
      })
    }

  },
  jumps: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src
    var wb_src = e.currentTarget.dataset.wb_src
    var type = e.currentTarget.dataset.type
    if (type == 1) {
      var s1 = src.replace(/[^0-9]/ig, "");
      src = src.replace(/(\d+|\s+)/g, "");
      src = src
      console.log(src)
      console.log(s1)
      console.log()
      wx: wx.navigateTo({
        url: src + Number(s1),
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
        url: '../car/car?vr=' + wb_src,
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
  // 跳转详情
  carinfo: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: 'shuninfo2/shuninfo2?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
    })
    var url = wx.getStorageSync('url')
    var system = wx.getStorageSync('System')
    that.setData({
      url: url,
      system: system
    })
    app.util.request({
      'url': 'entry/wxapp/Llz',
      'cachetime': '0',
      data: { cityname: wx.getStorageSync('city'), type: 4 },
      success: function (res) {
        console.log(res)
        that.setData({
          unitid: res.data,
        })
      },
    })
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
    var time = getNowFormatDate()
    console.log(time)
    // 查看列表所属标签
    var cityname = wx.getStorageSync('city')
    console.log(cityname)
    var page = that.data.page
    var pc = that.data.pc
    if (page == null) {
      page = 1
    }
    if (pc == null) {
      pc = []
    }
    app.util.request({
      'url': 'entry/wxapp/CarList',
      'cachetime': '0',
      data: { cityname: cityname, page: page },
      success: res => {
        console.log(res)
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            page: page + 1,
            refresh_top: false
          })
          pc = pc.concat(res.data)
        }
        for (let i in res.data) {
          res.data[i].tz.time = app.ormatDate(res.data[i].tz.time).slice(5, 16)
          res.data[i].tz.start_time1 = res.data[i].tz.start_time.slice(5, 10)
          res.data[i].tz.start_time2 = res.data[i].tz.start_time.slice(10, 17)
          if (res.data[i].tz.is_open == 2) {
            res.data[i].tz.class2 = 'car3'
            res.data[i].tz.class3 = 'car4'
            res.data[i].tz.class4 = 'car5'
          } else {
            res.data[i].tz.class2 = ''
            res.data[i].tz.class3 = ''
            res.data[i].tz.class4 = ''
          }
          if (res.data[i].tz.typename == '人找车') {
            res.data[i].tz.class = 'color1'
            res.data[i].tz.class1 = 'car1'
          } else if (res.data[i].tz.typename == '车找人') {
            res.data[i].tz.class = 'color2'
            res.data[i].tz.class1 = 'car2'
          } else if (res.data[i].tz.typename == '货找车') {
            res.data[i].tz.class = 'color1'
            res.data[i].tz.class1 = 'car1'
          } else if (res.data[i].tz.typename == '车找货') {
            res.data[i].tz.class = 'color2'
            res.data[i].tz.class1 = 'car2'
          }
        }
        that.setData({
          pc: pc
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/news',
      'cachetime': '0',
      data: { cityname: cityname },
      success: function (res) {
        console.log(res)
        var msgList = []
        for (let i in res.data) {
          if (res.data[i].type == 3) {
            msgList.push(res.data[i])
          }
        }
        that.setData({
          msgList: msgList
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: { cityname: cityname },
      success: function (res) {
        console.log(res)
        var slide = []
        for (let i in res.data) {
          if (res.data[i].type == 4) {
            slide.push(res.data[i])
          }
        }
        console.log(slide)
        var top = 0
        if (slide.length != 0) {
          that.setData({
            top: 600
          })
        } else {
          that.setData({
            top: 300
          })
        }
        console.log(top)
        that.setData({
          slide: slide
        })
      },
    })
  },
  carlist: function (e) {
    var that = this
    console.log(e)
    var name = e.currentTarget.dataset.typename
    app.util.request({
      'url': 'entry/wxapp/TypeCarList',
      'cachetime': '0',
      data: { typename: name },
      success: res => {
        console.log(res)
        for (let i in res.data) {
          res.data[i].tz.time = app.ormatDate(res.data[i].tz.time).slice(5, 16)
          res.data[i].tz.start_time1 = res.data[i].tz.start_time.slice(5, 10)
          res.data[i].tz.start_time2 = res.data[i].tz.start_time.slice(10, 16)
          if (res.data[i].tz.typename == '人找车') {
            res.data[i].tz.class = 'color1'
            res.data[i].tz.class1 = 'car1'
          } else if (res.data[i].tz.typename == '车找人') {
            res.data[i].tz.class = 'color2'
            res.data[i].tz.class1 = 'car2'
          } else if (res.data[i].tz.typename == '货找车') {
            res.data[i].tz.class = 'color1'
            res.data[i].tz.class1 = 'car1'
          } else if (res.data[i].tz.typename == '车找货') {
            res.data[i].tz.class = 'color2'
            res.data[i].tz.class1 = 'car2'
          }
        }
        that.setData({
          pc: res.data
        })
      }
    })
  },
  // 返回首页
  shouye: function (e) {
    wx: wx.reLaunch({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 我的拼车
  mine_yellow: function (e) {
    wx.redirectTo({
      url: '../logs/mine_car',
    })
  },
  whole: function (e) {
    this.refresh()
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh()
    wx: wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.refresh_top == false) {
      this.refresh()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})