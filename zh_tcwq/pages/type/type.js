// pages/tongcheng/tongcheng.js
var app = getApp();
var Data = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    currentTab: 0,
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    averdr: false,
    hotels: false,
    refresh_top: false,
    scroll_top: true,
    index_class: false,
    sxtab: ['全部'],
    activesxtab: 0,
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  swiperChange1: function (e) {
    this.setData({
      swiperCurrent1: e.detail.current
    })
  },
  // ----------------------------------同城合伙人----------------------------------
  redinfo: function (e) {
    var that = this, user_id = wx.getStorageSync('users').id;
    //用户是否申请
    app.util.request({
      'url': 'entry/wxapp/MyDistribution',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if (res.data.state == '2') {
          console.log('是分销商')
          wx.navigateTo({
            url: '../distribution/yaoqing',
          })
        }
        else if (res.data.state == '1') {
          wx.showModal({
            title: '提示',
            content: '您的申请正在审核中，请耐心等待',
          })
        }
        else {
          wx.navigateTo({
            url: '../distribution/jrhhr',
          })
        }
      }
    });
  },
  jumps: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src
    var ggid = e.currentTarget.dataset.id
    var sjtype = e.currentTarget.dataset.sjtype
    console.log(ggid)
    var type = e.currentTarget.dataset.type
    if (type == 1) {
      console.log(src)
      if (src == '../distribution/jrhhr') {
        that.redinfo();
        return false
      }
      wx: wx.navigateTo({
        url: src,
        success: function (res) {
          that.setData({
            averdr: true
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (type == 2) {
      wx: wx.navigateTo({
        url: '../car/car?vr=' + ggid + '&sjtype=' + sjtype,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (type == 3) {
      wx.navigateToMiniProgram({
        appId: appid,
        path: '',
        extraData: {
          foo: 'bar'
        },
        // envVersion: 'develop',
        success(res) {
          // 打开成功
          that.setData({
            averdr: true
          })
        }
      })
    }
  },
  city_select: function (e) {
    wx: wx.navigateTo({
      url: 'city',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  delete: function (e) {
    this.setData({
      averdr: true
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })

  },
  seller: function (e) {
    wx: wx.navigateTo({
      url: '../sellerinfo/sellerinfo',
    })
  },
  settled: function (e) {
    wx: wx.navigateTo({
      url: '../settled/settled',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    app.pageOnLoad(this);
    app.setNavigationBarColor(this);
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        that.seller()
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    //---------------------------------- 异步保存上传图片需要的网址----------------------------------
    app.util.request({
      'url': 'entry/wxapp/Url2',
      'cachetime': '0',
      success: function (res) {
        wx.setStorageSync('url2', res.data)
      },
    })
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        if (Number(res.data.total_num) > 10000) {
          res.data.total_num = (Number(res.data.total_num) / 10000).toFixed(2) + '万'
        }
        that.setData({
          System: res.data,
          userinfo:wx.getStorageSync("users"),
        })
        if (res.data.fj_tz == '1') {
          that.setData({
            sxtab: ['全部', '附近'],
          })
        }
      },
    })
    //---------------------------------- 获取浏览量----------------------------------
    app.util.request({
      'url': 'entry/wxapp/Views',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var views = res.data
        if (views == '') {
          views = 0
        }
        else if (Number(views) > 10000) {
          views = (Number(views) / 10000).toFixed(2) + '万'
        }
        that.setData({
          views: views
        })
      },
    })
    //---------------------------------- 获取帖子数量----------------------------------
    app.util.request({
      'url': 'entry/wxapp/Num',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          Num: res.data
        })
      },
    })
    //---------------------------------- 获取网址----------------------------------
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        // ---------------------------------- 异步保存网址前缀----------------------------------
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })
    that.refresh()
  },
  hddb: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1000
    })
  },
  refresh: function (e) {
    var that = this
    var city = wx.getStorageSync('city')

    //---------------------------------- 获取最新入驻----------------------------------
    app.util.request({
      'url': 'entry/wxapp/Storelist',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        if (res.data.length <= 5) {
          that.setData({
            store: res.data
          })
        } else {
          that.setData({
            store: res.data.slice(0, 6)
          })
        }

      },
    })
    // -----------------------------------轮播图和公告--------------------------------
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        console.log(res)
        var slide = []
        var advert = []
        var ggslide=[]
        for (let i in res.data) {
          if (res.data[i].type == 8) {
            slide.push(res.data[i])
          }
          if (res.data[i].type == 5) {
            advert.push(res.data[i])
          }
          if (res.data[i].type == 7) {
            ggslide.push(res.data[i])
          }
        }
        that.setData({
          slide: slide,
          advert: advert,
          ggslide: ggslide,
        })
      },
    })
    //---------------------------------- 首页公告----------------------------------
    app.util.request({
      'url': 'entry/wxapp/news',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        var msgList = []
        var msgList1 = []
        for (let i in res.data) {
          if (res.data[i].type == 4) {
            msgList.push(res.data[i])
          }
        }
        that.setData({
          msgList: msgList
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/type',
      'cachetime': '0',
      success: function (res) {
        // ----------------------------------获取分类的集合----------------------------------
        var navs = res.data

        // ----------------------------------高度随分类的数量去改变----------------------------------
        if (navs.length <= 5) {
          that.setData({
            height: 165
          })
        } else if (navs.length > 5) {
          that.setData({
            height: 330
          })
        }
        // ----------------------------------把分类以10个位一组分隔开----------------------------------
        var nav = []
        for (var i = 0, len = navs.length; i < len; i += 10) {
          nav.push(navs.slice(i, i + 10))
        }
        console.log(nav,navs)
        that.setData({
          nav: nav,
          navs: navs
        })
      },
    })

  },
  // -----------------------------------帖子信息--------------------------------
  seller: function (e) {
    var that = this
    var index_class = that.data.index_class
    var city = wx.getStorageSync('city'), index = that.data.activeIndex;
    var type_id = index ? that.data.navs[index].id : '', isfj = that.data.activesxtab == '1' ? '1' : '2';
    var page = that.data.page, seller = that.data.seller;
    console.log(index, city, page, type_id, isfj)
    function getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
    }
    if (page == null || page == '') {
      page = 1
    }
    if (seller == null || seller == '') {
      seller = []
    }
    app.util.request({
      'url': 'entry/wxapp/list2',
      'cachetime': '0',
      data: { type_id: type_id, fj_tz: isfj, lat: that.data.lat, lng: that.data.lng, page: page, cityname: city },
      success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1
          })
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
        }
        if (res.data.length > 0) {
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
            if (Number(res.data[i].juli) < 1000) {
              res.data[i].tz.juli = Number(res.data[i].tz.juli) + 'm'
            }
            else {
              res.data[i].tz.juli = (Number(res.data[i].tz.juli)/1000).toFixed(2) + 'km'
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
        } else {
          that.setData({
            seller: seller
          })
        }
      },
    })
  },
  commend: function (e) {
    var that = this
    var activeIndex = e.currentTarget.id
    function getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
    }
    that.setData({
      page: '',
      seller: '',
      index_class: true,
      activeIndex: activeIndex
    })
    that.seller()

  },
  // 选择全部
  whole: function (e) {
    // wx.removeStorage({
    //   key: 'index',
    //   success: function (res) {
    //   }
    // })
    this.setData({
      activesxtab: e.currentTarget.dataset.index,
      activeIndex: null,
      page: 1,
      seller: [],
      index_class: false
    })
    this.seller()
  },
  bindinput: function (e) {
    var that = this
    var value = e.detail.value
    if (value != '') {
      app.util.request({
        'url': 'entry/wxapp/list2',
        'cachetime': '0',
        data: { keywords: value },
        success: function (res) {
          if (res.data.length == 0) {
            wx: wx.showModal({
              title: '提示',
              content: '没有这个帖子',
              showCancel: true,
              cancelText: '取消',
              confirmText: '确定',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            wx: wx.navigateTo({
              url: "../infodetial/infodetial?id=" + res.data[0].tz.id,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }

        }
      })
    }

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
  // -----------------------------------------------点赞-----------------------------------------------
  thumbs_up: function (e) {
    var that = this
    var seller = that.data.seller
    var post_info_id = e.currentTarget.dataset.id
    var user_id = wx.getStorageSync('users').id
    var thumbs_up = Number(e.currentTarget.dataset.num)
    for (let i in seller) {
      if (seller[i].tz.id == post_info_id) {
        seller[i].thumbs_up = true
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
                confirmText: '确认',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else {
              seller[i].tz.givelike = Number(seller[i].tz.givelike) + 1
              that.setData({
                seller: seller,
              })

            }
          },
        })
      }
    }


  },
  // ---------------------------获取需要预览的帖子id--------------------------
  // previewimg: function (e) {
  //   var seller_id = e.currentTarget.dataset.id
  //   this.setData({
  //     seller_id: seller_id
  //   })
  // },
  // --------------------------------------------图片预览
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
  //
  red: function (e) {
    wx.navigateTo({
      url: '../redbag/redbag',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  yellow_page: function (e) {
    wx.reLaunch({
      url: '../yellow_page/yellow',
    })
  },
  post1: function (e) {
    wx.switchTab({
      url: '../fabu/fabu/fabu'
    })
  },
  // ---------------------获取商家详情------------------
  store_info: function (e) {
    var id = e.currentTarget.id
    wx: wx.navigateTo({
      url: '../sellerinfo/sellerinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ----------------------------------发帖----------------------------------
  notice: function (e) {
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../notice/notice?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ----------------------------------发帖----------------------------------
  post: function (e) {
    wx, wx.reLaunch({
      url: '../shun/shun',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ----------------------------------拨打热门推荐电话----------------------------------
  phone: function (e) {
    var id = e.currentTarget.dataset.id
    wx.makePhoneCall({
      phoneNumber: id
    })
  },
  // ----------------------------------跳转到商家----------------------------------
  more: function (e) {
    wx: wx.switchTab({
      url: '../store/store',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ----------------------------------跳转到分类页----------------------------------
  jump: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx: wx.navigateTo({
      url: '../marry/marry?id=' + id + '&name=' + name,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ---------------------------------------查看详情
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
  // 搜集formid
  formid_one: function (e) {
    console.log('搜集第一个formid')
    console.log(e)
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: wx.getStorageSync('users').id,
        form_id: e.detail.formId,
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {

      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      first: 1
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // var city_type = wx.getStorageSync('city_type')
    // if (city_type == 1) {
    //   this.setData({
    //     page: 1,
    //     seller: []
    //   })
    //   this.reload()
    //   this.refresh()
    //   this.seller()
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // wx.removeStorage({
    //   key: 'city_type',
    //   success: function (res) {
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('city_type')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    this.setData({
      page: 1,
      seller: [],
      refresh_top: false,
    })
    that.refresh()
    that.seller()
    wx: wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.refresh_top == false) {
      this.seller()
    } else {

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})