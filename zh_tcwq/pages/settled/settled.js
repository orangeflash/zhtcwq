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
    index: 0,
    inde: 0,
    index_two: 0,
    prompt: false,
    time: '00:00',
    time1: '00:00',
    choise: false,
    images: [],
    upload_img: [],
    lunbo_len: 0,
    upload_img_length: 0,
    getmsg: "获取验证码",
    tel_code: false,
    sms: false,
    fwxy: true,
    items: [
      { name: '刷卡支付', value: '刷卡支付' },
      { name: '免费wifi', value: '免费wifi' },
      { name: '免费停车', value: '免费停车' },
      { name: '禁止吸烟', value: '禁止吸烟' },
      { name: '提供包间', value: '提供包间' },
      { name: '沙发休闲', value: '沙发休闲' },
    ],
    facilities: [],
    countries: ["本地", "全国"],
    countryIndex: 0,
  },
  bindCountryChange: function (e) {
    var stick = this.data.stick, xzindex = this.data.xzindex || 0
    console.log('picker country 发生选择改变，携带值为', e.detail.value, stick, xzindex);
    var that = this;
    this.setData({
      countryIndex: e.detail.value,
      inmoney: e.detail.value == 0 ? stick[xzindex].money : stick[xzindex].money2,
    })
  },
  lookck: function () {
    wx.navigateTo({
      url: '../logs/system?rzxz=1',
    })
    // this.setData({
    //   fwxy: false
    // })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
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
    var cost = that.data.stick
    var index = e.currentTarget.id
    for (let i in cost) {
      if (i == index) {
        cost[i].hidden1 = false
      } else {
        cost[i].hidden1 = true
      }
    }
    that.setData({
      xzindex:index,
      stick: cost,
      type: cost[index].type,
      inmoney: that.data.countryIndex == 0 ? cost[index].money : cost[index].money2,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    // ----------------------------------保存上传图片所需要的网址---------------------------
    var url = wx.getStorageSync("url2")
    // ----------------------------------获取用户openid----------------------------------
    var openid = wx.getStorageSync("openid")
    // ----------------------------------获取用户id----------------------------------
    var user_id = wx.getStorageSync("users").id
    console.log('用户的openid为' + ' ' + openid + ' ' + '用户的user_id为' + ' ' + user_id)
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data.state == 1) {
          //----------------------------------查看是否已经入驻过----------------------------------
          app.util.request({
            'url': 'entry/wxapp/sjdlogin',
            'cachetime': '0',
            data: { user_id: user_id },
            success: function (res) {
              console.log(res)
              if (res.data == false) {
                that.setData({
                  mystore: true
                })
              } else {
                if (res.data.time_over == 2) {
                  wx: wx.showModal({
                    title: '提示',
                    content: '你已经入驻过了哦',
                    showCancel: true,
                    cancelText: '返回',
                    confirmText: '跳转首页',
                    success: function (res) {
                      wx: wx.reLaunch({
                        url: '../logs/logs',
                        success: function (res) { },
                        fail: function (res) { },
                        complete: function (res) { },
                      })
                    },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                } else if (res.data.time_over == 1) {
                  wx: wx.showModal({
                    title: '提示',
                    content: '你的入驻已到期，前往商家入口续费',
                  })
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../logs/logs',
                    })
                  }, 2000)
                }
              }
            },
          })
        } else {
          wx: wx.showModal({
            title: '提示',
            content: '您的账号异常，请尽快联系管理员',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) {
              wx: wx.navigateBack({
                delta: 1,
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }

      }
    })
    that.setData({
      user_id: user_id,
      openid: openid,
      url: url
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
            sms: true
          })
        } else {
          that.setData({
            send: true,
            sms: false,
            tel_code: true
          })
        }
      }
    })
    // ---------------------------------查看System---------------------
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          xtxx: res.data,
        })
      }
    })
    //----------------------------------获取行业分类----------------------------------
    app.util.request({
      'url': 'entry/wxapp/StoreType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '平台暂未添加行业分类，无法入驻',
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 2000)
        }
        var store = res.data
        var store_type_one = []
        store.map(function (item) {
          var arr = {}
          arr = item.type_name
          store_type_one.push(arr)
        })
        that.setData({
          store: store,
          store_type: store_type_one
        })
        app.util.request({
          'url': 'entry/wxapp/StoreType2',
          'cachetime': '0',
          data: { type_id: store[0].id },
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
      }
    })

    // -------------------------------获取置顶费用-------------------------
    app.util.request({
      'url': 'entry/wxapp/InMoney',
      'cachetime': '0',
      success: res => {
        console.log(res);
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '平台暂未添加入驻期限，无法入驻',
          })
          setTimeout(function () {
            wx.navigateBack({

            })
          }, 2000)
        }
        var stick = res.data
        for (let i in stick) {
          // if (stick[i].money > 0) {
          //   stick[i].money1 = '（收费'
          // } else {
          //   stick[i].money1 = '  免费'
          // }
          stick[i].money1 = '（收费'
          if (stick[i].type == 1) {
            stick[i].array = '一周' + stick[i].money1
            stick[i].hidden1 = false
          } else if (stick[i].type == 2) {
            stick[i].array = '半年' + stick[i].money1
            stick[i].hidden1 = true
          } else if (stick[i].type == 3) {
            stick[i].array = '一年' + stick[i].money1
            stick[i].hidden1 = true
          }
        }
        that.setData({
          stick: stick,
          type: stick[0].type,
          inmoney: that.data.countryIndex == 0 ? stick[0].money : stick[0].money2,
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.system.indexOf("iOS") != -1) {
          console.log('ios')
          that.setData({
            isios: true
          })
        }
        else {
          console.log('andr')
        }
      },
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
        that.setData({
          address: res.address,
          coordinates: coordinates
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
    console.log(store[index].id)
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
          store2:res.data,
          store_type_two: store_type_two
        })
      },
    })
  },
  bindchange_two: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
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
          num: res.data.phoneNumber
        })
      },
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
        that.setData({
          hotel_logo1: tempFilePaths
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
        that.setData({
          hotel_logo2: tempFilePaths
        })
      }
    })
  },
 // ----------------------------------上传老板微信图片----------------------------------
  choose2: function (e) {
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
              yyzz: res.data
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
        that.setData({
          hotel_logo3: tempFilePaths
        })
      }
    })
  },
  // ----------------------------------上传老板微信图片----------------------------------
  choose3: function (e) {
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
              sfzzm: res.data
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
        that.setData({
          hotel_logo4: tempFilePaths
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
    var that = this, images = this.data.images;
    imgArray = [];
    console.log(that.data)
    var uniacid = wx.getStorageSync('uniacid')
    var img_length = 9 - images.length
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
          console.log(tempFilePaths);
          var imgsrc = res.tempFilePaths;
          images = images.concat(imgsrc);
          console.log(images)
          that.setData({
            images: images,
            lunbo_len: images.length
          });
          that.uploadimg({
            url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
            path: images
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
      lunbo_len: pictures.length
    })
  },
  // ---------------------------------------商家介绍上传图片------------------------------
  upload_image: function () {
    var that = this
    var upload_img = this.data.upload_img
    uploaded = []
    console.log(upload_img)
    var uniacid = wx.getStorageSync('uniacid')
    var img_length = 9 - upload_img.length
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
          upload_img = upload_img.concat(tempFilePaths)
          console.log(upload_img)
          that.setData({
            upload_img: upload_img,
            upload_img_length: upload_img.length
          });
          that.already({
            url1: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
            path1: upload_img
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
            uploaded: uploaded
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
      upload_img: pictures,
      upload_img_length: pictures.length
    })
  },
  // ----------------------------------提交表单验证----------------------------------
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    var form_id = e.detail.formId
    var inmoney = Number(that.data.inmoney)
    var type = that.data.type
    console.log(inmoney + ' ' + type)
    var uniacid = wx.getStorageSync('uniacid')
    var openid = wx.getStorageSync("openid")
    // ----------------------------------选择的店内设施----------------------------------
    var facilities = that.data.facilities
    // ----------------------------------店铺logo----------------------------------
    var hotel_logo = that.data.hotel_logo
    // ----------------------------------老板微信----------------------------------
    var wechat = that.data.wechat
    // ----------------------------------营业执照----------------------------------
    var yyzz = that.data.yyzz
    // ----------------------------------老板微信----------------------------------
    var sfzzm = that.data.sfzzm
    // ---------------------------------商家名称----------------------------------
    var business_name = e.detail.value.business_name
    // ----------------------------------核销密码----------------------------------
    // var business_write_password = e.detail.value.business_write_password
    // ----------------------------------关键字----------------------------------
    var business_keyword = e.detail.value.business_keyword
    // ----------------------------------详细地址----------------------------------
    var business_address = e.detail.value.address
    // ----------------------------------营业时间----------------------------------
    var start_time = that.data.time
    var end_time = that.data.time1
    // ----------------------------------联系电话----------------------------------
    var business_number = e.detail.value.business_number
    // ----------------------------------商家公告----------------------------------
    var business_notice = e.detail.value.business_notice
    // ----------------------------------商家vr演示站点----------------------------------
    var vr_demo = e.detail.value.vr_demo
    if (vr_demo == null) {
      vr_demo = ''
    }
    // ----------------------------------补充说明----------------------------------
    var textarea = e.detail.value.textarea
    // ----------------------------------具体地址的经纬度----------------------------------
    var coordinates = that.data.coordinates
    // ----------------------------------行业分类----------------------------------
    var store = that.data.store,store2=that.data.store2;
    var index = that.data.index, index_two = that.data.index_two;
    var store_type_one = store[index], store_type_two=store2[index_two]
    if(store2.length>0){
      var storetype2_id = store2[index_two].id
    }
    else{
      var storetype2_id = ''
    }
    var storetype_id = store[index].id;
    var tel_code = that.data.tel_code
    console.log(store,store2,store_type_one, store_type_two,storetype_id,storetype2_id)
    var money = inmoney

    // -----------------------------获取上传的轮播图集合
    console.log(imgArray)
    console.log(uploaded)
    if (imgArray.length == 0) {
      var ad = ''
    } else {
      var ad = imgArray.join(",")
    }
    if (uploaded.length == 0) {
      var img = ''
    } else {
      var img = uploaded.join(",")
    }
    // ----------------------------------判断哪个模块没有输入----------------------------------
    var title = ''
    if (textarea == '' || textarea == null) {
      textarea = ''
    } 
    console.log(that.data,yyzz,sfzzm)
    if (business_name == '') {
      title = '请输入商家名称'
    } else if (business_keyword == '') {
      title = '请输入关键字'
    } else if (business_address == '') {
      title = '请输入详细地址'
    } else if (that.data.xtxx.is_dnss == '1' &&facilities == null) {
      title = '请勾选店内设施'
    } else if (that.data.xtxx.is_dnss == '1' &&facilities.length == 0) {
      title = '请勾选店内设施'
    } else if (that.data.xtxx.is_yysj == '1' &&start_time == '00:00') {
      title = '请输入营业开始时间'
    } else if (that.data.xtxx.is_yysj == '1' &&end_time == '00:00') {
      title = '请输入营业结束时间'
    } else if (business_number == '') {
      title = '请输入联系电话'
    } else if (business_notice == '') {
      title = '请输入公告说明'
    } else if (that.data.xtxx.is_img == '1' && yyzz == null) {
      title = '请上传营业执照照片'
    } else if (that.data.xtxx.is_img == '1' && sfzzm == null) {
      title = '请上传法人身份证正面照片'
    } else if (textarea.length >= 540) {
      title = '内容超出'
    } else if (that.data.sms == false) {
      if (that.data.num == null) {
        title = '请进行手机号验证'
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
      if (tel_code == true) {
        var cityname = that.data.countryIndex == 0 ? wx.getStorageSync('city') : '';
        console.log('city', cityname)
        that.setData({
          loading: true
        })
        wx.showLoading({
          title: "正在提交",
          mask: !0
        });
        // --------------------------------金额为0执行这一步
        if (money <= 0) {
          app.util.request({
            'url': 'entry/wxapp/store',
            'cachetime': '0',
            data: {
              user_id: that.data.user_id,
              store_name: business_name,
              address: business_address,
              announcement: business_notice,
              storetype_id: storetype_id,
              storetype2_id: storetype2_id,
              area_id: '',
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
              yyzz_img: yyzz,
              sfz_img: sfzzm,
              ad: ad,
              img: img,
              money: money,
              details: textarea,
              coordinates: coordinates,
              type: type,
              vr_link: vr_demo,
              cityname: cityname
            },
            success: function (res) {
              console.log('这里是发布成功')
              console.log(res)
              var store_id = res.data
              console.log(store_id)
              app.util.request({
                'url': 'entry/wxapp/rzmessage',
                'cachetime': '0',
                data: { form_id: form_id, openid: openid, store_id: store_id },
                success: function (res) {
                  console.log(res)
                },
              })
              // app.util.request({
              //   'url': 'entry/wxapp/SaveStorePayLog',
              //   'cachetime': '0',
              //   data: { store_id: store_id, money: money, note: '商家入驻' },
              //   success: function (res) {
              //     console.log('这是入驻成功')
              //     console.log(res)
              //   },
              // })
              wx.showModal({
                title: '提示',
                content: '提交成功，等待审核',
              })
              setTimeout(function () {
                wx: wx.reLaunch({
                  url: '../logs/logs',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }, 2000)
            }
          })
        } else {
          that.setData({
            loading: false
          })
          if (that.data.isios && that.data.xtxx.is_pgzf == '2') {
            wx.showModal({
              title: '暂不支持',
              content: '由于相关规范，iOS功能暂不可用',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#666'
            })
            return
          }
          // -----------------------------------有金额执行这一步-----------------------------------------
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
                    'url': 'entry/wxapp/store',
                    'cachetime': '0',
                    data: {
                      user_id: that.data.user_id,
                      store_name: business_name,
                      address: business_address,
                      announcement: business_notice,
                      storetype_id: storetype_id,
                      storetype2_id: storetype2_id,
                      area_id: '',
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
                      yyzz_img: yyzz,
                      sfz_img: sfzzm,
                      ad: ad,
                      money: money,
                      img: img,
                      details: textarea,
                      coordinates: coordinates,
                      type: type,
                      vr_link: vr_demo,
                      cityname: cityname
                    },
                    success: function (res) {
                      console.log('这里是发布成功')
                      console.log(res)
                      var store_id = res.data
                      app.util.request({
                        'url': 'entry/wxapp/rzmessage',
                        'cachetime': '0',
                        data: { form_id: form_id, openid: openid, store_id: store_id },
                        success: function (res) {
                          console.log(res)
                        },
                      })
                      app.util.request({
                        'url': 'entry/wxapp/SaveStorePayLog',
                        'cachetime': '0',
                        data: { store_id: store_id, money: money, note: '商家入驻' },
                        success: function (res) {
                          console.log('这是入驻成功')
                          console.log(res)
                          wx.showModal({
                            title: '提示',
                            content: '提交成功，等待审核',
                          })
                        },
                      })
                      app.util.request({
                        'url': 'entry/wxapp/fx',
                        'cachetime': '0',
                        data: { user_id: that.data.user_id, money: money },
                        success: res => {
                          console.log(res)
                        }
                      })
                      setTimeout(function () {
                        wx: wx.reLaunch({
                          url: '../logs/logs',
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                      }, 2000)
                    }
                  })
                },

                'fail': function (res) {
                  console.log(res);
                  wx.showToast({
                    title: '支付失败',
                    duration: 1000
                  })
                  that.setData({
                    loading: false
                  })
                },
              })
            },
          })
        }
      } else {
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
    // wx.navigateBack({
    //   delta: 1
    // })
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