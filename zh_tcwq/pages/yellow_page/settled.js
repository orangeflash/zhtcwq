// zh_zbkq/pages/my/txzl.js
var app = getApp();
var util = require('../../utils/util.js');
var imgArray = [], imgArray1 = [], lbimgArray = [], lbimgArray1 = [], imglogo = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    index_two: 0,
    zsnum: 0,
    lbimages1: [],
    images1: [],
    logo: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: '入驻' + getApp().xtxx.hy_title,
    })
    imgArray = [], imgArray1 = [], lbimgArray = [], lbimgArray1 = [];
    var is_tel = wx.getStorageSync('System').is_tel;
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        if (res.data.state == 2) {
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
      },
    })
    var user_info = wx.getStorageSync('users')
    var that = this;
    console.log(user_info)
    console.log(getApp().imglink, getApp().getuniacid)
    var link = wx.getStorageSync('url')
    // 商家行业分类
    app.util.request({
      'url': 'entry/wxapp/yellowType',
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
        that.setData({
          nav: store_type_one,
          store: store,
          link: link,
          is_tel: is_tel,
          user_info: user_info
        })
        app.util.request({
          'url': 'entry/wxapp/yellowType2',
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
    app.util.request({
      'url': 'entry/wxapp/YellowSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
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
        var array = []
        for (let i in res.data) {
          var yellow_set = res.data
          if (res.data[i].money == 0) {
            res.data[i].money1 = '免费'
          } else {
            res.data[i].money1 = res.data[i].money + '元'
          }
          res.data[i].text = res.data[i].days + '天' + ' ' + res.data[i].money1
        }
        res.data.map(function (item) {
          var obj = {}
          obj.value = item.text
          obj.name = item.id
          array.push(obj)
        })
        console.log(array)
        array[0].checked = true
        that.setData({
          items: array,
          yellow_set: yellow_set,
          rz_type: array[0].name
        })
      }
    })
    var url = wx.getStorageSync("url2")
    console.log(link)
    this.setData({
      url: url,
      hy_title: getApp().xtxx.hy_title,
      link: link
    })
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this
    var store = that.data.store
    var index = e.detail.value
    this.setData({
      index: index,
      index_two: 0
    })
    console.log(store[index].id)
    app.util.request({
      'url': 'entry/wxapp/yellowType2',
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
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index_two: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      rz_type: e.detail.value
    })
  },
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
            var logo = that.data.logo
            logo[0] = res.data
            that.setData({
              logo: logo
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
      }
    })
  },
  lbdelete1: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var logo = that.data.logo;
    logo.splice(index, 1)
    console.log(logo)
    that.setData({
      logo: logo
    })
  },
  gongg: function (e) {
    console.log(e.detail.value)
    var zsnum = parseInt(e.detail.value.length);
    this.setData({
      zsnum: zsnum
    })
  },
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
        that.setData({
          address: res.address,
          start_lat: res.latitude,
          start_lng: res.longitude
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var city = wx.getStorageSync('city')
    var name = e.detail.value.name
    var tel = e.detail.value.tel
    var details = e.detail.value.details
    var address = e.detail.value.address
    var title = ''
    var logo = that.data.logo
    var yellow_set = that.data.yellow_set
    var items = that.data.items
    var coordinates = that.data.start_lat + ',' + that.data.start_lng
    console.log(coordinates)
    // 获取分类id
    var store = that.data.store, store2 = that.data.store2;
    var nav = that.data.nav
    var index = that.data.index, index_two = that.data.index_two;
    var type_name = nav[index], store_type_two=store2[index_two];
    if (that.data.is_tel == 2) {
      var num = 1
    } else {
      var num = that.data.num
    }
    for (let i in store) {
      if (store[i].type_name == type_name) {
        var type_id = store[i].id
      }
    }
    if (store2.length > 0) {
      var storetype2_id = store2[index_two].id
    }
    else {
      var storetype2_id = ''
    }
    console.log(store, store2, store_type_two, type_id,storetype2_id)
    var rz_type = that.data.rz_type
    for (let i in yellow_set) {
      if (yellow_set[i].id == rz_type) {
        console.log(yellow_set[i].money)
        var money = Number(yellow_set[i].money)
      }
    }
    console.log(yellow_set)
    console.log(that.data.rz_type)
    console.log(logo[0])
    if (name == '') {
      title = '公司名称不能为空'
    } else if (tel == '') {
      title = '公司电话不能为空'
    } else if (details == '') {
      title = '公司简介不能为空'
    } else if (address == null || address == '') {
      title = '请正确填写公司地址'
    } else if (logo.length == 0) {
      title = '请上传公司logo'
    } else if (num == null) {
      title = '还没进行手机号验证'
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
      logo = logo[0]
      var user_id = wx.getStorageSync("users").id
      var openid = wx.getStorageSync("openid")
      if (money > 0) {
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
        app.util.request({
          'url': 'entry/wxapp/Pay',
          'cachetime': '0',
          data: { openid: openid, money: money },
          success: function (res) {
            console.log(res)
            wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': res.data.signType,
              'paySign': res.data.paySign,
              'success': function (res) {
                console.log('这里是支付成功')
                app.util.request({
                  'url': 'entry/wxapp/fx',
                  'cachetime': '0',
                  data: { user_id: user_id, money: money },
                  success: res => {
                    console.log(res)
                  }
                })
                console.log(res)
                app.util.request({
                  'url': 'entry/wxapp/YellowPage',
                  'cachetime': '0',
                  data: {
                    user_id: user_id,
                    logo: logo,
                    company_name: name,
                    company_address: address,
                    type_id: type_id,
                    type2_id: storetype2_id,
                    link_tel: tel,
                    rz_type: rz_type,
                    coordinates: coordinates,
                    content: details,
                    imgs: '',
                    tel2: num,
                    cityname: city
                  },
                  success: function (res) {
                    console.log(res)
                    app.util.request({
                      'url': 'entry/wxapp/SaveHyPayLog',
                      'cachetime': '0',
                      data: { hy_id: res.data,money:money },
                      success: res => {
                        console.log(res)

                      }
                    })
                    wx.showModal({
                      title: '提示',
                      content: '提交成功等待审核',
                    })
                    setTimeout(function () {
                      wx: wx.navigateBack({
                        delta: 1,
                      })
                    }, 2000)
                  }
                })
              },
              'fail': function (res) {
                console.log('这里是支付失败')
                console.log(res)
                wx.showToast({
                  title: '支付失败',
                  duration: 1000
                })
              },
            })
          },
        })
      } else {
        app.util.request({
          'url': 'entry/wxapp/YellowPage',
          'cachetime': '0',
          data: {
            user_id: user_id,
            logo: logo,
            company_name: name,
            company_address: address,
            type_id: type_id,
            type2_id: storetype2_id,
            link_tel: tel,
            rz_type: rz_type,
            coordinates: coordinates,
            content: details,
            imgs: '',
            tel2: num,
            cityname: city
          },
          success: function (res) {
            console.log(res)
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
              wx: wx.navigateBack({
                delta: 1,
              })
            }, 2000)
          }
        })
      }
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
})