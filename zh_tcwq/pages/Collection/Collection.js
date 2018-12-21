// pages/marry/marry.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {


    star2: [
      {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }
    ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 35,

    tabs: ["收藏的信息", "收藏的商家"],
    activeIndexe: 0,
    sliderOffsete: 0,
    sliderLefte: 0,
  },
  navClick: function (e) {
    this.setData({
      sliderOffsete: e.currentTarget.offsetLeft,
      activeIndexe: e.currentTarget.id
    });
  },
  tabClick: function (e) {
    var that = this
    console.log(e)
    var classification = that.data.classification
    var activeIndex = e.currentTarget.id
    var type2_id = classification[activeIndex].id
    var type2_name = classification[activeIndex].name
    console.log(classification[activeIndex])
    this.setData({
      activeIndex: activeIndex
    });
    app.util.request({
      'url': 'entry/wxapp/PostList',
      'cachetime': '0',
      data: { type2_id: type2_id },
      success: function (res) {
        console.log(res)
        var classification_info = []
        for (let i in res.data) {
          res.data[i].type2_name = type2_name
          res.data[i].img = res.data[i].img.split(",")
          if (res.data[i].store_name!=null){
            classification_info.concat(res.data[i])
          }
        }
        console.log(classification_info)
        that.setData({
          classification_info: classification_info
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          System: res.data,
        })
      },
    })
    console.log(options)
    // ------------------------------------------动态设置导航栏的标题---------------------------------------
    wx.setNavigationBarTitle({
      title: options.name
    })
    // ------------------------------------------大分类id---------------------------------------
    var url = wx.getStorageSync('url')
    that.setData({
      url: url
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    var user_id = wx.getStorageSync('users').id
    console.log(user_id)
    // ============================获取我的收藏=====================
    app.util.request({
      'url': 'entry/wxapp/MyCollection',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        var classification_info = []
        for (let i in res.data) {
          if (res.data[i].details != null) {
            var time1 = that.ormatDate(res.data[i].time)
            res.data[i].img = res.data[i].img.split(",")
            if (res.data[i].img.length >= 4) {
              res.data[i].img1 = res.data[i].img.slice(0, 4)
            } else {
              res.data[i].img1 = res.data[i].img
            }
            res.data[i].time = time1.slice(0, 16)
            classification_info.push(res.data[i])
          }
        }
        console.log(classification_info)
        that.setData({
          classification_info: classification_info
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/MyStoreCollection',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        var star = that.data.star2
        console.log(star)
        var img = '../image/xing.png'
        var sellers = []
        for (let i in res.data) {
          if (res.data[i].store_name != null) {
            sellers.push(res.data[i])
            // 获取商家的经纬度
            var lat = res.data[i].coordinates
            var ss = lat.split(",")
            res.data[i].lat2 = Number(wx.getStorageSync('Location').latitude)
            res.data[i].lng2 = Number(wx.getStorageSync('Location').longitude)
            // 获取两者之间的距离
            var lat1 = Number(wx.getStorageSync('Location').latitude)
            var lng1 = Number(wx.getStorageSync('Location').longitude)
            var lat2 = ss[0]
            var lng2 = ss[1]
            var radLat1 = lat1 * Math.PI / 180.0;
            var radLat2 = lat2 * Math.PI / 180.0;
            var a = radLat1 - radLat2;
            var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378.137;
            s = Math.round(s * 10000) / 10000;
            var s = s.toFixed(2)
            res.data[i].distance = s
            res.data[i].star = star
            res.data[i].score = parseInt(res.data[i].score)
            if (res.data[i].score == 0) {
              res.data[i].star = res.data[i].star
            } else if (res.data[i].score == 1) {
              res.data[i].star[0].img = img
            } else if (res.data[i].score == 2) {
              res.data[i].star[0].img = img
              res.data[i].star[1].img = img
            } else if (res.data[i].score == 3) {
              res.data[i].star[0].img = img
              res.data[i].star[1].img = img
              res.data[i].star[2].img = img
            } else if (res.data[i].score == 4) {
              res.data[i].star[0].img = img
              res.data[i].star[1].img = img
              res.data[i].star[2].img = img
              res.data[i].star[3].img = img
            } else if (res.data[i].score == 5) {
              res.data[i].star[0].img = img
              res.data[i].star[1].img = img
              res.data[i].star[2].img = img
              res.data[i].star[3].img = img
              res.data[i].star[4].img = img
            }
            console.log(sellers)
            that.setData({
              sellers: sellers
            })
          }
        }
       
      }
    })
  },
  // // -----------------------------------------------点赞-----------------------------------------------
  // thumbs_up: function (e) {
  //   var that = this
  //   console.log(e)
  //   var post_info_id = e.currentTarget.dataset.id
  //   var user_id = wx.getStorageSync('users').id
  //   var thumbs_up = Number(e.currentTarget.dataset.num)
  //   app.util.request({
  //     'url': 'entry/wxapp/Like',
  //     'cachetime': '0',
  //     data: { information_id: post_info_id, user_id: user_id },
  //     success: function (res) {
  //       console.log(res)
  //       if (res.data != 1) {
  //         wx: wx.showModal({
  //           title: '提示',
  //           content: '不能重复点赞',
  //           showCancel: true,
  //           cancelText: '取消',
  //           cancelColor: '',
  //           confirmText: '确认',
  //           confirmColor: '',
  //           success: function (res) { },
  //           fail: function (res) { },
  //           complete: function (res) { },
  //         })
  //       } else {
  //         that.reload()
  //         that.setData({
  //           thumbs_ups: true,
  //           thumbs_up: thumbs_up + 1
  //         })
  //       }
  //     },
  //   })

  // },
  // -----------------------------时间戳转换日期时分秒--------------------------------
  ormatDate: function (dateNum) {
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
  },
  // -----------------------------------跳转商家详情界面-------------------------------
  store: function (e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../sellerinfo/sellerinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  see: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var classification_info = that.data.classification_info
    var id = e.currentTarget.dataset.id
    for (let i in classification_info) {
      if (classification_info[i].id == id) {
        var my_post = classification_info[i]
      }
    }
    console.log(my_post)
    wx: wx.navigateTo({
      url: '../infodetial/infodetial?id=' + my_post.information_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  phone: function (e) {
    var id = e.currentTarget.dataset.id
    wx.makePhoneCall({
      phoneNumber: id
    })
  },
  // ----------------------------------拨打电话----------------------------------
  phone1: function (e) {
    console.log(e)
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
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
    this.reload()
    wx: wx.stopPullDownRefresh()
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