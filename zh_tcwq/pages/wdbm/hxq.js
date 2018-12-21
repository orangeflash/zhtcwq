// zh_zbkq/pages/index/yhqdl.js
var app=getApp();
var dsq;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  maketel: function (t) {
    var a = this.data.hdinfo.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  location: function () {
    var jwd = this.data.hdinfo.coordinate.split(','), t = this.data.hdinfo.address;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t,
      name: '位置'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    this.setData({
      color: wx.getStorageSync('color'),
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
    })
    var uid = wx.getStorageSync('users').id;
    console.log(uid)
    //取详情;
    app.util.request({
      'url': 'entry/wxapp/ActivityInfo',
      'cachetime': '0',
      data: { id: options.hdid },
      success: function (res) {
        console.log(res)
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
        that.setData({
          hdinfo: res.data
        })
      },
    })
    //ActCode;
    app.util.request({
      'url': 'entry/wxapp/ActCode',
      'cachetime': '0',
      data: { id: options.hxid },
      success: function (res) {
        console.log(res)
        that.setData({
          hxm: res.data
        })
      },
    })
    // dsq=setInterval(function(){
    //   //;
    //   app.util.request({
    //     'url': 'entry/wxapp/UseCoupons',
    //     'cachetime': '0',
    //     data: { coupons_id: options.yhqid, user_id: uid, qid: options.qid},
    //     success: function (res) {
    //       console.log(res.data)
    //       if(res.data==2){
    //         wx.showToast({
    //           title: '核销成功',
    //           duration:1000,
    //         })
    //         setTimeout(function(){
    //           wx.reLaunch({
    //             url: '../../index/index',
    //           })
    //         },1000)
    //       }
    //     }
    //   });
    // },5000)
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
    clearInterval(dsq)
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