// zh_dianc/pages/logs/qd/pm.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["手速榜", "总榜"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 15,
    refresh_top:false,
    refresh_top1:false,
    rankpage:1,
    zrankpage:1,
    sranklist:[],
    szrank:[],
  },
  tabClick: function (e) {
    console.log(e)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var that = this;
    var user_id = wx.getStorageSync('users').id
    var user_info = wx.getStorageSync('user_info')
    console.log(user_info)
    that.setData({
      userinfo: user_info
    })
    //查看连续签到天数
    app.util.request({
      'url': 'entry/wxapp/Continuous',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('查看连续签到天数', res)
        that.setData({
          lxts: res.data,
        })
      }
    })
    //查看MySign
    app.util.request({
      'url': 'entry/wxapp/MySign',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('MySign', res)
        that.setData({
          ljqd: res.data,
        })
      }
    })
    //MyJrRank
    app.util.request({
      'url': 'entry/wxapp/MyJrRank',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('MyJrRank', res.data)
        res.data.time3 = app.ormatDate(res.data.time3).substring(11);
        that.setData({
          MyRank: res.data,
        })
      }
    })
    this.rank()
    this.zrank()
  },
  rank: function () {
    var that = this;
    var user_id = wx.getStorageSync('users').id, rankpage = that.data.rankpage, zrankpage = that.data.zrankpage, sranklist = that.data.sranklist,szrank=that.data.szrank;
    console.log(rankpage,zrankpage,sranklist,szrank)
    //JrRank
    app.util.request({
      'url': 'entry/wxapp/JrRank',
      'cachetime': '0',
      data: {page: rankpage, pagesize: 20, },
      success: function (res) {
        console.log('JrRank', res.data)
        console.log(res)
        that.setData({
          rankpage: rankpage + 1,
        })
        if (res.data.length < 20) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false
          })
        }
        for (let i in res.data) {
          res.data[i].time3 = app.ormatDate(res.data[i].time3).substring(11);
        }
        sranklist = sranklist.concat(res.data)
        console.log(sranklist)
        that.setData({
          ranklist: sranklist,
          sranklist:sranklist
        })
      }
    })
  },
  zrank: function () {
    var that = this;
    var user_id = wx.getStorageSync('users').id, rankpage = that.data.rankpage, zrankpage = that.data.zrankpage, sranklist = that.data.sranklist, szrank = that.data.szrank;
    console.log(rankpage, zrankpage, sranklist, szrank)
    //pm
    app.util.request({
      'url': 'entry/wxapp/Rank',
      'cachetime': '0',
      data: { page: zrankpage, pagesize: 20, },
      success: function (res) {
        console.log('rank', res)
        console.log(res)
        that.setData({
          zrankpage: zrankpage + 1,
        })
        if (res.data.length < 20) {
          that.setData({
            refresh_top1: true
          })
        } else {
          that.setData({
            refresh_top1: false
          })
        }
        szrank = szrank.concat(res.data)
        console.log(szrank)
        that.setData({
          zrank: szrank,
          szrank: szrank
        })
        // for (let i = 0; i < res.data.length; i++) {
        //   if (user_id == res.data[i].id) {
        //     that.setData({
        //       pm: i + 1
        //     })
        //   }
        // }
      }
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉加载', this.data.activeIndex, this.data.rankpage, this.data.zrankpage)
    if (this.data.refresh_top == false && this.data.activeIndex==0) {
      this.rank()
    } else {
      console.log('今日没有了')  
    }
    if (this.data.refresh_top1 == false && this.data.activeIndex == 1) {
      this.zrank()
    } else {
      console.log('总的没有了')
    }
  },

})