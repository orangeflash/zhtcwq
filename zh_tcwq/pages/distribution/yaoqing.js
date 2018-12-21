// zh_tcwq/pages/yaoqing/yaoqing.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    havecode: false,
    fwxy:true,
    wdtd:0,
  },
  ljyq: function () {
    var that=this;
    var fxset = this.data.fxset, wdsq = this.data.wdsq;
    console.log(fxset, wdsq)
    if (fxset.is_fx == '1') {
      if (!wdsq) {
        console.log('不是分销商')
        wx.navigateTo({
          url: 'distribution',
        })
      }
      else {
        if (wdsq.state == '1') {
          wx.showModal({
            title: '提示',
            content: '您的申请正在审核中，请耐心等待',
          })
        }
        if (wdsq.state == '2') {
          that.setData({
            share_modal_active: "active",
          })
        }
        if (wdsq.state == '3') {
          wx.showModal({
            title: '提示',
            content: '您的申请已被拒绝，点击确定重新申请',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: 'distribution',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    }
    else{
      console.log('未开启审核')
      that.setData({
        share_modal_active: "active",
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
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
    var that = this;
    var user_id = wx.getStorageSync('users').id, username = wx.getStorageSync('users').name;
    var url = wx.getStorageSync('url')
    console.log(user_id)
    //
    app.util.request({
      'url': 'entry/wxapp/FxSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          img: res.data.img,
          url: url,
          fxset: res.data,
        })
        if (res.data.is_fx == '1') {
          console.log('开启分销审核')
          //用户是否申请
          app.util.request({
            'url': 'entry/wxapp/MyDistribution',
            'cachetime': '0',
            data: { user_id: user_id },
            success: function (res) {
              console.log(res.data)
              that.setData({
                wdsq: res.data,
              })
              if (!res.data) {
                console.log('不是分销商')
                that.setData({
                  havecode: false,
                })
              }
              else if(res.data.state=='2'){
                that.setData({
                  havecode: true,
                })
              }
            }
          });
        }
        if (res.data.is_fx == '2') {
          console.log('未开启审核')
          app.util.request({
            'url': 'entry/wxapp/MyDistribution',
            'cachetime': '0',
            data: { user_id: user_id },
            success: function (res) {
              console.log(res.data)
              that.setData({
                wdsq: res.data,
              })
            }
          });
          that.setData({
            havecode: true,
          })
        }
      }
    });
    //MyCode
    app.util.request({
      'url': 'entry/wxapp/MyCode',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          code: res.data,
        })
      }
    });
    // 系统设置
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          system:res.data,
          link_logo: res.data.link_logo,
          pt_name: res.data.pt_name,
          userid:user_id,
          username:username,
        })
      },
    })
    //佣金
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
         userinfo: res.data
        })
      }
    })
    //tx
    app.util.request({
      'url': 'entry/wxapp/YjtxList',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          txmx: res.data
        })
      }
    })
    //symx
    app.util.request({
      'url': 'entry/wxapp/Earnings',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].time = util.ormatDate(res.data[i].time)
        }
        that.setData({
          symx: res.data
        })
      }
    })
    //MyTeam
    app.util.request({
      'url': 'entry/wxapp/MyTeam',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          wdtd: res.data.one.length + res.data.two.length
        })
      }
    })
  },
  previewimg: function () {
    wx.previewImage({
      urls: [this.data.code],
    })
  },
  showShareModal: function () {
    var page = this;
    page.setData({
      share_modal_active: "active",
      no_scroll: true,
    });
  },
  shareModalClose: function () {
    var page = this;
    page.setData({
      share_modal_active: "",
      no_scroll: false,
    });
  },
  mdmfx:function(){
    var page = this;
    page.setData({
      share_modal_active: "",
      no_scroll: false,
      fwxy:false,
    });
  },
  yczz:function(){
    this.setData({
      fwxy: true,
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
    this.setData({
      havecode: false,
    })
    this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(this.data.pt_name, this.data.userid, this.data.username)
    console.log(res)
    if (res.from === 'menu') {
      //
      return false;
    }
    return {
      title: this.data.username + '邀请你来看看' + this.data.pt_name,
      path: "zh_tcwq/pages/index/index?userid=" + this.data.userid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})