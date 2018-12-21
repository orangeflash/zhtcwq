// zh_tcwq/pages/wdbm/wdbm.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh_top: false,
    postlist: [],
    page: 1,
  },
  tzxq:function(e){
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.state!='3'){
       wx.navigateTo({
         url: '../hdzx/hdzxinfo?hdid=' + e.currentTarget.dataset.id,
       })
    }
    else{
      wx.navigateTo({
        url: 'hxq?hdid=' + e.currentTarget.dataset.id + '&hxid=' + e.currentTarget.dataset.hxid,
      })
    }
  },
  reload: function (e) {
    var that = this
    var user_id = wx.getStorageSync('users').id
    var url = wx.getStorageSync('url')
    var user_img = wx.getStorageSync('users').img, page = that.data.page, postlist = that.data.postlist;
    console.log(user_img)
    //---------------------------------- 获取轮播图集合----------------------------------
    app.util.request({
      'url': 'entry/wxapp/MyActivity',
      'cachetime': '0',
      data: { user_id: user_id, pagesize: 10, page: page },
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
        // var audit = [], adopt = [], refuse = [];
        for (let i in res.data) {
          res.data[i].start_time = res.data[i].start_time.substring(0, 16);
          res.data[i].end_time = res.data[i].end_time.substring(0, 16);
        }
        // for (let i in postlist) {
        //   // 1为待审核------------------2为已通过--------------------------3为已拒绝
        //   if (postlist[i].state == 1 && postlist[i].type_name != null) {
        //     audit.push(postlist[i])
        //   } else if (postlist[i].state == 2 && postlist[i].type_name != null) {
        //     adopt.push(postlist[i])
        //   } else if (postlist[i].state == 3 && postlist[i].type_name != null) {
        //     refuse.push(postlist[i])
        //   }

        // }
        that.setData({
          postlist: postlist,
          slide: postlist,
          user_img: user_img,
          url: url,
          // audit: audit,
          // adopt: adopt,
          // refuse: refuse
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.reload()
    that.setData({
      color: wx.getStorageSync('color'),
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
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
    this.setData({
      activeIndex: 0,
      refresh_top: false,
      postlist: [],
      page: 1,
    })
    this.reload()
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
})