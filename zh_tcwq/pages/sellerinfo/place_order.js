// zh_tcwq/pages/sellerinfo/place_order.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dnzt:false,
    hydl: false,
  },
  bindDateChange: function (e) {
    console.log('date 发生 change 事件，携带值为', e.detail.value, this.data.datestart)
    this.setData({
      date: e.detail.value
    })
    if (e.detail.value == this.data.datestart) {
      console.log('日期没有修改')
    }
    else {
      console.log('修改了日期')
    }
  },
  switch1Change: function (e) {
    var that = this, cost3 = Number(this.data.cost3),freight2=this.data.freight2;
    console.log('switch1 发生 change 事件，携带值为', e.detail.value,cost3,freight2)
    that.setData({
      dnzt: e.detail.value
    })
    if (e.detail.value) {
      that.setData({
        cost2: cost3-freight2,
        freight:0,
      })
    }
    else {
      that.setData({
        cost2: cost3,
        freight: freight2,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var nowtime = util.formatTime(new Date)
    var date = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    var time = util.formatTime(new Date).substring(11, 16);
    console.log(nowtime, date.toString(), time.toString())
    this.setData({
      datestart: date,
      timestart: time,
      date: date,
      time: time
    })
    var url = wx.getStorageSync('url')
    var cost = options.price * options.num
    that.setData({
      id: options.id,
      url: url,
      price: options.price,
      num: options.num,
      cost: cost.toFixed(2),
      name1: options.name1,
      name2: options.name2,
      name3: options.name3,
      store_id: options.store_id
    })
    console.log(options+'这是商家的id')
    that.getuserinfo()
    that.refresh()
  },

  refresh: function (e) {
    var that = this
    var id = that.data.id
    app.util.request({
      'url': 'entry/wxapp/GoodInfo',
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log(res)
        var spec = res.data.spec
        var jmap = {};
        var result = [];
        spec.forEach(function (al) {
          var key = al.spec_id + '_' + al.spec_name;
          if (typeof jmap[key] === 'undefined') {
            jmap[key] = [];
          }
          jmap[key].push(al);
        })

        var keys = Object.keys(jmap);
        for (var i = 0; i < keys.length; i++) {
          var rs = keys[i].split('_');
          result.push({ spec_id: rs[0], spec_name: rs[1], value: jmap[keys[i]] });
        }
        console.log(result)
        res.data.good.imgs = res.data.good.imgs.split(",")
        res.data.good.lb_imgs = res.data.good.lb_imgs.split(",")
        var cost = Number(that.data.cost)
        var freight = Number(res.data.good.freight), freight2 = Number(res.data.good.freight);
        var cost2 = cost + freight
        cost2 = cost2.toFixed(2)
        that.setData({
          store_good: res.data.good,
          cost2: cost2,
          freight: freight,
          freight2:freight2,
          result: result,
          cost3:cost2,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: that.data.store_id },
      success: function (res) {
        console.log(res)
        that.setData({
          store: res.data.store[0]
        })
      },
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
                          that.user_infos()
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
  user_infos: function (e) {
    var that = this
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          user_info: res.data,
          openid: res.data.openid,
        })
      },
    })
  },
  // 选择收货地址
  address: function (e) {
    var that = this
    var user_id = that.data.user_info.id
    console.log(user_id)
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        app.util.request({
          'url': 'entry/wxapp/UpdAdd',
          'cachetime': '0',
          data: {
            user_id: user_id,
            user_name: res.userName,
            user_tel: res.telNumber,
            user_address: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          },
          success: function (res) {
            console.log(res)
            that.user_infos()
          },
        })
      }
    })
  },
  // 添加商品数量
  add: function (e) {
    var that = this
    var num = that.data.num + 1
    var cost = that.data.cost1
    cost = cost * num.toFixed(2)
    var cost2 = cost + that.data.freight
    that.setData({
      num: num,
      cost: cost,
      cost2: cost2
    })
  },
  // 减去商品数量
  subtraction: function (e) {
    var that = this
    var num = that.data.num
    num = num - 1
    var cost = that.data.cost1
    cost = cost * num.toFixed(2)
    var cost2 = cost + that.data.freight
    that.setData({
      num: num,
      cost: cost,
      cost2: cost2
    })
  },
  note: function (e) {
    console.log(e)
    this.setData({
      note: e.detail.value
    })
  },
  // -------------------------提交订单-----------------------------
  order: function (e) {
    var that = this
    console.log(that.data)
    var store_good = that.data.store_good
    var user_id = that.data.user_info.id
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: { user_id: user_id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
    var user_info = that.data.user_info
    var openid = that.data.openid
    var freight = this.data.freight
    var goods_cost = Number(store_good.goods_cost)
    var money = that.data.cost2
    var note = that.data.note
    var result = that.data.result
    var iszt,zt_time=this.data.date;
    if (this.data.dnzt) {
      iszt = 1
    }
    else {
      iszt = 2
    }
    console.log('iszt', iszt,zt_time)
    if(result.length==1){
      var good_spec = result[0].spec_name+':'+that.data.name1
    }
    if (result.length == 2) {
      var good_spec = result[0].spec_name + ':' + that.data.name1 + ';' + result[1].spec_name + ':' + that.data.name2
    }
    if (result.length == 3) {
      var good_spec = result[0].spec_name + ':' + that.data.name1 + ';' + result[1].spec_name + ':' + that.data.name2 + ';' + result[2].spec_name + ':' + that.data.name3
    }
    console.log(result)
    console.log(String(good_spec))
    if (note == null) {
      note = ''
    } else {
      note = that.data.note
    }
    if (user_info.user_name == '' && !this.data.dnzt) {
      wx: wx.showModal({
        title: '提示',
        content: '您还没有填写收货地址喔',
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
      console.log(note)
      app.util.request({
        'url': 'entry/wxapp/addorder',
        'cachetime': '0',
        data: {
          user_id: user_id,
          store_id: store_good.store_id,
          money: money,
          user_name: user_info.user_name,
          address: user_info.user_address,
          tel: user_info.user_tel,
          good_id: store_good.id,
          good_name: store_good.goods_name,
          good_img: store_good.imgs[0],
          good_money: that.data.price,
          good_spec: String(good_spec),
          freight: freight,
          good_num: that.data.num,
          note: note,
          is_zt:iszt,
          zt_time: zt_time,
        },
        success: function (res) {
          console.log(res)
          var order_id = res.data
          console.log(money)
          app.util.request({
            'url': 'entry/wxapp/Pay',
            'cachetime': '0',
            data: { openid: openid, money: money, order_id: order_id },
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
                  console.log(res)
                  app.util.request({
                    'url': 'entry/wxapp/PayOrder',
                    'cachetime': '0',
                    data: { order_id: order_id },
                    success: function (res) {
                      console.log('改变订单状态')
                      console.log(res)
                      wx: wx.redirectTo({
                        url: '../logs/order',
                        success: function (res) { },
                        fail: function (res) { },
                        complete: function (res) { },
                      })
                    },
                  })
                  app.util.request({
                    'url': 'entry/wxapp/sms2',
                    'cachetime': '0',
                    data: { store_id: store_good.store_id, },
                    success: function (res) {
                      console.log(res)
                    },
                  })
                },

                'fail': function (res) {
                  console.log('这里是支付失败')
                  console.log(res)
                  wx.showToast({
                    title: '支付失败',
                    duration: 1000
                  })
                  wx: wx.redirectTo({
                    url: '../logs/order',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                },
              })
            },
          })
        },
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
    var that=this;
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          system: res.data,
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
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