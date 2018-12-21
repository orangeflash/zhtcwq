// zh_dianc/pages/logs/distribution/wdtd.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['一级'],
    activeIndex: 0,
    djd:[],
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    console.log(getApp().xtxx)
    var that = this;
    var user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/FxSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        if (res.data.is_ej=='1'){
          that.setData({
            tabs: ['一级', '二级'],
          })
        }
        that.setData({
          fxset: res.data,
        })
      }
    })
    //symx
    app.util.request({
      'url': 'entry/wxapp/MyTeam',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        var yj = [], ej = [];
        yj=res.data.one,ej=res.data.two;
        for (var i = 0; i < yj.length; i++) {
          yj[i].time = util.ormatDate(yj[i].time)
        }
        for (var i = 0; i < ej.length; i++) {
          ej[i].time = util.ormatDate(ej[i].time)
        }
        that.setData({
          yj:yj,
          ej: ej,
        })
      }
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