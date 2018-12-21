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
    app.util.request({
      'url': 'entry/wxapp/FxLevel',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        let accounts=res.data
        that.setData({
          accounts: res.data,
        })
        app.util.request({
          'url': 'entry/wxapp/MyDistribution',
          'cachetime': '0',
          data: { user_id: user_id },
          success: function (res) {
            console.log(res.data)
            for (let i = 0; i < accounts.length; i++) {
              if (accounts[i].id == res.data.level) {
                that.setData({
                  dqdjindex: i,
                })
                console.log(i)
              }
            }
            that.setData({
              wdsq: res.data,
            })
          }
        });
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
    var that = this, city = wx.getStorageSync('city');
    var dqdjid = this.data.wdsq.level, user_id = wx.getStorageSync('users').id, openid = wx.getStorageSync("openid"), form_id = e.detail.formId, accountIndex = that.data.accountIndex, dqdjindex = that.data.dqdjindex;
    //
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: user_id,
        form_id: form_id,
        openid: openid
      },
      success: function (res) {

      },
    })
    var money = Number(that.data.accounts[accountIndex].money), dqdjmoney = Number(that.data.accounts[dqdjindex].money), djid = that.data.accounts[accountIndex].id;
    var cjmoney = parseFloat((money - dqdjmoney).toFixed(2))
    console.log(user_id, openid, form_id, accountIndex, dqdjindex, money, dqdjmoney, cjmoney, djid, city, dqdjid)
    var warn = "";
    var flag = true;
    if (Number(accountIndex)<=dqdjindex) {
      warn = "请选择高于你当前的等级进行升级！";
    } else if (cjmoney<0) {
      warn = "升级错误，请联系平台管理员设置正确等级金额！";
    } else {
      flag = false;
      wx.showModal({
        title: '提示',
        content: '升级需补差价' + cjmoney+'元进行升级',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '加载中...',
              mask: true,
            })
            app.util.request({
              'url': 'entry/wxapp/SjFx',
              'cachetime': '0',
              data: { user_id: user_id, level: djid, money: cjmoney},
              success: function (res) {
                console.log(res)
                if (res.data != '下单失败') {
                  if (cjmoney > 0) {
                    app.util.request({
                      'url': 'entry/wxapp/Pay6',
                      'cachetime': '0',
                      data: { openid: openid, money: cjmoney, order_id: res.data },
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
                                title: '升级成功',
                              })
                              setTimeout(() => {
                                wx.reLaunch({
                                  url: '../logs/logs',
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
                      title: '升级成功',
                    })
                    setTimeout(() => {
                      wx.reLaunch({
                        url: '../logs/logs',
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
          } else if (res.cancel) {
            console.log('用户点击取消')
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