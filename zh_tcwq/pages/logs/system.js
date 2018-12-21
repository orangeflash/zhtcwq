// zh_tcwq/pages/logs/system.js
var app = getApp()
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
    })
    var system = wx.getStorageSync('System')
    console.log(system)
    if(options.isbz=='1'){
      wx.setNavigationBarTitle({
        title: options.title,
      })
      that.setData({
        node: wx.getStorageSync('bzinfo')
      })
    }
    else if (options.ftxz == '1') {
      wx.setNavigationBarTitle({
        title: '发帖须知',
      })
      that.setData({
        node: system.ft_xuz
      })
    }
    else if (options.rzxz == '1') {
      wx.setNavigationBarTitle({
        title: '入驻须知',
      })
      that.setData({
        node: system.rz_xuz
      })
    }
    else{
    that.setData({
      node: system.details
    })
    }
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
    wx.removeStorageSync('bzinfo')
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
  // onShareAppMessage: function () {
  
  // }
})