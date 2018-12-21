// zh_tcwq/pages/collage/order_info.js
var app =  getApp();

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
    // Take out cache order
    var that = this, info = wx.getStorageSync('order_info')
    app.setNavigationBarColor(this);
    var that = this;
    // Qutput domain name
    that.setData({
      url:wx.getStorageSync('url')
    })
    console.log(info)
    that.setData({
      info:info
    })
    // Load cancel code
    app.util.request({
      'url': 'entry/wxapp/OrderCode',
      'cachetime': '0',
      data: { order_id: info.id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          hx_code: res.data
        })
      },
    })
  },
  // My collage
  my_group:function(e){
    let info = this.data.info
    wx.navigateTo({
      url: 'group?id=' +info.group_id  + '&user_id=' + info.user_id  + '&goods_id=' + info.goods_id,
    })
  },
  // Buy again
  buy:function(e){
    let info = this.data.info
    wx.navigateTo({
      url: '/zh_tcwq/pages/collage/info?id=' +info.goods_id,
    })
  },
  // View more products
  more:function(e){
    wx.navigateTo({
      url:'/zh_tcwq/pages/collage/index'
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