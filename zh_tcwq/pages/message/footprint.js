// zh_tcwq/pages/message/message.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    types: 1,
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
    var url = wx.getStorageSync('url')
    that.setData({
      url: url
    })
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    // -----------------------------
    // 获取资讯列表
    // -----------------------------
    var user_id = wx.getStorageSync("users").id
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "/";
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


    app.util.request({
      'url': 'entry/wxapp/MyFootprint',
      'cachetime': '0',
      data:{user_id:user_id},
      success: function (res) {
        console.log(res)
        var info = res.data
        for (let i in info) {
          info[i].time = info[i].time.slice(0, 16)
          if (info[i].img == null) {
            info[i].type = 1
          } else {
            info[i].type = 2
          }
          var dt1 = time;
          var dt2 = info[i].zx_time.replace(/-/g, "/")
          var regTime = /(\d{4})-(\d{1,2})-(\d{1,2})( \d{1,2}:\d{1,2})/g;
          var interval = Math.abs(Date.parse(dt1.replace(regTime, "$2-$3-$1$4")) - Date.parse(dt2.replace(regTime, "$2-$3-$1$4"))) / 1000;
          var h = Math.floor(interval / 3600);
          var m = Math.floor(interval % 3600 / 60);
          info[i].m = h
          info[i].h = m
          console.log(h + " 小时 " + m + " 分钟");
          info[i].imgs = info[i].imgs.split(",").slice(0,3)
        }
        that.setData({
          info: info,
          info1: info
        })
      },
    })
  },
  message: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: 'message_info?id=' + id,
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