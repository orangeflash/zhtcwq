// pages/fabu/fabu.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    base: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.pageOnLoad(this);
    app.setNavigationBarColor(this);
    that.reload()
  },
  reload: function (e) {
    var that = this
    var store_name = wx.getStorageSync('System')
    console.log(store_name)
    var url = wx.getStorageSync('url')
    that.setData({
      url: url,
      pt_name: store_name.pt_name,
      System:wx.getStorageSync('System')
    })
    //---------------------------------- 获取首页分类----------------------------------
    app.util.request({
      'url': 'entry/wxapp/type',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var nav = res.data
        that.setData({
          nav: nav
        })

      },
    })
  },
  settled: function (e) {
    wx: wx.navigateTo({
      url: '../../settled/settled',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 搜集formid
  formid_one: function (e) {
    console.log('搜集第一个formid')
    console.log(e)
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: wx.getStorageSync('users').id,
        form_id: e.detail.formId,
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {

      },
    })
  },
  // 点击跳转到编辑发布页面
  bindPickerChange: function (e) {
    console.log(e)
    var that = this
    var id = that.data.id
    var inde = e.detail.value
    var info = that.data.nav[that.data.index].array[inde]
    for (let i in that.data.nav[that.data.index].array) {
      if (info == that.data.nav[that.data.index].arrays[i].name) {
        var type_id = that.data.nav[that.data.index].arrays[i].id
        var type2_id = that.data.nav[that.data.index].arrays[i].type_id
        var money = that.data.nav[that.data.index].money
      }
    }
    console.log(that.data.nav[that.data.index])
    wx: wx.navigateTo({
      url: '../edit/edit?info=' + info + '&id=' + id + '&type_id=' + type_id + '&money=' + money + '&type2_id=' + type2_id,
    })
  },
  // ---------------------------------------------------------跳转入驻
  edit: function (e) {
    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var money = that.data.nav[index].money + ',' + that.data.nav[index].money2
    var array = []
    var user_id = wx.getStorageSync('users').id;
    console.log(money)
    app.util.request({
      'url': 'entry/wxapp/FtXz',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res, user_id)
        if (res.data == '今天发帖次数已经超限!') {
          wx.showModal({
            title: '提示',
            content: '今天发帖次数已经超限!',
          })
        }
        else{
          app.util.request({
            'url': 'entry/wxapp/type2',
            'cachetime': '0',
            data: { id: id },
            success: function (res) {
              console.log(res)
              if (res.data.length != 0) {
                res.data.map(function (item) {
                  var obj = {}
                  obj = item.name
                  array.push(obj);
                })
                console.log(array)
                that.setData({
                  array: array,
                  arrays: res.data,
                  base: true,
                  type_id: id,
                  money: money
                })
              } else {
                wx: wx.navigateTo({
                  url: '../edit/edit?id=' + that.data.id + '&type_id=' + id + '&money=' + money + '&type2_id=' + 0,
                })
              }
            },
          })
        }
      },
    })
  },
  // ----------------------------------点击取消--------------------------------
  cancel: function (e) {
    this.setData({
      base: false
    })
  },
  // ----------------------------------点击选择----------------------------------
  selected: function (e) {
    var that = this
    var arrays = that.data.arrays
    var index = e.currentTarget.id
    var type_id = that.data.type_id
    var type2_id = arrays[index].id
    var info = arrays[index].name
    var money = that.data.money
    that.setData({
      base: false
    })
    wx: wx.navigateTo({
      url: '../edit/edit?type2_id=' + type2_id + '&type_id=' + type_id + '&money=' + money + '&info=' + info,
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
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //     }
    //     else {
    //       console.log('未授权过')
    //       wx.reLaunch({
    //         url: '../../index/index',
    //       })
    //     }
    //     // if (res.authSetting['scope.userLocation']) {
    //     //   // 已经授权
    //     // }
    //     // else {
    //     //   wx.showModal({
    //     //     title: '提示',
    //     //     content: '您暂未授权位置信息无法正常使用,请在（右上角 - 关于 - 右上角 - 设置）中开启位置信息授权后，首页下拉刷新即可正常使用',
    //     //     success: function (res) {
    //     //       wx.reLaunch({
    //     //         url: '../../index/index',
    //     //       })
    //     //     }
    //     //   })
    //     // }
    //   }
    // })
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