// zh_tcwq/pages/shun/shunfabu/shunfabu.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shunfabu: ['人找车', '车找人', '车找货', '货找车'],
    index: 0,
    arr_index: 0,
    array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    icon_hidden: false,
    duty: true,
    money: '0',
    time: '00:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    app.setNavigationBarColor(this);
    var system = wx.getStorageSync('System')
    console.log(system)
    var that = this
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
    var time = getNowFormatDate().slice(0, 11)
    var type_name = ''
    if (options.id == 0) {
      type_name = '人找车'
    } else if (options.id == 1) {
      type_name = '车找人'
    } else if (options.id == 2) {
      type_name = '车找货'
    } else if (options.id == 3) {
      type_name = '货找车'
    }
    // 查看列表所属标签
    app.util.request({
      'url': 'entry/wxapp/CarTag',
      'cachetime': '0',
      data: { typename: type_name },
      success: res => {
        console.log(res)
        for (let i in res.data) {
          res.data[i].click_class = 'select1'
        }
        that.setData({
          label: res.data
        })
      }
    })
    that.setData({
      date: time,
      id: options.id,
      type_name: type_name,
      money: system.pc_money,
      system: system,
      pc_xuz: system.pc_xuz
    })

  },
  // -------------------选择标签----------------
  changeColor: function (e) {
    var that = this
    console.log(e)
    var id = e.currentTarget.id
    var label = that.data.label
    for (let i in label) {
      // if(id==i){
      //   if (label[id].click_class == 'select1') {
      //     label[id].click_class = 'select2'
      //   } else {
      //     label[i].click_class = 'select1'
      //   }
      // }else{
      //   label[i].click_class = 'select1'
      // }

    }
    if (label[id].click_class == 'select1') {
      label[id].click_class = 'select2'
    } else if (label[id].click_class == 'select2') {
      label[id].click_class = 'select1'
    }
    that.setData({
      label: label
    })
  },
  text:function(e){
    console.log(e)
    var value = e.detail.value
    this.setData({
      text:value
    })
  },
  // ---------------------选择位置
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
  add1: function (e) {
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
          address1: res.address,
          end_lat: res.latitude,
          end_lng: res.longitude
        })
      }
    })
  },
  // ---------选择乘车人数---------------
  bindPickerChange: function (e) {
    this.setData({
      arr_index: e.detail.value
    })
  },
  // ——————————日期选择器——————————————
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // ——————————时间选择器——————————————
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  // ———————————红色勾勾—————————————————
  icon_show: function (e) {
    var icon_hidden = this.data.icon_hidden
    if (icon_hidden == false) {
      this.setData({
        icon_hidden: true,
      })
    } else {
      this.setData({
        icon_hidden: false,
      })
    }
  },
  // ——————————责任声明弹框————————————————————
  cancel: function (e) {
    var duty = this.data.duty
    if (duty == false) {
      this.setData({
        duty: true
      })
    } else {
      this.setData({
        duty: false
      })
    }
  },
  // 提交表单
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var city_type = wx.getStorageSync('city_type')
    var city = wx.getStorageSync('city')
    console.log(city)
    var user_id = wx.getStorageSync('users').id
    var id = that.data.id
    var type_name = that.data.type_name
    // 出发地
    var address1 = e.detail.value.address1
    // 目的地
    var address2 = e.detail.value.address2
    // 途径地
    var path = e.detail.value.path
    if (path == null) {
      path = ' '
      console.log(path)
    }
    // 出发时间
    var date = that.data.date + that.data.time
    // 乘车人数
    var array = that.data.array
    var arr_index = that.data.arr_index
    var num_people = array[arr_index]
    // 货物重量
    var weight = e.detail.value.weight
    // 联系人
    var contacts = e.detail.value.contacts
    // 联系人电话
    var contacts_tel = e.detail.value.contacts_tel
    // 其他补充
    var other_demand = e.detail.value.other_demand
    // 发布金额
    var money = Number(that.data.money)
    // 分类
    var type_name = that.data.type_name
    var start_lat = that.data.start_lat
    var start_lng = that.data.start_lng
    var end_lat = that.data.end_lat
    var end_lng = that.data.end_lng
    console.log(start_lat)
    console.log(start_lng)
    console.log(end_lat)
    console.log(that.data.label)
    var label = that.data.label
    var selected = []
    for (let i in label) {
      if (label[i].click_class == 'select2') {
        selected.push(label[i])
      }
    }
    console.log(selected)
    var sz = []
    selected.map(function (item) {
      var arr = {}
      arr.tag_id = item.id
      sz.push(arr)
    })
    console.log(sz)
    var title = ''
    if (address1 == '') {
      title = '还没有选择出发地址哦'
    } else if (address2 == '') {
      title = '还没有选择目的地哦'
    } else if (id == 3) {
      if (weight == '') {
        title = '还没有填写货物重量'
      }
    } else if (contacts == '') {
      title = '还没有填写联系人'
    } else if (contacts_tel == '') {
      title = '还没有填写联系人的电话'
    }
    if (title != '') {
      wx: wx.showModal({
        title: '温馨提示',
        content: title,
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      if (money <= 0) {
        app.util.request({
          'url': 'entry/wxapp/car',
          'cachetime': '0',
          data: {
            user_id: user_id,
            start_place: address1,
            end_place: address2,
            start_time: date,
            num: num_people,
            link_name: contacts,
            link_tel: contacts_tel,
            typename: type_name,
            other: other_demand,
            tj_place: path,
            sz: sz,
            hw_wet: weight,
            star_lat: start_lat,
            star_lng: start_lng,
            end_lat: end_lat,
            end_lng: end_lng,
            cityname: city
          },
          success: res => {
            console.log(res)
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
              wx.navigateBack({
                url: '../shun',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }, 2000)
          }
        })
      } else {
        var openid = wx.getStorageSync("openid")
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
                  'url': 'entry/wxapp/car',
                  'cachetime': '0',
                  data: {
                    user_id: user_id,
                    start_place: address1,
                    end_place: address2,
                    start_time: date,
                    num: num_people,
                    link_name: contacts,
                    link_tel: contacts_tel,
                    typename: type_name,
                    other: other_demand,
                    tj_place: path,
                    sz: sz,
                    hw_wet: weight,
                    star_lat: start_lat,
                    star_lng: start_lng,
                    end_lat: end_lat,
                    end_lng: end_lng,
                    cityname: city
                  },
                  success: res => {
                    console.log(res)
                    app.util.request({
                      'url': 'entry/wxapp/SaveCarPayLog',
                      'cachetime': '0',
                      data: { car_id: res.data ,money:money},
                      success: res => {
                        console.log(res)
                       
                      }
                    })
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
                      wx.navigateBack({
                        url: '../shun',
                        success: function (res) { },
                        fail: function (res) { },
                        complete: function (res) { },
                      })
                    }, 2000)
                  }
                })
              }
            })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})