// integral.js
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
    wx.hideShareMenu({

    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var that = this
    var user_id = wx.getStorageSync('users').id
    console.log(user_id)
    // 积分
    app.util.request({
      'url': 'entry/wxapp/Jfmx',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        var score = res.data
        // var integral = 0
        // for (var i = 0; i < score.length; i++) {
        //   if (score[i].type == 1) {
        //     integral += Number(score[i].score)
        //   }
        //   if (score[i].type == 2){
        //     integral -= Number(score[i].score)
        //   }
        // }
        // console.log(integral)
        that.setData({
          score: score
        })
      }
    })
    // 积分
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          integral: res.data.total_score,
        })
      }
    })
  },
  tzjfsc:function(){
    wx.redirectTo({
      url: 'integral',
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