// zh_tcwq/pages/hdzx/hdzxinfo.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slide: [{ logo: '../image/background2.png' }, { logo: '../image/fximg.png' }],
    kpgg: true,
    qddh: false,
    hdinfo:{id:2,money:10},
    tjwz:'提交报名'
  },
  maketel: function (t) {
    var a = this.data.hdinfo.tel;
    wx.makePhoneCall({
      phoneNumber: a,
    })
  },
  location: function () {
    var jwd = this.data.hdinfo.coordinate.split(','), t = this.data.hdinfo.address;
    console.log(jwd)
    wx.openLocation({
      latitude: parseFloat(jwd[0]),
      longitude: parseFloat(jwd[1]),
      address: t,
      name: '位置'
    })
  },
  ycgg: function () {
    var that = this;
    that.setData({
      kpgg: true,
    })
  },
  wybm: function () {
    var that = this;
    that.setData({
      kpgg: false,
    })
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
        console.log('这是登录所需要的code')
        console.log(res.code)
        var code = res.code
        wx.setStorageSync("code", code)
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
                          app.util.request({
                            'url': 'entry/wxapp/IsSignUp',
                            'cachetime': '0',
                            data: { user_id: res.data.id, act_id: that.data.hdid },
                            success: function (res) {
                              console.log(res)
                              that.setData({
                                userisbm: res.data
                              })
                            },
                          })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var date = util.formatTime(new Date).replace(/\//g, "-").toString();
    console.log(date)
    var scene = decodeURIComponent(options.scene), hdid;
    console.log('scene', scene)
    if (scene != 'undefined') {
      hdid = scene
    }
    if (options.hdid != null) {
      console.log('跳转进来的id:', options.hdid)
      hdid = options.hdid
    }
    console.log(options, hdid)
    this.setData({
      hdid: hdid
    })
    this.getuserinfo()
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
        that.setData({
          system: res.data,
          color: res.data.color,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/ActivityInfo',
      'cachetime': '0',
      data: { id: hdid},
      success: function (res) {
        console.log(res)
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
        if (res.data.end_time>date){
          res.data.isgq=2
        }
        else{
          res.data.isgq =1
        }
        that.setData({
          hdinfo: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Llz',
      'cachetime': '0',
      data: { cityname: wx.getStorageSync('city'), type: 6 },
      success: function (res) {
        console.log(res)
        that.setData({
          unitid: res.data,
        })
      },
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var user_id = wx.getStorageSync('users').id, openid = wx.getStorageSync("openid"), form_id = e.detail.formId
    var hdid = that.data.hdinfo.id, money=this.data.hdinfo.money;
    var lxr = e.detail.value.lxr, tel = e.detail.value.tel;
    console.log(user_id, hdid, money, lxr, tel)
    var warn = "";
    var flag = true;
    if (lxr == "") {
      warn = "请填写联系人！";
    } else if (tel == ""||tel.length<11) {
      warn = "请填写正确联系电话！";
    } else {
      flag = false;//若必要信息都填写，则不用弹框
      that.setData({
        qddh: true,
        tjwz: '提交中'
      })
      // return
      app.util.request({
        'url': 'entry/wxapp/SignUp',
        'cachetime': '0',
        data: { user_id: user_id, act_id: hdid, money: money, form_id: form_id, user_name: lxr, user_tel: tel },
        success: function (res) {
          console.log(res)
          if (res.data != '人数已满' && res.data != '报名失败') {
            if (money > 0) {
              app.util.request({
                'url': 'entry/wxapp/Pay3',
                'cachetime': '0',
                data: { openid: openid, money: money, order_id: res.data },
                success: function (res) {
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function (res) {
                      console.log('这里是支付成功')
                    },
                    'complete': function (res) {
                      console.log(res);
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '取消支付',
                          icon: 'loading',
                          duration: 1000
                        })
                        that.setData({
                          qddh: false,
                          tjwz: '提交报名'
                        })
                      }
                      if (res.errMsg == 'requestPayment:ok') {
                        wx.showToast({
                          title: '提交成功',
                        })
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '../wdbm/wdbm',
                          })
                        }, 1000)
                      }
                    }
                  })
                },
              })
            }
            else {
              wx.showToast({
                title: '提交成功',
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../wdbm/wdbm',
                })
              }, 1000)
            }
          }
          else {
            wx.showModal({
              title: '提示',
              content: res.data,
            })
            that.setData({
              qddh: false,
              tjwz: '提交报名'
            })
          }
        }
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
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
    var titlename = this.data.hdinfo.title,hdid=this.data.hdid;
    console.log(titlename,hdid)
    return {
      title: titlename,
      path: '/zh_tcwq/pages/hdzx/hdzxinfo?hdid='+hdid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})