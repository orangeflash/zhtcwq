// zh_zbkq/pages/my/tjhxy/hx.js
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
    var that = this;
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log(scene, wx.getStorageSync('hxsjid'))
    var oid = scene
    this.setData({
      oid: oid,
      hxsjid: wx.getStorageSync('hxsjid')
    })
    if (!wx.getStorageSync('hxsjid')) {
      wx.showModal({
        title: '您未携带商家信息',
        content: '点击确定，登录商家中心核销',
        showCancel: false,
        success: function (res) {
          wx.reLaunch({
            url: '/zh_tcwq/pages/logs/bbaa',
          })
        }
      })
    }
  },
  hx: function () {
    var that = this;
    var oid = that.data.oid
    var hxsjid = that.data.hxsjid
    //
    console.log('扫的码的订单id', oid, hxsjid, '核销的商家id', hxsjid)
    wx.showModal({
      title: '提示',
      content: '确定核销此订单吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/HxOrder',
            'cachetime': '0',
            data: { order_id:oid,store_id:hxsjid },
            success: function (res) {
              console.log(res)
              if (res.data == '核销成功!') {
                wx.showToast({
                  title: '核销成功',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }, 1000)
              }
              if (res.data == '核销失败!') {
                wx.showToast({
                  title: '核销失败',
                  icon: 'success',
                  duration: 1000
                })
              }
              if (res.data == '无核销权限!') {
                wx.showToast({
                  title: '无核销权限!',
                  icon: 'success',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }, 1000)
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
          wx.reLaunch({
            url: '../../index/index',
          })
        }
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
    wx.removeStorageSync('hxsjid')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('hxsjid')
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