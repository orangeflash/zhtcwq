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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: '平台管理员登录',
    })
    app.getUrl(this)
    this.setData({
      bqxx: getApp().xtxx,
    })
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
    wx.redirectTo({
      url: 'tzlb',
    })
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
    var that = this;
    console.log(this);
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      if (userinfo.img == '' || userinfo.name == '') {
        wx.navigateTo({
          url: '/zh_tcwq/pages/index/getdl',
        })
      }
      that.setData({
        userinfo: userinfo,
      })
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
  // onShareAppMessage: function () {

  // }
})