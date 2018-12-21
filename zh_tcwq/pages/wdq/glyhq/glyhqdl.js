// zh_zbkq/pages/my/glyhq/glyhqdl.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bjsl: true,
    tabs: ['领取列表','核销列表'],
    activeIndex: 0,
    mygd: false,
    jzgd: true,
    pagenum:1,
    lqlist:[],
    lqlb: [],
  },
  tel: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  tabClick: function (e) {
    var params = this.data.params, that = this;
    if (e.currentTarget.id == '0') {
      params.state='';
      params.orderby = 'a.time desc'
    }
    if (e.currentTarget.id == '1') {
      params.state = '1';
      params.orderby = 'a.hx_time desc'
    }
    console.log(params, e.currentTarget.dataset.index)
    this.setData({
      activeIndex: e.currentTarget.id,
      params: params,
      mygd: false,
      jzgd: true,
      pagenum: 1,
      lqlist: [],
      lqlb:[],
    });
    that.lqlb();
  },
  ffsl: function (e) {
    console.log(e.detail.value)
    this.setData({
      ffsl: e.detail.value,
    })
  },
  wanc: function () {
    var yhqid = this.data.yhq.id, ffsl = this.data.ffsl;
    console.log(yhqid, ffsl)
    if(ffsl==''){
      wx.showModal({
        title: '提示',
        content: '修改数量不能为空',
      })
      return false
    }
    if (Number(ffsl) < Number(this.data.yhq.lq_num)){
      wx.showModal({
        title: '提示',
        content: '发放数量不能少于已领取数量',
      })
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确定修改此券的发放数量为' + ffsl + '张？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //UpdKqNum;
          app.util.request({
            'url': 'entry/wxapp/UpdKqNum',
            'cachetime': '0',
            data: { coupons_id: yhqid, number: ffsl },
            success: function (res) {
              console.log(res.data)
              if(res.data==1){
                wx.showToast({
                  title: '编辑成功',
                })
                setTimeout(function(){
                  wx.navigateBack({

                  })
                },1000)
              }
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    this.setData({
      bjsl: true,
    })
  },
  bj: function () {
    this.setData({
      bjsl: false,
    })
  },
  chakan: function () {
    var that = this
    wx.navigateTo({
      url: '../../sellerinfo/yhqinfo?yhqid=' + that.data.yhqid + '&sjid=' + that.data.yhq.store_id,
    })
  },
  sjxj:function(){
    var that = this, yhq = this.data.yhq, is_show = yhq.is_show=='1'?'2':'1'
    console.log(is_show)
    if (is_show == '2') {
      wx.showModal({
        title: '提示',
        content: '确定下架吗?下架后商家页面不显示此券',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.util.request({
              'url': 'entry/wxapp/UpdCoupon',
              'cachetime': '0',
              data: { is_show: is_show, coupon_id: yhq.id },
              success: function (res) {
                console.log(res.data)
                if (res.data == '1') {
                  wx.showToast({
                    title: '操作成功',
                  })
                  setTimeout(() => {
                    that.reLoad();
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
    else{
    app.util.request({
      'url': 'entry/wxapp/UpdCoupon',
      'cachetime': '0',
      data: { is_show: is_show,coupon_id: yhq.id },
      success: function (res) {
        console.log(res.data)
        if(res.data=='1'){
          wx.showToast({
            title: '操作成功',
          })
          setTimeout(()=>{
            that.reLoad();
          },1000)
        }
      }
    });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    this.setData({
      sjid: options.sjid,
      yhqid:options.yhqid,
      params: { coupons_id: options.yhqid, state: '', orderby:'a.time desc'}
    })
    this.reLoad();
    this.lqlb();
  },
  reLoad:function(){
    var that = this, yhqid = this.data.yhqid;
    //取优惠券详情;
    app.util.request({
      'url': 'entry/wxapp/CouponInfo2',
      'cachetime': '0',
      data: { coupon_id: yhqid },
      success: function (res) {
        console.log(res.data)
        wx.setNavigationBarTitle({
          title: '管理'+res.data.name,
        })
        that.setData({
          yhq: res.data,
        })
      }
    });
  },
  lqlb:function(){
    var that = this, page = that.data.pagenum; that.data.params.page = page, that.data.params.pagesize = 10;
    console.log(page, that.data.params);
    //取优惠券详情;
    app.util.request({
      'url': 'entry/wxapp/LqCouponList',
      'cachetime': '0',
      data: that.data.params,
      success: function (res) {
        console.log('分页返回的门店列表数据', res.data)
        if (res.data.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: page + 1,
          })
        }
        var lqlist = that.data.lqlist;
        lqlist = lqlist.concat(res.data)
        console.log(lqlist)
        that.setData({
          lqlist: lqlist,
          lqlb:lqlist
        })
      }
    });
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
    console.log('上拉加载', this.data.pagenum)
    var that = this;
    if (!this.data.mygd && this.data.jzgd) {
      this.setData({
        jzgd: false
      })
      this.lqlb();
    }
    else {
      // wx.showToast({
      //   title: '没有更多了',
      //   icon: 'loading',
      //   duration: 1000,
      // })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})