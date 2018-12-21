// zh_tcwq/pages/active/active.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luntext: ['新入', '附近', '热门'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 35,
    currentTab: 0,
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    slide: [
      { img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513057315830&di=28c50097b1b069b2de68f70d625df8e2&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fa8014c086e061d95cb1b561170f40ad162d9cabe.jpg', },
      { img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513057315830&di=28c50097b1b069b2de68f70d625df8e2&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fa8014c086e061d95cb1b561170f40ad162d9cabe.jpg', }
    ],
    store: [
      { store_name: "王呵呵" },
      { store_name: "赵四" },
    ]
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = wx.getStorageSync('url')
    that.setData({
      url: url
    })
    // ----------------------------------获取分类的集合----------------------------------
    app.util.request({
      'url': 'entry/wxapp/StoreType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var store = res.data
        // ----------------------------------高度随分类的数量去改变----------------------------------
        if (store.length <= 5) {
          that.setData({
            height: 130
          })
        } else if (store.length > 5) {
          that.setData({
            height: 260
          })
        }
        // ----------------------------------把分类以10个位一组分隔开----------------------------------
        var nav = []
        for (var i = 0, len = store.length; i < len; i += 10) {
          nav.push(store.slice(i, i + 10))
        }
        console.log(nav)
        that.setData({
          nav: nav
        })
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
    this.reload()
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