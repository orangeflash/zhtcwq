// zh_tcwq/pages/logs/publish .js
var app = getApp()
var imgArray1 = []
var imgArray2 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '正品保证', value: '正品保证' },
      { name: '全程包邮', value: '全程包邮' },
      { name: '24h发货', value: '24h发货' },
      { name: '售后保障', value: '售后保障' },
      { name: '极速退款', value: '极速退款' },
      { name: '七天包退', value: '七天包退' },
    ],
    spec: [
      {
        'text': '',
        'id': 0,
        'spec': [
          {
            'id': '0',
            'name': '',
            'price': '',
            'spec_id':''
          }
        ]
      }
    ],
    add_spec: false,
    spec1: [
      {
        'text': '',
        'id': 0,
        'spec': [
          {
            'id': '0',
            'name': '',
            'price': '',
            'spec_id': ''
          }
        ]
      }
    ],
    classification: false,
    imgarr1:[],
    imgarr2:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    imgArray1=[],imgArray2=[];
    console.log('onLoad')
    var that = this
    var store_id = options.store_id
    var url = wx.getStorageSync("url2")
    var url1 = wx.getStorageSync("url")
    that.setData({
      url: url,
      url1: url1,
      store_id: store_id
    })
    var add = that.data.add
    console.log(that.data.spec)
    app.util.request({
      'url': 'entry/wxapp/Spec',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          label: res.data
        })
      },
    })
  },
  // -----------------------选择分类
  classification: function (e) {
    var that = this
    console.log(e)
    var index = e.currentTarget.dataset.index
    var classification = that.data.classification
    if (classification == false) {
      that.setData({
        classification: true,
        index: index
      })
    } else {
      that.setData({
        classification: false,
        index: index
      })
    }

  },
  select: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var label = that.data.label
    var index = that.data.index
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    var add = that.data.add
    var text1 = that.data.text1
    var text2 = that.data.text2
    var text3 = that.data.text3
    var id1 = that.data.id1
    var id2 = that.data.id2
    var id3 = that.data.id3

    var spec = that.data.spec
    spec[index].text = name
    // for (let i in spec) {
    //   spec[index].spec_id = id
    // }
    spec[index].spec_id = id
    console.log(spec)
    that.setData({
      spec: spec,
      classification: false
    })
    // if (index == 0) {
    //   if (text1 == null) {
    //     var text1 = name
    //     var id1 = id
    //   } else {
    //     var text1 = text1
    //     var id1 = id1
    //   }


    // }
    // if (index == 1) {
    //   if (text2 == null) {
    //     var text2 = name
    //     var id2 = id
    //   } else {
    //     var text2 = text2
    //     var id2 = id2
    //   }
    // }
    // if (index == 2) {
    //   if (text3 == null) {
    //     var text3 = name
    //     var id3 = id
    //   } else {
    //     var text3 = text3
    //     var id3 = id3
    //   }
    // }
    // that.setData({
    //   id1: id1,
    //   id2: id2,
    //   id3: id3,
    //   text1: text1,
    //   text2: text2,
    //   text3: text3,
    //   classification: false
    // })
  },
  imgArray1: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    var imgarr1 = this.data.imgarr1;
    imgArray1=[];
    console.log(imgarr1)
      // 选择图片
      wx.chooseImage({
        count: 4-imgarr1.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.showToast({
            icon: "loading",
            title: "正在上传"
          })
          var imgsrc = res.tempFilePaths;
          imgarr1 = imgarr1.concat(imgsrc);
          that.uploadimg({
            url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
            path: imgarr1
          });
        }
      })
  },
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'upfile',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          console.log(resp)
          success++;
          imgArray1.push(resp.data)
          console.log('上传商品主图时候提交的图片数组', imgArray1)
        }
        else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;
        if (i == data.path.length) {
          that.setData({
            imgarr1: data.path
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  //  ----------------------------------删除商家上传的轮播图----------------------------------
  delete: function (e) {
    var that = this
    // Array.prototype.indexOf = function (val) {
    //   for (var i = 0; i < this.length; i++) {
    //     if (this[i] == val) return i;
    //   }
    //   return -1;
    // };
    // Array.prototype.remove = function (val) {
    //   var index = this.indexOf(val);
    //   if (index > -1) {
    //     this.splice(index, 1);
    //   }
    // };
    var index = e.currentTarget.dataset.index;
    var imgarr1 = that.data.imgarr1;
    console.log(imgarr1,imgArray1)
    imgarr1.splice(index, 1);
    imgArray1.splice(index, 1)
    console.log('删除imgarr1里的图片后剩余的图片', imgArray1)
    that.setData({
      imgarr1: imgarr1
    });
  },
  imgArray2: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    var imgarr2 = this.data.imgarr2;
    imgArray2 = [];
    console.log(imgarr2)
    // 选择图片
    wx.chooseImage({
      count: 8 - imgarr2.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        var imgsrc = res.tempFilePaths;
        imgarr2 = imgarr2.concat(imgsrc);
        that.uploadimg1({
          url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
          path: imgarr2
        });
      }
    })
  },
  uploadimg1: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'upfile',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          console.log(resp)
          success++;
          imgArray2.push(resp.data)
          console.log('上传商品详情页时候提交的图片数组', imgArray2)
        }
        else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;
        if (i == data.path.length) {
          that.setData({
            imgarr2: data.path
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg1(data);
        }

      }
    });
  },
  //  ----------------------------------删除商家上传的轮播图----------------------------------
  delete1: function (e) {
    var that = this
    // Array.prototype.indexOf = function (val) {
    //   for (var i = 0; i < this.length; i++) {
    //     if (this[i] == val) return i;
    //   }
    //   return -1;
    // };
    // Array.prototype.remove = function (val) {
    //   var index = this.indexOf(val);
    //   if (index > -1) {
    //     this.splice(index, 1);
    //   }
    // };
    var index = e.currentTarget.dataset.index;
    var imgarr2 = that.data.imgarr2;
    console.log(imgarr2,imgArray2)
    imgarr2.splice(index, 1);
    imgArray2.splice(index, 1)
    console.log('删除imgarr2里的图片后剩余的图片', imgArray2)
    that.setData({
      imgarr2: imgarr2
    });
  },
  // ------

  // 动态添加小分类

  // --------
  add: function (e) {
    var that = this
    console.log(that.data)
    console.log(e)
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var spec = that.data.spec
    console.log(spec)
    var spec_small = that.data.spec1[0].spec[0]
    console.log(id)
    spec[id].spec.push(spec_small)

    for (let i in spec) {
      for (let j in spec[i].spec) {
        spec[i].spec[j].id = spec[i].id
      }
    }
    console.log(spec)
    if (spec[id].spec.length > 3) {
      wx: wx.showModal({
        title: '提示',
        content: '只能添加三条子分类',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      that.setData({
        spec: spec
      })
    }
  },
  // ------

  // 动态添加大分类

  // --------
  add1: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    console.log(that.data)
    console.log(index)
    var spec = that.data.spec
    var add1 = that.data.spec1[0]
    console.log(add1)
    if (spec.length == 1) {
      console.log('只要一个')
      add1.id = 1
    } else if (spec.length == 2) {
      console.log('只要两个')
      add1.id = 2
    }
    spec.push(add1)
    for (let i in spec) {
      for (let j in spec[i].spec) {
        spec[i].spec[j].id = spec[i].id
      }
    }
    if (spec.length <= 3) {
      console.log(add1)
      console.log(spec)
      that.setData({
        spec: spec,
        len: spec.length
      })
    } else {
      wx: wx.showModal({
        title: '提示',
        content: '只能添加三条',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  add2: function (e) {
    var that = this
    console.log(e)
    var spec = that.data.spec
    var index = e.currentTarget.dataset.index
    console.log(index)
    // spec.splice(index, 1)
    spec.pop()
    console.log(spec)
    that.setData({
      spec: spec,
      len: spec.length
    })
  },
  checkboxChange: function (e) {
    console.log(e)
    var value = e.detail.value
    this.setData({
      check_box: value
    })
  },
  add_spec: function (e) {
    var that = this
    var add_spec = that.data.add_spec
    if (add_spec == false) {
      that.setData({
        add_spec: true
      })
    } else {
      that.setData({
        add_spec: false
      })
    }
  },
  delete_spec_small: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var spec = that.data.spec
    console.log(index)
    spec[id].spec.splice(1, 1)
    for (let i in spec) {
      for (let j in spec[i].spec) {
        spec[i].spec[j].id = spec[i].id
      }
    }
    that.setData({
      spec: spec
    })
  },

// ------------------------------------------

                                          //  第一条

// ----------------------------------------

  spec_0_0_name:function(e){
    console.log(e)
    var spec = this.data.spec
    spec[0].spec[0].name = e.detail.value
    this.setData({
      spec:spec
    })
  },
  spec_0_0_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[0].spec[0].price = e.detail.value
    this.setData({
      spec: spec
    })
  },

  spec_0_1_name: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[0].spec[1].name = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_0_1_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[0].spec[1].price = e.detail.value
    this.setData({
      spec: spec
    })
  },


  spec_0_2_name: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[0].spec[2].name = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_0_2_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[0].spec[2].price = e.detail.value
    this.setData({
      spec: spec
    })
  },
  // ------------------------------------------

  //  第二条

  // ----------------------------------------

  spec_1_0_name: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[1].spec[0].name = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_1_0_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[1].spec[0].price = e.detail.value
    this.setData({
      spec: spec
    })
  },


  spec_1_1_name: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[1].spec[1].name = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_1_1_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[1].spec[1].price = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_1_2_name: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[1].spec[2].name = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_1_2_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[1].spec[2].price = e.detail.value
    this.setData({
      spec: spec
    })
  },


  // ------------------------------------------

  //  第三条

  // ----------------------------------------

  spec_2_0_name: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[2].spec[0].name = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_2_0_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[2].spec[0].price = e.detail.value
    this.setData({
      spec: spec
    })
  },


  spec_2_1_name: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[2].spec[1].name = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_2_1_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[2].spec[1].price = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_2_2_name: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[2].spec[2].name = e.detail.value
    this.setData({
      spec: spec
    })
  },
  spec_2_2_price: function (e) {
    console.log(e)
    var spec = this.data.spec
    spec[2].spec[2].price = e.detail.value
    this.setData({
      spec: spec
    })
  },
  formSubmit: function (e) {
    console.log(e)
    console.log(imgArray1)
    console.log(imgArray2)
    var that = this
    console.log(that.data.spec)
    var spec_name = e.detail.value.spec_name
    var spec_num = e.detail.value.spec_num
    var spec_price = e.detail.value.spec_price
    var spec_freight = e.detail.value.spec_freight
    var spec_delivery = e.detail.value.spec_delivery
    var goods_details = e.detail.value.goods_details
    var check_box = that.data.check_box
    var spec =  that.data.spec
    for(let i in spec){
      for(let j in spec[i].spec){
        spec[i].spec[j].spec_id = spec[i].spec_id
        spec[i].spec[j].spec_name = spec[i].text
      }
    }
    console.log(spec)
    var spec_big = []
    for(let i in spec){
      spec_big = spec_big.concat(spec[i].spec)
    }
    console.log(spec_big)
    // 正品
    var quality = 2
    // 包邮
    var free = 2
    // 24小时发货
    var all_day = 2
    // 售后服务
    var service = 2
    // 急速退款
    var refund = 2
    // 7天包邮
    var weeks = 2
    for (let i in check_box) {
      if (check_box[i] == '正品保证') {
        quality = 1
      }
      if (check_box[i] == '全程包邮') {
        free = 1
      }
      if (check_box[i] == '24h发货') {
        all_day = 1
      }
      if (check_box[i] == '售后保障') {
        service = 1
      } if (check_box[i] == '急速退款') {
        refund = 1
      } if (check_box[i] == '七天包退') {
        weeks = 1
      }
    }
    var title = ''
    if (spec_name == '') {
      title = "商品名称不能为空"
    } else if (spec_price == '') {
      title = "商品价格不能为空"
    } else if (spec_num == '') {
      title = "商品数量不能为空"
    } else if (spec_freight == '') {
      title = "商品运费不能为空"
    } else if (spec_delivery == '') {
      title = "发货说明不能为空"
    } else if (imgArray1.length == 0) {
      title = "还没有上传商品图片哦"
    }else if(that.data.add_spec==true){
      for (let i in spec_big) {
        if (spec_big[i].spec_name == '') {
          title = '没有选择规格'
        } else if (spec_big[i].name==''){
          title='还有规格名字没输入'
        }else if (spec_big[i].price == '') {
          title = '还有规格价格没输入'
        }
      }
    }
    if (title != '') {
      wx: wx.showModal({
        title: '提示',
        content: title,
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      
      if (that.data.add_spec == true) {
        var sz = []
        spec_big.map(function (item) {
          var arr = {}
          arr.name = item.name
          arr.money = item.price
          arr.spec_id = item.spec_id
          sz.push(arr)
        })
        console.log(sz)
      } else {
        var sz = []
        
      }
      if (imgArray1.length > 0) {
        var lb_imgs = imgArray1.join(",")
      } else {
        lb_imgs = ""
      }
      if (imgArray2.length > 0) {
        var imgs = imgArray2.join(",")
      } else {
        imgs = ""
      }
      console.log(lb_imgs)
      console.log(imgs)
      app.util.request({
        'url': 'entry/wxapp/AddGoods',
        'cachetime': '0',
        data: {
          store_id: that.data.store_id,
          imgs: imgs,
          lb_imgs: lb_imgs,
          goods_name: spec_name,
          goods_num: spec_num,
          goods_cost: spec_price,
          freight: spec_freight,
          delivery: spec_delivery,
          goods_details: goods_details,
          sz: sz,
          quality: quality,
          free: free,
          all_day: all_day,
          service: service,
          refund: refund,
          weeks: weeks,
        },
        success: function (res) {
          console.log(res)
          // -----------------------------------发布成功跳转到首页-----------------------------------------
          if (res.data == 1) {
            wx: wx.showToast({
              title: '发布成功',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
            setTimeout(function () {
             wx:wx.navigateBack({
               delta: 1,
             })
            }, 2000)
          }
        },
      })

    }
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // imgArray1.splice(0, imgArray1.length)
    // imgArray2.splice(0, imgArray2.length)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // imgArray1.splice(0, imgArray1.length)
    // imgArray2.splice(0, imgArray2.length)
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