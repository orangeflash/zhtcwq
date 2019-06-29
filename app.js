//app.js
// var push = require('zh_tcwq/utils/pushsdk.js');
App({
  onLaunch: function () {
  },
  onShow: function () {
   
  },
  onHide: function () {
    console.log(getCurrentPages())
  },
  onError: function (msg) {
    console.log(msg)
  },
  getUrl: function (n) {
    var url = this.globalData.url;
    console.log(url, n)
    n.setData({
      url: url
    })
    var e = this;
    url || e.util.request({
      'url': 'entry/wxapp/Url',
      success: function (res) {
        console.log(res)
        wx.setStorageSync('url', res.data)
        e.globalData.url = res.data
        e.getUrl(n)
      }
    })
  },
  setNavigationBarColor: function (n) {
    var t = this.globalData.color;
    console.log(t, n)
    t && wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: t,
    }); n.setData({
      color: t
    })
    var e = this;
    t || e.util.request({
      'url': 'entry/wxapp/System',
      success: function (t) {
        console.log(t)
        getApp().xtxx = t.data
        e.globalData.color = t.data.color ||'ED414A'
        e.setNavigationBarColor(n)
        // 0 == t.code && (wx.setStorageSync("_navigation_bar_color", t.data), e.setNavigationBarColor())
      }
    })
  },
  getUser: function (cb) {
    var that = this
    // ----------------------------------获取用户登录信息----------------------------------
    wx.login({
      success: function (res) {
        var code = res.code
        wx.setStorageSync("code", code)
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            wx.setStorageSync("user_info", res.userInfo)
            var nickName = res.userInfo.nickName
            var avatarUrl = res.userInfo.avatarUrl
            that.util.request({
              'url': 'entry/wxapp/openid',
              'cachetime': '0',
              data: { code: code },
              success: function (res) {
                console.log(res)
                wx.setStorageSync("key", res.data.session_key)
                wx.setStorageSync("openid", res.data.openid)
                var openid = res.data.openid
                that.util.request({
                  'url': 'entry/wxapp/Login',
                  'cachetime': '0',
                  data: { openid: openid, img: avatarUrl, name: nickName },
                  success: function (res) {
                    console.log(res)
                    wx.setStorageSync('users', res.data)
                    wx.setStorageSync('uniacid', res.data.uniacid)
                    cb(res.data)
                  },
                })
              },
            })
          },
          fail: function (res) {
            wx.getSetting({
              success: (res) => {
                var authSetting = res.authSetting
                if (authSetting['scope.userInfo'] == false) {
                  wx.openSetting({
                    success: function success(res2) {
                      if (res2.authSetting["scope.userInfo"]) {
                        that.getUser(cb)
                      }
                      else {
                        that.getUser(cb)
                      }
                    }
                  });
                }
              }
            })
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this, userinfo = this.globalData.userInfo;
    console.log(userinfo)
    if (userinfo) {
      typeof cb == "function" && cb(userinfo)
    } else {
      wx.login({
        success: function (res) {
          wx.showLoading({
            title: "正在登录",
            mask: !0
          })
          console.log(res.code)
          that.util.request({
            'url': 'entry/wxapp/Openid',
            'cachetime': '0',
            data: { code: res.code },
            header: {
              'content-type': 'application/json'
            },
            dataType: 'json',
            success: function (res) {
              console.log('openid信息', res.data)
              getApp().getOpenId = res.data.openid;
              getApp().getSK = res.data.session_key;
              //存用户信息
              that.util.request({
                'url': 'entry/wxapp/login',
                'cachetime': '0',
                data: { openid: res.data.openid },
                header: {
                  'content-type': 'application/json'
                },
                dataType: 'json',
                success: function (res) {
                  console.log('用户信息', res)
                  getApp().getuniacid = res.data.uniacid;
                  wx.setStorageSync('users', res.data)
                  that.globalData.userInfo = res.data
                  typeof cb == "function" && cb(that.globalData.userInfo)
                },
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      });
    }
  },
  getLocation: function (cb) {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        typeof cb == "function" && cb(res)
      },
      fail: function () {
        wx.getSetting({
          success: (res) => {
            console.log(res)
            var authSetting = res.authSetting
            if (authSetting['scope.userLocation'] == false) {
              wx.showModal({
                title: '提示',
                content: '您暂未授权位置信息无法正常使用,请在（右上角 - 关于 - 右上角 - 设置）中开启位置信息授权后，下拉刷新即可正常使用',
              })
              // wx.showModal({
              //   title: '提示',
              //   content: '您拒绝了位置授权,无法正常使用功能，点击确定重新获取授权。',
              //   showCancel: false,
              //   success: function (res) {
              //     if (res.confirm) {
              //       console.log('用户点击确定')
              //       wx.openSetting({
              //         success: function success(res2) {
              //           if (res2.authSetting["scope.userLocation"]) {
              //             that.getLocation(cb)
              //           }
              //           else {
              //             that.getLocation(cb)
              //           }
              //         }
              //       });
              //     }
              //   }
              // })
            }
          }
        })
      },
      complete: function (res) {
      }
    })
  },
  pageOnLoad: function (e) {
    var that = this;
    console.log("----setPageNavbar----"), console.log(e);
    function a(t) {
      console.log(t)
      var a = !1,
        o = e.route || e.__route__ || null;
      for (var n in t.navs) t.navs[n].url === "/" + o ? (t.navs[n].active = !0, a = !0) : t.navs[n].active = !1;
      a && e.setData({
        _navbar: t
      })
    }
    var navdata = {
      background_image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==", border_color: "rgba(0,0,0,.1)"
    }
    var o = that.globalData.navbar;
    console.log(o)
    o && a(o);
    o || that.util.request({
      'url': 'entry/wxapp/GetBottom',
      success: function (t) {
        console.log(t)
        if (t.data.length == 0 || !t.data) {
          var arr = [{
            logo: '/zh_tcwq/pages/image/shouye-foucs.png', logo2: '/zh_tcwq/pages/image/shouye.png', title: '首页', title_color: '#f44444', title_color2: '#888', url: "/zh_tcwq/pages/index/index"
          }, {
            logo: '/zh_tcwq/pages/image/zixun1.png', logo2: '/zh_tcwq/pages/image/zixun.png', title: '分类信息', title_color: '#f44444', title_color2: '#888', url: "/zh_tcwq/pages/type/type"
          }, {
            logo: '/zh_tcwq/pages/image/fabu.png', logo2: '/zh_tcwq/pages/image/fabu.png', title: '发布', title_color: '#f44444', title_color2: '#888', url: "/zh_tcwq/pages/fabu/fabu/fabu"
          }, {
            logo: '/zh_tcwq/pages/image/dianpu-foucs.png', logo2: '/zh_tcwq/pages/image/dianpu.png', title: '商家', title_color: '#f44444', title_color2: '#888', url: "/zh_tcwq/pages/store/store"
          }, {
            logo: '/zh_tcwq/pages/image/wode-foucs.png', logo2: '/zh_tcwq/pages/image/wode.png', title: '我的', title_color: '#f44444', title_color2: '#888', url: "/zh_tcwq/pages/logs/logs"
          },]
          navdata.navs = arr
          a(navdata)
          that.globalData.navbar = navdata
        }
        else {
          navdata.navs = t.data
          a(navdata)
          that.globalData.navbar = navdata
          that.util.request({
            'url': 'entry/wxapp/Url',
            'cachetime': '0',
            success: function (res) {
              console.log(res.data)
              var url = res.data
              for (var i in t.data) t.data[i].logo = url + t.data[i].logo, t.data[i].logo2 = url + t.data[i].logo2
              navdata.navs = t.data
              a(navdata)
              that.globalData.navbar = navdata
            }
          });
        }
      }
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
  ab: function (e) {
    
  },
  util: require('we7/resource/js/util.js'),
  siteInfo: require('siteinfo.js'),
  tabBar: {
    "color": "#123",
    "selectedColor": "#1ba9ba",
    "borderStyle": "#1ba9ba",
    "backgroundColor": "#fff",
    "list": [
      {
        "pagePath": "/we7/pages/index/index",
        "iconPath": "/we7/resource/icon/home.png",
        "selectedIconPath": "/we7/resource/icon/homeselect.png",
        "text": "首页"
      },
      {
        "pagePath": "/we7/pages/user/index/index",
        "iconPath": "/we7/resource/icon/user.png",
        "selectedIconPath": "/we7/resource/icon/userselect.png",
        "text": "微擎我的"
      }
    ]
  },
  globalData: {
    userInfo: null,
  },
});