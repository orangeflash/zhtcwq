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
      { name: '正品保证', value: '正品保证'},
      { name: '全程包邮', value: '全程包邮'},
      { name: '24h发货', value: '24h发货'},
      { name: '售后保障', value: '售后保障'},
      { name: '极速退款', value: '极速退款'},
      { name: '七天包退', value: '七天包退'},
    ],
    classification: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    var store_id = options.store_id
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var url = wx.getStorageSync("url2")
    var url1 = wx.getStorageSync("url")
    that.setData({
      url: url,
      url1: url1,
      store_id: store_id,
      id:id
    })
    var add = that.data.add
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
    app.util.request({
      'url': 'entry/wxapp/GoodInfo',
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log(res)
        if (res.data.good.imgs == '') {
          res.data.good.imgs = []
        }
        else {
          res.data.good.imgs = res.data.good.imgs.split(",")
        }
        var good = res.data.good
        res.data.good.lb_imgs = res.data.good.lb_imgs.split(",")
        imgArray1 = res.data.good.lb_imgs
        imgArray2 = res.data.good.imgs
        var items = that.data.items
        for (var i = 0; i < items.length; i++) {
          if (items[i].value == '正品保证') {
            if (good.quality == 1) {
              items[i].checked = true
            } else {
              items[i].checked = false
            }
          } else if (items[i].value == '全程包邮') {
            if (good.free == 1) {
              items[i].checked = true
            } else {
              items[i].checked = false
            }
          } else if (items[i].value == '24h发货') {
            if (good.all_day == 1) {
              items[i].checked = true
            } else {
              items[i].checked = false
            }
          } else if (items[i].value == '售后保障') {
            if (good.service == 1) {
              items[i].checked = true
            } else {
              items[i].checked = false
            }
          } else if (items[i].value == '极速退款') {
            if (good.refund == 1) {
              items[i].checked = true
            } else {
              items[i].checked = false
            }
          } else if (items[i].value == '七天包退') {
            if (good.weeks == 1) {
              items[i].checked = true
            } else {
              items[i].checked = false
            }
          }
        }
        console.log(items)
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
        var add = that.data.add
        if (result.length == 1) {
          var text1 = result[0].spec_name
        }
        if (result.length == 2) {
          var text1 = result[0].spec_name
          var text2 = result[1].spec_name
        }
        if (result.length == 3) {
          var text1 = result[0].spec_name
          var text2 = result[1].spec_name
          var text3 = result[2].spec_name
        }
        that.setData({
          add:result,
          spec: spec,
          store_good: res.data.good,
          items: items,
          imgArray1: imgArray1,
          imgArray2: imgArray2
        })
      },
    })
  },
  getIdDataSet: function (jsonArr) {
    let dataset = new Array();
    let len = jsonArr.length;
    for (let i = 0; i < len; i++) {
      dataset.push(jsonArr[i].coupons_id);
    }
    return dataset;
    console.log(dataset)
  },
  classify: function (origin, comp) {
    let received = new Array();
    let unreceive = new Array();
    let len = origin.length;
    for (let i = 0; i < len; i++) {
      if (comp.indexOf(origin[i].id) === -1) {
        unreceive.push(origin[i]);
      } else {
        received.push(origin[i]);
      }
    }
    console.log(received)
    console.log(unreceive)
    this.setData({
      received: received,
      unreceive: unreceive
    });
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
    if (index == 0) {
      if (text1 == null) {
        var text1 = name
        var id1 = id
      } else {
        var text1 = text1
        var id1 = id1
      }


    }
    if (index == 1) {
      if (text2 == null) {
        var text2 = name
        var id2 = id
      } else {
        var text2 = text2
        var id2 = id2
      }
    }
    if (index == 2) {
      if (text3 == null) {
        var text3 = name
        var id3 = id
      } else {
        var text3 = text3
        var id3 = id3
      }
    }
    that.setData({
      id1: id1,
      id2: id2,
      id3: id3,
      text1: text1,
      text2: text2,
      text3: text3,
      classification: false
    })
  },
  imgArray1: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    var img_length = 4 - imgArray1.length
    console.log(img_length)
    if (img_length > 0 && img_length <= 9) {
      // 选择图片
      wx.chooseImage({
        count: img_length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.showToast({
            icon: "loading",
            title: "正在上传"
          })
          var imgsrc = res.tempFilePaths;
          that.uploadimg({
            url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
            path: imgsrc
          });
        }
      })
    } else {
      wxd: wx.showModal({
        title: '上传提示',
        content: '最多上传4张图片',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
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
          that.setData({
            imgArray1: imgArray1
          })
          console.log('上传商家轮播图时候提交的图片数组', imgArray1)
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
            images: data.path
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
    var imgarr1 = that.data.imgArray1;
    console.log(imgarr1, imgArray1)
    imgarr1.splice(index, 1);
    imgArray1.splice(index, 1)
    console.log('删除imgarr1里的图片后剩余的图片', imgArray1)
    that.setData({
      imgArray1: imgarr1
    });
  },
  imgArray2: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    var img_length = 8 - imgArray2.length
    console.log(img_length)
    if (img_length > 0 && img_length <= 9) {
      // 选择图片
      wx.chooseImage({
        count: img_length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.showToast({
            icon: "loading",
            title: "正在上传"
          })
          var imgsrc = res.tempFilePaths;
          that.uploadimg1({
            url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
            path: imgsrc
          });
        }
      })
    } else {
      wxd: wx.showModal({
        title: '上传提示',
        content: '最多上传9张图片',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
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
          that.setData({
            imgArray2: imgArray2
          })
          console.log('上传商家轮播图时候提交的图片数组', imgArray1)
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
            images: data.path
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
    var imgarr2 = that.data.imgArray2;
    console.log(imgarr2, imgArray2)
    imgarr2.splice(index, 1);
    imgArray2.splice(index, 1)
    console.log('删除imgarr2里的图片后剩余的图片', imgArray2)
    that.setData({
      imgArray2: imgarr2
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
    var add = that.data.add
    var add2 = that.data.add2
    var add1 = that.data.add[id][index]
    for (let i in add) {
      for (let j in add[i]) {
        add[i][j].id = i
      }
    }
    add[id].push(add1)
    for (let i in add) {
      for (let j in add[i]) {
        add[i][j].id = i
      }
    }
    console.log(add)
    that.setData({
      add: add,
      len: add.length
    })
  },
  // ------

  // 动态添加大分类

  // --------
  add1: function (e) {
    var that = this
    console.log(that.data)
    var add = that.data.add
    var add2 = that.data.add2
    var add1 = that.data.add2[0]
    console.log(add1)
    if (add.length < 3) {
      add.push(add1)
      for (let i in add) {
        for (let j in add[i]) {
          add[i][j].id = i
        }
      }
      that.setData({
        add: add,
        len: add.length
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
    var add = that.data.add
    var index = e.currentTarget.dataset.index
    console.log(index)
    that.data.add.splice(index, 1)
    that.setData({
      add: that.data.add,
      len: add.length
    })
  },
  checkboxChange: function (e) {
    console.log(e)
    var that = this
    // var items = that.data.items
    var value = e.detail.value
    that.setData({
      check_box: value
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var spec =that.data.spec
    var spec_name = e.detail.value.spec_name
    var spec_num = e.detail.value.spec_num
    var spec_price = e.detail.value.spec_price
    var spec_freight = e.detail.value.spec_freight
    var spec_delivery = e.detail.value.spec_delivery
    var goods_details = e.detail.value.goods_details


    var check_box = that.data.check_box
    console.log(check_box)
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
      } if (check_box[i] == '极速退款') {
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
      var sz = []
      spec.map(function (item) {
        var arr = {}
        arr.name = item.name
        arr.money = item.money
        arr.num = item.num
        arr.spec_id = item.spec_id
        sz.push(arr)
      })
      console.log(sz)
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
      console.log(that.data.id)
      console.log(that.data.store_id)
      console.log(imgs)
      console.log(lb_imgs)
      console.log(spec_name)
      console.log(spec_num)
      console.log(spec_price)
      console.log(spec_freight)
      console.log(spec_delivery)
      console.log(goods_details)
      console.log(sz)
      console.log(quality)
      console.log(free)
      console.log(all_day)
      console.log(service)
      console.log(refund)
      console.log(weeks)
      app.util.request({
        'url': 'entry/wxapp/UpdGoods',
        'cachetime': '0',
        data: {
          good_id:that.data.id,
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
              title: '修改成功',
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