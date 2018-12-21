// zh_cjdianc/pages/smdc/getdl.js
var a = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  bindGetUserInfo: function (res) {
    console.log(res)
    var pages = getCurrentPages(),that=this;
    console.log(pages)
    if (res.detail.errMsg == "getUserInfo:ok") {
      wx.showLoading({
        title: '登录中...',
        mask:true,
      })
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
          a.util.request({
            'url': 'entry/wxapp/login',
            'cachetime': '0',
            data: { openid: getApp().getOpenId, img: res.userInfo.avatarUrl, name: res.userInfo.nickName },
            header: {
              'content-type': 'application/json'
            },
            dataType: 'json',
            success: function (res) {
              console.log('用户信息', res)
              a.globalData.userInfo = res.data
              if (pages.length > 1) {

                var prePage = pages[pages.length - 2];

                prePage.setData({
                  userinfo: res.data,
                })
              }
              setTimeout(function () {
                wx.navigateBack({
                })
              }, 1000)
            },
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    a.setNavigationBarColor(this);
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