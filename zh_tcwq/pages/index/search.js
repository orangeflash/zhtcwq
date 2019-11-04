// zh_tcwq/pages/index/search.js
var app = getApp();
var searchTitle = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    inputShowed: false,
    inputVal: "",
    searchLogShowed: true,
    refresh_top: false,
    seller: [],
    page: 1,
  },
  showInput: function () {
    var that = this;
    that.setData({
      inputShowed: true,
      searchLogShowed: true
    });
  },
  // 点击 搜索 按钮
  searchData: function () {
    console.log(searchTitle)
    var that = this;
    that.setData({
      refresh_top: false,
      seller: [],
      page: 1,
    });
    //  
    if ("" != searchTitle) {
      that.refresh(searchTitle)
      that.setData({
        djss:true,
      })
    }
    else {
      wx.showToast({
        title: '搜索内容为空',
        icon: 'loading',
        duration: 1000,
      })
    }
  },

  // 点击叉叉icon 清除输入内容
  clearInput: function () {
    var that = this;
    that.setData({
      inputVal: ""
    });
    searchTitle = "";
  },

  // 输入内容时  
  inputTyping: function (e) {
    var that = this;
    that.setData({
      inputVal: e.detail.value,
      searchLogShowed: true
    });
    searchTitle = e.detail.value;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    app.setNavigationBarColor(this);
    //---------------------------------- 获取网址----------------------------------
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data,
          color: wx.getStorageSync('color'),
          system: wx.getStorageSync('System'),
        })
      },
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log(res)
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
      }
    })
  },
  see: function (e) {
    var that = this
    var seller = that.data.seller
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: "../infodetial/infodetial?id=" + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  previewImage: function (e) {
    console.log(e)
    var seller_id = e.currentTarget.dataset.id
    // this.setData({
    //   seller_id: seller_id
    // })
    var that = this
    var url = that.data.url
    var urls = []
    var inde = e.currentTarget.dataset.inde
    var seller = that.data.seller
    // var seller_id = that.data.seller_id
    for (let i in seller) {
      if (seller[i].tz.id == seller_id) {
        var pictures = seller[i].tz.img
        for (let i in pictures) {
          urls.push(url + pictures[i]);
        }
        wx.previewImage({
          current: url + pictures[inde],
          urls: urls
        })
      }
    }
  },
  phone: function (e) {
    var id = e.currentTarget.dataset.id
    wx.makePhoneCall({
      phoneNumber: id
    })
  },
  refresh: function (ssnr) {
    console.log(ssnr)
    var that = this
    var city = wx.getStorageSync('city')
    var page = that.data.page, seller = that.data.seller;
    console.log(seller, page)
    app.util.request({
      'url': 'entry/wxapp/list2',
      'cachetime': '0',
      data: { keywords: ssnr, page: page, lat: that.data.lat,lng:that.data.lng},
      success: function (res) {
        that.setData({
          page: page + 1,
          djss: false,
        })
        console.log(res)
        if (res.data.length < 10) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false
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
        for (let i in res.data) {
          var time1 = app.ormatDate(res.data[i].tz.sh_time);
          res.data[i].tz.img = res.data[i].tz.img.split(",")
          res.data[i].tz.details = res.data[i].tz.details.replace("↵", " ");
          if (res.data[i].tz.img.length > 4) {
            res.data[i].tz.img_length = Number(res.data[i].tz.img.length) - 4
          }
          if (res.data[i].tz.img.length >= 4) {
            res.data[i].tz.img1 = res.data[i].tz.img.slice(0, 4)
          } else {
            res.data[i].tz.img1 = res.data[i].tz.img
          }
          res.data[i].tz.time = time1.slice(0, 16)
          if (Number(res.data[i].tz.juli) < 1000) {
            res.data[i].tz.juli = Number(res.data[i].tz.juli) + 'm'
          }
          else {
            res.data[i].tz.juli = (Number(res.data[i].tz.juli) / 1000).toFixed(2) + 'km'
          }
        }
        function rgb() {
          var r = Math.floor(Math.random() * 255);
          var g = Math.floor(Math.random() * 255);
          var b = Math.floor(Math.random() * 255);
          var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
          return rgb;
        }
        for (let i in seller) {
          for (let j in seller[i].label) {
            seller[i].label[j].number = rgb()
          }
          that.setData({
            seller: seller
          })
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
    if (this.data.refresh_top == false) {
      this.refresh(searchTitle)
    } else {

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})