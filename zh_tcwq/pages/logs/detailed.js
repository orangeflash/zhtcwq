// zh_tcwq/pages/logs/detailed.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    var state = options.state
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
    })
    var user_id = wx.getStorageSync('users').id
    that.setData({
      state: state,
      system: wx.getStorageSync('System')
    })
    app.util.request({
      'url': 'entry/wxapp/MyTiXian',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
        console.log(res)
        var detailed = []
        for (let i in res.data) {
          res.data[i].time = that.ormatDate(res.data[i].time).slice(0, 16)
          that.setData({
            detailed: res.data
          })
          // if (res.data[i].state == state) {
          //   detailed.concat(res.data[i])
          //   that.setData({
          //     detailed: detailed
          //   })
          // }
        }

      }
    })
    app.util.request({
      'url': 'entry/wxapp/Hbmx',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
        var compare = function(a, b) {
          var a = Number(a.time);
          var b = Number(b.time);
          if (a < b) {
            return -1
          } else if (a > b) {
            return 1
          } else {
            return 0
          }
        }
        for (let i in res.data) {
          res.data[i].time = that.ormatDate(res.data[i].time).slice(0, 16)
        }
        var detaileds = res.data.sort(compare)
        console.log(detaileds)
        that.setData({
          detaileds: detaileds
        })
      }
    })
    if (state == 3) {
      app.util.request({
        'url': 'entry/wxapp/CallList',
        data: {
          post_id: options.postId
        },
        success: function(res) {
          for (let i in res.data) {
            res.data[i].time = that.ormatDate(res.data[i].time).slice(0, 16)
          }
          that.setData({
            ckdh: res.data
          })
        }
      })
    }
  },
  ormatDate: function(dateNum) {
    var date = new Date(dateNum * 1000);
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);

    function fixZero(num, length) {
      var str = "" + num;
      var len = str.length;
      var s = "";
      for (var i = length; i-- > len;) {
        s += "0";
      }
      return s + str;
    }
  }
})