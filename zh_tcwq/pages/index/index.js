// pages/tongcheng/tongcheng.js
var app = getApp();
var Data = require('../../utils/util.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js'), qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
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
    seller: [], store1: [], yellow_list: [], pc: [], hdlist: [], zxlist: [],
    page: 1,
    star: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }
    ],
    star1: [
      {
        img: '../image/xing.png'
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
    star2: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }
    ],
    star3: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/star_none.png'
      }, {
        img: '../image/star_none.png'
      }
    ],
    star4: [
      {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/xing.png'
      }, {
        img: '../image/star_none.png'
      }
    ],
  },
  updateUserInfo: function (res) {
    console.log(res)
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        hydl: false,
      })
      this.reload();
    }
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
  jumps: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    var appid = e.currentTarget.dataset.appid
    var src = e.currentTarget.dataset.src
    var ggid = e.currentTarget.dataset.id
    var sjtype = e.currentTarget.dataset.sjtype
    console.log(ggid, sjtype)
    var type = e.currentTarget.dataset.type
    if (type == 1) {
      // var s1 = src.replace(/[^0-9]/ig, "");
      // src = src.replace(/(\d+|\s+)/g, "");
      // src = src
      // console.log(s1)
      console.log(src)
      if (src == '../distribution/jrhhr') {
        that.redinfo();
        return false
      }
      if (src == '../store/store') {
        wx.reLaunch({
          url: '../store/store',
        })
        return false
      }
      if (src == '../fabu/fabu/fabu') {
        wx.reLaunch({
          url: '../fabu/fabu/fabu',
        })
        return false
      }
      if (src == '../logs/logs') {
        wx.reLaunch({
          url: '../logs/logs',
        })
        return false
      }
      if (src == '../type/type') {
        wx.reLaunch({
          url: '../type/type',
        })
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
  settled: function (e) {
    wx: wx.navigateTo({
      url: '../settled/settled',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    console.log('onLoad')
    console.log(options)
    var scene = decodeURIComponent(options.scene)
    console.log('scene', scene)
    if (scene != 'undefined') {
      var fxzuid = scene
    }
    if (options.userid != null) {
      console.log('转发获取到的userid:', options.userid)
      var fxzuid = options.userid
    }
    console.log('fxzuid', fxzuid)
    this.setData({
      fxzuid: fxzuid,
    })
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '30',
      success: function (res) {
        console.log(res)
        // wx.setNavigationBarTitle({
        //   title: res.data.pt_name
        // })
        wx.setStorageSync('color', res.data.color)
        if (Number(res.data.total_num) > 10000) {
          res.data.total_num = (Number(res.data.total_num) / 10000).toFixed(2) + '万'
        }
        that.setData({
          System: res.data,
        })
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
        })
        console.log(res)
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
      'url': 'entry/wxapp/Llz',
      'cachetime': '0',
      data: { cityname: wx.getStorageSync('city'), type: 2 },
      success: function (res) {
        console.log(res)
        that.setData({
          unitid: res.data,
        })
      },
    })
    app.getUrl(this)
    this.reload();
  },
  reload: function (e) {
    var that = this, fxzuid = this.data.fxzuid;
    console.log(fxzuid)
    // ----------------------------------获取用户登录信息----------------------------------
    wx.login({
      success: function (res) {
        var code = res.code
        wx.setStorageSync("code", code)
        // wx.getSetting({
        //   success: function (res) {
        //     console.log(res)
        //     if (res.authSetting['scope.userInfo']) {
        //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        //       wx.getUserInfo({
        //         success: function (res) {
        //           console.log(res)
        //           wx.setStorageSync("user_info", res.userInfo)
        //           var nickName = res.userInfo.nickName
        //           var avatarUrl = res.userInfo.avatarUrl
                  app.util.request({
                    'url': 'entry/wxapp/openid',
                    'cachetime': '0',
                    data: { code: code },
                    success: function (res) {
                      console.log(res)
                      wx.setStorageSync("key", res.data.session_key)
                      wx.setStorageSync("openid", res.data.openid)
                      var openid = res.data.openid
                      app.util.request({
                        'url': 'entry/wxapp/Login',
                        'cachetime': '0',
                        data: { openid: openid, },
                        success: function (res) {
                          console.log(res)
                          that.setData({
                            userinfo: res.data
                          })
                          wx.setStorageSync('users', res.data)
                          wx.setStorageSync('uniacid', res.data.uniacid)
                          //Binding
                          if (fxzuid != null) {
                            app.util.request({
                              'url': 'entry/wxapp/Binding',
                              'cachetime': '0',
                              data: { fx_user: res.data.id, user_id: fxzuid },
                              success: function (res) {
                                console.log(res)
                              },
                            })
                          }
                        },
                      })
                    },
                  })
        //         }
        //       })
        //     }
        //     else {
        //       console.log('未授权过')
        //       that.setData({
        //         hydl: true,
        //       })
        //     }
        //   }
        // })
      }
    })
    //---------------------------------- 获取用户的地理位置----------------------------------
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.setStorageSync('Location', res)
        let latitude = res.latitude
        let longitude = res.longitude
        let op = latitude + ',' + longitude;
        app.util.request({
          'url': 'entry/wxapp/map',
          'cachetime': '0',
          data: { op: op },
          success: dwres => {
            console.log(dwres)
            // that.setData({
            //   dwcity: res.data.result.address_component.district
            // })
            app.util.request({
              'url': 'entry/wxapp/System',
              'cachetime': '30',
              success: function (res) {
                console.log(res)
                var systemres = res.data;
                if (res.data.dw_more == '1') {
                  that.setData({
                    dwcity: dwres.data.result.address_component.district
                  })
                }
                if (res.data.dw_more == '2') {
                  that.setData({
                    dwcity: dwres.data.result.address_component.city
                  })
                }
                wx.setStorageSync('System', res.data)
                // 是否开启多城市
                if (res.data.many_city == 1) {
                  wx.setStorageSync('city', res.data.cityname)
                  that.setData({
                    city: res.data.cityname
                  })
                }
                else {
                  console.log(wx.getStorageSync('city_type'))
                  if (wx.getStorageSync('city_type') != 1) {
                    wx.setStorageSync('city', that.data.dwcity)
                    that.setData({
                      city: that.data.dwcity
                    })
                  }
                  else {
                    that.setData({
                      city: wx.getStorageSync('city')
                    })
                    console.log('choosecity')
                  }
                }
                var city = wx.getStorageSync('city')
                that.refresh()
                console.log(city)
                if (res.data.is_city == '1') {
                  wx.setNavigationBarTitle({
                    title: city + ' ' + res.data.pt_name
                  })
                }
                else {
                  wx.setNavigationBarTitle({
                    title: res.data.pt_name
                  })
                }
                //高德
                var gd_key = res.data.gd_key
                if (gd_key == '') {
                  wx: wx.showModal({
                    title: '配置提示',
                    content: '请在后台配置高德地图的key',
                    showCancel: true,
                    cancelText: '取消',
                    confirmText: '确定',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
                var amapFile = require('../amap-wx.js')
                var myAmapFun = new amapFile.AMapWX({ key: gd_key });
                myAmapFun.getWeather({
                  success: function (data) {
                    function getMyDay(date) {
                      var week;
                      if (date.getDay() == 0) week = "星期日"
                      if (date.getDay() == 1) week = "星期一"
                      if (date.getDay() == 2) week = "星期二"
                      if (date.getDay() == 3) week = "星期三"
                      if (date.getDay() == 4) week = "星期四"
                      if (date.getDay() == 5) week = "星期五"
                      if (date.getDay() == 6) week = "星期六"
                      return week;
                    }
                    var city = data.liveData.city
                    var weather = data.liveData.weather
                    var reporttime = data.liveData.reporttime.slice(0, 10)
                    var w1 = getMyDay(new Date(reporttime))
                    var temperature = data.temperature.data
                    that.setData({
                      area: city,
                      reporttime: reporttime,
                      weather: weather,
                      w1: w1,
                      temperature: temperature
                    })
                    //成功回调
                  },
                  fail: function (info) {
                    //失败回调
                  }
                })
                app.util.request({
                  'url': 'entry/wxapp/GetPlate',
                  'cachetime': '0',
                  success: function (res) {
                    console.log(res)
                    if (res.data.length == 0 || !res.data) {
                      var bkarr = [{ type: '1', name: '最新信息' }];
                      if (systemres.fj_tz == '1') {
                        bkarr.push({ type: '1', name: '附近信息' })
                      }
                      if (systemres.is_sjrz == '1') {
                        bkarr.push({ type: '2', name: '热门商家' })
                      }
                      if (systemres.is_pageopen == '1' && systemres.is_hyqx == '1') {
                        bkarr.push({ type: '3', name: '黄页114' })
                      }
                      if (systemres.is_pcfw == '1' && systemres.is_pcqx == '1') {
                        bkarr.push({ type: '4', name: '顺风车' })
                      }
                      if (systemres.is_hd == '1' && systemres.is_hdqx == '1') {
                        bkarr.push({ type: '5', name: '活动报名' })
                      }
                      bkarr.push({ type: '6', name: '最新资讯' })
                      that.seller()
                    }
                    else {
                      var bkarr = res.data;
                      if (bkarr[0].type == '1') {
                        that.seller()
                      }
                      if (bkarr[0].type == '2') {
                        that.sjbk()
                      }
                      if (bkarr[0].type == '3') {
                        that.hybk()
                      }
                      if (bkarr[0].type == '4') {
                        that.sfcbk()
                      }
                      if (bkarr[0].type == '5') {
                        that.hdbmbk()
                      }
                      if (bkarr[0].type == '6') {
                        that.zxbk()
                      }
                    }
                    that.setData({
                      //System: res.data,
                      bkname: bkarr[0].type,
                      bkarr: bkarr,
                    })
                    console.log(bkarr)
                  },
                })
                app.util.request({
                  'url': 'entry/wxapp/SaveHotCity',
                  'cachetime': '0',
                  data: { cityname: city, user_id: wx.getStorageSync('users').id },
                  success: function (res) {
                    console.log(res)
                  },
                })
              },
            })
          }
        })
      },
      fail: function (res) {
        // wx.getSetting({
        //   success: (res) => {
        //     var authSetting = res.authSetting
        //     if (authSetting['scope.userLocation'] == false) {
        //       wx.openSetting({
        //         success: function success(res) {
        //         }
        //       });
        //     }
        //   }
        // })
        app.util.request({
          'url': 'entry/wxapp/System',
          'cachetime': '0',
          success: function (res) {
            console.log(res)
            //高德
            var gd_key = res.data.gd_key
            if (gd_key == '') {
              wx: wx.showModal({
                title: '配置提示',
                content: '请在后台配置高德地图的key',
                showCancel: true,
                cancelText: '取消',
                confirmText: '确定',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
            var amapFile = require('../amap-wx.js')
            var myAmapFun = new amapFile.AMapWX({ key: gd_key });
            myAmapFun.getWeather({
              success: function (data) {
                function getMyDay(date) {
                  var week;
                  if (date.getDay() == 0) week = "星期日"
                  if (date.getDay() == 1) week = "星期一"
                  if (date.getDay() == 2) week = "星期二"
                  if (date.getDay() == 3) week = "星期三"
                  if (date.getDay() == 4) week = "星期四"
                  if (date.getDay() == 5) week = "星期五"
                  if (date.getDay() == 6) week = "星期六"
                  return week;
                }
                var city = data.liveData.city
                var weather = data.liveData.weather
                var reporttime = data.liveData.reporttime.slice(0, 10)
                var w1 = getMyDay(new Date(reporttime))
                var temperature = data.temperature.data
                that.setData({
                  area: city,
                  reporttime: reporttime,
                  weather: weather,
                  w1: w1,
                  temperature: temperature
                })
                //成功回调
              },
              fail: function (info) {
                //失败回调
              }
            })
            var bkarr = ['最新信息'];
            if (res.data.is_sjrz == '1') {
              bkarr.push('热门商家')
            }
            if (res.data.is_pageopen == '1' && res.data.is_hyqx == '1') {
              bkarr.push('黄页114')
            }
            if (res.data.is_pcfw == '1' && res.data.is_pcqx == '1') {
              bkarr.push('顺风车')
            }
            if (res.data.is_hd == '1' && res.data.is_hdqx == '1') {
              bkarr.push('活动报名')
            }
            console.log(bkarr)
            wx.setStorageSync('System', res.data)
            wx.setStorageSync('city', res.data.cityname)
            that.setData({
              city: res.data.cityname
            })
            var city = wx.getStorageSync('city')
            console.log(city)
            that.setData({
              bkarr: bkarr,
            })
            that.refresh()
            that.seller()
          },
        })
      }
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

  },
  refresh: function (e) {
    var that = this
    var city = wx.getStorageSync('city')
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        console.log(res)
        var slide = [], advert = [], ggslide = [], zjggbk = [];
        for (let i in res.data) {
          if (res.data[i].type == 1) {
            slide.push(res.data[i])
          }
          if (res.data[i].type == 5) {
            advert.push(res.data[i])
          }
          if (res.data[i].type == 7) {
            ggslide.push(res.data[i])
          }
          if (res.data[i].type == 10) {
            zjggbk.push(res.data[i])
          }
        }
        that.setData({
          slide: slide,
          advert: advert,
          ggslide: ggslide,
          zjggbk: zjggbk,
        })
      },
    })
    //---------------------------------- 获取最新入驻----------------------------------
    app.util.request({
      'url': 'entry/wxapp/RmStore',
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
    //---------------------------------- 首页公告----------------------------------
    app.util.request({
      'url': 'entry/wxapp/news',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        var msgList = []
        var msgList1 = []
        for (let i in res.data) {
          if (res.data[i].type == 1) {
            msgList.push(res.data[i])
          }
        }
        that.setData({
          msgList: msgList
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/GetNav',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // ----------------------------------获取分类的集合----------------------------------
        var navs = res.data

        // ----------------------------------高度随分类的数量去改变----------------------------------
        if (navs.length <= 5) {
          that.setData({
            height: 150
          })
        } else if (navs.length > 5) {
          that.setData({
            height: 300
          })
        }
        // ----------------------------------把分类以10个位一组分隔开----------------------------------
        var nav = []
        for (var i = 0, len = navs.length; i < len; i += 10) {
          nav.push(navs.slice(i, i + 10))
        }
        that.setData({
          nav: nav,
          navs: navs
        })
      },
    })

  },
  sjbk: function () {
    var that = this
    var city = wx.getStorageSync('city')
    console.log('城市为' + city)
    console.log('page数量为' + that.data.page)
    var page = that.data.page
    var business = that.data.store1
    // ----------------------------------获取商家列表----------------------------------
    app.util.request({
      'url': 'entry/wxapp/StoreList',
      'cachetime': '0',
      data: { type: 1, lat: wx.getStorageSync('Location').latitude, lng: wx.getStorageSync('Location').longitude, page: page, cityname: city },
      success: function (res) {
        console.log(res)
        for (let x in res.data){
          res.data[x].distance = (parseFloat(res.data[x].juli) / 1000).toFixed(2)
          res.data[x].ad = res.data[x].ad.split(",")
        }
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1,
            issljz: true,
          })
          business = business.concat(res.data)
        }
        that.setData({
          store1: business
        })
      },
    })
  },
  // -----------------------------------帖子信息--------------------------------
  seller: function (e) {
    var that = this
    var index_class = that.data.index_class
    var city = wx.getStorageSync('city')
    var isfj = that.data.activeIndex=='1' ? '1' : '2'
    var page = that.data.page
    var seller = that.data.seller
    console.log(city, page, isfj)
    function getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
    }
    app.util.request({
      'url': 'entry/wxapp/list2',
      'cachetime': '0',
      data: { page: that.data.page, cityname: city, fj_tz: isfj, lat: wx.getStorageSync('Location').latitude, lng: wx.getStorageSync('Location').longitude, },
      success: function (res) {
        console.log(res.data)
        if (res.data.length ==0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1,
            issljz: true,
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
        } else {
          that.setData({
            seller: seller
          })
        }
      },
    })
  },
  hybk: function () {
    var that = this
    var index_class = that.data.index_class
    var city = wx.getStorageSync('city')
    var index = wx.getStorageSync('index')
    var page = that.data.page
    var yellow_list = that.data.yellow_list
    console.log(city)
    function getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
    }
    // 商家行业分类
    app.util.request({
      'url': 'entry/wxapp/YellowPageList',
      'cachetime': '0',
      data: { type: 1, lat: wx.getStorageSync('Location').latitude, lng: wx.getStorageSync('Location').longitude,page: page, cityname: city },
      success: function (res) {
        console.log(res)
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1,
            issljz: true,
          })
          yellow_list = yellow_list.concat(res.data)
        }
        if (res.data.length > 0) {
          for (let x in res.data) res.data[x].distance = (parseFloat(res.data[x].juli) / 1000).toFixed(2)
          that.setData({
            yellow_list: yellow_list,
          })
        } else {
          that.setData({
            yellow_list: yellow_list
          })
        }
      }
    })
  },
  sfcbk: function () {
    var that = this
    var index_class = that.data.index_class
    var city = wx.getStorageSync('city')
    var index = wx.getStorageSync('index')
    var page = that.data.page
    var pc = that.data.pc
    console.log(city)
    // 商家行业分类
    app.util.request({
      'url': 'entry/wxapp/CarList',
      'cachetime': '0',
      data: { page: page, cityname: city },
      success: function (res) {
        console.log(res)
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1,
            issljz: true,
          })
          pc = pc.concat(res.data)
        }
        if (res.data.length > 0) {
          for (let i in res.data) {
            res.data[i].tz.time = app.ormatDate(res.data[i].tz.time).slice(5, 16)
            res.data[i].tz.start_time1 = res.data[i].tz.start_time.slice(5, 10)
            res.data[i].tz.start_time2 = res.data[i].tz.start_time.slice(10, 17)
            if (res.data[i].tz.is_open == 2) {
              res.data[i].tz.class2 = 'car3'
              res.data[i].tz.class3 = 'car4'
              res.data[i].tz.class4 = 'car5'
            } else {
              res.data[i].tz.class2 = ''
              res.data[i].tz.class3 = ''
              res.data[i].tz.class4 = ''
            }
            if (res.data[i].tz.typename == '人找车') {
              res.data[i].tz.class = 'color1'
              res.data[i].tz.class1 = 'car1'
            } else if (res.data[i].tz.typename == '车找人') {
              res.data[i].tz.class = 'color2'
              res.data[i].tz.class1 = 'car2'
            } else if (res.data[i].tz.typename == '货找车') {
              res.data[i].tz.class = 'color1'
              res.data[i].tz.class1 = 'car1'
            } else if (res.data[i].tz.typename == '车找货') {
              res.data[i].tz.class = 'color2'
              res.data[i].tz.class1 = 'car2'
            }
          }
          that.setData({
            pc: pc
          })
        } else {
          that.setData({
            pc: pc
          })
        }
      }
    })
  },
  hdbmbk: function (typeid) {
    var that = this
    var nowtime = Data.formatTime(new Date)
    var date = Data.formatTime(new Date).replace(/\//g, "-").toString();
    console.log(nowtime, date)
    var city = wx.getStorageSync('city'), page = that.data.page, hdlist = that.data.hdlist;
    console.log(city)
    app.util.request({
      'url': 'entry/wxapp/Activity',
      'cachetime': '0',
      data: { type_id: '', page: page, pagesize: 10, cityname: city },
      success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1,
            issljz: true,
          })
        }
        hdlist = hdlist.concat(res.data)
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        hdlist = unrepeat(hdlist)
        console.log(hdlist)
        for (let i = 0; i < hdlist.length; i++) {
          if (hdlist[i].end_time > date) {
            hdlist[i].isgq = 2
          }
          else {
            hdlist[i].isgq = 1
          }
        }
        that.setData({
          hdlist: hdlist
        })
      },
    })
  },
  zxbk: function () {
    var that = this
    var time = Data.formatTime(new Date)
    var city = wx.getStorageSync('city'), zxlist = that.data.zxlist;
    app.util.request({
      'url': 'entry/wxapp/ZxList',
      data: { page: that.data.page, cityname: city },
      success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: that.data.page + 1,
            issljz: true,
          })
        }
        for (let i in res.data) {
          res.data[i].time = res.data[i].time.slice(0, 16)
          if (res.data[i].img == null) {
            res.data[i].type = 1
          } else {
            res.data[i].type = 2
          }
          var dt1 = time;
          var dt2 = res.data[i].time.replace(/-/g, "/")
          var regTime = /(\d{4})-(\d{1,2})-(\d{1,2})( \d{1,2}:\d{1,2})/g;
          var interval = Math.abs(Date.parse(dt1.replace(regTime, "$2-$3-$1$4")) - Date.parse(dt2.replace(regTime, "$2-$3-$1$4"))) / 1000;
          var h = Math.floor(interval / 3600);
          var m = Math.floor(interval % 3600 / 60);
          res.data[i].m = h
          res.data[i].h = m
          console.log(h + " 小时 " + m + " 分钟");
          res.data[i].imgs = res.data[i].imgs.split(",").slice(0, 3)
        }
        zxlist = zxlist.concat(res.data)
        that.setData({
          zxlist: zxlist
        })
      },
    })
  },
  bkswiperChange(e) {
    let that = this;
    console.log("===== swiperChange " + e.detail.current);
    that.setData({
      refresh_top: false,
      activeIndex: e.detail.current,
    })
    var bkname = that.data.bkarr[e.detail.current]
    console.log(bkname)
    if (bkname == '最新信息') {
      that.seller()
    }
    if (bkname == '热门商家') {
      that.sjbk()
    }
    if (bkname == '黄页114') {
      that.hybk()
    }
    if (bkname == '顺风车') {
      that.sfcbk()
    }
  },
  commend: function (e) {
    var that = this
    var activeIndex = e.currentTarget.dataset.index
    function getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
    }
    var index = e.currentTarget.id
    var bkname = e.currentTarget.dataset.name
    wx.setStorageSync("index", index)
    console.log(bkname)
    that.setData({
      index_class: true,
      activeIndex: e.currentTarget.dataset.index,
      toView: 'a' + (e.currentTarget.dataset.index - 1),
      bkname: bkname,
      refresh_top: false,
      swipecurrent: e.currentTarget.id,
      seller: [], store1: [], yellow_list: [], pc: [], hdlist: [], zxlist:[],
      page: 1,
      issljz:false,
    })
    if (bkname == '1') {
      that.seller()
    }
    else if (bkname == '2') {
      that.sjbk()
    }
    else if (bkname == '3') {
      that.hybk()
    }
    else if (bkname == '4') {
      that.sfcbk()
    }
    else if (bkname == '5') {
      that.hdbmbk()
    }
    else if (bkname == '6') {
      that.zxbk()
    }
  },
  // 选择全部
  whole: function (e) {
    wx.removeStorage({
      key: 'index',
      success: function (res) {
      }
    })
    this.setData({
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
  yellow_page: function (e) {
    wx.reLaunch({
      url: '../yellow_page/yellow',
    })
  },
  post1: function (e) {
    wx.reLaunch({
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
    console.log(e)
    wx.reLaunch({
      url: '../store/store',
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
  // 跳转详情
  carinfo: function (e) {
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../shun/shuninfo2/shuninfo2?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  yellow_info: function (e) {
    var id = e.currentTarget.dataset.id
    var user_id = e.currentTarget.dataset.user_id
    console.log(user_id)
    wx: wx.navigateTo({
      url: '../yellow_page/yellowinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // -----------------------------------跳转商家详情界面-------------------------------
  store: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../sellerinfo/sellerinfo?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  message: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '../message/message_info?id=' + id,
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
  hddb: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      first: 1
    })
    wx.removeStorageSync('city_type')
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
    // wx.removeStorageSync('city_type')
    var that = this
    this.setData({
      page: 1,
      seller: [], store1: [], yellow_list: [], pc: [], hdlist: [], zxlist:[],
      activeIndex: 0,
      swipecurrent: 0,
      refresh_top: false,
    })
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        wx.setStorageSync('color', res.data.color)
        if (Number(res.data.total_num) > 10000) {
          res.data.total_num = (Number(res.data.total_num) / 10000).toFixed(2) + '万'
        }
        that.setData({
          System: res.data,
        })
      },
    })
    that.reload()
    wx: wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this, bkname = this.data.bkname;
    if (this.data.refresh_top == false && this.data.issljz) {
      console.log('上拉触底',bkname)
      if (bkname == '1') {
        that.seller()
      }
      else if (bkname == '2') {
        that.sjbk()
      }
      else if (bkname == '3') {
        that.hybk()
      }
      else if (bkname == '4') {
        that.sfcbk()
      }
      else if (bkname == '5') {
        that.hdbmbk()
      }
      else if (bkname == '6') {
        that.zxbk()
      }
    } else {
      console.log('dobutno')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var titlename = this.data.System.zf_title;
    if (titlename == '') {
      titlename = this.data.System.pt_name
    }
    console.log(titlename)
    return {
      title: titlename,
      path: '/zh_tcwq/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})