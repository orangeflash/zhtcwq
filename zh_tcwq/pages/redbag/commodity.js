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
    wx.hideShareMenu({

    })
    var that = this
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
      'url': 'entry/wxapp/StoreGoodList',
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
        var rows = res.data
        rows.sort(function (a, b) {
          return Date.parse(b.time) - Date.parse(a.time);//时间正序
        })
        console.log(rows)
        if (activeindex == 0) {
          that.setData({
            store_shop: store_shop,
            url: url
          })
        }else if (activeindex ==1) {
          that.setData({
            store_shop: rows,
            url: url
          })
        }

      }
    })
  },
  // -------------顶部切换效果---------------
  select: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    this.setData({
      activeindex: index,
      index: index
    })
    this.refresh()
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
  shelves:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    console.log(id)
    app.util.request({
      'url': 'entry/wxapp/UpGood',
      'cachetime': '0',
      data: {
        good_id: id
      },
      success: function (res) {
        console.log(res)
        if(res.data==1){
          wx: wx.showToast({
            title: '上架成功',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          setTimeout(function () {
            that.refresh()
          }, 2000)
        }
        if(res.data==2){
          wx:wx.showToast({
            title: '商品已经上架',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      }
    })
  },
  shelf: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    app.util.request({
      'url': 'entry/wxapp/DownGood',
      'cachetime': '0',
      data: {
        good_id: id
      },
      success: function (res) {
        console.log(res)
        if(res.data==1){

          wx: wx.showToast({
            title: '下架成功',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          setTimeout(function () {
            that.refresh()
          }, 2000)
        }
        if (res.data == 2) {
          wx: wx.showToast({
            title: '商品已经下架',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    })
  },
  delgood: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelGood',
            'cachetime': '0',
            data: {
              good_id: id
            },
            success: function (res) {
              console.log(res)
              wx: wx.showToast({
                title: '删除成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
              setTimeout(function () {
                that.refresh()
              }, 2000)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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