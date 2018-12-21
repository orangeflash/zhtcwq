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
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: '核销抢购订单',
    })
    var that = this;
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    var moid = scene, storeid = options.storeid
    this.setData({
      moid: moid,
      storeid: storeid,
    })
    wx.showLoading({
      title: '加载中',
    })
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.setData({
        smuid: userinfo.id
      })
    })
  },
  hx: function () {
    var that = this;
    var moid = that.data.moid,storeid = this.data.storeid,smuid = this.data.smuid;
    //
    console.log('扫码人的storeid', storeid, 'smuid', smuid, '订单id', moid)
      app.util.request({
        'url': 'entry/wxapp/QgHx',
        'cachetime': '0',
        data: { order_id: moid, store_id :storeid,user_id:smuid},
        success: function (res) {
          console.log(res)
          if (res.data == '核销成功') {
            wx.showToast({
              title: '核销成功',
              icon: 'success',
              duration: 1000,
            })
            setTimeout(function () {
              wx.navigateBack({
                
              })
            }, 1000)
          }
          else {
            wx.showModal({
              title: '提示',
              content: res.data,
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
        }
      });
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