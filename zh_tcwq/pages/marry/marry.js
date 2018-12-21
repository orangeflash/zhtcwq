// pages/marry/marry.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sliderOffset: 0,
    activeIndex1:1,
    sliderLeft: 35,
    refresh_top: false,
    refresh1_top: false,
    page: 1,
    page1: 1,
    tie:[],
    tie1:[]
  },
  hdsy: function (e) {
    wx: wx.reLaunch({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  hdft: function (e) {
    wx: wx.reLaunch({
      url: '../fabu/fabu/fabu',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  tabClick: function (e) {
    var that = this
    var activeIndex = e.currentTarget.id
    var classification = that.data.classification
    var type2_id = classification[activeIndex].id
    var type2_name = classification[activeIndex].name
    this.setData({
      activeIndex: activeIndex,
      activeIndex1: 0,
      page1:1,
      type2_id: type2_id,
      type2_name: type2_name,
      tie1: [],
    });
    this.refresh1()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    // ------------------------------------------动态设置导航栏的标题---------------------------------------
    wx.setNavigationBarTitle({
      title: options.name
    })
    // ------------------------------------------大分类id---------------------------------------
    var id = options.id
    var url = wx.getStorageSync('url')
    that.setData({
      id: id,
      url: url,
      tname: options.name,
      system: wx.getStorageSync('System'),
    })
    that.reload()
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        that.refresh()
      }
    })
  },
  wole: function (e) {
    this.setData({
      activeIndex: -1,
      activeIndex1: 1,

      classification_info:this.data.tie
    })
  },
  reload: function (e) {
    var that = this
    var id = that.data.id
    console.log(id)
    app.util.request({
      'url': 'entry/wxapp/type2',
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log(res)
        if (res.data.length>0){
          var type2_id = res.data[0].id
          var type2_name = res.data[0].name
          that.setData({
            classification: res.data
          })
        }
      },
    })
  },
  refresh:function(e){
    var that = this
    var id = that.data.id
    var city=wx.getStorageSync('city')
    console.log(city)
    // ============================时间戳转换日期======================
    function getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
    }
    console.log(that.data.page)
    app.util.request({
      'url': 'entry/wxapp/list',
      'cachetime': '0',
      data: { type_id: id, page: that.data.page, lat: that.data.lat, lng: that.data.lng,cityname:city },
      success: function (res) {
        console.log(res)
        if (res.data.length == 0) {
          // wx: wx.showToast({
          //   title: '没有更多了',
          //   icon: '',
          //   image: '',
          //   duration: 2000,
          //   mask: true,
          //   success: function (res) { },
          //   fail: function (res) { },
          //   complete: function (res) { },
          // })
          that.setData({
            refresh_top:true
          })
        } else {
          that.setData({
            page: that.data.page + 1
          })
          var tie = that.data.tie
          tie = tie.concat(res.data)
          for (let i in res.data) {
            // var time1 = getLocalTime(res.data[i].tz.time)
            // var time2 = time1.getFullYear() + '-' + (time1.getMonth() + 1) + '-' + time1.getDate()
            res.data[i].tz.img = res.data[i].tz.img.split(",")
            res.data[i].tz.details = res.data[i].tz.details.replace("↵", " ");
            res.data[i].tz.time = that.ormatDate(res.data[i].tz.time)
            if (res.data[i].tz.img.length > 4) {
              res.data[i].tz.img_length = Number(res.data[i].tz.img.length) - 4
            }
            if (res.data[i].tz.img.length >= 4) {
              res.data[i].tz.img = res.data[i].tz.img.slice(0, 4)
            } else {
              res.data[i].tz.img = res.data[i].tz.img
            }
            if (Number(res.data[i].tz.juli) < 1000) {
              res.data[i].tz.juli = Number(res.data[i].tz.juli) + 'm'
            }
            else {
              res.data[i].tz.juli = (Number(res.data[i].tz.juli) / 1000).toFixed(2) + 'km'
            }
            function rgb() {
              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
              return rgb;
            }
            for (let j in res.data[i].label) {
              res.data[i].label[j].number = rgb()
            }
          }
          that.setData({
            classification_info: tie,
            tie: tie
          })
        }

      },
    })
  },
  refresh1: function (e) {
   var that = this
   var city = wx.getStorageSync('city')
   console.log(that.data.type2_id)
   console.log(that.data.type2_name)
   app.util.request({
     'url': 'entry/wxapp/PostList',
     'cachetime': '0',
     data: { type2_id: that.data.type2_id, page: that.data.page1, lat: that.data.lat, lng: that.data.lng, cityname: city },
     success: function (res) {
       console.log(res)
       if(res.data==0){
         wx:wx.showToast({
           title: '没有更多了',
           icon: '',
           image: '',
           duration: 1000,
           mask: true,
           success: function(res) {},
           fail: function(res) {},
           complete: function(res) {},
         })
         that.setData({
           refresh1_top:true
         })
       }else{
         that.setData({
           page1:that.data.page1+1
         })
         
       }
       var tie1 = that.data.tie1
       console.log(tie1)
       tie1 = tie1.concat(res.data)
       for (let i in res.data) {
         res.data[i].tz.type2_name = that.data.type2_name
         var time1 = that.ormatDate(res.data[i].tz.time)
         res.data[i].tz.time = time1.slice(0, 16)
         res.data[i].tz.img = res.data[i].tz.img.split(",").slice(0, 4)
         function rgb() {
           var r = Math.floor(Math.random() * 255);
           var g = Math.floor(Math.random() * 255);
           var b = Math.floor(Math.random() * 255);
           var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
           return rgb;
         }
         if (Number(res.data[i].tz.juli) < 1000) {
           res.data[i].tz.juli = Number(res.data[i].tz.juli) + 'm'
         }
         else {
           res.data[i].tz.juli = (Number(res.data[i].tz.juli) / 1000).toFixed(2) + 'km'
         }
         for (let j in res.data[i].label) {
           res.data[i].label[j].number = rgb()
         }
       }
       that.setData({
         classification_info: tie1,
         tie1: tie1
       })
     },
   })
  },
  EventHandle: function (e) {
    var activeIndex1 = this.data.activeIndex1
    if (activeIndex1==1){
      if (this.data.refresh_top == false) {
        this.refresh()
      } else {
        // wx: wx.showToast({
        //   title: '没有更多了',
        //   icon: '',
        //   image: '',
        //   duration: 2000,
        //   mask: true,
        //   success: function (res) { },
        //   fail: function (res) { },
        //   complete: function (res) { },
        // })
      }
    }else{
      if (this.data.refresh1_top == false) {
        this.refresh1()
      } else {
        // wx: wx.showToast({
        //   title: '没有更多了',
        //   icon: '',
        //   image: '',
        //   duration: 2000,
        //   mask: true,
        //   success: function (res) { },
        //   fail: function (res) { },
        //   complete: function (res) { },
        // })
      }
    }
   
  },
  // -----------------------------------------------点赞-----------------------------------------------
  thumbs_up: function (e) {
    var that = this
    var post_info_id = e.currentTarget.dataset.id
    var user_id = wx.getStorageSync('users').id
    var thumbs_up = Number(e.currentTarget.dataset.num)
    app.util.request({
      'url': 'entry/wxapp/Like',
      'cachetime': '0',
      data: { information_id: post_info_id, user_id: user_id },
      success: function (res) {
        if (res.data != 1) {
          wx: wx.showModal({
            title: '提示',
            content: '不能重复点赞',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确认',
            confirmColor: '',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          that.reload()
          that.setData({
            thumbs_ups: true,
            thumbs_up: thumbs_up + 1
          })
        }
      },
    })

  },
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
  see: function (e) {
    var that = this
    var classification_info = that.data.classification_info
    var id = e.currentTarget.dataset.id
    for (let i in classification_info) {
      if (classification_info[i].tz.id == id) {
        var my_post = classification_info[i].tz
      }
    }
    wx: wx.navigateTo({
      url: '../infodetial/infodetial?id=' + my_post.id,
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
    var id=this.data.id,name=this.data.tname;
    console.log(id,name)
    return {
      path: '/zh_tcwq/pages/marry/marry?id='+id+'&name='+name,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})