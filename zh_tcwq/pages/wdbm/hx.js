// zh_zbkq/pages/my/tjhxy/hx.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  updateUserInfo: function (res) {
    console.log(res)
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        hydl: false,
      })
      this.getuserinfo();
    }
  },
  getuserinfo: function () {
    var that = this;
    wx.login({
      success: function (res) {
        console.log('这是登录所需要的code')
        console.log(res.code)
        var code = res.code
        wx.setStorageSync("code", code)
        wx.getSetting({
          success: function (res) {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  // ----------------------------------异步保存用户登录信息----------------------------------
                  wx.setStorageSync("user_info", res.userInfo)
                  // ----------------------------------用户登录的名字----------------------------------
                  var nickName = res.userInfo.nickName
                  // ----------------------------------用户登录的头像----------------------------------
                  var avatarUrl = res.userInfo.avatarUrl
                  that.setData({
                    user_name: nickName
                  })
                  console.log('用户名字')
                  console.log(res.userInfo.nickName)
                  console.log('用户头像')
                  console.log(res.userInfo.avatarUrl)
                  app.util.request({
                    'url': 'entry/wxapp/openid',
                    'cachetime': '0',
                    data: { code: code },
                    success: function (res) {
                      // 异步保存session-key
                      wx.setStorageSync("key", res.data.session_key)
                      //  -------------------------需要上传给后台的值 包括名字和头像----------------------------------
                      var img = avatarUrl
                      var name = nickName
                      // 异步7保存用户openid
                      wx.setStorageSync("openid", res.data.openid)
                      var openid = res.data.openid
                      console.log('这是用户的openid')
                      console.log(openid)
                      //---------------------------------- 获取用户登录信息----------------------------------
                      app.util.request({
                        'url': 'entry/wxapp/Login',
                        'cachetime': '0',
                        data: { openid: openid, img: img, name: name },
                        success: function (res) {
                          console.log('这是用户的登录信息')
                          console.log(res)
                          // ----------------------------------异步保存用户信息----------------------------------
                          wx.setStorageSync('users', res.data)
                          wx.setStorageSync('uniacid', res.data.uniacid)
                        },
                      })
                    },
                  })
                }
              })
            }
            else {
              console.log('未授权过')
              that.setData({
                hydl: true,
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    var hxmid = scene;
    this.setData({
      hxmid: hxmid,
    })
    this.getuserinfo()
  },
  hx: function () {
    var that = this;
    var hxmid = this.data.hxmid;
    var uid = wx.getStorageSync('users').id;
    //
    console.log('扫码人的uid', uid, 'hxmid', hxmid)
    app.util.request({
      'url': 'entry/wxapp/ActHx',
      'cachetime': '0',
      data: { user_id: uid, id: hxmid },
      success: function (res) {
        console.log(res)
        if (res.data == '暂无核销权限') {
          wx.showModal({
            title: '提示',
            content: res.data,
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../index/index',
            })
          }, 1000)
        }
        if (res.data == '1') {
          wx.showModal({
            title: '提示',
            content: '核销成功',
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../index/index',
            })
          }, 1000)
        }
        if (res.data == '2') {
          wx.showModal({
            title: '提示',
            content: '核销失败',
          })
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