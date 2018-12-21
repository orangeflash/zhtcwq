// zh_dianc/pages/logs/distribution/fxyj.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: true,
    txtype:2,
    zhtext:'微信帐号',
    zhtstext:'请输入微信帐号',
    zhtype:'text',
    disabled: false,
    logintext: '提现',
    fwxy: true,
  },
  lookck: function () {
    this.setData({
      fwxy: false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
  },
  tradeinfo: function () {
    var that = this;
    this.setData({
      open: !that.data.open
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == 'zfbtx') {
      this.setData({
        txtype: 1,
        zhtext: '支付宝帐号',
        zhtstext: '请输入支付宝帐号',
        zhtype: 'number',
      })
    }
    if (e.detail.value == 'wxtx') {
      this.setData({
        txtype: 2,
        zhtext: '微信帐号',
        zhtstext: '请输入微信帐号',
        zhtype: 'text',
      })
    }
    if (e.detail.value == 'yhktx') {
      this.setData({
        txtype: 3,
        zhtext: '银行卡号',
        zhtstext: '请输入银行卡号',
        zhtype: 'number',
      })
    }
  },
  formSubmit: function (e) {
    var that=this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var user_id = wx.getStorageSync('users').id, useryj = Number(this.data.userinfo.commission);
    var rate = this.data.system.tx_sxf, txmoney = Number(this.data.system.tx_money), je = e.detail.value.je, name = e.detail.value.name, zh = e.detail.value.zh, cb = e.detail.value.checkbox.length, zhlx = e.detail.value.radiogroup, ylyhmc = e.detail.value.ylyhmc;
    console.log(user_id,useryj,rate,txmoney,je,name,zh,cb,zhlx,ylyhmc)
    if(zhlx==''){
      wx.showModal({
        title: '提示',
        content: '请选择提现方式',
      })
      return false;
    }
    if(zhlx=='zfbtx'){
      var actype=1
      ylyhmc=''
    }
    if (zhlx == 'wxtx') {
      var actype = 2
      ylyhmc = ''
    }
    if (zhlx == 'yhktx') {
      var actype = 3
      if(ylyhmc==''){
        wx.showModal({
          title: '提示',
          content: '请输入银行名称',
        })
        return false;
      }
    }
    var sjje = Number(e.detail.value.je) * (100 - Number(rate))/100;
    console.log(sjje)
    var warn = "";
    var flag = true;
    if (useryj <txmoney) {
      warn = "佣金满"+txmoney+"才能申请提现";
    } else if (je == "") {
      warn = "请填写提现金额！";
    } else if (Number(je) <txmoney) {
      warn = "提现金额未满足提现要求";
    } else if (Number(je) > useryj) {
      warn = "提现金额超出您的实际佣金";
    } else if (name == "") {
      warn = "请填写姓名！";
    } else if (zh=='') {
      warn = "请填写帐号！";
    } else if (cb == 0) {
      warn = "请阅读并同意分销商提现协议";
    } else {
      that.setData({
        disabled: true,
        logintext: '提交中...'
      })
      flag = false;//若必要信息都填写，则不用弹框
      app.util.request({
        'url': 'entry/wxapp/Yjtx',
        'cachetime': '0',
        data: { user_id: user_id, type: actype, user_name: name, account: zh, tx_cost: je, sj_cost: sjje, bank: ylyhmc, },
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(function () {
              wx.redirectTo({
                url: 'txmx',
              })
            }, 1000)
          }
          else {
            wx.showToast({
              title: '请重试！',
              icon: 'loading'
            })
            that.setData({
              disabled: false,
              logintext: '提现',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    var that = this;
    var user_id = wx.getStorageSync('users').id;
    //
    app.util.request({
      'url': 'entry/wxapp/FxSet',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
         fxset:res.data,
        })
      }
    });
    //佣金
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          userinfo: res.data
        })
      }
    })
    //我的佣金
    app.util.request({
      'url': 'entry/wxapp/MyCommission',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          wdyj: res.data
        })
      }
    })
    //
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res.data)
        that.setData({
          system:res.data,
        })
        if (res.data.tx_type==1){
          that.setData({
            iswx: '2',
            iszfb: '1',
            isyhk: '2',
          })
        }
        if (res.data.tx_type == 2) {
          that.setData({
            iswx: '1',
            iszfb: '2',
            isyhk: '2',
          })
        }
        if (res.data.tx_type == 3) {
          that.setData({
            iswx: '2',
            iszfb: '2',
            isyhk: '1',
          })
        }
      }
    });
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
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
})