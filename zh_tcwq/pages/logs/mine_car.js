// zh_tcwq/pages/logs/mine_car.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    foot: false,
  },
  cancel: function (e) {
    var that = this
    wx: wx.showModal({
      title: '提示',
      content: '是否删除此条内容',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var id = e.currentTarget.dataset.id
          app.util.request({
            'url': 'entry/wxapp/DelCar',
            'cachetime': '0',
            data: {
              car_id: id
            },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                that.setData({
                  yellow_list: [],
                })
                that.refresh()
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
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
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
  },
  refresh:function(e){
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
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/MyCar',
      'cachetime': '0',
      data: { user_id: user_id,page:1},
      success: res => {
        console.log(res)
        for (let i in res.data) {
          res.data[i].time = app.ormatDate(res.data[i].time).slice(5, 16)
          res.data[i].start_time1 = res.data[i].start_time.slice(5, 10)
          res.data[i].start_time2 = res.data[i].start_time.slice(10, 17)
          if (res.data[i].is_open == 2) {
            res.data[i].class2 = 'car3'
            res.data[i].class3 = 'car4'
            res.data[i].class4 = 'car5'
          } else {
            res.data[i].class2 = ''
            res.data[i].class3 = ''
            res.data[i].class4 = ''
          }
          // if (time >= res.data[i].start_time) {
          //   res.data[i].is_open = 2
          //   res.data[i].class2 = 'car3'
          //   res.data[i].class3 = 'car4'
          //   res.data[i].class4 = 'car5'
          // } else {
          //   res.data[i].is_open = 1
          // }
          if (res.data[i].typename == '人找车') {
            res.data[i].class = 'color1'
            res.data[i].class1 = 'car1'
          } else if (res.data[i].typename == '车找人') {
            res.data[i].class = 'color2'
            res.data[i].class1 = 'car2'
          } else if (res.data[i].typename == '货找车') {
            res.data[i].class = 'color1'
            res.data[i].class1 = 'car1'
          } else if (res.data[i].typename == '车找货') {
            res.data[i].class = 'color2'
            res.data[i].class1 = 'car2'
          }
        }
        that.setData({
          pc: res.data
        })
      }
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
      url: '../shun/shunfabu/shunfabu?id=' + id,
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
  // 跳转详情
  carinfo: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../shun/shuninfo2/shuninfo2?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
  // 返回首页
  shouye:function(e){
    wx:wx.reLaunch({
      url: '../index/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 掌上拼车
  yellow:function(e){
    wx: wx.redirectTo({
      url: '../shun/shun',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 入驻拼车
  settled:function(e){
    wx:wx.navigateTo({
      url: '../shun/shunfabu/shunfabu',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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