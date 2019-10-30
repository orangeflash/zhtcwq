// pages/mypost/mypost.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部", "审核中", "已通过", "已拒绝"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 15,
    iszd:false,
    refresh_top: false,
    postlist: [],
     page: 1,
     countries: ["本地", "全国"],
     countryIndex: 0,
     xzdq:false,
  },
  detailed2: function (e) {
    wx.navigateTo({
      url: '../logs/detailed?state=' +3+'&postId='+e.currentTarget.id,
    })
  },
  bindCountryChange: function (e) {
    var stick = this.data.stick
    console.log('picker country 发生选择改变，携带值为', e.detail.value, stick);
    var that = this;
    this.setData({
      countryIndex: e.detail.value,
      iszd:true,
    })
  },
  qxxzdq: function () {
    this.setData({
      xzdq: false,
    })
  },
  qxzd:function(){
    this.setData({
      iszd:false,
    })
  },
  dkxf: function (e) {
    console.log(e.currentTarget.dataset.id, this.data.System)
    if (this.data.System.is_qgb == '1') {
      this.setData({
        xzdq: true,
        xfid: e.currentTarget.dataset.id
      })
    }
    else {
      this.setData({
        iszd: true,
        xfid: e.currentTarget.dataset.id
      })
    }
  },
  shuaxin: function (e) {
    if (this.data.isios && this.data.System.is_pgzf == '2') {
      wx.showModal({
        title: '暂不支持',
        content: '由于相关规范，iOS功能暂不可用',
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#666'
      })
      return
    }
    var that = this;
    var sxid = e.currentTarget.dataset.id, openid = wx.getStorageSync("openid"), user_id = wx.getStorageSync('users').id;
    console.log(sxid, e.currentTarget.dataset.typeid,openid)
    //---------------------------------- 获取刷新金额----------------------------------
    app.util.request({
      'url': 'entry/wxapp/SxMoney',
      'cachetime': '0',
      data: { type_id: e.currentTarget.dataset.typeid, id: sxid},
      success: function (res) {
        console.log(res)
        var sxmoney = Number(res.data.sx_money)
        console.log(sxmoney)
        wx.showModal({
          title: '提示',
          content: '刷新此帖子？',
          confirmText:'确定刷新',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              if(sxmoney<=0){
                console.log('免费刷新')
                app.util.request({
                  'url': 'entry/wxapp/SxTz',
                  'cachetime': '0',
                  data: { id: sxid },
                  success: function (res) {
                    console.log(res)
                    if(res.data==1){
                      wx.showToast({
                        title: '刷新帖子成功',
                      })
                      setTimeout(function () {
                        wx.reLaunch({
                          url: '../index/index',
                        })
                      }, 1000)
                    }
                  },
                })
              }
              else{
                console.log('付费刷新')
                if (that.data.isios && that.data.System.is_pgzf == '2') {
                  wx.showModal({
                    title: '暂不支持',
                    content: '由于相关规范，iOS功能暂不可用',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#666'
                  })
                  return
                }
                app.util.request({
                  'url': 'entry/wxapp/Pay',
                  'cachetime': '0',
                  data: { openid: openid, money: sxmoney },
                  success: function (res) {
                    wx.requestPayment({
                      'timeStamp': res.data.timeStamp,
                      'nonceStr': res.data.nonceStr,
                      'package': res.data.package,
                      'signType': res.data.signType,
                      'paySign': res.data.paySign,
                      'success': function (res) {
                        wx.showModal({
                          title: '提示',
                          content: '支付成功',
                          showCancel: false,
                        })
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
                          app.util.request({
                            'url': 'entry/wxapp/SxTz',
                            'cachetime': '0',
                            data: { id: sxid},
                            success: function (res) {
                              console.log(res)
                            },
                          })
                          app.util.request({
                            'url': 'entry/wxapp/SaveTzPayLog',
                            'cachetime': '0',
                            data: { tz_id: sxid, money: sxmoney, money5: sxmoney },
                            success: res => {

                            }
                          })
                          app.util.request({
                            'url': 'entry/wxapp/fx',
                            'cachetime': '0',
                            data: { user_id: user_id, money: sxmoney },
                            success: res => {
                              console.log(res)
                            }
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../index/index',
                            })
                          }, 1000)
                        }
                      }
                    })
                  },
                })
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })
  },
  // --------------------------------------选择的置顶信息-------------------------------------
  selected: function (e) {
    var that = this, countryIndex = this.data.countryIndex;
    var index = e.currentTarget.id, openid = wx.getStorageSync("openid"), user_id = wx.getStorageSync('users').id;
    var stick = that.data.stick, money = countryIndex == 0 ? stick[index].money : stick[index].money2, type = stick[index].type, xfid = this.data.xfid;
    var city = that.data.countryIndex == 0 ? '本地' : '全国版', cityname2 = wx.getStorageSync('city');
    console.log('city', city, cityname2)
    that.setData({
      iszd: false,
      xzdq: false,
    })
    console.log(money, type, xfid)
    if (Number(money) <= 0) {
      app.util.request({
        'url': 'entry/wxapp/TzXf',
        'cachetime': '0',
        data: { id: xfid, type: type, cityname: city, cityname2: cityname2 },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '操作成功',
            mask: true,
            duration: 1000,
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 1000)
        },
      })
    }
    else{
      if (that.data.isios && that.data.System.is_pgzf == '2') {
        wx.showModal({
          title: '暂不支持',
          content: '由于相关规范，iOS功能暂不可用',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#666'
        })
        return
      }
    app.util.request({
      'url': 'entry/wxapp/Pay',
      'cachetime': '0',
      data: { openid: openid, money: money },
      success: function (res) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            wx.showModal({
              title: '提示',
              content: '支付成功',
              showCancel: false,
            })
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
              app.util.request({
                'url': 'entry/wxapp/TzXf',
                'cachetime': '0',
                data: { id: xfid, type: type, cityname: city, cityname2: cityname2 },
                success: function (res) {
                  console.log(res)
                },
              })
              app.util.request({
                'url': 'entry/wxapp/SaveTzPayLog',
                'cachetime': '0',
                data: { tz_id: xfid, money: money, money4: money },
                success: res => {

                }
              })
              app.util.request({
                'url': 'entry/wxapp/fx',
                'cachetime': '0',
                data: { user_id: user_id, money: money },
                success: res => {
                  console.log(res)
                }
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
  },
  tabClick: function (e) {
    console.log(e)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      clickE:e,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          System: res.data,
        })
      },
    })
    //---------------------------------- 获取置顶信息----------------------------------
    app.util.request({
      'url': 'entry/wxapp/Top',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var stick = res.data
        for (let i in stick) {
          if (stick[i].type == 1) {
            stick[i].array = '置顶一天' + '（收费'
          } else if (stick[i].type == 2) {
            stick[i].array = '置顶一周' + '（收费'
          } else if (stick[i].type == 3) {
            stick[i].array = '置顶一月' + '（收费'
          }
        }
        console.log(stick)
        that.setData({
          stick: stick
        })
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.system.indexOf("iOS") != -1) {
          console.log('ios')
          that.setData({
            isios: true
          })
        }
        else {
          console.log('andr')
        }
      },
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    var user_id = wx.getStorageSync('users').id
    var url = wx.getStorageSync('url')
    var user_img = wx.getStorageSync('users').img, page = that.data.page, postlist = that.data.postlist;
    console.log(user_img)
    //---------------------------------- 获取轮播图集合----------------------------------
    app.util.request({
      'url': 'entry/wxapp/MyPost',
      'cachetime': '0',
      data: { user_id: user_id, pagesize: 10,page:page},
      success: function (res) {
        console.log(res)
        that.setData({
          page: page + 1,
        })
        console.log(res)
        if (res.data.length < 10) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false
          })
        }
        postlist = postlist.concat(res.data)
        console.log(postlist)
        var audit = [], adopt = [], refuse = [];
        for (let i in res.data) {
          res.data[i].time = that.ormatDate(res.data[i].time).slice(0, 16);
          res.data[i].img = res.data[i].img.split(",").slice(0, 4)
        }
        for (let i in postlist) {
          // 1为待审核------------------2为已通过--------------------------3为已拒绝
          if (postlist[i].state == 1 && postlist[i].type_name != null) {
            audit.push(postlist[i])
          } else if (postlist[i].state == 2 && postlist[i].type_name != null) {
            adopt.push(postlist[i])
          } else if (postlist[i].state == 3 && postlist[i].type_name != null) {
            refuse.push(postlist[i])
          }

        }
        that.setData({
          postlist:postlist,
          slide: postlist,
          user_img: user_img,
          url: url,
          audit: audit,
          adopt: adopt,
          refuse: refuse
        })
      },
    })
  },
  //---------------------------------- 点击跳转详情----------------------------------
  see: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var classification_info = that.data.slide
    var id = e.currentTarget.dataset.id
    for (let i in classification_info) {
      if (classification_info[i].id == id) {
        var my_post = classification_info[i]
      }
    }
    console.log(my_post)
    wx: wx.navigateTo({
      url: '../infodetial/infodetial?id=' + my_post.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
  bianji: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx: wx.navigateTo({
      url: 'modify?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // wx: wx.showModal({
    //   title: '提示',
    //   content: '程序员努力开发中',
    //   showCancel: true,
    //   cancelText: '取消',
    //   cancelColor: '',
    //   confirmText: '确定',
    //   confirmColor: '',
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
  },
  cancel: function (e) {
    var that = this
    wx: wx.showModal({
      title: '提示',
      content: '是否删除帖子',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var id = e.currentTarget.dataset.id
          app.util.request({
            'url': 'entry/wxapp/DelPost',
            'cachetime': '0',
            data: {
              id: id
            },
            success: function (res) {
              console.log(res)
              // -----------------------------------发布成功跳转到首页-----------------------------------------
              if (res.data == 1) {
                that.setData({
                  activeIndex: 0,
                  refresh_top: false,
                  slide: [],
                  postlist: [],
                  page: 1,
                })
                that.reload()
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
   
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
    this.setData({
      refresh_top: false,
      postlist: [],
      page: 1,
    })
    this.reload()
    this.tabClick(this.data.clickE)
    wx: wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载', this.data.page)
    if (this.data.refresh_top == false) {
      this.reload()
    } else {

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})