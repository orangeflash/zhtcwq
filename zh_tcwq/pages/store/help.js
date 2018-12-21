// zh_zbkq/pages/my/bzzx/bzzx.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
    ]
  },
  kindToggle: function (e) {
    var index = e.currentTarget.id, list = this.data.list;
    console.log(index)
    wx.setStorageSync('bzinfo', list[index].answer)
    wx.navigateTo({
      url: '../logs/system?isbz=1&title=' + list[index].question,
    })
    return
    for (var i = 0, len = list.length; i < len; ++i) {
      if (i == index) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    console.log(this);
    //取帮助信息
    app.util.request({
      'url': 'entry/wxapp/GetHelp',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data
        })
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
  // onShareAppMessage: function () {

  // }
})