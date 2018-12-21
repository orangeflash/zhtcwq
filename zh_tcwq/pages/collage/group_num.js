// zh_tcwq/pages/collage/group_num.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    that.refresh(options.goods_id)
  },

  refresh: function (id) {
    var that = this
    var a = that.data
    // 商品详情
    app.util.request({
      'url': 'entry/wxapp/GoodsInfo',
      'cachetime': '0',
      data: {
        goods_id: id,
      },
      success: res => {
        console.log('商品详情', res)
        for (let i in res.data.group) {
          res.data.group[i].num = Number(res.data.group[i].kt_num) - Number(res.data.group[i].yg_num)
          if (res.data.group[i].name != '' && res.data.group[i].name != null && res.data.group[i].name.length >= 6) {
            res.data.group[i].name = res.data.group[i].name.slice(0, 6) + '...'
          }
        }
        console.log(res.data.group)
        var goods_info = res.data.goods
        that.countdown(goods_info.end_time)
        that.setData({
          group: res.data.group,
          goods_info: goods_info
        })
      }
    })
  },
  // 跳转参团详情
  collageInfo: function (e) {
    var a = this.data
    // id为团id
    wx.navigateTo({
      url: 'group?id=' + e.currentTarget.dataset.id + '&user_id=' + e.currentTarget.dataset.userid + '&goods_id=' + a.goods_info.id,
    })
  },
  // countdown(activity.start_time)
  countdown: function (time) {
    var that = this
    var EndTime = time || [];
    var NowTime = Math.round(new Date().getTime() / 1000)
    var total_micro_second = EndTime - NowTime || []
    if (total_micro_second <= 0) {
      app.util.request({
        url: 'entry/wxapp/UpdateGroup',
        data: {
          store_id: that.data.id
        },
        success: res => {
          console.log(res)
        }
      })
      that.setData({
        clock: false
      });
    } else if (total_micro_second > 0 && that.data.clock != false) {
      that.dateformat(total_micro_second)
      setTimeout(function () {
        total_micro_second -= 1000;
        that.countdown(time);
      }, 1000)
    }

  },

  // 时间格式化输出，如11:03 25:19 每1s都会调用一次
  dateformat: function (micro_second) {
    var that = this
    // 总秒数
    var second = Math.floor(micro_second);
    // 天数
    var day = Math.floor(second / 3600 / 24);
    // 小时
    var hr = Math.floor(second / 3600 % 24);
    // 分钟
    var min = Math.floor(second / 60 % 60);
    // 秒
    var sec = Math.floor(second % 60);
    if (day < 10) {
      day = '0' + day
    }
    if (hr < 10) {
      hr = '0' + hr
    }
    if (sec < 10) {
      sec = '0' + sec
    }
    if (min < 10) {
      min = '0' + min
    }
    that.setData({
      day: day,
      hour: hr,
      min: min,
      sec: sec
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
  
  }
})