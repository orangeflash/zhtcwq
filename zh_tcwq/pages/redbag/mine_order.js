// zh_tcwq/pages/redbag/mine_order.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['待付款', '待发货', '待收货', '已完成', '售后/退款'],
    activeIndex:0,
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var url = wx.getStorageSync('url')
    if (options.activeIndex!=null){
      that.setData({
        activeIndex: options.activeIndex,
        store_id: options.store_id
      })
    }
    that.setData({
      url:url
    })
    that.refresh()
  },
  refresh:function(){
    var that = this
    var activeIndex = that.data.activeIndex
    var store_id = that.data.store_id
    app.util.request({
      'url': 'entry/wxapp/StoreOrder',
      'cachetime': '0',
      data: { store_id: store_id },
      success: function (res) {
        console.log(res)
        var order1 = [], order2 = [], order3 = [], order4 = [], order5 = []
        for (let i in res.data) {
          res.data[i].time = app.ormatDate(res.data[i].time)
          if (res.data[i].state == 1) {
            order1.push(res.data[i])
          } else if (res.data[i].state == 2) {
            order2.push(res.data[i])
          } else if (res.data[i].state == 3) {
            order3.push(res.data[i])
          } else if (res.data[i].state == 4) {
            order4.push(res.data[i])
          } else if (res.data[i].state == 5 || res.data[i].state == 6 || res.data[i].state == 7) {
            order5.push(res.data[i])
          }
        }
        console.log(order1)
        if (activeIndex == 0) {
          that.setData({
            order: order1
          })
        } else if (activeIndex == 1) {
          that.setData({
            order: order2
          })
        } else if (activeIndex == 2) {
          that.setData({
            order: order3
          })
        } else if (activeIndex == 3) {
          that.setData({
            order: order4
          })
        } else if (activeIndex == 4) {
          that.setData({
            order: order5
          })
        }
        console.log(order1)

      },
    })
  },
  select:function(e){
    console.log(e)
    var that = this
    var store_id = that.data.store_id
    var index = e.currentTarget.dataset.index
    app.util.request({
      'url': 'entry/wxapp/StoreOrder',
      'cachetime': '0',
      data: { store_id: store_id },
      success: function (res) {
        console.log(res)
        var order1 = [], order2 = [], order3 = [], order4 = [], order5 = []
        for (let i in res.data) {
          res.data[i].time = app.ormatDate(res.data[i].time)
          if (res.data[i].state == 1) {
            order1.push(res.data[i])
          } else if (res.data[i].state == 2) {
            order2.push(res.data[i])
          } else if (res.data[i].state == 3) {
            order3.push(res.data[i])
          } else if (res.data[i].state == 4) {
            order4.push(res.data[i])
          } else if (res.data[i].state == 5 || res.data[i].state == 6 || res.data[i].state == 7) {
            order5.push(res.data[i])
          }
        }
        console.log(order1)
        if (index == 0) {
          that.setData({
            order: order1
          })
        } else if (index == 1) {
          that.setData({
            order: order2
          })
        } else if (index == 2) {
          that.setData({
            order: order3
          })
        } else if (index == 3) {
          that.setData({
            order: order4
          })
        } else if (index == 4) {
          that.setData({
            order: order5
          })
        }
      },
    })
    that.setData({
      activeIndex:index,
      index:index
    })
  },
   // -----------------------------确认发货----------------------------
  order_info:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx:wx.navigateTo({
      url: 'mine_order_info?id='+id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
    app.setNavigationBarColor(this);
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