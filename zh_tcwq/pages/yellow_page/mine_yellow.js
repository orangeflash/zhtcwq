// zh_tcwq/pages/active/active.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['最新收录', '热门推荐', '附近发现'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 35,
    currentTab: 0,
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: '我的' + getApp().xtxx.hy_title,
    })
    var that = this;
    var url = wx.getStorageSync('url')
    that.setData({
      url: url,
      system: getApp().xtxx
    })
  },
  refresh: function (e) {
    var that = this
    // 商家行业分类
    var user_id = wx.getStorageSync("users").id
    app.util.request({
      'url': 'entry/wxapp/MyYellowPage',
      'cachetime': '0',
      data:{user_id:user_id},
      success: function (res) {
        console.log(res)
        for (let i in res.data) {
          var lat = res.data[i].coordinates
          var ss = lat.split(",")
          res.data[i].lat2 = Number(wx.getStorageSync('Location').latitude)
          res.data[i].lng2 = Number(wx.getStorageSync('Location').longitude)
          var lat1 = Number(wx.getStorageSync('Location').latitude)
          var lng1 = Number(wx.getStorageSync('Location').longitude)
          var lat2 = ss[0]
          var lng2 = ss[1]
          var radLat1 = lat1 * Math.PI / 180.0;
          var radLat2 = lat2 * Math.PI / 180.0;
          var a = radLat1 - radLat2;
          var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
          var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
          s = s * 6378.137;
          s = Math.round(s * 10000) / 10000;
          var s = s.toFixed(2)
          res.data[i].distance = s
        }
        that.setData({
          yellow_list: res.data,
        })
      }
    })
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
            'url': 'entry/wxapp/DelYellowStore',
            'cachetime': '0',
            data: {
              y_id: id
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
  yellow_info: function (e) {
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: 'yellowinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  store_type_id: function (e) {
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../store/business?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 返回首页
  shouye: function (e) {
    wx.reLaunch({
     url: '../index/index',
    })
  },
  // 114
  yellow: function (e) {
    wx.redirectTo({
      url: 'yellow',
    })
  },
  // 入驻114
  settled: function (e) {
    wx.navigateTo({
      url: 'settled',
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
    this.reload()
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