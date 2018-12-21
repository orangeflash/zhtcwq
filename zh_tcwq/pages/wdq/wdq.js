// zh_zbkq/pages/wdq/wdq.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['可用的', '失效的'],
    activeIndex: 0,
    items1: [],
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    showModal: false,
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    var uid = wx.getStorageSync('users').id
    console.log(e)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您未授权获取您的手机号',
        success: function (res) { }
      })
    }
    else {
      app.util.request({
        'url': 'entry/wxapp/Jiemi',
        'cachetime': '0',
        data: { sessionKey: getApp().getSK, data: e.detail.encryptedData, iv: e.detail.iv },
        success: function (res) {
          console.log('解密后的数据', res)
          if (res.data.phoneNumber != null) {
            that.setData({
              sjh: res.data.phoneNumber,
              showModal: false,
            })
            //保存手机号
            app.util.request({
              'url': 'entry/wxapp/SaveLqTel',
              'cachetime': '0',
              data: { user_id: uid, lq_tel: res.data.phoneNumber},
              success: function (res) {
                console.log(res.data)
                if(res.data==1){
                  wx.showToast({
                    title: '验证成功',
                    duration:1000,
                  })
                }
              }
            });
          }
        }
      });
    }
  },
  ljsy: function (e) {
    var yhqid = e.currentTarget.dataset.yhqid, sjid = e.currentTarget.dataset.sjid, qid = e.currentTarget.dataset.qid;
    console.log(e, yhqid, sjid, qid)
    wx.navigateTo({
      url: '../sellerinfo/yhqinfo?yhqid=' + yhqid + '&sjid=' + sjid+'&qid='+qid,
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '正在开发中',
    // })
  },
  reLoad: function () {
    var that = this;
    var uid = wx.getStorageSync('users').id
    var nowtime = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-")
    console.log(uid, nowtime)
    //我的券;
    app.util.request({
      'url': 'entry/wxapp/MyCoupons',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log(res.data)
        var all = res.data
        for (var i = 0; i < all.length; i++) {
          if (all[i].name == '通用券') {
            all[i].cost = parseInt(all[i].cost)
          }
        }
        var kyd = [], sxd = [];
        for (var i = 0; i < all.length; i++) {
          if (!(util.validTime1(nowtime, all[i].end_time)) || all[i].state == '1' || all[i].state == '3') {
            all[i].isTouchMove=false
            sxd.push(all[i])
          }
          else if (all[i].state == '2') {
            kyd.push(all[i])
          }
        }
        console.log(kyd, sxd)
        that.setData({
          items1: kyd,
          items: sxd
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = wx.getStorageSync('url')
    console.log(url)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('System').color,
    })
    this.setData({
      url: url,
      System: wx.getStorageSync('System'),
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
    this.reLoad();
    var uid = wx.getStorageSync('users').id
    console.log(uid)
    var that=this;
    //取平台信息
    // app.util.request({
    //   'url': 'entry/wxapp/GetPlatform',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res.data)
    //     if (res.data.is_lq=='2'){
    //       //取用户信息
    //       app.util.request({
    //         'url': 'entry/wxapp/GetUserInfo',
    //         'cachetime': '0',
    //         data: { user_id: uid },
    //         success: function (res) {
    //           console.log(res.data)
    //           if (res.data.lq_tel == '') {
    //             that.setData({
    //               showModal: true,
    //             })
    //           }
    //           else {
    //             that.setData({
    //               showModal: false,
    //             })
    //           }
    //         }
    //       });
    //     }
    //   }
    // });
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
    this.reLoad();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  touchstart1: function (e) {
    //开始触摸时 重置所有删除
    this.data.items1.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items1: this.data.items1
    })
  },
  //滑动事件处理
  touchmove1: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items1.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items1: that.data.items1
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //
  del: function (e) {
    var that = this;
    var yhqid = e.currentTarget.dataset.yhqid
    console.log(e, yhqid)
    //删除
    wx.showModal({
      title: '提示',
      content: '删除后，此券将成为失效券',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelMyCoupons',
            'cachetime': '0',
            data: { id: yhqid },
            success: function (res) {
              console.log(res.data)
              if (res.data == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else{
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  del2: function (e) {
    var that = this;
    var yhqid = e.currentTarget.dataset.yhqid
    console.log(e, yhqid)
    //删除
    wx.showModal({
      title: '提示',
      content: '删除后，此券将从您的记录中删除',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelCoupon',
            'cachetime': '0',
            data: { coupon_id: yhqid },
            success: function (res) {
              console.log(res.data)
              if (res.data == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})