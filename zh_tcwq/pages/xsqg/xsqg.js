// zh_cjdianc/pages/index/xsqg.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: [{ name: '全部', id: '' }],
    selectedindex: 0,
    mask1Hidden:true,
    img:'http://img1.imgtn.bdimg.com/it/u=4078366710,4168441355&fm=200&gp=0.jpg',
    status: 1,
    pagenum: 1,
    order_list: [],
    storelist: [],
    mygd: false,
    jzgd: true,
    type_id:'',
  },
  onOverallTag: function (e) {
    console.log(e)
    this.setData({
      mask1Hidden: false
    })
  },
  mask1Cancel: function () {
    this.setData({
      mask1Hidden: true
    })
  },
  selectednavbar: function (e) {
    console.log(e)
    this.setData({
      pagenum: 1,
      order_list: [],
      storelist: [],
      mygd: false,
      jzgd: true,
      selectedindex: e.currentTarget.dataset.index,
      toView: 'a' + (e.currentTarget.dataset.index - 1),
      type_id: e.currentTarget.dataset.id
    })
    this.reLoad();
  },
  reLoad: function () {
    var that = this, status = this.data.type_id, store_id = this.data.store_id || '', type = this.data.store_id == null ? 1 : '', page = this.data.pagenum, cityname = this.data.store_id == null ? wx.getStorageSync('city') : '';
    var type_id=status;
    // if (status == 1) {
    //   type_id = ''
    // }
    // else {
    //   type_id = that.data.navbar[status - 1].id
    // }
    console.log(status, type_id, store_id, cityname, page)
    app.util.request({
      'url': 'entry/wxapp/QgGoods',
      'cachetime': '0',
      data: { type_id: type_id, store_id: store_id, page: page, pagesize: 10, type: type, cityname: cityname },
      success: function (res) {
        console.log('分页返回的列表数据', res.data)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].discount = (Number(res.data[i].money) / Number(res.data[i].price) * 10).toFixed(1)
          res.data[i].yqnum = (((Number(res.data[i].number) - Number(res.data[i].surplus)) / Number(res.data[i].number)*100)).toFixed(1)
        }
        if (res.data.length < 10) {
          that.setData({
            mygd: true,
            jzgd: true,
          })
        }
        else {
          that.setData({
            jzgd: true,
            pagenum: that.data.pagenum + 1,
          })
        }
        var storelist = that.data.storelist;
        storelist = storelist.concat(res.data);
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        storelist = unrepeat(storelist)
        that.setData({
          order_list: storelist,
          storelist: storelist
        })
        console.log(storelist)
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    app.setNavigationBarColor(this);
    var that = this, storeid = options.storeid;
    console.log(storeid)
    that.setData({
      store_id: storeid,
    })
    // ZbOrder
    app.util.request({
      'url': 'entry/wxapp/ZbOrder',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          ZbOrder: res.data
        })
      },
    })
    var city = wx.getStorageSync('city')
    app.util.request({
      'url': 'entry/wxapp/Ad',
      'cachetime': '0',
      data: { cityname: city },
      success: function (res) {
        console.log(res)
        var slide = []
        for (let i in res.data) {
          if (res.data[i].type == 12) {
            slide.push(res.data[i])
          }
        }
        that.setData({
          slide: slide,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/QgType',
      'cachetime': '0',
      success: function (res) {
        var navs = res.data
        if (navs.length <= 5) {
          that.setData({
            height: 165
          })
        } else if (navs.length > 5) {
          that.setData({
            height: 340
          })
        }
        var nav = []
        for (var i = 0, len = navs.length; i < len; i += 10) {
          nav.push(navs.slice(i, i + 10))
        }
        console.log(nav, navs)
        that.setData({
          nav: nav,
          navs: navs
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          url: res.data,
        })
      },
    })
    // app.util.request({
    //   'url': 'entry/wxapp/QgType',
    //   'cachetime': '0',
    //   success: function (res) {
    //     var navbar = that.data.navbar.concat(res.data)
    //     console.log(res, navbar)
    //     that.setData({
    //       navbar: navbar,
    //     })
    //   },
    // })
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
      this.reLoad();
    }
    else {
    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})