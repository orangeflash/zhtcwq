// zh_tcwq/pages/sellerinfo/good_info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    index: 0,
    tabs2: ["商品信息"],
    select_spec:false,
    spec_index_one:0,
    spec_index:0,
    spec_index_two:0,
    money_one:0,
    money_two:0,
    money_three:0,
    num:1
  },
  openshare: function () {
    var page = this;
    page.setData({
      share_modal_active: "active",
    });
  },
  showShareModal: function () {
    var page = this;
    page.setData({
      share_modal_active: "active",
    });
  },
  shareModalClose: function () {
    var page = this;
    page.setData({
      share_modal_active: "",
    });
  },
  Demonstration: function (e) {
    wx: wx.navigateTo({
      url: '../car/car?goodid=' + this.data.store_good.id,
    })
  },
  cartaddformSubmit: function (e) {
    console.log('formid', e.detail.formId)
    var that = this, user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: { user_id: user_id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
    })
    var that=this
    var scene = decodeURIComponent(options.scene)
    if (options.id == null) {
      var id = scene
    }else{
      var id = options.id
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        // ---------------------------------- 异步保存网址前缀----------------------------------
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
        app.util.request({
          'url': 'entry/wxapp/StoreGoodCode',
          'cachetime': '0',
          data: {
            store_id: id
          },
          success: function (res) {
            console.log('这是商品的二维码')
            console.log(res)
            that.setData({
              shop_code: res.data
            })
            that.refresh()
          },
        })
      },
    })
    that.setData({
      id: id,
      logo:options.logo,
      system: wx.getStorageSync('System')
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
  refresh: function (e) {
    var that = this
    var id = that.data.id
    app.util.request({
      'url': 'entry/wxapp/GoodInfo',
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log(res)
        that.setData({
          store_id:res.data.good.store_id
        })
        res.data.good.imgs = res.data.good.imgs.split(",")
        res.data.good.lb_imgs = res.data.good.lb_imgs.split(",")
        // 商品的二维码
        var shop_code = that.data.shop_code
        // var shop_code = '../image/back.png'
        // 商品的logo
        var shop_logo = that.data.url + res.data.good.lb_imgs[0]
        console.log(shop_code)
        console.log(shop_logo)
        wx.downloadFile({
          url: shop_code, //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res.tempFilePath)
            that.setData({
              code_big: res.tempFilePath
            })
            wx.downloadFile({
              url: shop_logo, //仅为示例，并非真实的资源
              success: function (res) {
                console.log(res.tempFilePath)
                that.setData({
                  code_small: res.tempFilePath
                })

                // that.canvas()
                that.ctx()
              }
            })
          }
        })
        if(res.data.spec.length==0){
          var result = []

          that.setData({
            goods_cost: res.data.good.goods_cost,
            store_good: res.data.good,
            result: result,
          })
        }else{
          var spec = res.data.spec
          var jmap = {};
          var result = [];
          spec.forEach(function (al) {
            var key = al.spec_id + '_' + al.spec_name;
            if (typeof jmap[key] === 'undefined') {
              jmap[key] = [];
            }
            jmap[key].push(al);
          })

          var keys = Object.keys(jmap);
          for (var i = 0; i < keys.length; i++) {
            var rs = keys[i].split('_');
            result.push({ spec_id: rs[0], spec_name: rs[1], value: jmap[keys[i]] });
          }
          console.log(result)
          var goods_cost = Number(res.data.good.goods_cost)
          var price = 0
          if (result.length == 1) {
            var money1 = Number(result[0].value[0].money)
            var money2 = 0
            var money3 = 0
            that.setData({
              money1: money1,
              money2: money2,
              money3: money3
            })
          } else if (result.length == 2) {
            var money1 = Number(result[0].value[0].money)
            var money2 = Number(result[1].value[0].money)
            var money3 = 0
            that.setData({
              money1: money1,
              money2: money2,
              money3: money3
            })
          } else if (result.length == 3) {
            var money1 = Number(result[0].value[0].money)
            var money2 = Number(result[1].value[0].money)
            var money3 = Number(result[2].value[0].money)
            that.setData({
              money1: money1,
              money2: money2,
              money3: money3
            })
          }
          price = money1 + money2 + money3
          console.log(price)
          var goods_cost1 = (goods_cost + price).toFixed(2)
          console.log(goods_cost1)
          that.setData({
            result: result,
            goods_cost: goods_cost1 ,
            price: goods_cost,
            store_good: res.data.good,
          })
        }
       
      },
    })
  },
  add: function (e) {
    wx: wx.reLaunch({
      url: '../logs/logs',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 生成商品二维码图片
  ctx: function (e) {
    var that = this
    var a = that.data
    var width = a.width//屏幕宽度
    var height = a.height//屏幕高度
    var leiWid = (width - 150) / 2
    // 声明画布
    var ctx = wx.createCanvasContext('ctx')
    ctx.drawImage(a.code_big, 0, 0, 150, 150)
    ctx.save()
    ctx.beginPath()
    ctx.arc(75, 75, 35, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(a.code_small, 35, 35, 75, 75)
    ctx.restore()
    ctx.draw()
    setTimeout(function (e) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 150,
        height: 150,
        canvasId: 'ctx',
        success: function (res) {
          console.log(res.tempFilePath)
          that.setData({
            logos: res.tempFilePath
          })
        }
      })
    }, 500)
  },
  // ---------规格选择
  liji:function(e){
    this.setData({
      select_spec:true
    })
  },
  // 添加商品数量
  add_num: function (e) {
    var that = this  
    var num = that.data.num + 1
    var good_num = that.data.store_good.goods_num
    if (num < good_num){
      that.setData({
        num: num,
      })
    }else{
      that.setData({
        num: good_num,
      })
    }
    
  },
  // 减去商品数量
  subtraction: function (e) {
    var that = this
    var num = that.data.num
    num = num - 1
    if(num>1){
      that.setData({
        num: num,
      })
    }else{
      that.setData({
        num: 1,
      })
    }
    
  },
  // 商家详情和评论切换时间
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  
  order:function(e){
    var that = this
    console.log('formid', e.detail.formId)
    var that = this, user_id = wx.getStorageSync('users').id;
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: { user_id: user_id, form_id: e.detail.formId },
      success: function (res) {
        console.log(res.data)
      },
    })
    var result = that.data.result
    var store_good = that.data.store_good
    var store_id = that.data.store_id
    var price = that.data.goods_cost
    var num = that.data.num
    console.log(store_id)
    if(result.length==0){
      wx: wx.redirectTo({
        url: 'place_order?id=' + store_good.id + '&store_id=' + store_id + '&price=' + price + '&num=' + num ,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      if (result.length == 1) {
        var name1 = result[0].value[that.data.spec_index].name
        var name2 = 0
        var name3 = 0
      } else if (result.length == 2) {
        var name1 = result[0].value[that.data.spec_index].name
        var name2 = result[1].value[that.data.spec_index_one].name
        var name3 = 0
      } else if (result.length == 3) {
        var name1 = result[0].value[that.data.spec_index].name
        var name2 = result[1].value[that.data.spec_index_one].name
        var name3 = result[2].value[that.data.spec_index_two].name
      }
      wx: wx.redirectTo({
        url: 'place_order?id=' + store_good.id + '&store_id=' + store_id + '&price=' + price + '&num=' + num + '&name1=' + name1 + '&name2=' + name2 + '&name3=' + name3,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  // 选择商品规格
  select_spec:function(e){
    var select_spec = this.data.select_spec
    if (select_spec==false){
      this.setData({
        select_spec:true
      })
    }else{
      this.setData({
        select_spec: false
      })
    }
  },
  spec_index:function(e){
    var price = this.data.price
    var index = e.currentTarget.dataset.index
    var money = Number(e.currentTarget.dataset.price)
    var goods_cost = price + this.data.money2 + this.data.money3 + money
    this.setData({
      spec_index:index,
      money1: Number(money),
      goods_cost: goods_cost.toFixed(2)
    })
  },
  spec_index_one: function (e) {
    console.log(e)
    var price = this.data.price
    var index = e.currentTarget.dataset.index
    var money = Number(e.currentTarget.dataset.price)
    var goods_cost = price + this.data.money1 + this.data.money3 + money
    this.setData({
      spec_index_one: index,
      money2: Number(money),
      goods_cost: goods_cost.toFixed(2)
    })
  },
  spec_index_two: function (e) {
    console.log(e)
    var price = this.data.price
    var index = e.currentTarget.dataset.index
    var money = Number(e.currentTarget.dataset.price)
    var goods_cost = price + this.data.money2 + this.data.money1 + money
    this.setData({
      spec_index_two: index,
      money3: money,
      goods_cost: goods_cost.toFixed(2)
    })
  },
  canvas:function(e){
    var a = this.data
    wx.navigateTo({
      url: '../extra/canvas?url=' + a.url + '&id=' + a.id,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this, id = this.data.id, store_id = this.data.store_id;
    console.log(id, store_id)
    return {
      title: that.data.store_good.goods_name,
      path: '/zh_tcwq/pages/sellerinfo/good_info?id=' + id + '&store_id=' + store_id,
    }
  }
})