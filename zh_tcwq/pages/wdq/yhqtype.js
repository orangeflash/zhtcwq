// pages/tongcheng/tongcheng.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  inputValue: '',
  data: {
    page: 1,
    refresh_top: false,
    seller: [],
    typeid: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    app.setNavigationBarColor(this);
    if (options.name) {
      wx.setNavigationBarTitle({
        title: options.name,
      })
    }
    this.setData({
      titlename: options.name,
      typeid:options.id,
      System: wx.getStorageSync('System'),
    })
    var that = this;
    var city = wx.getStorageSync('city')
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      },
    })
    this.seller(this.data.typeid)
  },
  // -----------------------------------帖子信息--------------------------------
  seller: function (typeid) {
    console.log('typeid为', typeid)
    var that = this
    var nowtime = util.formatTime(new Date)
    var date = util.formatTime(new Date).replace(/\//g, "-").toString();
    console.log(nowtime, date)
    var city = wx.getStorageSync('city')
    var page = that.data.page, store_id = that.data.store_id || '', seller = that.data.seller, cityname = this.data.store_id == null ? wx.getStorageSync('city') : '';
    console.log(store_id, cityname)
    app.util.request({
      'url': 'entry/wxapp/CouponList',
      'cachetime': '0',
      data: { type_id: typeid, store_id: store_id, page: page, pagesize: 10, cityname: cityname },
      success: function (res) {
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].rate = parseInt((1 - Number(res.data[i].surplus) / Number(res.data[i].number)) * 100)
        }
        if (res.data.length < 10) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1
          })
        }
        seller = seller.concat(res.data)
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        seller = unrepeat(seller)
        console.log(seller)
        for (let i = 0; i < seller.length; i++) {
          if (seller[i].end_time > date) {
            seller[i].isgq = 2
          }
          else {
            seller[i].isgq = 1
          }
        }
        that.setData({
          seller: seller
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
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
    console.log('上拉触底')
    if (this.data.refresh_top == false) {
      this.seller(this.data.typeid)
    } else {
      console.log('没有更多了')
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   var titlename = this.data.titlename;
  //   console.log(titlename)
  //   return {
  //     title: titlename,
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // }
})