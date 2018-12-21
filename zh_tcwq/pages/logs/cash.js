// zh_hdbm/pages/cash/cash.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    hidden2: true,
    hidden3: true,
    hidden4: false,
    hidden5: true,
    hidden6: false,
    button: false,
    cash_wei: false,
    cash_wei2: false,
    tx_money: 0,
    sxf: 0,
    sh_money: 0,
    fwxy: true,
  },
  lookck: function () {
    this.setData({
      fwxy: false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({

    })
    var that = this
    console.log(options)
    that.setData({
      state: options.state,
      system:wx.getStorageSync('System')
    })
    if (options.state == 2) {
      that.setData({
        store_id: options.store_id,
        profit: options.profit
      })
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    var user_id = wx.getStorageSync('users').id
    var state = that.data.state
    if (state == 1) {
      app.util.request({
        'url': 'entry/wxapp/GetUserInfo',
        'cachetime': '0',
        data: { user_id: user_id },
        success: function (res) {
          console.log(res)
          var user = res.data
          app.util.request({
            'url': 'entry/wxapp/MyTiXian',
            'cachetime': '0',
            data: {
              user_id: res.data.id
            },
            success: function (res) {
              console.log(res)
              var money = 0
              for (let i in res.data) {
                money += Number(res.data[i].tx_cost)
              }
              console.log(money)
              var price = Number(user.money)
              price = price.toFixed(2)
              console.log(price)
              that.setData({
                money: price
              })
            }
          })
        },
      })
    } else {
      var store_id = that.data.store_id
      that.setData({
        money: that.data.profit
      })
    }

    console.log(wx.getStorageSync('System'))

    var system = wx.getStorageSync('System')
    var tx_sxf = system.tx_sxf / 100
    var tx_sxf1 = system.tx_sxf
    var tx_price = system.tx_money
    that.setData({
      tx_price: tx_price,
      tx_sxf: tx_sxf,
      tx_sxf1: tx_sxf1,
      user_id: user_id
    })
    var avatarUrl = wx.getStorageSync('img')
    var url = wx.getStorageSync('url')
    var nickName = wx.getStorageSync('name')
    var openid = wx.getStorageSync('openid')
  },
  check: function (e) {
    var that = this;
    that.setData({
      hidden: false,
      hidden2: true,
      hidden3: true,
      hidden4: false,
      hidden5: true,
      hidden6: false,
      cash_wei: false,
      cash_wei2: false,
      cash_zhi: true,
      cash_zhi2: true,
      cash_ka: true,
      cash_ka2: true
    })
  },
  check2: function (e) {
    var that = this;
    that.setData({
      hidden: true,
      hidden2: false,
      hidden3: false,
      hidden4: true,
      hidden5: true,
      hidden6: false,
      cash_wei: true,
      cash_wei2: true,
      cash_ka: true,
      cash_ka2: true,
      cash_zhi2: false,
      cash_zhi: false
    })
  },
  check3: function (e) {
    var that = this;
    that.setData({
      hidden: true,
      hidden2: false,
      hidden3: true,
      hidden4: false,
      hidden5: false,
      hidden6: true,
      cash_wei: true,
      cash_wei2: true,
      cash_zhi: true,
      cash_zhi2: true,
      cash_ka: false,
      cash_ka2: false
    })
  },
  bindblur: function (e) {
    var that = this
    var tx_money = Number(e.detail.value)
    var money = Number(that.data.money)
    console.log(tx_money, money)
    if (tx_money > money) {
      wx.showModal({
        title: '提示',
        content: '您的提现金额超出可提现金额',
      })
      that.setData({
        button: false
      })
      tx_money = money
      return;
    }
    var tx_sxf = that.data.tx_sxf
    var sh_money = tx_money - tx_money * tx_sxf
    that.setData({
      tx_money: tx_money,
      sxf: Number(tx_money * tx_sxf).toFixed(2),
      sh_money: Number(sh_money).toFixed(2)
    })
    if (tx_money > 0) {
      that.setData({
        button: true
      })
    } else {
      that.setData({
        button: false
      })
    }
  },
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var form_id = e.detail.formId
    var store_id = that.data.store_id
    var method = that.data.state
    var user_id = that.data.user_id
    // 提现门槛
    var tx_price = Number(that.data.tx_price)
    // 实际到账金额
    var sh_money = that.data.sh_money
    // 提现所扣的手续费
    var sxf = that.data.sxf
    // 提现金额
    var tx_money = that.data.tx_money
    console.log(tx_money,tx_price)
    var openid = wx.getStorageSync("openid")
    if (tx_money < tx_price) {
      wx: wx.showModal({
        title: '提示',
        content: '不到提现门槛，再接再厉哦',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      if (that.data.hidden2 == true) {
        var tx_type = 2
        console.log('提现的方式为微信' + tx_type)
      } else if (that.data.hidden4 == true) {
        var tx_type = 1
        console.log('提现的方式为支付宝' + tx_type)
      } else if (that.data.hidden6 == true) {
        var tx_type = 3
        console.log('提现的方式为银联' + tx_type)
      }
      if (tx_type == 1) {
        // 支付宝
        var zfname = e.detail.value.zfname
        var zfkahao = e.detail.value.zfkahao
        var zfka = e.detail.value.zfka
        if (zfname == '' || zfname == null) {
          wx: wx.showToast({
            title: '姓名不能为空',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (zfkahao == '' || zfka == '') {
          wx: wx.showToast({
            title: '账号不能为空',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (zfka != zfkahao) {
          wx: wx.showToast({
            title: '输入不一致',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (zfka == zfkahao) {
          that.setData({
            button: false,
          })
          app.util.request({
            'url': 'entry/wxapp/TiXian',
            'cachetime': '0',
            'method': 'POST',
            data: {
              user_id: user_id,
              type: tx_type,
              tx_cost: tx_money,
              sj_cost: sh_money,
              name: zfname,
              username: zfka,
              method: method,
              store_id: store_id
            },
            success: function (res) {
              console.log(res)

              wx: wx.showToast({
                title: '提现成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
              app.util.request({
                'url': 'entry/wxapp/txmessage',
                'cachetime': '0',
                data: { form_id: form_id, openid: openid, txsh_id: res.data },
                success: function (res) {
                  console.log(res)
                },
              })
              var pages = getCurrentPages();
              console.log(pages)
              if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.refresh1()
              }
              setTimeout(function () {
                wx:wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
            }
          })
        }
      } else if (tx_type == 2) {
        // 微信
        var wxname = e.detail.value.wxname
        var wxkahao = e.detail.value.wxkahao
        var wxka = e.detail.value.wxka
        if (wxname == '' || wxname == null) {
          wx: wx.showToast({
            title: '姓名不能为空',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (wxkahao == '' || wxka == '') {
          wx: wx.showToast({
            title: '账号不能为空',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (wxka != wxkahao) {
          wx: wx.showToast({
            title: '输入不一致',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (wxkahao == wxka) {
          that.setData({
            button: false,
          })
          app.util.request({
            'url': 'entry/wxapp/TiXian',
            'cachetime': '0',
            'method': 'POST',
            data: {
              user_id: user_id,
              type: tx_type,
              tx_cost: tx_money,
              sj_cost: sh_money,
              name: wxname,
              username: wxka,
              method: method,
              store_id: store_id
            },
            success: function (res) {
              console.log(res)
              wx: wx.showToast({
                title: '提现成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
              app.util.request({
                'url': 'entry/wxapp/txmessage',
                'cachetime': '0',
                data: { form_id: form_id, openid: openid, txsh_id:res.data },
                success: function (res) {
                  console.log(res)
                },
              })
              var pages = getCurrentPages();
              console.log(pages)
              if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.refresh1()
              }
              setTimeout(function () {
                wx: wx.navigateBack({
                  delta: 1,
                })
              }, 1000)

            }
          })
        }
      } else if (tx_type == 3) {
        // 银联
        var ylname = e.detail.value.ylname
        var ylka = e.detail.value.ylka
        var ylkahao = e.detail.value.ylkahao, ylyhmc = e.detail.value.ylyhmc
        if (ylname == '' || ylname == null) {
          wx: wx.showToast({
            title: '姓名不能为空',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (ylka == '' || ylkahao == '') {
          wx: wx.showToast({
            title: '账号不能为空',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (ylka != ylkahao) {
          wx: wx.showToast({
            title: '输入不一致',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (ylyhmc==''){
            wx.showToast({
              title: '银行名称为空',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
        } else {
          that.setData({
            button: false,
          })
          app.util.request({
            'url': 'entry/wxapp/TiXian',
            'cachetime': '0',
            'method': 'POST',
            data: {
              user_id: user_id,
              type: tx_type,
              tx_cost: tx_money,
              sj_cost: sh_money,
              name: ylname,
              username: ylka,
              method: method,
              store_id: store_id,
              bank:ylyhmc,
            },
            success: function (res) {
              console.log(res)
              wx: wx.showToast({
                title: '提现成功',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
              app.util.request({
                'url': 'entry/wxapp/txmessage',
                'cachetime': '0',
                data: { form_id: form_id, openid: openid, txsh_id: res.data },
                success: function (res) {
                  console.log(res)
                },
              })
              var pages = getCurrentPages();
              console.log(pages)
              if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.refresh1()
              }
              setTimeout(function () {
                wx: wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
            }
          })
        }
      }
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
    var that = this
    console.log(that.data)

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