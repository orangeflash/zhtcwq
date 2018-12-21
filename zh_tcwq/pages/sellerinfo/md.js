// zh_hyk/pages/index/md.js
var app = getApp()
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listarr: ['代金券', '折扣券'],
    activeIndex: 0,
    focus: true,
    disabled: true,
    qlq: true,
    djq: [],
    zkq: [],
    discounttext:'0',
    checkboxChange:[],
    radioChange:'',
    isyhq:false,
    yhqnum:0,
    kdje:0,
    yhqname:'',
    total:0,
    showModal: false,
    zffs: 1,
    zfz: false,
    zfwz: '微信支付',
    btntype: 'btn_ok1',
    marqueePace: 1,
     marqueeDistance:0,
     size: 14,
     interval: 20 //
  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length;
    var windowWidth = that.data.windowWidth;
    var interval = setInterval(function () {
      var maxscrollwidth = length + windowWidth;
      var crentleft = that.data.marqueeDistance;
      if (crentleft < maxscrollwidth) {
        that.setData({
          marqueeDistance: crentleft + that.data.marqueePace
        })
      }
      else {
        that.setData({
          marqueeDistance: 0
        });
        clearInterval(interval);
        that.scrolltxt();
      }
    }, that.data.interval);
  },
  qrmd: function (e) {
    var xfje = Number(this.data.total), uid = wx.getStorageSync('users').id, sjid = this.data.mdinfo.id,openid = wx.getStorageSync("openid"), form_id = e.detail.formId;
    console.log(xfje, uid, sjid, openid,form_id)
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: uid,
        form_id: form_id,
        openid: openid
      },
      success: function (res) {

      },
    })
    if (xfje == 0) {
      wx.showModal({
        title: '提示',
        content: '消费金额不能为0哦~',
      })
      return false
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // AddDmOrder
    app.util.request({
      'url': 'entry/wxapp/AddDmOrder',
      'cachetime': '0',
      data: { user_id: uid, money: xfje, store_id: sjid },
      success: function (res) {
        console.log(res)
        var orderid = res.data;
        app.util.request({
          'url': 'entry/wxapp/pay4',
          'cachetime': '0',
          data: { openid: openid, money: xfje, order_id: orderid},
          success: function (res) {
            console.log(res)
            // 支付
            wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': res.data.signType,
              'paySign': res.data.paySign,
              'success': function (res) {
                console.log(res)
              },
              'complete': function (res) {
                console.log(res)
                if (res.errMsg == 'requestPayment:fail cancel') {
                  wx.showToast({
                    title: '取消支付',
                  })
                }
                if (res.errMsg == 'requestPayment:ok') {
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    showCancel: false,
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                    })
                  }, 1000)
                }
              }
            })
          },
        })
      }
    })
    // this.setData({
    //   showModal: true,
    // })
  },
  radioChange1: function (e) {
    console.log('radio1发生change事件，携带value值为：', e.detail.value)
     if (e.detail.value=='wxzf'){
      this.setData({
        zffs:1,
        zfwz: '微信支付',
        btntype:'btn_ok1',
      })
    }
    if (e.detail.value == 'yezf') {
      this.setData({
        zffs:2,
        zfwz: '余额支付',
        btntype: 'btn_ok2',
      })
    }
    if (e.detail.value == 'jfzf') {
      this.setData({
        zffs: 3,
        zfwz: '积分支付',
        btntype: 'btn_ok3',
      })
    }
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  qlq: function () {
    console.log(this.data)
    if (this.data.xfje==0)
    {
      wx.showToast({
        title: '请输入消费金额',
        icon:'loading',
        duration:1000,
      })
      return 
    }
    this.setData({
      qlq: false,
    })
  },
  qdzz: function () {
    this.setData({
      qlq: true
    })
  },
  hqjd: function (e) {
    this.setData({
      focus: true,
    })
  },
  sqjd:function(e){
    console.log(e.detail.value)
    this.setData({
      focus: false,
      xfje: Number(e.detail.value),
    })
  },
  jstotal:function(){
    console.log(this.data)
    var total = (Number(this.data.xfje) - Number(this.data.discounttext)).toFixed(2);
    if (this.data.checkboxChange.indexOf('quan') !== -1) {
      total = (total - Number(this.data.kdje)).toFixed(2)
      console.log('选择了优惠券')
      this.setData({
        isyhq:true,
      })
    }
    else {
      console.log('没有选择券')
      this.setData({
        isyhq: false,
      })
    }
    if(total<=0){
      total=0;
    }
    this.setData({
      total:total,
    })
  },
  checkboxChange: function (e) {
    this.setData({
      checkboxChange: e.detail.value,
    })
    this.jstotal();
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  radioChange: function (e) {
    this.setData({
      radioChange: e.detail.value,
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  xzq:function(e){
    console.log(e.currentTarget.dataset,this.data.xfje)
    if (Number(e.currentTarget.dataset.full) > this.data.xfje){
      wx.showModal({
        title: '提示',
        content: '您的消费金额不满足此优惠券条件',
      })
      return false;
    }
    this.setData({
      activeradio: e.currentTarget.dataset.rdid,
      yhqnum: 1,
      yhqfull: e.currentTarget.dataset.full,
      yhqname: e.currentTarget.dataset.type,
      yhqkdje: e.currentTarget.dataset.kdje,
    })
    if (e.currentTarget.dataset.type=='代金券'){
      this.setData({
        kdje: e.currentTarget.dataset.kdje,
      })
    }
    if (e.currentTarget.dataset.type == '折扣券') {
      this.setData({
        kdje: ((1-Number(e.currentTarget.dataset.kdje)*0.1) * Number(this.data.xfje)).toFixed(2),
      })
    }
    this.jstotal();
  },
  bindinput: function (e) {
    console.log(e.detail.value,this.data.yhqfull,this.data.yhqname,this.data.yhqkdje)
    // if (Number(e.detail.value) < Number(this.data.yhqfull)){
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '您的消费金额发生了改变，请重新选择优惠券',
    //   })
    //   this.setData({
    //     isyhq: false,
    //     radioChange: '',
    //     yhqnum: 0,
    //     kdje: 0,
    //     yhqfull:'',
    //     yhqname: '',
    //     yhqkdje:'0',
    //     activeradio:'abc',
    //   })
    // }
    // var that = this;
    // if (this.data.yhqname == '折扣券') {
    //   console.log(this.data.yhqname)
    //   this.setData({
    //     kdje: ((1 - Number(that.data.yhqkdje) * 0.1) * Number(e.detail.value)).toFixed(2),
    //   })
    // }
    // else {
    //   console.log(this.data.yhqname)
    // }
    // console.log(e.detail.value,this.data)
    // var discount =1-Number(this.data.discount)/100;
    // console.log(discount)
    // var discounttext = (Number(e.detail.value) * discount).toFixed(2);
    // this.setData({
    //   discounttext: discounttext,
    //   xfje: Number(e.detail.value),
    // })
    if (e.detail.value != '') {
      this.setData({
        disabled: false,
        total: Number(e.detail.value).toFixed(2)
      })
    }
    else {
      this.setData({
        disabled: true,
        total: 0,
      })
    }
    // this.jstotal();
  },
  //点击切换排序
  tabClick: function (e) {
    var that = this;
    var index = e.currentTarget.id
    console.log(index)
    this.setData({
      activeIndex: e.currentTarget.id,
    });
  },
  
  yuan: function () {
    console.log('yuan')
    var that=this;
    wx.showModal({
      title: '会员等级说明',
      content: that.data.userInfo.details,
      showCancel: false,
    })
  },
  ji: function () {
    console.log('ji')
    wx.showModal({
      title: '积分规则',
      content: '1积分可抵一元，最高可抵订单金额50%',
      showCancel: false,
    })
  },
  lqyhq: function (uid, sjid) {
    var that = this;
    //Coupons
    app.util.request({
      'url': 'entry/wxapp/MyCoupons2',
      'cachetime': '0',
      data: { user_id: uid, store_id: sjid },
      success: function (res) {
        console.log('优惠券信息', res.data)
        var received=res.data;
        var djq=[],zkq=[];
        for (let i = 0; i < received.length; i++) {
          if (received[i].type == '1' && received[i].state == '2') {
            djq.push(received[i]);
          } 
          if (received[i].type == '2' && received[i].state == '2') {
            zkq.push(received[i]);
          }
        }
        console.log(djq, zkq)
        that.setData({
          djq: djq,
          zkq: zkq,
        })
      }
    });
  },
  // formSubmit: function (e) {
  //   var that=this;
  //   var openid = getApp().getOpenId;
  //   console.log('form发生了submit事件，携带数据为：', e.detail.value.radiogroup)
  //   var form_id = e.detail.formId, uid = wx.getStorageSync('UserData').id, sjid = wx.getStorageSync('mdid'), xfje = this.data.xfje, money = this.data.total, zhe = this.data.discounttext,sjname=this.data.mdinfo.name;
  //   if(this.data.isyhq){
  //   var yhqid = this.data.radioChange
  //   var quan = this.data.kdje
  //   }
  //   else{
  //   var yhqid = '';
  //   var quan=0;
  //   }
  //   console.log(openid,form_id, uid, sjid, '总价', xfje,'实付',money,'zhe',zhe,'quan',quan,'优惠券id',yhqid,sjname)
  //   if (e.detail.value.radiogroup == 'yezf') {
  //     var ye = Number(this.data.userInfo.wallet), total = Number(this.data.total);
  //     console.log(ye, total)
  //     if (ye < total) {
  //       wx.showToast({
  //         title: '余额不足支付',
  //         icon: 'loading',
  //       })
  //       return
  //     }
  //   }
  //   var dyjf = 0;
  //   if (e.detail.value.radiogroup == 'jfzf') {
  //     var jf = Number(this.data.integral) / Number(this.data.jf_proportion), sfmoney = Number(this.data.total);
  //     dyjf = (sfmoney * Number(this.data.jf_proportion)).toFixed(2);
  //     console.log(jf, sfmoney, dyjf)
  //     if (jf < sfmoney) {
  //       wx.showToast({
  //         title: '积分不足支付',
  //         icon: 'loading',
  //       })
  //       return
  //     }
  //   }
  //   if (e.detail.value.radiogroup == 'yezf') {
  //     var is_yue =2;
  //   }
  //   if (e.detail.value.radiogroup == 'wxzf') {
  //     var is_yue = 1;
  //   }
  //   if (e.detail.value.radiogroup == 'jfzf') {
  //     var is_yue = 3;
  //   }
  //   console.log('是否余额', is_yue)
  //   if (form_id == '') {
  //     wx: wx.showToast({
  //       title: '没有获取到formid',
  //       icon: 'loading',
  //       duration: 1000,
  //     })
  //   } else {
  //     this.setData({
  //       zfz: true,
  //     })
  //     if (e.detail.value.radiogroup == 'yezf') {
  //       console.log('余额支付流程')
  //       // 下单
  //       app.util.request({
  //         'url': 'entry/wxapp/addorder',
  //         'cachetime': '0',
  //         data: { price: xfje, money: money, store_id: sjid, user_id: uid, pay_type: is_yue, preferential: zhe, preferential2:quan,coupons_id:yhqid},
  //         success: function (res) {
  //           console.log(res)
  //           var order_id = res.data;
  //           that.setData({
  //             zfz: false,
  //             showModal: false,
  //           })
  //           if (res.data != '下单失败') {
  //             wx.showToast({
  //               title: '支付成功',
  //             })
  //             setTimeout(function(){
  //               wx.redirectTo({
  //                 url: '../my/wdzd',
  //               })
  //             },1000)
  //             // // 打印机
  //             // app.util.request({
  //             //   'url': 'entry/wxapp/dmPrint',
  //             //   'cachetime': '0',
  //             //   data: { order_id: order_id },
  //             //   success: function (res) {
  //             //     console.log(res)
  //             //   },
  //             // })
  //             app.util.request({
  //               'url': 'entry/wxapp/Print',
  //               'cachetime': '0',
  //               data: { order_id: order_id },
  //               success: function (res) {
  //                 console.log(res)
  //               },
  //             })
  //             // 下单发送模板消息
  //             app.util.request({
  //               'url': 'entry/wxapp/Message',
  //               'cachetime': '0',
  //               data: { openid: openid, form_id: form_id, store_name: sjname, money: money + '元' },
  //               success: function (res) {
  //                 console.log(res)
  //                 wx.showToast({
  //                   title: '支付成功',
  //                   duration: 2000
  //                 })
  //                 // setTimeout(function () {
  //                 //   wx.navigateBack({
  //                 //     delta: 1
  //                 //   })
  //                 // }, 1000)
  //               },
  //             })
  //           }
  //           else {
  //             wx.showToast({
  //               title: '支付失败',
  //               icon: 'loading',
  //             })
  //           }
  //         },
  //       })
  //     }
  //     else if (e.detail.value.radiogroup == 'jfzf') {
  //       console.log('积分支付流程')
  //       // 下单
  //       app.util.request({
  //         'url': 'entry/wxapp/addorder',
  //         'cachetime': '0',
  //         data: { price: xfje, money: money, store_id: sjid, user_id: uid, pay_type: is_yue, preferential: zhe, preferential2: quan, coupons_id: yhqid, jf: dyjf },
  //         success: function (res) {
  //           console.log(res)
  //           var order_id = res.data;
  //           that.setData({
  //             zfz: false,
  //             showModal: false,
  //           })
  //           if (res.data != '下单失败') {
  //             wx.showToast({
  //               title: '支付成功',
  //             })
  //             setTimeout(function () {
  //               wx.redirectTo({
  //                 url: '../my/wdzd',
  //               })
  //             }, 1000)
  //             app.util.request({
  //               'url': 'entry/wxapp/Print',
  //               'cachetime': '0',
  //               data: { order_id: order_id },
  //               success: function (res) {
  //                 console.log(res)
  //               },
  //             })
  //             // 下单发送模板消息
  //             app.util.request({
  //               'url': 'entry/wxapp/Message',
  //               'cachetime': '0',
  //               data: { openid: openid, form_id: form_id, store_name: sjname, money: money + '元' },
  //               success: function (res) {
  //                 console.log(res)
  //                 wx.showToast({
  //                   title: '支付成功',
  //                   duration: 2000
  //                 })
  //               },
  //             })
  //           }
  //           else {
  //             wx.showToast({
  //               title: '支付失败',
  //               icon: 'loading',
  //             })
  //           }
  //         },
  //       })
  //     }
  //     else {
  //       console.log('微信支付流程')
  //       if(money==0){
  //         wx.showModal({
  //           title: '提示',
  //           content: '0元买单请选择其他方式支付',
  //         })
  //         that.setData({
  //           zfz: false,
  //         })
  //       }
  //       else{
  //         // 下单
  //         app.util.request({
  //           'url': 'entry/wxapp/addorder',
  //           'cachetime': '0',
  //           data: { price: xfje, money: money, store_id: sjid, user_id: uid, pay_type: is_yue, preferential: zhe, preferential2: quan, coupons_id: yhqid, form_id: form_id, },
  //           success: function (res) {
  //             console.log(res)
  //             var order_id = res.data;
  //             if (res.data != '下单失败') {
  //               app.util.request({
  //                 'url': 'entry/wxapp/pay',
  //                 'cachetime': '0',
  //                 data: { openid: openid, money: money,order_id:res.data },
  //                 success: function (res) {
  //                   console.log(res)
  //                   that.setData({
  //                     zfz: false,
  //                     showModal: false,
  //                   })
  //                   wx.requestPayment({
  //                     'timeStamp': res.data.timeStamp,
  //                     'nonceStr': res.data.nonceStr,
  //                     'package': res.data.package,
  //                     'signType': res.data.signType,
  //                     'paySign': res.data.paySign,
  //                     'success': function (res) {
  //                       console.log(res.data)
  //                       console.log(res)
  //                       console.log(form_id)
  //                     },
  //                     'complete': function (res) {
  //                       console.log(res);
  //                       if (res.errMsg == 'requestPayment:fail cancel') {
  //                         wx.showToast({
  //                           title: '取消支付',
  //                           icon: 'loading',
  //                           duration: 1000
  //                         })
  //                       }
  //                       if (res.errMsg == 'requestPayment:ok') {
  //                         wx.showToast({
  //                           title: '支付成功',
  //                           duration: 2000
  //                         })
  //                         setTimeout(function () {
  //                           wx.redirectTo({
  //                             url: '../my/wdzd',
  //                           })
  //                         }, 1000)
  //                       }
  //                     }
  //                   })
  //                 },
  //               })
  //             }
  //           },
  //         })
  //       }
  //     }
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,this.data)
    var that=this;
    var url=wx.getStorageSync('url');
    var mdid=options.sjid
    console.log(mdid)
    var uid = wx.getStorageSync('users').id;
    console.log(uid)
    that.lqyhq(uid,mdid)
    //UserInfo
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: uid },
      success: function (res) {
        console.log('用户信息', res.data)
        if (res.data.discount!=null){
          var discount = res.data.discount
        }
        else{
          var discount = 100
        }
        that.setData({
          userInfo: res.data,
          discount: discount,
          integral: res.data.integral,
        })
        if (res.data.grade == '0'){
          wx.showModal({
            title: '提示',
            content: '开卡成为会员能享受优惠买单哦~',
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../my/login',
            })
          },1500)
        }
      }
    });
    //Store 
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: mdid },
      success: function (res) {
        console.log('门店信息', res.data)
        // that.lqyhq(uid, res.data.id)
        that.setData({
          mdinfo: res.data.store[0],
        })
        wx.setNavigationBarTitle({
          title: '欢迎光临' + res.data.store[0].store_name,
        })
        var length = res.data.store[0].details.length * that.data.size;

        var windowWidth = wx.getSystemInfoSync().windowWidth;
        console.log(length, windowWidth);
        that.setData({
          length: length,
          windowWidth: windowWidth
        });
        that.scrolltxt();
      }
    });
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          xtxx: res.data,
          url:url,
          jf_proportion: res.data.jf_proportion,
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
        if (res.data.is_yue == '1') {
          that.setData({
            kqyue: true
          })
        }
        else {
          that.setData({
            kqyue: false
          })
        }
        if (res.data.is_jf == '1' && res.data.is_jfpay=='1' ) {
          that.setData({
            kqjf: true
          })
        }
        else {
          that.setData({
            kqjf: false
          })
        }
      },
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
   wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // wx.showToast({
    //   title: '上拉触底',
    // })
  }
})