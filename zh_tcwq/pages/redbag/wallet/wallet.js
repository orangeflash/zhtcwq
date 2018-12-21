// zh_tcwq/pages/merchant/wallet/wallet.js
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var that=this;
    console.log(options)
    app.util.request({
      'url': 'entry/wxapp/Storewallet',
      'cachetime': '0',
      data: {
        store_id: options.store_id
      },
      success: function (res) {
        console.log(res)
        // var order = res.data
        // var order_num = []
        // for (let i in order) {
        //   order[i].time = app.ormatDate(order[i].time).slice(0, 10)
        //   order[i].time = order[i].time.replace(/-/g, "/")
        //   if (time == order[i].time) {
        //     order_num.push(order[i])
        //   }
        // }
        that.setData({
          score: res.data,
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