// zh_jd/pages/kefu/kefu.js
var app = getApp()
var imgArray = []
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: '编辑',
    })
    var url = wx.getStorageSync('url')
    var url1 = wx.getStorageSync("url2")
    var id = options.id
    that.setData({
      url: url,
      url1: url1,
      id: id
    })
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
      return currentdate;
    }
    var time = getNowFormatDate()
    app.util.request({
      'url': 'entry/wxapp/PostInfo',
      'cachetime': '0',
      data: { id: id },
      success: function (res) {
        console.log(res)
        var post = res.data.tz
        post.dq_time = app.ormatDate(post.dq_time)
        if (post.dq_time >= time) {
          post.dq = true
        } else {
          post.dq_ = false
        }
        post.img = post.img.split(",")
        if (post.img != '') {
          for (let i in post.img) {
            imgArray.push(post.img[i])
          }
        }
        //---------------------------------- 获取置顶信息----------------------------------
        app.util.request({
          'url': 'entry/wxapp/Label',
          'cachetime': '0',
          data: { type2_id: post.type2_id },
          success: function (res) {
            for (let i in res.data) {
              res.data[i].click_class = 'selected1'
            }
            that.setData({
              label: res.data
            })
          },
        })
        that.setData({
          post: post,
          imgArray: imgArray
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Top',
      'cachetime': '0',
      success: function (res) {
        var stick = res.data
        for (let i in stick) {
          if (stick[i].type == 1) {
            stick[i].array = '置顶一天' + '（收费' + stick[i].money + '元）'
          } else if (stick[i].type == 2) {
            stick[i].array = '置顶一周' + '（收费' + stick[i].money + '元）'
          } else if (stick[i].type == 3) {
            stick[i].array = '置顶一月' + '（收费' + stick[i].money + '元）'
          }
        }
        var stock = []
        stick.map(function (item) {
          var arr = {}
          arr = item.array
          stock.push(arr)
        })
        stock.push('取消置顶')
        that.setData({
          stock: stock,
          stick: stick
        })
      },
    })
  },
  // 选择置顶期限
  radioChange: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  chooseImage2: function () {
    var that = this,
      imgArray = [];
    var uniacid = wx.getStorageSync('uniacid')
    var img_length = 9 - imgArray.length
    if (img_length > 0 && img_length <= 9) {
      // 选择图片
      wx.chooseImage({
        count: img_length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          wx.showToast({
            icon: "loading",
            title: "正在上传"
          })
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          that.uploadimg({
            url: that.data.url1 + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
            path: tempFilePaths
          });
        }
      })
    } else {
      wxd: wx.showModal({
        title: '上传提示',
        content: '最多上传9张图片',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
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
          success++;
          imgArray.push(resp.data)
          that.setData({
            imgArray: imgArray
          });
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
      },
      complete: () => {
        i++;
        if (i == data.path.length) {
          that.setData({
            imgArray: imgArray
          });
          wx.hideToast();
        } else {
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
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };
    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    var inde = e.currentTarget.dataset.index
    imgArray.remove(imgArray[inde])
    that.setData({
      imgArray: imgArray
    })
  },

  // ----------------------------------标签----------------------------------
  label: function (e) {
    var that = this
    var label = that.data.label
    var index = e.currentTarget.dataset.inde
    if (label[index].click_class == 'selected1') {
      label[index].click_class = 'selected2'
    } else if (label[index].click_class == 'selected2') {
      label[index].click_class = 'selected1'
    }
    that.setData({
      label: label
    })
  },
  // ----------------------------------选择具体地址和经纬度----------------------------------
  add: function (e) {
    var that = this
    wx.chooseLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        var coordinates = res.latitude + ',' + res.longitude
        var post = that.data.post
        post.address = res.address,
          post.coordinates = coordinates,
          that.setData({
            post: post
          })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    var post = that.data.post
    if (post.type_name == null) {
      var details = e.detail.value.content
      var name = post.user_name
      var tel = post.user_tel
    } else {
      var details = e.detail.value.content
      var name = e.detail.value.name
      var tel = e.detail.value.tel
    }
    var value = that.data.value
    var stick = that.data.stick
    if (value == '取消置顶' || value == null) {
      var type = 0
      var money = 0

    } else {
      for (let i in stick) {
        if (stick[i].array == value) {
          var type = stick[i].type
          var money = stick[i].money
        }
      }
    }
    console.log(type)
    console.log(money)
    var label = that.data.label
    var selected = []
    for (let i in label) {
      if (label[i].click_class == 'selected2') {
        selected.push(label[i])
      }
    }
    var sz = []
    selected.map(function (item) {
      var arr = {}
      arr.label_id = item.id
      sz.push(arr)
    })
    var id = that.data.id
    var img = '', cityname = wx.getStorageSync('city'), address = e.detail.value.address;
    img = imgArray.join(",");
    console.log(id, details, img, name, tel, address, cityname)
    app.util.request({
      'url': 'entry/wxapp/UpdPost',
      'cachetime': '0',
      data: {
        id: id,
        details: details,
        img: img,
        user_name: name,
        user_tel: tel,
        address: address,
        cityname:cityname
      },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          // -----------------------------------发布成功跳转到首页-----------------------------------------
          wx: wx.showToast({
            title: '修改成功',
            duration: 1000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          var pages = getCurrentPages();
          console.log(pages)
          if (pages.length > 1) {

            var prePage = pages[pages.length - 2];

            prePage.reload()
          }
          setTimeout(function () {
            wx: wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
      },
    })
    // if(money>0){
    //   var openid = wx.getStorageSync("openid")
    //   app.util.request({
    //     'url': 'entry/wxapp/Pay',
    //     'cachetime': '0',
    //     data: { openid: openid, money: money },
    //     success: function (res) {
    //       console.log(res)
    //       wx.requestPayment({
    //         'timeStamp': res.data.timeStamp,
    //         'nonceStr': res.data.nonceStr,
    //         'package': res.data.package,
    //         'signType': res.data.signType,
    //         'paySign': res.data.paySign,
    //         'success': function (res) {
    //           console.log('这里是支付成功')
    //           console.log(res)
    //           app.util.request({
    //             'url': 'entry/wxapp/UpdPost',
    //             'cachetime': '0',
    //             data: {
    //               id: id,
    //               details: details,
    //               img: img,
    //               user_id: post.user_id,
    //               user_name: name,
    //               user_tel: tel,
    //               type2_id: post.type2_id,
    //               type_id: post.type_id,
    //               money: post.money,
    //               top_type: type,
    //               sz: sz,
    //               address: post.address,
    //               hb_money: post.hb_money,
    //               hb_keyword: post.hb_keyword,
    //               hb_num: post.hb_num,
    //               hb_type: post.hb_type,
    //               hb_random: post.hb_random,
    //               cityname: post.cityname
    //             },
    //             success: function (res) {
    //               console.log(res)
    //               wx:wx.showToast({
    //                 title: '修改成功',
    //                 icon: '',
    //                 image: '',
    //                 duration: 2000,
    //                 mask: true,
    //                 success: function(res) {},
    //                 fail: function(res) {},
    //                 complete: function(res) {},
    //               })
    //               setTimeout(function(){
    //                 wx: wx.navigateBack({
    //                   delta: 1,
    //                 })
    //               },2000)
    //               // -----------------------------------发布成功跳转到首页-----------------------------------------

    //             },
    //           })
    //         },

    //         'fail': function (res) {
    //           console.log('这里是支付失败')
    //           console.log(res)
    //           wx.showToast({
    //             title: '支付失败',
    //             duration: 1000
    //           })
    //           // wx: wx.switchTab({
    //           //   url: '../../index/index',
    //           //   success: function (res) { },
    //           //   fail: function (res) { },
    //           //   complete: function (res) { },
    //           // })
    //         },
    //       })
    //     },
    //   })
    // }else{
    //   app.util.request({
    //     'url': 'entry/wxapp/UpdPost',
    //     'cachetime': '0',
    //     data: {
    //       id: id,
    //       details: details,
    //       img: img,
    //       user_id: post.user_id,
    //       user_name: name,
    //       user_tel: tel,
    //       type2_id: post.type2_id,
    //       type_id: post.type_id,
    //       money: post.money,
    //       top_type: type,
    //       sz: sz,
    //       address: post.address,
    //       hb_money: post.hb_money,
    //       hb_keyword: post.hb_keyword,
    //       hb_num: post.hb_num,
    //       hb_type: post.hb_type,
    //       hb_random: post.hb_random,
    //       cityname: post.cityname
    //     },
    //     success: function (res) {
    //       console.log(res)
    //       // -----------------------------------发布成功跳转到首页-----------------------------------------
    //       wx: wx.showToast({
    //         title: '修改成功',
    //         icon: '',
    //         image: '',
    //         duration: 2000,
    //         mask: true,
    //         success: function (res) { },
    //         fail: function (res) { },
    //         complete: function (res) { },
    //       })
    //       setTimeout(function () {
    //         wx: wx.navigateBack({
    //           delta: 1,
    //         })
    //       }, 2000)
    //     },
    //   })
    // }
    // if (post.type_name != null) {
    //   console.log('正常帖子')
    //   app.util.request({
    //     'url': 'entry/wxapp/UpdPost',
    //     'cachetime': '0',
    //     data: {
    //       id: id,
    //       details: details,
    //       img: img,
    //       user_id: post.user_id,
    //       user_name: name,
    //       user_tel: tel,
    //       type2_id: post.type2_id,
    //       type_id: post.type_id,
    //       money: post.money,
    //       top_type:type,
    //       sz: sz,
    //       address: post.address,
    //       hb_money: post.hb_money,
    //       hb_keyword: post.hb_keyword,
    //       hb_num: post.hb_num,
    //       hb_type: post.hb_type,
    //       hb_random: post.hb_random,
    //       cityname: post.cityname
    //     },
    //     success: function (res) {
    //       console.log(res)
    //       // -----------------------------------发布成功跳转到首页-----------------------------------------
    //       wx: wx.navigateBack({
    //         delta: 1,
    //       })
    //     },
    //   })
    // } else {
    //   console.log('不正常帖子')
    //   app.util.request({
    //     'url': 'entry/wxapp/UpdPost',
    //     'cachetime': '0',
    //     data: {
    //       store_id: post.store_id,
    //       details: details,
    //       img: img,
    //       user_id: post.user_id,
    //       user_name: post.user_name,
    //       user_tel: post.user_tel,
    //       type2_id: '',
    //       type_id: '',
    //       money: post.money,
    //       type: type,
    //       sz: sz,
    //       address: post.address,
    //       hb_money: post.hb_money,
    //       hb_keyword: post.hb_keyword,
    //       hb_num: post.hb_num,
    //       hb_type: post.hb_type,
    //       hb_random: post.hb_random,
    //       cityname: post.cityname
    //     },
    //     success: function (res) {
    //       console.log(res)
    //       // -----------------------------------发布成功跳转到首页-----------------------------------------
    //       wx: wx.navigateBack({
    //         delta: 1,
    //       })
    //     },
    //   })
    // }
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
    imgArray.splice(0, imgArray.length)
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
  // onShareAppMessage: function () {

  // }
})