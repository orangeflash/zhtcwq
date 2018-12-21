// zh_cjpt/pages/canvas/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    page: 1,
    group_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: options.title,
    })
    console.log(options)
    if (options.id == null) {
      var id = ''
    } else {
      var id = options.id
    }
    if (options.store_id == null) {
      var store_id = ''
    } else {
      var store_id = options.store_id
    }
    if (options.store_logo == null) {
      var store_logo = ''
    } else {
      var store_logo = options.store_logo
    }
    if (options.display == null) {
      var display = ''
    } else {
      var display = options.display
    }
    that.setData({
      id: id,
      store_id: store_id,
      store_logo: store_logo,
      display: display,
      url: wx.getStorageSync('url')
    })
    wx.showLoading({
      title: '正在加载',
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    var page = that.data.page
    var group_list = that.data.group_list
    // 商品列表
    app.util.request({
      'url': 'entry/wxapp/GroupGoods',
      'cachetime': '0',
      data: {
        store_id: that.data.store_id,
        type_id: that.data.id,
        page: page,
        display: that.data.display, cityname: wx.getStorageSync('city')
      },
      success: res => {
        console.log('商品列表', res)
        console.log(group_list)
        if (res.data.length > 0) {
          wx.hideLoading()
          group_list = group_list.concat(res.data)
          that.setData({
            group_list: group_list,
            page: page + 1
          })
        }
      }
    })
  },
  // 详情跳转
  // 详情跳转
  index: function (e) {
    wx.navigateTo({
      url: 'info?id=' + e.currentTarget.dataset.id + '&store_id=' + e.currentTarget.dataset.storeid + '&store_logo=' + this.data.store_logo,
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
    this.reload()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})