// zh_tcwq/pages/integral/integral.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slide:[
      { logo:'http://opocfatra.bkt.clouddn.com/images/0/2017/10/tdJ70qw1fEfjfVJfFDD09570eqF28d.jpg'},
      { logo: 'http://opocfatra.bkt.clouddn.com/images/0/2017/10/k5JQwpBfpb0u8sNNy5l5bhlnrhl33W.jpg' },
      { logo: 'http://opocfatra.bkt.clouddn.com/images/0/2017/10/zUeEednDedmUkIUumN9XI6IXU91eko.jpg' }
    ],
    fenlei:[],
    commodity:[]
  },
  tzweb: function (e) {
    console.log(e.currentTarget.dataset.index, this.data.lblist)
    var item = this.data.lblist[e.currentTarget.dataset.index]
    var sjtype = e.currentTarget.dataset.sjtype
    console.log(item)
    if (item.state == '1') {
      wx.redirectTo({
        url: item.src,
      })
    }
    if (item.state == '2') {
      wx: wx.navigateTo({
        url: '../car/car?vr=' + item.id + '&sjtype=' + sjtype,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    if (item.state == '3') {
      wx.navigateToMiniProgram({
        appId: item.appid,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = wx.getStorageSync('url'), city = wx.getStorageSync('city')
    this.setData({
      url:url
    })
    wx.hideShareMenu({
      
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var that = this
    this.reLoad()
    //
    app.util.request({
      'url': 'entry/wxapp/Ad3',
      'cachetime': '0',
      data:{ctiyname:city},
      success: function (res) {
        console.log(res)
        that.setData({
          lblist: res.data
        })
      }
    })
    //type
    app.util.request({
      'url': 'entry/wxapp/Jftype',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          fenlei: res.data
        })
      }
    })
    //商品列表
    app.util.request({
      'url': 'entry/wxapp/JfGoods',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          commodity: res.data
        })
      }
    })
  },
  reLoad(){
    var that = this
    var user_id = wx.getStorageSync('users').id
    // 积分
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          integral: res.data.total_score
        })
      }
    })
  },
  // —————————————点击跳转到兑换记录—————————————————
  record: function (e) {
    wx:wx.navigateTo({
      url: 'record/record',
    })
  },
  interinfo: function (e) {
    console.log(e.currentTarget.id)
    wx: wx.navigateTo({
      url: 'integralinfo/integralinfo?id=' + e.currentTarget.id,
    })
  },
  cxfl:function(e){
    console.log(e.currentTarget.id)
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/JftypeGoods',
      'cachetime': '0',
      data: { type_id: e.currentTarget.id},
      success: function (res) {
        console.log(res)
        that.setData({
          commodity: res.data
        })
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
    this.reLoad();
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
    this.onLoad();
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