var app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    url: wx.getStorageSync('url')
  },
  onLoad: function (options) {
    console.log(options)
    var that = this, sjdsjid = wx.getStorageSync('sjdsjid');
    wx.setNavigationBarTitle({
      title: '拼团详情',
    })
    app.setNavigationBarColor(this);
    app.util.request({
      'url': 'entry/wxapp/PtGroupOrderInfo',
      'cachetime': '0',
      data: { group_id: options.group_id},
      success: function (res) {
        console.log(res.data)
        res.data.group.dq_time = util.ormatDate(res.data.group.dq_time)
        res.data.group.kt_time = util.ormatDate(res.data.group.kt_time)
        for (let i = 0; i < res.data.order.length; i++) {
          res.data.order[i].time = util.ormatDate(res.data.order[i].time)
          res.data.order[i].xf_time = util.ormatDate(res.data.order[i].xf_time)
          res.data.order[i].pay_time = util.ormatDate(res.data.order[i].pay_time)
        }
        that.setData({
          group: res.data.group,
          groupinfo: res.data
        })
      }
    });
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
})