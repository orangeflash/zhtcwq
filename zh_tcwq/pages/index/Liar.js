// zh_dianc/pages/Liar/Liar.js
var a = getApp();
var dsq, dsq1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
  },
  tggg:function(){
    clearInterval(dsq)
    clearTimeout(dsq1)
    wx.reLaunch({
      url: 'index',
    })
  },
  jumps: function () {
    var that = this;
    wx.navigateTo({
      url: that.data.xtxx.kp_url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    a.setNavigationBarColor(this);
    a.getUrl(this)
    // 系统设置
    a.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var xtxx = res.data;
        xtxx.gs_img = xtxx.gs_img.split(',')
        if (xtxx.kp_img != '') {
          xtxx.kp_img = xtxx.kp_img.split(',')
        }
        that.setData({
          xtxx: xtxx,
          second: xtxx.kp_time,
          kpggimg: xtxx.kp_img
        })
        var second = Number(xtxx.kp_time);
        if (xtxx.model == '1') {
          dsq = setInterval(() => {
            second--
            that.setData({
              second: second,
            })
          }, 1000)
          dsq1 = setTimeout(() => {
            clearInterval(dsq)
            wx.reLaunch({
              url: 'index',
            })
          }, second * 1000)
        }
        // wx.setNavigationBarTitle({
        //   title: res.data.url_name,
        // })
      },
    })
    // a.util.request({
    //   'url': 'entry/wxapp/Ad',
    //   'cachetime': '0',
    //   data: { cityname: '' },
    //   success: function (res) {
    //     console.log(res)
    //     var advert = []
    //     for (let i in res.data) {
    //       if (res.data[i].type == 5) {
    //         advert.push(res.data[i])
    //       }
    //     }
    //     that.setData({
    //       kpggimg: advert,
    //     })
    //   },
    // })
  },
  maketel: function (t) {
    var a = this.data.xtxx.gs_tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  location: function () {
    var jwd = this.data.xtxx.gs_zb.split(','), t = this.data.xtxx;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t.gs_add,
      name: '位置'
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
    this.onLoad();
    wx.stopPullDownRefresh();
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