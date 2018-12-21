// zh_cjdianc/pages/collage/yz_code.js
const app = getApp()
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
    app.setNavigationBarColor(that);
    var scene = decodeURIComponent(options.scene)
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo,
        order_id: scene,
        storeid : options.storeid
      })
    })
  },
  add_market: function (e) {
    var that = this
    var user_id = that.data.userInfo.id, storeid = that.data.storeid
    var order_id = that.data.order_id
    app.util.request({
      'url': 'entry/wxapp/GroupVerification',
      'cachetime': '0',
      data: {
        order_id: order_id,
        user_id: user_id,
        storeid: storeid
      },
      success: function (res) {
        console.log(res)
        if (res.data == '核销成功') {
          wx.showToast({
            title: '核销成功',
          })
          setTimeout(function () {
            // wx.reLaunch({
            //   url: '../index/index',
            // })
            wx.navigateBack({

            })
          }, 1000)
        } else {
          wx.showToast({
            title: '核销失败',
          })
          setTimeout(function () {
            // wx.reLaunch({
            //   url: '../index/index',
            // })
            wx.navigateBack({

            })
          }, 1000)
        }
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