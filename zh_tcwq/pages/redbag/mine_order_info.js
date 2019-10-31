// zh_tcwq/pages/redbag/mine_order_info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kdname:'',
    kdnum:''
  },
  bindnameInput: function (e) {
    this.setData({
      kdname: e.detail.value
    })
  },
  bindnumInput: function (e) {
    this.setData({
      kdnum: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    that.setData({
      id: id
    })
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    var id = that.data.id
    app.util.request({
      'url': 'entry/wxapp/StoreOrderInfo',
      'cachetime': '0',
      data: { order_id: id },
      success: function (res) {
        console.log(res)
        res.data.time = app.ormatDate(res.data.time)
        console.log(res.data.address.length)
        if (res.data.address.length>22){
          that.setData({
            height:40
          })
        }
        that.setData({
          oreder_info: res.data
        })
      },
    })
  },
  // ------------------------------确认收货--------------------------
  Deliver: function (e) {
    var that = this, kdname = this.data.kdname, kdnum = this.data.kdnum;
    console.log(this.data.oreder_info.is_zt,kdname, kdnum)
    if (this.data.oreder_info.is_zt==2){
      if (kdname == '' || kdnum == '') {
        wx.showModal({
          title: '提示',
          content: '请填写发货快递名称及快递单号',
        })
        return
      }
    }
    var id = that.data.id
    app.util.request({
      'url': 'entry/wxapp/DeliveryOrder',
      'cachetime': '0',
      data: { order_id: id, kd_name: kdname, kd_num:kdnum },
      success: function (res) {
        console.log(res)
        wx:wx.showToast({
          title: '操作成功',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function(res) {
            setTimeout(function(){
              that.refresh()
            },1000)
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
    })
  },
  // -----------------------------确认收货----------------------------
  tk: function (e) {
    var that = this
    console.log(e)
    var id = that.data.id, type=e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: `${type==1?'确认退款':'拒绝退款'}吗？`,
      success(res){
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          app.util.request({
            'url': 'entry/wxapp/RefundOrder',
            data: { order_id: id, type, },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx: wx.showToast({
                  title: '操作成功',
                  duration: 1000,
                  mask: true,
                  success: function (res) {
                    setTimeout(function () {
                      that.refresh()
                    }, 1000)
                  },
                })
              } else {
                wx.showToast({
                  title: res.data,
                  icon: 'none',
                })
              }
            },
          })
        }
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
    app.setNavigationBarColor(this);
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