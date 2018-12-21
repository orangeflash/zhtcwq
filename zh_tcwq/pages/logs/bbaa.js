// zh_dianc/pages/seller/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    zh: '',
    mm: '',
    logintext: '登录',
    werchat: false,
    hydl: false,
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
                          that.setData({
                            user_id: res.data.id,
                            user_info: res.data
                          })
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
    console.log(this);
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          system: res.data,
          url: wx.getStorageSync('url')
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
        var u = res.data
        that.setData({
          bqxx: u
        })
      }
    })
    if (wx.getStorageSync('users')) {
      that.setData({
        user_id: wx.getStorageSync('users').id,
        name: wx.getStorageSync('users').name
      })
    }
    else {
      this.getuserinfo()
    }
  },
  name: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  password: function (e) {
    console.log(e)
    this.setData({
      password: e.detail.value
    })
  },
  sign: function (e) {
    console.log(this.data)
    app.util.request({
      'url': 'entry/wxapp/StoreLogin',
      'cachetime': '0',
      data: { user_name: this.data.name, pwd: this.data.password },
      success: function (res) {
        console.log(res)
        if (res.data == '账号不存在!' || res.data == '密码不正确!') {
          wx: wx.showModal({
            title: '提示',
            content: '当前账号未绑定操作员',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx.setStorageSync('store_info', res.data)
          var id = res.data.id
          console.log(id)
          wx: wx.redirectTo({
            url: '../redbag/merchant?id=' + res.data.id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
    })
  },
  weixin: function (e) {
    if (this.data.werchat == false) {
      this.setData({
        werchat: true
      })
    } else if (this.data.werchat == true) {
      this.setData({
        werchat: false
      })
    }

  },
  queding: function (e) {
    this.setData({
      werchat: false
    })
    app.util.request({
      'url': 'entry/wxapp/sjdlogin',
      'cachetime': '0',
      data: { user_id: this.data.user_id },
      success: function (res) {
        console.log(res)
        if (res.data == false) {
          wx: wx.showModal({
            title: '提示',
            content: '当前账号未绑定操作员',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        else if (res.data.state == '1') {
          wx.showModal({
            title: '提示',
            content: '您的入驻申请正在后台审核，请耐心等待',
          })
        }
        else if (res.data.state == '2') {
          wx.setStorageSync('store_info', res.data)
          var user_id = res.data.user_id
          wx: wx.redirectTo({
            url: '../redbag/merchant?id=' + res.data.id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        else if (res.data.state == '3') {
          wx.showModal({
            title: '提示',
            content: '您的入驻申请已被拒绝，请联系平台处理',
          })
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
  // onShareAppMessage: function () {

  // }
})