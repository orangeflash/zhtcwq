// zh_tcwq/pages/integral/integralinfo/integralinfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bomb:true,
    kpgg:true,
    ssq: '',
    xxdz: '',
    djdh:false,
    qddh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    wx.hideShareMenu({

    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var url = wx.getStorageSync('url')
    var user_id = wx.getStorageSync('users').id
    this.setData({
      url: url
    })
    var that=this;
    //商品列表
    app.util.request({
      'url': 'entry/wxapp/JfGoodsInfo',
      'cachetime': '0',
      data: { id: options.id},
      success: function (res) {
        console.log(res)
        that.setData({
          spinfo: res.data[0]
        })
        wx.setNavigationBarTitle({
          title: res.data[0].name,
        })
      }
    })
    // 积分
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          integral: res.data.total_score
        })
      }
    })
  },
  duihuan:function(){
    var that = this;
    that.setData({
      bomb:false,
    })
  },
  cancel: function () {
    var that = this;
    that.setData({
      bomb: true
    })
  },
  caomfirm: function () {
    var user_id = wx.getStorageSync('users').id
    var that = this;
    var goodid = that.data.spinfo.id, integral = that.data.spinfo.money, hb_moeny = that.data.spinfo.hb_moeny, total_score = Number(that.data.integral), good_name = that.data.spinfo.name, good_img = that.data.spinfo.img;
    console.log(user_id, goodid, Number(integral),hb_moeny,total_score,good_name,good_img)
    if (that.data.spinfo.type == '1'){
      that.setData({
        bomb: true,
      })
      if (Number(integral) > total_score) {
        wx.showModal({
          title: '提示',
          content: '您的积分不足以兑换此物品',
        })
      }
      else{
        that.setData({
          djdh: true,
        })
        app.util.request({
          'url': 'entry/wxapp/Exchange',
          'cachetime': '0',
          data: { user_id: user_id, good_id: goodid, integral: integral, hb_money: hb_moeny, type: 1, good_name: good_name, good_img: good_img },
          success: function (res) {
            console.log(res)
            if (res.data == 1) {
              wx.showToast({
                title: '兑换成功',
              })
              setTimeout(function () {
                wx.navigateBack({

                })
              }, 1000)
            }
            else {
              wx.showToast({
                title: '请重试！',
                icon: 'loading'
              })
              that.setData({
                djdh: false,
              })
            }
          }
        }) 
      }
    }
    else{
      that.setData({
        bomb: true,
      })
      if (Number(integral) > total_score) {
        wx.showModal({
          title: '提示',
          content: '您的积分不足以兑换此物品',
        })
      }
      else{
        that.setData({
          kpgg: false,
        })
      }
    }
  },
  ycgg: function () {
    var that = this;
    that.setData({
      kpgg: true,
    })
  },
  //获取经纬度
  dingwei: function (e) {
    console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        var index = res.address.indexOf('区')
        console.log(res.address.substring(0, index + 1))
        that.setData({
          location: res.latitude + ',' + res.longitude,
          ssq: res.address.substring(0, index + 1),
          xxdz: res.address.substring(index + 1) + res.name,
        })
      }
    })
  },
  formSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that=this;
    var user_id = wx.getStorageSync('users').id
    var goodid = that.data.spinfo.id, integral = that.data.spinfo.money, good_name = that.data.spinfo.name, good_img = that.data.spinfo.img;
    var lxr = e.detail.value.lxr, tel = e.detail.value.tel,ssq=that.data.ssq, dz =that.data.ssq+ e.detail.value.grxxdz
    console.log(user_id,goodid,integral,lxr,tel,dz,good_name,good_img)
    var warn = "";
    var flag = true;
    if (lxr == "") {
      warn = "请填写联系人！";
    } else if (tel == "") {
      warn = "请填写联系电话！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(tel)) || tel.length != 11) {
      warn = "手机号错误";
    } else if (dz=='') {
      warn = "请选择位置！";
    } else {
      flag = false;//若必要信息都填写，则不用弹框
      that.setData({
        qddh: true,
      })
      app.util.request({
        'url': 'entry/wxapp/Exchange',
        'cachetime': '0',
        data: { user_id: user_id, good_id: goodid, integral: integral, user_name: lxr, user_tel: tel, address: dz, type: 2, good_name: good_name, good_img: good_img},
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '兑换成功',
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
          else {
            wx.showToast({
              title: '请重试！',
              icon: 'loading'
            })
            that.setData({
              qddh: false,
            })
          }
        }
      })
      }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
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