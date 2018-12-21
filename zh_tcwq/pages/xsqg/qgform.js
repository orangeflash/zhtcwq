// zh_dianc/pages/takeout/takeoutform.js
var app = getApp();
var util = require('../../utils/util.js');
// var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
// var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share_modal_active: false,
    activeradio: '',
    hbshare_modal_active: false,
    hbactiveradio: '',
    isloading: true,
    navbar: [],
    fwxy: true,
    xymc: '到店自取服务协议',
    xynr: '',
    selectedindex: 0,
    color: '#019fff',
    checked: true,
    cart_list: [],
    wmindex: 0,
    wmtimearray: ['尽快送达'],
    cjindex: 0,
    cjarray: ['1份', '2份', '3份', '4份', '5份', '6份', '7份', '8份', '9份', '10份', '10份以上'],
    mdoaltoggle: true,
    total: 0,
    showModal: false,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
    yhqkdje: 0,
    hbkdje: 0,
    note: '',
  },
  bindinput: function (e) {
    console.log(e.detail.value)
    var that = this;
    this.setData({
      note: e.detail.value,
    })
  },
  openxy: function() {
    this.setData({
      fwxy: false,
    })
  },
  queren: function() {
    this.setData({
      fwxy: true,
    })
  },
  checkboxChange: function(e) {
    var that = this;
    this.setData({
      checked: !that.data.checked,
    })
  },
  ckwz: function(e) {
    console.log(e.currentTarget.dataset.jwd)
    var jwd = e.currentTarget.dataset.jwd.split(',')
    console.log(jwd)
    var that = this
    wx.openLocation({
      latitude: Number(jwd[0]),
      longitude: Number(jwd[1]),
      name: that.data.store.name,
      address: that.data.store.address
    })
  },
  radioChange1: function(e) {
    console.log('radio1发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'wxzf') {
      this.setData({
        zffs: 1,
        zfwz: '微信支付',
        btntype: 'btn_ok1',
      })
    }
    if (e.detail.value == 'yezf') {
      this.setData({
        zffs: 2,
        zfwz: '余额支付',
        btntype: 'btn_ok2',
      })
    }
    if (e.detail.value == 'jfzf') {
      this.setData({
        zffs: 3,
        zfwz: '积分支付',
        btntype: 'btn_ok3',
      })
    }
    if (e.detail.value == 'hdfk') {
      this.setData({
        zffs: 4,
        zfwz: '货到付款',
        btntype: 'btn_ok4',
      })
    }
  },
  KeyName: function(t) {
    this.setData({
      name: t.detail.value
    })
  },
  KeyMobile: function(t) {
    this.setData({
      mobile: t.detail.value
    })
  },
  tjddformSubmit: function(e) {
    console.log(e)
    var user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: user_id,
        form_id: e.detail.formId
      },
      success: function(res) {
        console.log(res.data)
      },
    })
    var username = this.data.name,
      tel = this.data.mobile;
    console.log(username, tel)
    if (username == '' || tel == '' || username == null || tel == null) {
      wx.showModal({
        title: '提示',
        content: '请填写联系人和联系电话！',
      })
      return false
    }
    this.setData({
      showModal: true,
    })
  },
  yczz: function() {
    this.setData({
      showModal: false,
    })
  },
  mdoalclose: function() {
    this.setData({
      mdoaltoggle: true,
    })
  },
  bindDateChange: function(e) {
    console.log('date 发生 change 事件，携带值为', e.detail.value, this.data.datestart)
    this.setData({
      date: e.detail.value
    })
    if (e.detail.value == this.data.datestart) {
      console.log('日期没有修改')
      this.setData({
        timestart: util.formatTime(new Date).substring(11, 16)
      })
    } else {
      console.log('修改了日期')
      this.setData({
        timestart: "00:01"
      })
    }
  },
  bindTimeChange: function(e) {
    console.log('time 发生 change 事件，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  radioChange: function(e) {
    this.setData({
      radioChange: e.detail.value,
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    console.log(options)
    var nowtime = util.formatTime(new Date)
    var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    var time = util.formatTime(new Date).substring(11, 16);
    console.log(nowtime, date.toString(), time.toString())
    var now = new Date();
    var time1 = now.getTime();
    var timelimit = (24 - new Date(time1).getHours()) * 2
    console.log(timelimit, new Date(time1), new Date(time1).getHours(), new Date(time1).getMinutes())
    var wmtimearray = ['尽快送达'];
    for (let i = 1; i < timelimit; i++) {
      var time1 = now.getTime() + 1000 * 60 * 30 * i,
        getMinutes = new Date(time1).getMinutes();
      if (getMinutes < 10) {
        getMinutes = '0' + getMinutes
      }
      var str = new Date(time1).getHours() + ':' + getMinutes
      wmtimearray.push(str)
    }
    console.log(wmtimearray)
    this.setData({
      datestart: date,
      timestart: time,
      date: date,
      time: time,
      wmtimearray: wmtimearray,
    })
    var that = this,
      storeid = options.storeid,
      goodid = options.goodid,
      user_id = wx.getStorageSync('users').id;
    //
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data,
        })
      },
    })  
    // UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
        var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
        console.log(res, date.toString())
        if (res.data.dq_time != '' && res.data.dq_time >= date.toString()) {
          res.data.ishy = 1
        }
        that.setData({
          userInfo: res.data,
          mobile: res.data.user_tel ? res.data.user_tel : '',
          name: res.data.user_name ? res.data.user_name : ''
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/QgGoodInfo',
      'cachetime': '0',
      data: {
        id: goodid
      },
      success: function(res) {
        console.log(res)
        res.data.yh = (Number(res.data.price) - Number(res.data.money)).toFixed(1)
        that.setData({
          QgGoodInfo: res.data,
          isloading: false,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: {
        id: storeid,
      },
      success: function(res) {
        console.log(res.data)
        var StoreInfo = res.data.store[0];
        var loc = res.data.store[0].coordinates.split(',')
        var sjstart = {
          lng: Number(loc[1]),
          lat: Number(loc[0])
        }
        console.log(sjstart)
        // if (StoreInfo.storeset.is_ps == '1' && StoreInfo.storeset.is_zt == '1') {
        //   that.setData({
        //     navbar: [StoreInfo.storeset.wmps_name, '到店自取'],
        //   })
        // }
        // if (StoreInfo.storeset.is_zt == '2') {
        //   that.setData({
        //     navbar: [StoreInfo.storeset.wmps_name],
        //   })
        // }
        // if (StoreInfo.storeset.is_ps == '2') {
        //   that.setData({
        //     navbar: ['到店自取'],
        //   })
        // }
        // if (StoreInfo.storeset.is_hdfk == '1' || StoreInfo.storeset.is_hdfk == '3') {
        //   that.setData({
        //     hdfk: true,
        //   })
        // }
        // if (getApp().xtxx.is_yuepay == '1' && StoreInfo.storeset.is_yuepay == '1') {
        //   that.setData({
        //     kqyue: true,
        //   })
        // }
        that.setData({
          store: StoreInfo,
        })
      },
    })
  },
  formSubmit: function(e) {
    var that=this, user_id = this.data.userInfo.id,
      openid = this.data.userInfo.openid,
      user_name = this.data.name,
      user_tel = this.data.mobile,
      store_id = this.data.store.id,
      money = this.data.QgGoodInfo.money,
      good_id = this.data.QgGoodInfo.id,
      good_logo = this.data.QgGoodInfo.logo,
      good_name = this.data.QgGoodInfo.name,
      note = this.data.note;
    console.log(user_id, openid, user_name, user_tel, store_id, money, good_id, good_logo, good_name,note)
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: user_id,
        form_id: e.detail.formId
      },
      success: function(res) {
        console.log(res.data)
      },
    })
    if (e.detail.value.radiogroup == 'yezf') {
      var ye = Number(this.data.userInfo.wallet),
        total = Number(money);
      console.log(ye, total)
      if (ye < total) {
        wx.showToast({
          title: '余额不足支付',
          icon: 'loading',
        })
        return
      }
    }
    // var dyjf = 0;
    // if (e.detail.value.radiogroup == 'jfzf') {
    //   var jf = Number(this.data.integral) / Number(this.data.jf_proportion), sfmoney = Number(this.data.totalprice);
    //   dyjf = (sfmoney * Number(this.data.jf_proportion)).toFixed(2);
    //   console.log(jf, sfmoney, dyjf)
    //   if (jf < sfmoney) {
    //     wx.showToast({
    //       title: '积分不足支付',
    //       icon: 'loading',
    //     })
    //     return
    //   }
    // }
    if (e.detail.value.radiogroup == 'yezf') {
      var pay_type = 2;
    }
    if (e.detail.value.radiogroup == 'wxzf') {
      var pay_type = 1;
    }
    if (e.detail.value.radiogroup == 'jfzf') {
      var pay_type = 3;
    }
    if (e.detail.value.radiogroup == 'hdfk') {
      var pay_type = 4;
    }
    console.log('支付方式', pay_type)
    this.setData({
      zfz: true,
    })
    //下单
    app.util.request({
      'url': 'entry/wxapp/QgOrder',
      'cachetime': '0',
      data: {
        user_id: user_id,
        user_name: user_name,
        user_tel: user_tel,
        store_id: store_id,
        money: money,
        good_id: good_id,
        pay_type: pay_type,
        good_logo: good_logo,
        good_name: good_name,
        note: note,
      },
      success: function(res) {
        console.log(res)
        var order_id = res.data;
        that.setData({
          zfz: false,
          showModal: false,
        })
        if (e.detail.value.radiogroup == 'yezf') {
          console.log('余额流程')
          if (order_id != '下单失败') {
            that.setData({
              mdoaltoggle: false,
            })
            setTimeout(function() {
              wx.redirectTo({
                url: 'order',
              })
            }, 1000)
          } else {
            wx.showToast({
              title: '支付失败',
              icon: 'loading',
            })
          }
        }
        if (e.detail.value.radiogroup == 'wxzf') {
          console.log('微信支付流程')
          if (money == 0) {
            wx.showModal({
              title: '提示',
              content: '0元买单请选择其他方式支付',
            })
            that.setData({
              zfz: false,
            })
          } else {
            // 下单
            if (order_id != '下单失败') {
              app.util.request({
                'url': 'entry/wxapp/QgPay',
                'cachetime': '0',
                data: {
                  openid: openid,
                  money: money,
                  order_id: order_id
                },
                success: function(res) {
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function(res) {
                      console.log(res.data)
                      console.log(res)
                      console.log(form_id)
                    },
                    'complete': function(res) {
                      console.log(res);
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '取消支付',
                          icon: 'loading',
                          duration: 1000
                        })
                      }
                      if (res.errMsg == 'requestPayment:ok') {
                        that.setData({
                          mdoaltoggle: false,
                        })
                        setTimeout(function() {
                          wx.redirectTo({
                            url: 'order',
                          })
                        }, 1000)
                      }
                    }
                  })
                },
              })
            }
          }
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})