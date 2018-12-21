// zh_tcwq/pages/car/car.js
var app = getApp();
var screenWidth = 0
var screenHeight = 0
var screenWidth1 = 0
var screenHeight1 = 0
var screenWidth2 = 0
var screenHeight2 = 0
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
    console.log(options)
    var that = this;
    if (options.sjtype == 'undefined') {
      app.util.request({
        'url': 'entry/wxapp/GetAdInfo',
        'cachetime': '0',
        data: { ad_id: options.vr },
        success: function (res) {
          that.setData({
            vr: res.data.wb_src
          })
        },
      })
    }
    else if (options.sjid) {
      app.util.request({
        'url': 'entry/wxapp/StoreInfo',
        'cachetime': '0',
        data: { id: options.sjid },
        success: function (res) {
          console.log(res)
          that.setData({
            vr: res.data.store[0].vr_link
          })
        },
      })
    }
    else if (options.goodid) {
      app.util.request({
        'url': 'entry/wxapp/GoodInfo',
        'cachetime': '0',
        data: { id: options.goodid },
        success: function (res) {
          console.log(res)
          that.setData({
            vr: res.data.good.vr
          })
        },
      })
    }
    else if (options.weburl) {
      that.setData({
        vr: options.weburl
      })
    }
    else {
      app.util.request({
        'url': 'entry/wxapp/GetNavInfo',
        'cachetime': '0',
        data: { nav_id: options.vr },
        success: function (res) {
          that.setData({
            vr: res.data.wb_src
          })
        },
      })
    }
  },

  canvas: function (e) {
    var that = this
    console.log(e)
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 400,
      height: 200,
      destWidth: 400,
      destHeight: 600,
      canvasId: 'firstCanvas',
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
        that.setData({
          tempFilePath: res.tempFilePath
        })
      },
      fail: function (res) {
        console.log(res)
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

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
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