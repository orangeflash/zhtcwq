// zh_dianc/pages/logs/distribution/symx.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: [{ note: '张三', time: '2017-10-18 12：11：25', money: '2.00', type: '1' }, { note: '张三', time: '2017-10-18 12：11：25', money: '5.00', type: '1' }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var that = this;
    var user_id = wx.getStorageSync('users').id;
    var url = wx.getStorageSync('url')
    //symx
    app.util.request({
      'url': 'entry/wxapp/Earnings',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].time = util.ormatDate(res.data[i].time)
        }
        that.setData({
          symx: res.data
        })
      }
    })
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          link_logo: res.data.link_logo,
          pt_name: res.data.pt_name,
          url: url,
        })
      },
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
  
  }
})