// zh_gjhdbm/pages/collage/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    group_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    var that = this
    that.setData({
      url:wx.getStorageSync('url')
    })
    app.setNavigationBarColor(this);
  },
  refresh:function(e){
    var that = this
    var city = wx.getStorageSync('city')
    // 轮播图
    app.util.request({
      'url': 'entry/wxapp/ad',
      'cachetime': '0',
      data: {
        type: 13,
        cityname: city 
      },
      success: res => {
        console.log('轮播图列表', res)
        var imgArray = []
        for(let i in res.data){
          if(res.data[i].type==13){
            imgArray.push(res.data[i])
          }
        }
        that.setData({
          imgArray: imgArray
        })
      }
    })
    // 获取拼团分类
    app.util.request({
      'url': 'entry/wxapp/GroupType',
      'cachetime': '0',
      success: res => {
        console.log('分类列表', res)
        if (res.data.length > 5) {
          var height = 340
        } else {
          var height = 170
        }
        var nav_array = []
        for (var i = 0, len = res.data.length; i < len; i += 10) {
          nav_array.push(res.data.slice(i, i + 10));
        }
        that.setData({
          nav_array: nav_array,
          height: height
        })
      }
    })
  },
  reload: function (e) {
    var that = this
    var page = that.data.page
    var group_list = that.data.group_list, cityname = wx.getStorageSync('city');
    // 商品列表
    app.util.request({
      'url': 'entry/wxapp/GroupGoods',
      'cachetime': '0',
      data: {
        type_id: '',
        page: page, cityname: cityname 
      },
      success: res => {
        console.log('商品列表', res)
        if (res.data.length > 0) {
          group_list = group_list.concat(res.data)
          that.setData({
            group_list: group_list,
            page: page + 1
          })
        }
      }
    })
  },
  // 分类跳转
  nav_child: function (e) {
    wx.navigateTo({
      url: 'nav?id=' + e.currentTarget.dataset.id + '&store_id=' + '' + '&display=' + 1,
    })
  },
  // 详情跳转
  index: function (e) {
    wx.navigateTo({
      url: 'info?id=' + e.currentTarget.dataset.id 
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
    this.refresh()
    this.reload()
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
    var that = this
    that.refresh()
    that.setData({
      group_list: [],
      page: 1
    })
    that.reload()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.reload()
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // }
})