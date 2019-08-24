// pages/sellerinfo/sellerinfo.js
var app = getApp()
var screenWidth = 0
var screenHeight = 0
var screenWidth1 = 0
var screenHeight1 = 0
var screenWidth2 = 0
var screenHeight2 = 0
var interval
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    activeIndex2: 0,
    sliderOffset: 0,
    sliderLeft: 15,
    comments: false,
    wechat: false,
    share: false,
    tabs2: ["商家详情"],
    tabs3: [],
    star: [
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
    star1: [
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
    index: 0,
    swiperCurrent: 0,
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20, // 时间间隔,
    hydl: false,
    inputShowed: false,
    inputVal: ""
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      ssjgarr: [],
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  search: function (e) {
    var value = this.data.inputVal, that = this;
    console.log(value)
    that.setData({
      ssjgarr: [],
    })
    if (value != '') {
      app.util.request({
        'url': 'entry/wxapp/GoodList',
        'cachetime': '0',
        data: { keywords: value, store_id: that.data.id },
        success: function (res) {
          console.log(res)
          that.setData({
            ssjgarr: res.data,
          })
          if (res.data.length == 0) {
            wx.showToast({
              title: '无此商品',
              icon: 'loading'
            })
          }
        }
      })
    }
    else {
      wx.showToast({
        title: '请输入内容',
        icon: 'loading'
      })
    }
  },
  updateUserInfo: function (res) {
    console.log(res)
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        hydl: false,
      })
      this.getuserinfo();
    }
  },
  getuserinfo: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code
        wx.setStorageSync("code", code)
        console.log(res)
        wx.getSetting({
          success: function (res) {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  // ----------------------------------异步保存用户登录信息----------------------------------
                  wx.setStorageSync("user_info", res.userInfo)
                  // ----------------------------------用户登录的名字----------------------------------
                  var nickName = res.userInfo.nickName
                  // ----------------------------------用户登录的头像----------------------------------
                  var avatarUrl = res.userInfo.avatarUrl
                  that.setData({
                    user_name: nickName
                  })
                  console.log('用户名字')
                  console.log(res.userInfo.nickName)
                  console.log('用户头像')
                  console.log(res.userInfo.avatarUrl)
                  app.util.request({
                    'url': 'entry/wxapp/openid',
                    'cachetime': '0',
                    data: { code: code },
                    success: function (res) {
                      // 异步保存session-key
                      wx.setStorageSync("key", res.data.session_key)
                      //  -------------------------需要上传给后台的值 包括名字和头像----------------------------------
                      var img = avatarUrl
                      var name = nickName
                      // 异步7保存用户openid
                      wx.setStorageSync("openid", res.data.openid)
                      var openid = res.data.openid
                      console.log('这是用户的openid')
                      console.log(openid)
                      //---------------------------------- 获取用户登录信息----------------------------------
                      app.util.request({
                        'url': 'entry/wxapp/Login',
                        'cachetime': '0',
                        data: { openid: openid, img: img, name: name },
                        success: function (res) {
                          console.log('这是用户的登录信息')
                          console.log(res)
                          // ----------------------------------异步保存用户信息----------------------------------
                          wx.setStorageSync('users', res.data)
                          wx.setStorageSync('uniacid', res.data.uniacid)
                          that.setData({
                            user_id: res.data.id,
                            user_info: res.data
                          })
                          that.reload()
                        },
                      })
                    },
                  })
                }
              })
            }
            else {
              console.log('未授权过')
              that.setData({
                hydl: true,
              })
            }
          }
        })
      }
    })
  },
  // ---------------------展示老板微信
  comments1: function (e) {
    if (this.data.wechat == false) {
      this.setData({
        wechat: true
      })
    } else {
      this.setData({
        wechat: false
      })
    }

  },
  // ---------------------分享---------------
  comments2: function (e) {
    var that = this

    if (this.data.share == false) {
      this.setData({
        share: true
      })
    } else {
      this.setData({
        share: false
      })
    }
  },
  more: function (e) {
    var store_id = this.data.id
    wx: wx.navigateTo({
      url: 'shop?store_id=' + store_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goods_info: function (e) {
    var store_id = this.data.id
    var id = e.currentTarget.id
    wx: wx.navigateTo({
      url: 'good_info?id=' + id + '&store_id=' + store_id+ '&logo=' + this.data.logo,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // --------------------------------------------图片预览
  previewImage: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var weixin_logo = that.data.store.weixin_logo
    urls.push(url + that.data.store.weixin_logo)
    wx.previewImage({
      current: url + weixin_logo,
      urls: urls
    })
  },
  previewImage3: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var weixin_logo = that.data.store.ewm_logo
    urls.push(url + that.data.store.ewm_logo)
    wx.previewImage({
      current: url + weixin_logo,
      urls: urls
    })
  },
  previewImage2: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    urls.push(that.data.bath)
    wx.previewImage({
      urls: urls
    })
  },
  // --------------------------------------------图片预览
  previewImage1: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var inde = e.currentTarget.id
    var pictures = that.data.store.images
    for (let i in pictures) {
      urls.push(url + pictures[i]);
    }
    wx.previewImage({
      current: url + pictures[inde],
      urls: urls
    })

  },
  // 商家详情和评论切换时间
  tabClick2: function (e) {
    this.setData({
      sliderOffset2: e.currentTarget.offsetLeft,
      activeIndex2: e.currentTarget.id,
      tabname: e.currentTarget.dataset.tabname,
    });
  },
  // 商家详情和评论切换时间
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  Demonstration: function (e) {
    if (this.data.store.vr_link != '') {
      wx: wx.navigateTo({
        url: '../car/car?sjid=' + this.data.id,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  // 轮播部分
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        let sys = res.data, tabs = [], tabs2 = that.data.tabs2;
        console.log(res, sys.is_coupon != '1' || sys.is_yhqqx != '1')
        if (sys.is_coupon == '1' && sys.is_yhqqx == '1') {
          tabs.push('优惠券')
        }
        if (sys.is_xsqg == '1' && sys.is_qgqx == '1') {
          tabs.push('限时抢购')
        }
        if (sys.g_qx == '1' && sys.g_open == '1') {
          tabs.push('拼团商品')
        }
        if(res.data.is_pl==1){
          tabs2.push('用户评论')
        }
        that.setData({
          system: res.data,
          tabs3: tabs,
          tabs2,
          tabname: tabs[0]
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
      }
    })
    var scene = decodeURIComponent(options.scene)
    app.getUrl(this)
    if (options.scene == null) {
      if (wx.getStorageSync('users')){
        var user_info = wx.getStorageSync('users')
        var user_id = wx.getStorageSync('users').id
      }
      else{
        this.getuserinfo();
      }
      var id = options.id
    } else {
      var id = scene
      this.getuserinfo();
    }
    app.util.request({
      'url': 'entry/wxapp/StoreCoupon',
      'cachetime': '0',
      data: { store_id: id },
      success: function (res) {
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].rate = parseInt((1 - Number(res.data[i].surplus) / Number(res.data[i].number)) * 100)
        }
        that.setData({
          coupons: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/QgGoods',
      'cachetime': '0',
      data: { type_id: '', store_id: id, page: 1, pagesize: 10, type: '' },
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].discount = (Number(res.data[i].money) / Number(res.data[i].price) * 10).toFixed(1)
          res.data[i].yqnum = (((Number(res.data[i].number) - Number(res.data[i].surplus)) / Number(res.data[i].number) * 100)).toFixed(1)
        }
        var storelist = [];
        storelist = storelist.concat(res.data);
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        storelist = unrepeat(storelist)
        that.setData({
          order_list: storelist,
        })
        console.log(storelist)
      }
    });
    //ptgood
    app.util.request({
      'url': 'entry/wxapp/GroupGoods',
      'cachetime': '0',
      data: {
        store_id: id,
        type_id: '',
        page: 1,
        display: ''
      },
      success: res => {
        console.log('商品列表', res)
        that.setData({
          group_list: res.data,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/StoreCode',
      'cachetime': '0',
      data: { store_id: id },
      success: res => {
        that.setData({
          bath: res.data
        })
        that.reload()
      }
    })
    that.setData({
      id: id,
      user_id: user_id,
      user_info: user_info
    })
    wx: wx.getSystemInfo({
      success: function (res) {
        var sys_width = res.windowWidth
        var sys_height = res.windowHeight
        that.setData({
          sys_width: sys_width,
          sys_height: sys_height
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  reload: function (e) {
    var that = this
    var star1 = that.data.star1
    var star3 = that.data.star
    // ----------------------------------获取商家详情列表----------------------------------
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: that.data.id },
      success: function (res) {
        console.log(res)
        res.data.star3 = star3
        res.data.store[0].img1 = res.data.store[0].ad.split(",")
        res.data.store[0].images = res.data.store[0].img.split(",")
        res.data.store[0].coordinates = res.data.store[0].coordinates.split(",")
        res.data.store[0].star = star1.slice(0, res.data.store[0].score)
        res.data.store[0].details = res.data.store[0].details.replace(/↵/g, "\n");

        for (let i in res.data.pl) {
          res.data.pl[i].score = parseInt(res.data.pl[i].score)
        }

        var score = Number(res.data.store[0].score)
        score = parseInt(score)
        var star2 = '../image/xing.png'
        if (score == 0) {
          res.data.star3 = that.data.star1
        } else if (score == 1) {
          res.data.star3[0].img = star2
        } else if (score == 2) {
          res.data.star3[0].img = star2
          res.data.star3[1].img = star2
        } else if (score == 3) {
          res.data.star3[0].img = star2
          res.data.star3[1].img = star2
          res.data.star3[2].img = star2
        } else if (score == 4) {
          res.data.star3[0].img = star2
          res.data.star3[1].img = star2
          res.data.star3[2].img = star2
          res.data.star3[3].img = star2
        } else if (score == 5) {
          res.data.star3[0].img = star2
          res.data.star3[1].img = star2
          res.data.star3[2].img = star2
          res.data.star3[3].img = star2
          res.data.star3[4].img = star2
        }
        that.setData({
          score: score,
          star3: res.data.star3
        })
        app.util.request({
          'url': 'entry/wxapp/IsCollection',
          'cachetime': '0',
          data: { store_id: that.data.id, user_id: that.data.user_id },
          success: function (res) {
            if (res.data == 1) {
              that.setData({
                Collection: true
              })
            } else {
              that.setData({
                Collection: false
              })
            }
          },
        })
        wx.setNavigationBarTitle({
          title: res.data.store[0].store_name
        })

        var stores = res.data.store[0]
        var url = that.data.url
        console.log(url)
        console.log(that.data.bath)
        // 商家的logo
        var logo = url + stores.logo
        // 二维码的图片
        if (stores.ewm_logo == '' || stores.ewm_logo == null){
          var logo1 = that.data.bath
        }else{
          var logo1 = url + stores.ewm_logo
        }
        console.log(logo)
        console.log(logo1)
        wx.downloadFile({
          url: logo, //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res)
            that.setData({
              logo: res.tempFilePath
            })
            wx.downloadFile({
              url: logo1, //仅为示例，并非真实的资源
              success: function (res) {
                console.log(res)
                that.setData({
                  logo1: res.tempFilePath
                })

                // that.canvas()
                that.ctx()
              }
            })
          }
        })
        that.setData({
          store: res.data.store[0],
          comment: res.data.pl
        })

        var length = res.data.store[0].details.length * that.data.size;

        var windowWidth = wx.getSystemInfoSync().windowWidth;
        console.log(length,windowWidth);
        that.setData({
          length: length,
          windowWidth: windowWidth
        });
        //that.scrolltxt();
      },
    })
    // -----------------------------------商品列表
    app.util.request({
      'url': 'entry/wxapp/StoreGoodList',
      'cachetime': '0',
      data: { store_id: that.data.id },
      success: function (res) {
        console.log(res)
        for (let i in res.data) {
          res.data[i].imgs = res.data[i].imgs.split(",")[0]
          res.data[i].lb_imgs = res.data[i].lb_imgs.split(",")
        }
        var store_good = []
        for(let i in res.data){
          if (res.data[i].is_show==1){
            store_good.push(res.data[i])
          }
        }
        var store_good = store_good.slice(0, 4)
        that.setData({
          store_good: store_good
        })
      },
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
  // ------------------------------------点击查看商家详细地址
  dizhi: function (e) {
    var that = this
    var lat2 = Number(that.data.store.coordinates[0])
    var lng2 = Number(that.data.store.coordinates[1])
    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.store.store_name,
      address: that.data.store.address
    })
  },
  // ------------------------------------点击回到首页
  shouye: function (e) {
    wx: wx.reLaunch({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ------------------------------------点击入驻商家
  fabu: function (e) {
    var that = this
    wx: wx.navigateTo({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // ------------------------------------点击拨打商家电话
  phone: function (e) {
    var that = this
    var tel = that.data.store.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  // ------------------------------------点击弹出商家回复
  reply: function (e) {
    var that = this
    var reflex_id = e.currentTarget.dataset.id
    that.setData({
      comments: true,
      relpay: true,
      reflex_id: reflex_id
    })
  },
  // ---------------------------------评论的星级--------------------------
  star: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var star = that.data.star
    var img = '../image/xing.png'
    var img1 = '../image/star_none.png'
    if (index == 0) {
      star[0].img = img
      star[1].img = img1
      star[2].img = img1
      star[3].img = img1
      star[4].img = img1
    } else if (index == 1) {
      star[0].img = img
      star[1].img = img
      star[2].img = img1
      star[3].img = img1
      star[4].img = img1
    } else if (index == 2) {
      star[0].img = img
      star[1].img = img
      star[2].img = img
      star[3].img = img1
      star[4].img = img1
    } else if (index == 3) {
      star[0].img = img
      star[1].img = img
      star[2].img = img
      star[3].img = img
      star[4].img = img1
    } else if (index == 4) {
      star[0].img = img
      star[1].img = img
      star[2].img = img
      star[3].img = img
      star[4].img = img
    }
    that.setData({
      index: index + 1,
      star: star
    })
  },
  // -----------------------------------------------收藏-----------------------------------------------
  Collection: function (e) {
    var that = this
    var store_id = that.data.id
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/Collection',
      'cachetime': '0',
      data: { store_id: store_id, user_id: user_id },
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            Collection: true
          })
          wx: wx.showToast({
            title: '收藏成功',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx: wx.showToast({
            title: '取消收藏成功',
            icon: 'fail',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          that.setData({
            Collection: false
          })
        }
      },
    })

  },
  // ---------------------------------获取输入框的内容--------------------------
  textarea: function (e) {
    var value = e.detail.value
    this.setData({
      value: value
    })
  },
  // ---------------------------------点击发表评论弹出评论框--------------------------
  comments: function (e) {
    var that = this
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        if (res.data.state == 1) {
          that.setData({
            comments: true,
            relpay: false
          })
        } else {
          wx: wx.showModal({
            title: '提示',
            content: '您的账号异常，请尽快联系管理员',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) {
              // wx: wx.navigateBack({
              //   delta: 1,
              // })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
    })

  },
  // ---------------------------------点击取消隐藏评论框--------------------------
  formid_three: function (e) {
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
    var that = this
    this.setData({
      comments: false
    })
  },
  settled: function (e) {
    wx.navigateTo({
      url: '../settled/settled',
    })
  },
  // ---------------------------------点击完成评论--------------------------
  formid_two: function (e) {
    console.log('点击完成评论')
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
    var that = this
    // 星级
    var index = that.data.index
    var value = that.data.value
    var store_id = that.data.id
    var user_id = wx.getStorageSync('users').id
    var reflex_id = that.data.reflex_id
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
      return currentdate;
    }
    var time = getNowFormatDate()
    function fun_submit(arg) {
      var date1 = new Date();
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() + 7);
      var times = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
      return times
    }
    if (value == null || value == '') {
      wx: wx.showModal({
        title: '提示',
        content: '请输入评论的内容',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      if (that.data.relpay == false) {
        if (index == 0) {
          wx: wx.showModal({
            title: '提示',
            content: '小主，给个评分吧',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          app.util.request({
            'url': 'entry/wxapp/StoreComments',
            'cachetime': '0',
            data: { store_id: store_id, user_id: user_id, details: value, score: index },
            success: function (res) {
              console.log('评论完成')
              console.log(res)
              that.setData({
                comments: false
              })
              wx: wx.showToast({
                title: '发表成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
              setTimeout(function () {
                that.reload()
              }, 2000)
              var pl_id = res.data
              // 搜索formid
              app.util.request({
                'url': 'entry/wxapp/GetFormid',
                'cachetime': '0',
                data: { user_id: that.data.store.user_id },
                success: function (res) {
                  console.log('搜索form_id')
                  console.log(res)
                  var formid_array = []
                  for (let i in res.data) {
                    res.data[i].hours = res.data[i].time.slice(10, 19)
                    res.data[i].time = fun_submit(res.data[i].time, 7) + res.data[i].hours
                    if (time <= res.data[i].time) {
                      formid_array.push(res.data[i])
                    } else {
                      app.util.request({
                        'url': 'entry/wxapp/DelFormid',
                        'cachetime': '0',
                        data: {
                          user_id: res.data[i].id,
                          form_id: res.data[i].form_id
                        },
                        success: function (res) {
                          console.log('删除form_id')
                          console.log(res)
                        },
                      })
                    }
                  }
                  // 发送模板消息
                  app.util.request({
                    'url': 'entry/wxapp/StorehfMessage',
                    'cachetime': '0',
                    data: {
                      pl_id: pl_id,
                      form_id: formid_array[0].form_id,
                      user_id: formid_array[0].user_id,
                      openid: formid_array[0].openid
                    },
                    success: function (res) {
                      console.log('发送模板消息')
                      console.log(res)
                      app.util.request({
                        'url': 'entry/wxapp/DelFormid',
                        'cachetime': '0',
                        data: {
                          form_id: formid_array[0].form_id,
                          user_id: formid_array[0].user_id,
                        },
                        success: function (res) {
                          console.log('删除已经使用的模板消息')
                          console.log(res)
                        },
                      })
                    },
                  })
                },
              })
            },
          })
        }
      } else {
        app.util.request({
          'url': 'entry/wxapp/reply',
          'cachetime': '0',
          data: { id: reflex_id, reply: value },
          success: function (res) {
            if (res.data == 1) {
              that.setData({
                reply: false,
                comments: false
              })
              that.reload()
            }
          },
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // canvas: function (e) {
  //   var that = this
  //   var a = that.data
  //   var width = a.width//屏幕宽度
  //   var height = a.height//屏幕高度
  //   var leiWid = (width-150)/2
  //   // 声明画布
  //   var context = wx.createCanvasContext('firstCanvas')
  //   console.log(a.logo1)
  //   console.log(a.logo)
  //   context.drawImage(a.logo1, leiWid, 0, 150, 150)
  //   context.save()
  //   context.beginPath()
  //   context.arc(leiWid+75, 75, 35, 0, 2 * Math.PI)
  //   context.clip()
  //   context.drawImage(a.logo, leiWid+35, 35,75,75)
  //   context.restore()
  //   context.draw()
  //   setTimeout(function(e){
  //     wx.canvasToTempFilePath({
  //       x: 0,
  //       y: 0,
  //       width: 150,
  //       height: 150,
  //       canvasId: 'firstCanvas',
  //       success: function (res) {
  //         console.log(res.tempFilePath)
  //         that.setData({
  //           logo: res.tempFilePath
  //         })
  //       }
  //     })
  //   },500)
    
  // },
  ctx:function(e){
    var that = this
    var a = that.data
    var width = a.width//屏幕宽度
    var height = a.height//屏幕高度
    var leiWid = (width - 150) / 2
    // 声明画布
    var ctx = wx.createCanvasContext('ctx')
    ctx.drawImage(a.logo1, 0, 0, 150, 150)
    ctx.save()
    ctx.beginPath()
    ctx.arc( 75, 75, 35, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(a.logo, 35, 35, 75, 75)
    ctx.restore()
    ctx.draw()
    setTimeout(function (e) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 150,
        height: 150,
        canvasId: 'ctx',
        success: function (res) {
          console.log(res.tempFilePath)
          that.setData({
            logos: res.tempFilePath
          })
        }
      })
    }, 500)
  },
  // 查看大图
  previewImage_logo: function (e) {
    var that = this
    var urls = []
    urls.push(that.data.logos)
    wx.previewImage({
      current: that.data.logos,
      urls: urls
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length;
    var windowWidth = that.data.windowWidth;
       interval = setInterval(function () {
        console.log('interval')
        var maxscrollwidth = length + windowWidth;
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          that.setData({
            marqueeDistance: 0 
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
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
    clearInterval(interval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.reload()
    wx.stopPullDownRefresh()
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
    var that = this
    var user_id = wx.getStorageSync('users').id
    var name = that.data.store.store_name
    var store_id = that.data.store.id
    app.util.request({
      'url': 'entry/wxapp/StoreFxNum',
      'cachetime': '0',
      data: { store_id: store_id },
      success: function (res) {
        that.reload()
      },
    })
    return {
      title: name,
      path: '/zh_tcwq/pages/sellerinfo/sellerinfo?user_id=' + user_id + '&id=' + store_id + '&type=' + 1,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})