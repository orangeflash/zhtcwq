// zh_tcwq/pages/distribution/jrhhr.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountIndex: 0,
    fwxy: true,
  },
  lookck: function () {
    this.setData({
      fwxy: false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true
    })
  },
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      accountIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('color')) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: wx.getStorageSync('color'),
        animation: {
          duration: 0,
          timingFunc: 'easeIn'
        }
      })
    }
    var that = this, city = wx.getStorageSync('city')
    console.log(wx.getStorageSync('users'), wx.getStorageSync('openid'))
    var user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          url: res.data
        })
      },
    })
    //
    app.util.request({
      'url': 'entry/wxapp/FxSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          img: res.data.img2,
          fx_details: res.data.fx_details,
          fxset: res.data,
        })
      }
    });
    //邀请人
    app.util.request({
      'url': 'entry/wxapp/MySx',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        if (!res.data) {
          that.setData({
            yqr: '总店'
          })
        }
        else {
          that.setData({
            yqr: res.data.name
          })
        }
      }
    });
    app.util.request({
      'url': 'entry/wxapp/FxLevel',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          accounts: res.data,
        })
      }
    })
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          system: res.data,
          pt_name: res.data.pt_name,
        })
      },
    })
  },
  tzweb: function (e) {
    console.log(e.currentTarget.dataset.index, this.data.lblist)
    var item = this.data.lblist[e.currentTarget.dataset.index]
    var sjtype = e.currentTarget.dataset.sjtype
    console.log(item)
    if (item.state == '1') {
      wx.redirectTo({
        url: item.src,
      })
    }
    if (item.state == '2') {
      wx: wx.navigateTo({
        url: '../car/car?vr=' + item.id + '&sjtype=' + sjtype,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    if (item.state == '3') {
      wx.navigateToMiniProgram({
        appId: item.appid,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail)
    var that = this, name = e.detail.value.name, tel = e.detail.value.tel, cb = e.detail.value.checkbox.length, city = wx.getStorageSync('city');
    var user_id = wx.getStorageSync('users').id, openid = wx.getStorageSync("openid"), form_id = e.detail.formId, accountIndex = that.data.accountIndex;
    var money = Number(that.data.accounts[accountIndex].money), djid = that.data.accounts[accountIndex].id;
    console.log(user_id, openid, form_id, accountIndex, money, djid, name, tel, city)
    var warn = "";
    var flag = true;
    if (name == "") {
      warn = "请填写姓名！";
    } else if (tel == "") {
      warn = "请填写联系电话！";
    } else if (tel.length != 11) {
      warn = "手机号错误！";
    } else if (cb == 0) {
      warn = "阅读并同意《合伙人须知》";
    } else {
      flag = false;
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
      app.util.request({
        'url': 'entry/wxapp/Distribution',
        'cachetime': '0',
        data: { user_id: user_id, user_name: name, user_tel: tel, level: djid, money: money, cityname: city },
        success: function (res) {
          console.log(res)
          if (res.data != '下单失败') {
            if (money > 0) {
              app.util.request({
                'url': 'entry/wxapp/Pay2',
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
                      }
                      if (res.errMsg == 'requestPayment:ok') {
                        wx.showToast({
                          title: '提交成功',
                        })
                        setTimeout(function () {
                          wx.navigateBack({

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
                wx.navigateBack({

                })
              }, 1000)
            }
          }
          else {
            wx.showToast({
              title: '请重试！',
              icon: 'loading'
            })
            wx.hideLoading()
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
    var that = this, user_id = wx.getStorageSync("users").id;
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '30',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data.state == 1) {

        }
        else {
          wx: wx.showModal({
            title: '提示',
            content: '您的账号异常，请尽快联系管理员',
            success: function (res) {
              wx: wx.navigateBack({
                delta: 1,
              })
            }
          })
        }
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  //   var name = wx.getStorageSync('users').name
  //   return {
  //     title: name + '邀请你来成为合伙人',
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // }
})