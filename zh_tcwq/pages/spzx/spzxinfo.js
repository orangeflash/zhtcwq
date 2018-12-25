// pages/tongcheng/tongchenginfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dianzan: [{
      user_img: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ3PQDXes9vbhKKv49rbGEEv0EhCwHo4BvRMhx61xtQXFlvm6ILN8TxZ8r6pM8HCgqB3icIxtQAUfw/0"
    }, {
      user_img: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ3PQDXes9vbhKKv49rbGEEv0EhCwHo4BvRMhx61xtQXFlvm6ILN8TxZ8r6pM8HCgqB3icIxtQAUfw/0"
    }, {
      user_img: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ3PQDXes9vbhKKv49rbGEEv0EhCwHo4BvRMhx61xtQXFlvm6ILN8TxZ8r6pM8HCgqB3icIxtQAUfw/0"
    }],
    pl: [{
      details: "哦哦哦哦哦哦", name: "萌得发芽", user_img:
      "https://wx.qlogo.cn/mmopen/vi_32/MMxbq4GKvwLmcq6geRVEq9iay9KaXf7D5ax2p6bgBBFcpQpAjFqygWty9by9JHH4S3klOmicq2DaHbm7IppCGoDQ/0", time:"2018-01-24 15:29"
    }],
    dz:true,
  },
  dz:function(){
    var that=this;
    var user_id = wx.getStorageSync('users').id, video_id=this.data.spid;
    console.log(user_id,video_id)
    app.util.request({
      'url': 'entry/wxapp/VideoDz',
      'cachetime': '0',
      data: { user_id: user_id, video_id: video_id },
      success: function (res) {
        console.log(res)
        if (res.data == '点赞成功!') {
          wx.showToast({
            title: res.data,
            duration: 1000,
          })
          that.setData({
            dz: !that.data.dz
          })
          that.reLoad();
        }
        else if (res.data == '取消成功!') {
          wx.showToast({
            title: res.data,
            duration: 1000,
          })
          that.setData({
            dz: !that.data.dz
          })
          that.reLoad();
        }
        else{
          wx.showToast({
            title: '请求失败',
            duration: 1000,
          })
        }
      },
    })
  },
  bindinput:function(e){
    console.log(e.detail.value)
    this.setData({
      plnr: e.detail.value
    })
  },
  bindconfirm:function(){
    this.pl();
  },
  pl:function(){
    var plnr=this.data.plnr;
    var that = this;
    var user_id = wx.getStorageSync('users').id, video_id = this.data.spid;
    console.log(plnr,user_id, video_id)
    if (plnr == '' || plnr == null) {
      wx.showToast({
        title: '评论内容为空',
        icon: 'loading',
        duration: 1000,
      })
    }
    else{
      app.util.request({
        'url': 'entry/wxapp/VideoPl',
        'cachetime': '0',
        data: { user_id: user_id, video_id: video_id, content: plnr},
        success: function (res) {
          console.log(res)
          if (res.data == '评论成功!') {
            wx.showToast({
              title: res.data,
              duration: 1000,
            })
            that.reLoad();
          }
          else {
            wx.showToast({
              title: '请求失败',
              duration: 1000,
            })
          }
        },
      })
    }
  },
  back: function () {
    wx.redirectTo({
      url: 'spzx',
    })
  },
  jrzy:function(){
    wx.reLaunch({
      url: '../index/index',
    })
  },
  fbxx: function () {
    wx.reLaunch({
      url: '../fabu/fabu/fabu',
    })
  },
  gdzx: function () {
    wx.redirectTo({
      url: '../message/message',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options)
   wx.setNavigationBarColor({
     frontColor: '#ffffff',
     backgroundColor: wx.getStorageSync('color'),
     animation: {
       duration: 0,
       timingFunc: 'easeIn'
     }
   })
   var that = this;
   that.setData({
     spid: options.spid,
   })
   app.util.request({
     'url': 'entry/wxapp/Url',
     'cachetime': '0',
     success: function (res) {
       that.setData({
         url: res.data
       })
     },
   })
   app.util.request({
     'url': 'entry/wxapp/Llz',
     'cachetime': '0',
     data: { cityname: wx.getStorageSync('city'), type: 5},
     success: function (res) {
       console.log(res)
       that.setData({
         unitid: res.data,
       })
     },
   })
   this.reLoad();
  },
  reLoad:function(){
    var that = this;
    var spid = this.data.spid,user_id = wx.getStorageSync('users').id;
    console.log(spid,user_id)
    app.util.request({
      'url': 'entry/wxapp/VideoInfo',
      'cachetime': '0',
      data: { video_id: spid },
      success: function (res) {
        console.log(res)
        that.setData({
          spinfo: res.data,
        })
        for (let i = 0; i < res.data.dz.length;i++){
          if (user_id == res.data.dz[i].user_id){
            that.setData({
              dz: false,
            })
          }
        }
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
    var that = this;
    console.log(that.data.url + that.data.spinfo.fm_logo)
    return {
      title: that.data.spinfo.info.title,
      path: 'zh_tcwq/pages/spzx/spzxinfo?spid=' + that.data.spid,
      imageUrl: that.data.url+that.data.spinfo.info.fm_logo,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})