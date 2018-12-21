// zh_tcwq/pages/redbag/commodity.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['全部', '新品上架', '热门商品'],
    activeindex: 0,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    var store_id = options.store_id
    that.setData({
      store_id: store_id
    })
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var url = wx.getStorageSync('url')
    var activeindex = that.data.activeindex
    var store_id = that.data.store_id
    app.util.request({
      'url': 'entry/wxapp/GoodList',
      'cachetime': '0',
      data: {
        store_id: store_id
      },
      success: function (res) {
        console.log(res)
        var store_shop = res.data
        for (let i in store_shop) {
          store_shop[i].lb_imgs = store_shop[i].lb_imgs.split(",")[0]
        }
        that.setData({
          store_shop: store_shop,
          shop: store_shop,
          url: url
        })
        // var rows = res.data
        // rows.sort(function (a, b) {
        //   return Date.parse(b.time) - Date.parse(a.time);//时间正序
        // })
        // console.log(rows)
        // if (activeindex == 0) {
        //   that.setData({
        //     store_shop: store_shop,
        //     shop: store_shop,
        //     url: url
        //   })
        // } else if (activeindex == 1) {
        //   that.setData({
        //     store_shop: rows,
        //     shop: rows,
        //     url: url
        //   })
        // }

      }
    })
  },
  // -------------顶部切换效果---------------
  select: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var store_shop = this.data.shop
    this.setData({
      activeindex: index,
      index: index
    })
    if(index==2){
      var compare = function (a, b) {
        var a = Number(a.sales);
        var b = Number(b.sales);
        if (a > b) {
          return -1
        } else if (a < b) {
          return 1
        } else {
          return 0
        }
      }
      var store_shop = store_shop.sort(compare)
      this.setData({
        store_shop: store_shop
      })
    }
    if(index==1){
     this.refresh()
    }
    if(index==0){

      this.refresh()
    }
  },
  modify: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    var store_id = that.data.store_id
    wx: wx.navigateTo({
      url: 'modify?id=' + id + '&store_id=' + store_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goods_info: function (e) {
    console.log(e)
    var store_id = this.data.store_id
    var id = e.currentTarget.id
    wx: wx.navigateTo({
      url: 'good_info?id=' + id + '&store_id=' + store_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    this.refresh()
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
    this.refresh()
    wx.stopPullDownRefresh()
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