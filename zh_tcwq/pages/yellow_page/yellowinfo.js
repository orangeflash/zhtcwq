// zh_tcwq/pages/active/yellowinfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var url = wx.getStorageSync('url')
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: getApp().xtxx.hy_title + '详情',
    })
    that.setData({
      url: url,
      System: wx.getStorageSync('System')
    })
    app.util.request({
      'url': 'entry/wxapp/YellowPageInfo',
      'cachetime': '0',
      data:{
        id:options.id
      },
      success: function (res) {
        console.log(res)
        res.data.sh_time = app.ormatDate(res.data.sh_time).slice(0,10)
        res.data.coordinates = res.data.coordinates.split(",")
        that.setData({
          yellow_info:res.data
        })
      },
    })
  },
  phone: function (e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  address: function (e) {
    var that = this
    var lat2 = Number(that.data.yellow_info.coordinates[0])
    var lng2 = Number(that.data.yellow_info.coordinates[1])
    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.yellow_info.company_name,
      address: that.data.yellow_info.company_address
    })
  },
  // ------------------------------------点击回到首页
  shouye: function (e) {
    console.log(e)
    wx: wx.reLaunch({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // ------------------------------------点击拨打商家电话
  phone: function (e) {
    var that = this
    var tel = that.data.yellow_info.link_tel
    wx.makePhoneCall({
      phoneNumber: tel
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
    var that = this
    console.log(that.data)
    var user_id = wx.getStorageSync('users').id
    var name = that.data.yellow_info.company_name
    var store_id = that.data.yellow_info.id
    return {
      title: name,
      path: '/zh_tcwq/pages/yellow_page/yellowinfo?id='+ store_id + '&type=' + 1,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})