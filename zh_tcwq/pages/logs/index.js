// pages/settled/settled.js
var app = getApp()
var imgArray = []
var uploaded = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden1: false,
    hidden2: true,
    hidden3: true,
    index_two: 0,
    prompt: false,
    choise: false,
    images: [],
    upload_img: [],
    upload_img_length: 0,
    getmsg: "获取验证码",
    tel_code: false,
    items: [
      { name: '刷卡支付', value: '刷卡支付' },
      { name: '免费wifi', value: '免费wifi' },
      { name: '免费停车', value: '免费停车' },
      { name: '禁止吸烟', value: '禁止吸烟' },
      { name: '提供包间', value: '提供包间' },
      { name: '沙发休闲', value: '沙发休闲' },
    ],
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  // 年费的icon选择事件
  cost1: function (e) {
    var that = this;
    console.log(that.data)
    console.log(e)
    var store_info = that.data.store_info
    if (store_info.time_over == 2) {
      wx: wx.showModal({
        title: '提示',
        content: '入驻时间不可以修改喔',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      var stick = that.data.stick
      var index = e.currentTarget.id
      for (let i in stick) {
        if (i == index) {
          stick[i].hidden1 = false
        } else {
          stick[i].hidden1 = true
        }
      }
      that.setData({
        stick: stick,
        type: stick[index].type,
        inmoney: stick[index].money
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    console.log(prevPage)
    prevPage.setData({
      Return: true
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    console.log(that.data)

    // ----------------------------------动态改变顶部导航栏的颜色----------------------------------
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff',
    //   backgroundColor: wx.getStorageSync('platform_color'),
    //   animation: {
    //     duration: 0,
    //     timingFunc: 'easeIn'
    //   }
    // })
    // ----------------------------------保存上传图片所需要的网址---------------------------
    var url = wx.getStorageSync("url2")
    var url1 = wx.getStorageSync("url")
    // ----------------------------------获取用户openid----------------------------------
    var openid = wx.getStorageSync("openid")
    // ----------------------------------获取用户id----------------------------------
    var user_id = options.user_id
    console.log('用户的openid为' + ' ' + openid + ' ' + '用户的user_id为' + ' ' + user_id)
    that.setData({
      user_id: user_id,
      openid: openid,
      url: url,
      url1: url1
    })



    //----------------------------------查看是否已经入驻过----------------------------------
    app.util.request({
      'url': 'entry/wxapp/MyStore',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data == false) {
          that.setData({
            mystore: true
          })
        } else {
          if (res.data.img == '') {
            res.data.img = [];
          }
          else {
            res.data.img = res.data.img.split(",")
          }
          if (res.data.ad == '') {
            res.data.ad = [];
          }
          else {
            res.data.ad = res.data.ad.split(",")
          }
          // res.data.img = res.data.img.split(",")
          // res.data.ad = res.data.ad.split(",")
          for (let i in res.data.ad) {
            imgArray.push(res.data.ad[i])
          }
          for (let i in res.data.img) {
            uploaded.push(res.data.img[i])
          }
          console.log(imgArray)
          console.log(uploaded)
          var items = that.data.items
          var store_info = res.data
          if (store_info.time_over == 1) {
            wx: wx.showModal({
              title: '提示',
              content: '您的入驻已经到期了喔,赶紧去续费吧',
              showCancel: true,
              cancelText: '取消',
              confirmText: '确定',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
          store_info.yy_time = store_info.yy_time.split("-")
          console.log(store_info.yy_time)
          // 酒店设施
          for (var i = 0; i < items.length; i++) {
            if (items[i].value == '刷卡支付') {
              if (store_info.skzf == 1) {
                items[i].checked = true
              } else {
                items[i].checked = false
              }
            } else if (items[i].value == '免费wifi') {
              if (store_info.wifi == 1) {
                items[i].checked = true
              } else {
                items[i].checked = false
              }
            } else if (items[i].value == '免费停车') {
              if (store_info.mftc == 1) {
                items[i].checked = true
              } else {
                items[i].checked = false
              }
            } else if (items[i].value == '禁止吸烟') {
              if (store_info.jzxy == 1) {
                items[i].checked = true
              } else {
                items[i].checked = false
              }
            } else if (items[i].value == '提供包间') {
              if (store_info.tgbj == 1) {
                items[i].checked = true
              } else {
                items[i].checked = false
              }
            } else if (items[i].value == '沙发休闲') {
              if (store_info.sfxx == 1) {
                items[i].checked = true
              } else {
                items[i].checked = false
              }
            }
          }
          console.log(items)
          var coordinates = store_info.coordinates//经纬度
          var business_address = store_info.address//详细地址
          that.setData({
            time: store_info.start_time,
            time1: store_info.end_time,
            store_info: store_info,
            address: business_address,
            coordinates: coordinates,
            lunbo_len: imgArray.length,
            imgArray: imgArray,
            items: items,
            type: store_info.type,
            uploaded: uploaded,
            upload_img_length: uploaded.length,
            upload_img: res.data.img,
            hotel_logo: store_info.logo,
            wechat: store_info.weixin_logo,
          })
          //----------------------------------获取区域集合----------------------------------
          app.util.request({
            'url': 'entry/wxapp/Area',
            'cachetime': '0',
            success: function (res) {
              console.log(res)
              for (let i in res.data) {
                if (res.data[i].id == store_info.area_id) {
                  that.setData({
                    inde: i
                  })
                }
              }
              var list = []
              res.data.map(function (item) {
                var obj = {}
                obj = item.area_name
                list.push(obj)
              })
              console.log(list)

              that.setData({
                area: res.data,
                city: list
              })
            },
          })
          //----------------------------------获取行业分类----------------------------------
          app.util.request({
            'url': 'entry/wxapp/StoreType',
            'cachetime': '0',
            success: function (res) {
              console.log(res)
              var store = res.data
              var store_type_one = []
              store.map(function (item) {
                var arr = {}
                arr = item.type_name
                store_type_one.push(arr)
              })
              console.log(store_type_one)
              console.log(that.data)
              var type_name = store_info.type_name
              for (let i in store_type_one) {
                if (store_type_one[i] == type_name) {
                  console.log(store_type_one[i])
                  that.setData({
                    index: i
                  })
                }
              }
              that.setData({
                store: store,
                store_type: store_type_one
              })
              app.util.request({
                'url': 'entry/wxapp/StoreType2',
                'cachetime': '0',
                data: { type_id: store_info.storetype_id },
                success: function (res) {
                  console.log(res)
                  var store_type_two = []
                  res.data.map(function (item) {
                    var arr = {}
                    arr = item.name
                    store_type_two.push(arr)
                  })
                  var type2_name = store_info.type2_name
                  for (let i in store_type_two) {
                    if (store_type_two[i] == type2_name) {
                      console.log(store_type_two[i])
                      that.setData({
                        index_two: i
                      })
                    }
                  }
                  that.setData({
                    store2: res.data,
                    store_type_two: store_type_two
                  })
                },
              })
            }
          })
          // -------------------------------获取置顶费用-------------------------
          app.util.request({
            'url': 'entry/wxapp/InMoney',
            'cachetime': '0',
            success: res => {
              console.log(res);
              var stick = res.data
              for (let i in stick) {
                stick[i].hidden1 = true
                if (stick[i].money != 0) {
                  stick[i].money1 = '（收费' + stick[i].money + '元）'
                } else {
                  stick[i].money1 = '  免费'
                }
                if (stick[i].type == 1) {
                  stick[i].array = '一周' + stick[i].money1
                } else if (stick[i].type == 2) {
                  stick[i].array = '半年' + stick[i].money1
                } else if (stick[i].type == 3) {
                  stick[i].array = '一年' + stick[i].money1
                }
                if (stick[i].type == store_info.type) {
                  var type = stick[i].type
                  var inmoney = stick[i].money
                  stick[i].hidden1 = false
                }
              }
              that.setData({
                stick: stick,
                type: type,
                inmoney: inmoney
              })
            }
          })
        }
      },
    })
    // ---------------------------------查看是否开启短信验证---------------------
    app.util.request({
      'url': 'entry/wxapp/IsSms',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        if (res.data == 1) {
          that.setData({
            send: false,
            sms: true,
            tel_code: false
          })
        } else {
          that.setData({
            send: true,
            sms: false,
            tel_code: false
          })
        }
      }
    })
  },
  // ----------------------------------0  获取用户输入的手机号
  user_name: function (e) {
    var that = this
    console.log(e)
    var name = e.detail.value
    that.setData({
      name: name
    })
  },
  // ----------------------------------0  获取用户输入的验证码
  user_code: function (e) {
    var that = this
    console.log(e)
    var yz_code = e.detail.value
    if (yz_code != that.data.num) {
      wx: wx.showToast({
        title: '验证码错误',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      that.setData({
        tel_code: true,
        yz_code: yz_code
      })
    }
  },
  // -------------------------------------------验证码----------------------------------
  sendmessg: function (e) {
    var that = this
    console.log(that.data)
    var name = that.data.name
    if (name == '' || name == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      if (that.data.getmsg=='获取验证码'){
        // 获取6位数的随机数
        var Num = "";
        for (var i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10);
        }
        console.log(Num)
        // 随机数传给后台
        app.util.request({
          'url': 'entry/wxapp/sms',
          'cachetime': '0',
          data: { code: Num, tel: name },
          success: function (res) {
            console.log(res)
          },
        })
        that.setData({
          num: Num
        })
        var time = 60
        // 60秒倒计时
        var inter = setInterval(function () {
          that.setData({
            getmsg: time + "s后重新发送",
            send: true
          })
          time--
          if (time <= 0) {
            // 停止倒计时
            clearInterval(inter)
            that.setData({
              getmsg: "获取验证码",
              send: false,
              num: 0
            })
          }
        }, 1000)
      }
     
    }

  },
  // -------------------------------获取微信绑定的手机号-------------------------------
  getPhoneNumber: function (e) {
    var that = this
    var sessionKey = wx.getStorageSync('key')
    var iv = e.detail.iv
    var data = e.detail.encryptedData
    console.log(sessionKey)
    console.log(iv)
    console.log(data)
    app.util.request({
      'url': 'entry/wxapp/jiemi',
      'cachetime': '0',
      data: { sessionKey: sessionKey, iv: iv, data: data },
      success: function (res) {
        console.log(res)
        that.setData({
          num: res.data.phoneNumber,
          tel_code:true
        })
      },
    })
  },
  // ----------------------------------选择营业时间----------------------------------
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindTimeChange1: function (e) {
    var that = this
    var time = that.data.time
    var time1 = e.detail.value
    if (time1 == "00：00") {
      wx: wx.showModal({
        title: '提示',
        content: '营业结束时间不能为00:00',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (time1 <= time) {
      wx: wx.showModal({
        title: '提示',
        content: '营业结束时间不能为小于或等于营业开始时间',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      this.setData({
        time1: e.detail.value
      })
    }

  },
  // ----------------------------------选择具体地址和经纬度----------------------------------
  add: function (e) {
    var that = this
    wx.chooseLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        var coordinates = res.latitude + ',' + res.longitude
        var store_info = that.data.store_info
         store_info.address = res.address
         store_info.coordinates = coordinates
        that.setData({
          store_info: store_info,
          address :res.address
        })
      }
    })
  },
  // ----------------------------------选择行业分类----------------------------------
  bindPickerChanges: function (e) {
    var that = this
    var store = that.data.store
    var index = e.detail.value
    this.setData({
      index: index,
      index_two: 0
    })
    app.util.request({
      'url': 'entry/wxapp/StoreType2',
      'cachetime': '0',
      data: { type_id: store[index].id },
      success: function (res) {
        console.log(res)
        var store_type_two = []
        res.data.map(function (item) {
          var arr = {}
          arr = item.name
          store_type_two.push(arr)
        })
        that.setData({
          store2: res.data,
          store_type_two: store_type_two
        })
      },
    })
  },
  bindchange_two: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index_two: e.detail.value
    })
  },
  // 选----------------------------------选择所属区域----------------------------------
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      inde: e.detail.value
    })
  },
  // ----------------------------------选择店内设施----------------------------------
  choice: function (e) {
    this.setData({
      choice: true
    })
  },

  //  ----------------------------------删除商家上传的轮播图----------------------------------
  // delete1: function (e) {
  //   var that = this
  //   Array.prototype.indexOf = function (val) {
  //     for (var i = 0; i < this.length; i++) {
  //       if (this[i] == val) return i;
  //     }
  //     return -1;
  //   };
  //   Array.prototype.remove = function (val) {
  //     var index = this.indexOf(val);
  //     if (index > -1) {
  //       this.splice(index, 1);
  //     }
  //   };
  //   var inde = e.currentTarget.dataset.index,
  //     pictures = this.data.lunbo1;
  //   pictures.remove(pictures[inde]);
  //   console.log(pictures)
  //   that.setData({
  //     lunbo1: pictures,
  //     lunbo_len1: pictures.length
  //   })
  // },
  // ----------------------------------预览商家上传的轮播图----------------------------------
  previewImage: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      pictures = this.data.lunbo;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    })
  },
  // ----------------------------------预览商家上传的轮播图----------------------------------
  previewImage1: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,
      pictures = this.data.lunbo1;
    wx.previewImage({
      current: pictures[index],
      urls: pictures
    })
  },
  // ----------------------------------上传图片----------------------------------
  // lunbo: function (e) {
  //   var that = this
  //   var uniacid = wx.getStorageSync('uniacid')
  //   console.log(that.data)
  //   var tempFilePaths = that.data.lunbo
  //   if (tempFilePaths == null) {
  //     tempFilePaths = []
  //   } else {
  //     tempFilePaths = that.data.lunbo
  //   }
  //   var url = that.data.url
  //   wx.chooseImage({
  //     count: 9, // 默认9
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {
  //       console.log(res)
  //       Array.prototype.push.apply(tempFilePaths, res.tempFilePaths);
  //       if (tempFilePaths.length <= 9) {
  //         that.setData({
  //           lunbo: tempFilePaths,
  //           lunbo_len: tempFilePaths.length,
  //           log: true
  //         })
  //       } else {
  //         tempFilePaths = tempFilePaths.slice(0, 9)
  //         that.setData({
  //           lunbo: tempFilePaths,
  //           lunbo_len: tempFilePaths.length,
  //           log: true
  //         })
  //       }
  //     }
  //   })
  // },
  // ----------------------------------上传图片----------------------------------
  lunbo1: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    console.log(that.data)
    var tempFilePaths = that.data.lunbo
    if (tempFilePaths == null) {
      tempFilePaths = []
    } else {
      tempFilePaths = that.data.lunbo
    }
    var url = that.data.url
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        Array.prototype.push.apply(tempFilePaths, res.tempFilePaths);
        if (tempFilePaths.length <= 9) {
          that.setData({
            lunbo1: tempFilePaths,
            lunbo_len1: tempFilePaths.length,
            log: true
          })
        } else {
          tempFilePaths = tempFilePaths.slice(0, 9)
          that.setData({
            lunbo1: tempFilePaths,
            lunbo_len1: tempFilePaths.length,
            log: true
          })
        }
      }
    })
  },
  // ----------------------------------上传商家logo图片----------------------------------
  choose: function (e) {
    var that = this
    var url = that.data.url
    var uniacid = wx.getStorageSync("uniacid")
    console.log(url)
    console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              hotel_logo: res.data
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
      }
    })
  },
  // ----------------------------------上传老板微信图片----------------------------------
  choose1: function (e) {
    var that = this
    var url = that.data.url
    var uniacid = wx.getStorageSync("uniacid")
    var openid = wx.getStorageSync("openid")
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              wechat: res.data
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
      }
    })
  },

  // ----------------------------------封装上传图片函数----------------------------------
  checkboxChange: function (e) {
    var that = this
    console.log(e)
    var facilities = e.detail.value
    that.setData({
      facilities: facilities
    })
  },
  chooseImage2: function () {
    console.log(imgArray)
    var that = this,
      imgArray = that.data.imgArray;
    console.log(that.data)
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
          imgArray.push(resp.data)
          that.setData({
            imgArray: imgArray,
            lunbo_len: imgArray.length
          })
          console.log(i);
          console.log('上传商家轮播图时候提交的图片数组', imgArray)
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
    console.log(that.data)
    console.log(imgArray)
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
    var inde = e.currentTarget.dataset.index,
      pictures = this.data.images;
    imgArray.remove(imgArray[inde])
    pictures.remove(pictures[inde]);
    console.log(pictures)
    that.setData({
      images: pictures,
      imgArray: imgArray,
      lunbo_len: imgArray.length
    })
  },
  // ---------------------------------------商家介绍上传图片------------------------------
  upload_image: function () {
    var that = this
    uploaded = that.data.uploaded
    var uniacid = wx.getStorageSync('uniacid')
    var img_length = 9 - uploaded.length
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
          that.already({
            url1: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
            path1: tempFilePaths
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
  already: function (upload) {
    var that = this,
      j = upload.j ? upload.j : 0,
      success = upload.success ? upload.success : 0,
      fail = upload.fail ? upload.fail : 0;
    wx.uploadFile({
      url: upload.url1,
      filePath: upload.path1[j],
      name: 'upfile',
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          console.log(resp)
          success++;
          uploaded.push(resp.data)
          that.setData({
            uploaded: uploaded,
            upload_img_length: uploaded.length
          });
          console.log(j);
          console.log('上传商家介绍时候提交的图片数组', uploaded)
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
        console.log('fail:' + j + "fail:" + fail);
      },
      complete: () => {
        console.log(j);
        j++;
        if (j == upload.path1.length) {
          that.setData({
            upload_img: upload.path1
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {
          console.log(j);
          upload.j = j;
          upload.success = success;
          upload.fail = fail;
          that.already(upload);
        }

      }
    });
  },
  //  ----------------------------------删除商家上传的介绍图----------------------------------
  delete2: function (e) {
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
    var inde = e.currentTarget.dataset.index,
      pictures = this.data.upload_img;
    uploaded.remove(uploaded[inde])
    pictures.remove(pictures[inde]);
    console.log(pictures)
    that.setData({
      uploaded: uploaded,
      upload_img_length: uploaded.length
    })
  },
  // ----------------------------------提交表单验证----------------------------------
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)

    if (that.data.inmoney == null) {
      var inmoney = 0
    } else {
      var inmoney = Number(that.data.inmoney)
    }
    var type = that.data.type
    console.log(inmoney + ' ' + type)
    var store_id = that.data.store_info.id
    console.log(store_id)
    var openid = wx.getStorageSync("openid")
    // ----------------------------------选择的店内设施----------------------------------
    var facilities = that.data.facilities
    // ----------------------------------店铺logo----------------------------------
    var hotel_logo = that.data.hotel_logo
    // ----------------------------------老板微信----------------------------------
    var wechat = that.data.wechat
    // ---------------------------------商家名称----------------------------------
    var business_name = e.detail.value.business_name
    // ----------------------------------核销密码----------------------------------
    // var business_write_password = e.detail.value.business_write_password
    // ----------------------------------关键字----------------------------------
    var business_keyword = e.detail.value.business_keyword
    // ----------------------------------详细地址----------------------------------
    var business_address = e.detail.value.address
    // ----------------------------------营业时间----------------------------------
    var business_hours = that.data.time + '-' + that.data.time1
    var end_time = that.data.time1
    var start_time = that.data.time
    // ----------------------------------商家vr演示站点----------------------------------
    var vr_demo = e.detail.value.vr_demo
    // ----------------------------------联系电话----------------------------------
    var business_number = e.detail.value.business_number
    // ----------------------------------商家公告----------------------------------
    var business_notice = e.detail.value.business_notice
    // ----------------------------------补充说明----------------------------------
    var textarea = e.detail.value.textarea
    // ----------------------------------具体地址的经纬度----------------------------------
    var coordinates = that.data.store_info.coordinates
    // ----------------------------------行业分类----------------------------------
    var store = that.data.store, store2 = that.data.store2;
    var index = that.data.index, index_two = that.data.index_two;
    var store_type_one = store[index], store_type_two = store2[index_two]
    var storetype_id = store[index].id
    if (store2.length > 0) {
      var storetype2_id = store2[index_two].id
    }
    else {
      var storetype2_id = ''
    }
    console.log(store, store2, store_type_one, store_type_two, storetype_id, storetype2_id)
    var tel_code = that.data.tel_code
    var num = that.data.num
    var index_two = that.data.index_two

    // -----------------------------获取上传的轮播图集合
    var ad = imgArray.join(",")
    var img = uploaded.join(",")

    // ----------------------------------所属区域----------------------------------
    var region = that.data.city
    if (textarea == '' || textarea == null) {
      textarea = ''
    }
    if (that.data.sms == false) {

    }
    // ----------------------------------判断哪个模块没有输入----------------------------------
    var title = ''
    if (business_name == '') {
      title = '请输入商家名称'
    } else if (business_keyword == '') {
      title = '请输入关键字'
    } else if (business_address == '') {
      title = '请输入详细地址'
    }else if (business_number == '') {
      title = '请输入联系电话'
    } else if (start_time == '00:00') {
      title = '请输入营业开始时间'
    } else if (end_time == '00:00') {
      title = '请输入营业结束时间'
    }else if (business_notice == '') {
      title = '请输入公告说明'
    } else if (that.data.sms == false) {
        if(num==''){
          title='请进行手机号验证'
        }
    } else if (that.data.sms == true) {
      if (that.data.yz_code == null) {
        title = '请进行手机号验证'
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
      // 酒店设施
      var skzf = 0
      var wifi = 0
      var mftc = 0
      var jzxy = 0
      var tgbj = 0
      var sfxx = 0
      console.log(that.data.items)
      var items = that.data.items
      if (facilities == null) {
        for (let i in items) {
          if (items[i].checked == true) {
            if (items[i].value == '刷卡支付') {
              var skzf = 1
            } else if (items[i].value == '免费wifi') {
              var wifi = 1
            } else if (items[i].value == '免费停车') {
              var mftc = 1
            } else if (items[i].value == '禁止吸烟') {
              var jzxy = 1
            } else if (items[i].value == '提供包间') {
              var tgbj = 1
            } else if (items[i].value == '沙发休闲') {
              var sfxx = 1
            }
          }
        }
      } else {
        for (var i = 0; i < facilities.length; i++) {
          if (facilities[i] == '刷卡支付') {
            var skzf = 1
          } else if (facilities[i] == '免费wifi') {
            var wifi = 1
          } else if (facilities[i] == '免费停车') {
            var mftc = 1
          } else if (facilities[i] == '禁止吸烟') {
            var jzxy = 1
          } else if (facilities[i] == '提供包间') {
            var tgbj = 1
          } else if (facilities[i] == '沙发休闲') {
            var sfxx = 1
          }
        }
      }
      if (tel_code == true) {
        if (that.data.store_info.time_over == 2) {
          app.util.request({
            'url': 'entry/wxapp/UpdStore',
            'cachetime': '0',
            data: {
              id: store_id,
              user_id: that.data.user_id,
              store_name: business_name,
              address: business_address,
              announcement: business_notice,
              storetype_id: storetype_id,
              storetype2_id: storetype2_id,
              start_time: start_time,
              end_time: end_time,
              keyword: business_keyword,
              skzf: skzf,
              wifi: wifi,
              mftc: mftc,
              jzxy: jzxy,
              tgbj: tgbj,
              sfxx: sfxx,
              tel: business_number,
              logo: hotel_logo,
              weixin_logo: wechat,
              ad: ad,
              img: img,
              money: money,
              details: textarea,
              coordinates: coordinates,
              vr_link: vr_demo
            },
            success: function (res) {
              console.log('这里是发布成功')
              console.log(res)
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
                  wx: wx.reLaunch({
                    url: '../logs/logs',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }, 1000)
              }

            }
          })
        } else {
          var money = inmoney
         if(money<=0){
           app.util.request({
             'url': 'entry/wxapp/UpdStore',
             'cachetime': '0',
             data: {
               id: store_id,
               user_id: that.data.user_id,
               store_name: business_name,
               address: business_address,
               announcement: business_notice,
               storetype_id: storetype_id,
               storetype2_id: storetype2_id,
               start_time: start_time,
               end_time: end_time,
               keyword: business_keyword,
               skzf: skzf,
               wifi: wifi,
               mftc: mftc,
               jzxy: jzxy,
               tgbj: tgbj,
               sfxx: sfxx,
               tel: business_number,
               logo: hotel_logo,
               weixin_logo: wechat,
               ad: ad,
               img: img,
               money: money,
               details: textarea,
               coordinates: coordinates,
               type: type,
               vr_link: vr_demo
             },
             success: function (res) {
               console.log('这里是发布成功')
               console.log(res)
               if (res.data == 1) {
                 wx: wx.showToast({
                   title: '入驻成功',
                   icon: '',
                   image: '',
                   duration: 2000,
                   mask: true,
                   success: function (res) { },
                   fail: function (res) { },
                   complete: function (res) { },
                 })
                 setTimeout(function () {
                   wx: wx.reLaunch({
                     url: '../logs/logs',
                     success: function (res) { },
                     fail: function (res) { },
                     complete: function (res) { },
                   })
                 }, 1000)
               }

             }
           })
         }else{
           app.util.request({
             'url': 'entry/wxapp/Pay',
             'cachetime': '0',
             data: { openid: openid, money: money },
             success: function (res) {
               wx.requestPayment({
                 'timeStamp': res.data.timeStamp,
                 'nonceStr': res.data.nonceStr,
                 'package': res.data.package,
                 'signType': res.data.signType,
                 'paySign': res.data.paySign,
                 'success': function (res) {
                   console.log('这里是支付成功')
                   console.log(res)
                   app.util.request({
                     'url': 'entry/wxapp/UpdStore',
                     'cachetime': '0',
                     data: {
                       id: store_id,
                       user_id: that.data.user_id,
                       store_name: business_name,
                       address: business_address,
                       announcement: business_notice,
                       storetype_id: storetype_id,
                       storetype2_id: storetype2_id,
                       start_time: start_time,
                       end_time: end_time,
                       keyword: business_keyword,
                       skzf: skzf,
                       wifi: wifi,
                       mftc: mftc,
                       jzxy: jzxy,
                       tgbj: tgbj,
                       sfxx: sfxx,
                       tel: business_number,
                       logo: hotel_logo,
                       weixin_logo: wechat,
                       ad: ad,
                       img: img,
                       money: money,
                       details: textarea,
                       coordinates: coordinates,
                       type: type,
                       vr_link: vr_demo
                     },
                     success: function (res) {
                       console.log('这里是发布成功')
                       console.log(res)
                       if (res.data == 1) {
                         wx: wx.showToast({
                           title: '入驻成功',
                           icon: '',
                           image: '',
                           duration: 2000,
                           mask: true,
                           success: function (res) { },
                           fail: function (res) { },
                           complete: function (res) { },
                         })
                         setTimeout(function () {
                           wx: wx.reLaunch({
                             url: '../logs/logs',
                             success: function (res) { },
                             fail: function (res) { },
                             complete: function (res) { },
                           })
                         }, 1000)
                       }

                     }
                   })
                 },

                 'fail': function (res) {
                   console.log(res);
                   wx.showToast({
                     title: '支付失败',
                     duration: 1000
                   })
                 },
               })
             },
           })
           
         }
        }
      } else {
        wx: wx.showToast({
          title: '手机验证错误',
          icon: '',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }


  },
  reset: function (e) {
    // this.onload()
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
    console.log(this.data)
    imgArray.splice(0, imgArray.length)
    uploaded.splice(0, uploaded.length)
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