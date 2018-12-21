// zh_dianc/pages/logs/distribution/txmx.js
var app=getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['待审核', '已通过','已拒绝'],
    activeIndex: 0,
    djd: [],
    score: [{ note: '支付宝提现', time: '2017-10-18 12：11：25', money: '2.00', type: '1' }, { note: '银行卡提现', time: '2017-10-18 12：11：25', money: '5.00', type: '1' }],
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  reLoad:function(){
    var that = this;
    var user_id = wx.getStorageSync('users').id;
    //
    app.util.request({
      'url': 'entry/wxapp/YjtxList',
      'cachetime': '0',
      data: { user_id:user_id},
      success: function (res) {
        console.log(res.data)
        for (var i = 0; i < res.data.length; i++){
          res.data[i].time = util.ormatDate(res.data[i].time)
          res.data[i].sh_time = util.ormatDate(res.data[i].sh_time)
        }
        var dsh=[],ytg=[],yjj=[];
        for(var i=0;i<res.data.length;i++){
          if(res.data[i].state=='1'){
            dsh.push(res.data[i])
          }
          if (res.data[i].state == '2') {
            ytg.push(res.data[i])
          }
          if (res.data[i].state == '3') {
            yjj.push(res.data[i])
          }
        }
        console.log(dsh,ytg,yjj)
        that.setData({
          dsh:dsh,
          ytg:ytg,
          yjj:yjj,
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
     this.reLoad();
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
    this.reLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
})