// zh_zbkq/pages/my/glyhq/glyhq.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['有效的','失效的'],
    activeIndex: 0,
    items1: [],
    items: [],
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  cksj:function(e){
    var yhqid = e.currentTarget.dataset.yhqid, sjid = e.currentTarget.dataset.sjid;
    console.log(e, yhqid,sjid)
    wx.navigateTo({
      url: 'glyhqdl?yhqid=' + yhqid+'&sjid='+sjid,
    })
  },
  reLoad: function () {
    var that = this;
    var store_id = this.data.store_id
    var nowtime = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-")
    console.log(store_id, nowtime)
    //我的券;
    app.util.request({
      'url': 'entry/wxapp/StoreCoupon2',
      'cachetime': '0',
      data: { store_id: store_id },
      success: function (res) {
        console.log(res.data)
        var all = res.data
        var kyd = [], sxd = [];
        for (var i = 0; i < all.length; i++) {
          if (all[i].state == '3' || !(util.validTime1(nowtime, all[i].end_time))) {
            all[i].isTouchMove = false
            sxd.push(all[i])
          }
          else {
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
    var that=this, url = wx.getStorageSync('url')
    console.log(url,options)
    this.setData({
      url: url,
      store_id: options.store_id
    })
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: options.store_id },
      success: function (res) {
        console.log(res)
        that.setData({
          seller: res.data.store[0]
        })
      },
    })
    this.reLoad();
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
    //this.reLoad();
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
    var that=this;
    var yhqid = e.currentTarget.dataset.yhqid
    console.log(e, yhqid)
    //删除
    wx.showModal({
      title: '提示',
      content: '确认删除此券吗？删除后将失效',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelCoupons',
            'cachetime': '0',
            data: { coupons_id: yhqid },
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
      content: '确认删除此券吗？删除后将从你的记录中删除',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/DelCoupon2',
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
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})