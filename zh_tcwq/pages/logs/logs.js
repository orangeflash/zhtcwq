//logs.js
const util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Return: false
  },
  bindGetUserInfo: function(res) {
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        hydl: false,
      })
      this.changeData();
    }
  },
  changeData: function() {
    var that = this;
    //获取头像和名字
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              app.util.request({
                'url': 'entry/wxapp/login',
                'cachetime': '0',
                data: {
                  openid: wx.getStorageSync('openid'),
                  img: res.userInfo.avatarUrl,
                  name: res.userInfo.nickName
                },
                success: function(res) {},
              })
              var userInfo = res.userInfo
              that.setData({
                avatarUrl: userInfo.avatarUrl,
                nickName: userInfo.nickName
              })
            }
          })
        } else {
          console.log('未授权过')
          that.setData({
            hydl: true,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var pages = getCurrentPages();
    var prevPage = pages
    prevPage.route = 'zh_tcwq/pages/logs/index'
    if (that.data.Return == true) {
      prevPage.setData({
        Return: true
      })
    }
    app.pageOnLoad(this);
    app.setNavigationBarColor(this);
    this.changeData()
    var support = wx.getStorageSync('System').bq_name
    var bq_logo = wx.getStorageSync('System').bq_logo
    var user_info = wx.getStorageSync('user_info')
    console.log(user_info)
    var store = wx.getStorageSync('store')
    var url = wx.getStorageSync('url')
    console.log(store)
    that.setData({
      store: store,
      url: url,
      System: wx.getStorageSync('System'),
      support: support,
      bq_logo: bq_logo
    })
    that.setData({
      avatarUrl: user_info.avatarUrl,
      nickName: user_info.nickName
    })
  },
  collection: function(e) {
    wx: wx.navigateTo({
      url: '../Collection/Collection',
    })
  },
  //我要入驻跳转页面
  settled: function(e) {
    wx: wx.navigateTo({
      url: '../settled/settled',
    })
  },
  yellow_page: function(e) {
    wx: wx.navigateTo({
      url: '../yellow_page/mine_yellow',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  jfsc: function() {
    wx.navigateTo({
      url: '../integral/integral',
    })
  },
  wdbm: function() {
    wx.navigateTo({
      url: '../wdbm/wdbm',
    })
  },
  wdyhq: function() {
    wx.navigateTo({
      url: '../wdq/wdq',
    })
  },
  wdqg: function() {
    wx.navigateTo({
      url: '../xsqg/order',
    })
  },
  wdpt: function() {
    wx.navigateTo({
      url: '../collage/group_order',
    })
  },
  tchhr: function(e) {
    var that = this,
      user_id = wx.getStorageSync('users').id;
    //用户是否申请
    app.util.request({
      'url': 'entry/wxapp/MyDistribution',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.state == '2') {
          console.log('是分销商')
          wx.navigateTo({
            url: '../distribution/yaoqing',
          })
        } else if (res.data.state == '1') {
          wx.showModal({
            title: '提示',
            content: '您的申请正在审核中，请耐心等待',
          })
        } else {
          wx.navigateTo({
            url: '../distribution/jrhhr',
          })
        }
      }
    });
  },
  // 
  my_post: function(e) {
    wx: wx.navigateTo({
      url: '../mypost/mypost',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  content: function(e) {
    wx: wx.navigateTo({
      url: '../content/content',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  logs_store: function(e) {
    wx: wx.navigateTo({
      url: 'bbaa',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // --------------------------跳转订单---------------------------
  order: function(e) {
    wx: wx.navigateTo({
      url: 'order',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // ----------------------------------帮助中心----------------------------------
  help: function(e) {
    wx: wx.navigateTo({
      url: '../store/help',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  ptgl: function() {
    wx.navigateTo({
      url: '../extra/ptgly/bbaa',
    })
  },
  // --------------------跳转我的钱包-------------------
  wallet: function(e) {
    wx: wx.navigateTo({
      url: 'income',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // -----------------------------跳转我发布的拼车--------------
  mine_car: function(e) {
    wx: wx.navigateTo({
      url: 'mine_car',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // ----------------------------收货地址---------------
  address: function(e) {
    var users_info = wx.getStorageSync('users')
    var user_id = users_info.id
    wx.chooseAddress({
      success: function(res) {
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
          success: function(res) {
            console.log(res)
          },
        })
      }
    })
  },
  // ----------------------------------------------------跳转小程序------------------------------
  jump: function(e) {
    wx.navigateToMiniProgram({
      appId: wx.getStorageSync('System').tz_appid,
      path: '',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
        console.log('跳转成功')
        console.log(res)
      }
    })
  },
  about: function(e) {
    wx: wx.navigateTo({
      url: 'system',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
  onShow: function() {
    var that = this,
      user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '30',
      data: {
        user_id: user_id
      },
      success: function(res) {
        console.log(res)
        that.setData({
          UserInfo: res.data,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/MyCollection',
      'cachetime': '30',
      data: {
        user_id: user_id
      },
      success: function(res) {
        console.log(res)
        that.setData({
          MyCollection: res.data,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/Signset',
      'cachetime': '0',
      success: function(res) {
        console.log('签到设置', res)
        that.setData({
          qdset: res.data,
        })
      }
    })
    //用户是否申请
    app.util.request({
      'url': 'entry/wxapp/MyDistribution',
      'cachetime': '0',
      data: {
        user_id: user_id
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          MyDistribution: res.data,
        })
      }
    });
  },

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

  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})