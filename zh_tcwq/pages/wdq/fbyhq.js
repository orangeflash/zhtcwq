// zh_zbkq/pages/my/fbyhq.js
var app = getApp();
var util = require('../../utils/util.js'), imgArray = [], siteinfo = require('../../../siteinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countries: [],
    countryIndex: 0,
    lqcountries: ["付费领取+分享领取", "仅限付费领取", '仅限分享领取'],
    lqcountryIndex: 1,
    jesz: true,
    qssz: true,
    yhqtype: '元',
    start: '',
    timestart: "",
    timeend: '',
    issq: true,
    is_check: '',
    zsnum: 0,
    fwxy: true,
    images:[],
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
  jyfxsl: function (e) {
    console.log(e.detail.value)
    if (e.detail.value == '0') {
      wx.showToast({
        title: '数量不能为0',
        icon: 'loading'
      })
    }
  },
  bindTypeChange: function (e) {
    console.log('picker type 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryIndex: e.detail.value,
    })
    // if (e.detail.value == '0') {
    //   this.setData({
    //     countryIndex: e.detail.value,
    //     yhqtype: '元',
    //   })
    // }
    // if (e.detail.value == '1') {
    //   this.setData({
    //     countryIndex: e.detail.value,
    //     yhqtype: '折',
    //   })
    // }
    // if (e.detail.value == '2') {
    //   this.setData({
    //     countryIndex: e.detail.value,
    //     yhqtype: '',
    //   })
    // }
  },
  bindTypeChange1: function (e) {
    console.log('picker1 type 发生选择改变，携带值为', e.detail.value);
    if (this.data.ptxx.is_fxlq == '1') {
      if (e.detail.value == '0') {
        this.setData({
          lqcountryIndex: e.detail.value,
          jesz: true,
          qssz: true,
        })
      }
      if (e.detail.value == '1') {
        this.setData({
          lqcountryIndex: e.detail.value,
          jesz: true,
          qssz: false,
        })
      }
      if (e.detail.value == '2') {
        this.setData({
          lqcountryIndex: e.detail.value,
          jesz: false,
          qssz: true,
        })
      }
    }
    else{
      this.setData({
        lqcountryIndex: e.detail.value,
        jesz: true,
        qssz: false,
      })
    }
  },
  bindTimeChange: function (e) {
    console.log('picker 发生选择改变，携带值为', e.detail.value);
    this.setData({
      timestart: e.detail.value
    })
  },
  bindTimeChange1: function (e) {
    console.log('picker  发生选择改变，携带值为', e.detail.value);
    this.setData({
      timeend: e.detail.value
    })
  },
  qwkt: function () {
    wx.redirectTo({
      url: 'txzl',
    })
  },
  gongg: function (e) {
    console.log(e.detail.value)
    var zsnum = parseInt(e.detail.value.length);
    this.setData({
      zsnum: zsnum
    })
  },
  chooseImage: function (t) {
    var o = this,
      a = this.data.images,
      e = a.length;
    console.log(a)
    wx.chooseImage({
      count: 3 - e,
      success: function (t) {
        a = a.concat(t.tempFilePaths),
          o.setData({
            images: a
          })
        console.log(a)
      }
    })
  },
  deleteImage: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      e = this.data.images;
    console.log(i)
    e.splice(i, 1),
      o.setData({
        images: e
      })
    console.log(e)
  },
  formSubmit: function (e) {
    var mdid = this.data.sjid, images = this.data.images;
    var uid = wx.getStorageSync('users').id;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var yhqlx = this.data.countries[this.data.countryIndex].id, yhje = e.detail.value.yhje, yhtj = e.detail.value.yhtj,
      ffsl = e.detail.value.ffsl, timestart = this.data.timestart, timeend = this.data.timeend, syxz = e.detail.value.syxz,
      lqje = e.detail.value.lqje, fxsl = e.detail.value.fxsl, tyqmc = e.detail.value.tyqmc;
    if (lqje == null) {
      lqje = '';
    }
    if (fxsl == null) {
      fxsl = '';
    }
    if (tyqmc == null) {
      tyqmc = '';
    }
    if (yhqlx == '通用券') {
      if (tyqmc == '') {
        wx.showModal({
          title: '提示',
          content: '您选择的通用券类型，请填写通用券名称',
        })
        return false
      }
    }
    console.log(mdid, uid, yhqlx, yhje, yhtj, ffsl, timestart, timeend, syxz, lqje, fxsl, tyqmc, images)
    console.log(util.validTime(timestart, timeend))
    var is_couset = this.data.is_couset, szlx = this.data.lqcountryIndex;
    // if (this.data.ptxx.is_fxlq == '2') {
    //   szlx = '1'
    // }
    console.log(is_couset, szlx)
    if (is_couset == '2') {
      var lqmode = 0;
    }
    if (is_couset == '1') {
      if (szlx == '0') {
        var lqmode = 1;
      }
      if (szlx == '1') {
        var lqmode = 2;
      }
      if (szlx == '2') {
        var lqmode = 3;
      }
    }
    var warn = "";
    var flag = true;
    if (is_couset == '1' && szlx == '0') {
      if (lqje == "") {
        wx.showModal({
          title: '提示',
          content: "请填写领券金额！"
        })
        return
      } else if (fxsl == "") {
        wx.showModal({
          title: '提示',
          content: "请填写分享数量！"
        })
        return
      } else if (Number(fxsl) > 10) {
        wx.showModal({
          title: '提示',
          content: "分享数量不能大于10"
        })
        return
      }
    }
    if (is_couset == '1' && szlx == '1') {
      if (lqje == "") {
        wx.showModal({
          title: '提示',
          content: "请填写领券金额！"
        })
        return
      }
    }
    if (is_couset == '1' && szlx == '2') {
      if (fxsl == "") {
        wx.showModal({
          title: '提示',
          content: "请填写分享数量！"
        })
        return
      }
      if (Number(fxsl) > 10) {
        wx.showModal({
          title: '提示',
          content: "分享数量不能大于10"
        })
        return
      }
    }
    if (yhje == "") {
      warn = "请填写优惠金额！";
    } else if (ffsl == "") {
      warn = "请填写发放数量！";
    } else if (!(util.validTime(timestart, timeend))) {
      warn = "请设置合理的截止日期！";
    } else if (syxz == "") {
      warn = "请填写优惠券使用说明！";
    } else {
      flag = false;
      var that = this;
      wx.showLoading({
        title: "正在提交",
        mask: !0
      });
      if (images.length == 0) {
        e()
      }
      else {
        uploadimg({
          url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_tcwq',
          path: images
        });
      }
      function uploadimg(data) {
        var i = data.i ? data.i : 0,
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
              console.log('图片数组', imgArray)
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
              // that.setData({
              //   images: data.path
              // });
              wx.hideToast();
              console.log('执行完毕');
              e()
              console.log('成功：' + success + " 失败：" + fail);
            } else {
              console.log(i);
              data.i = i;
              data.success = success;
              data.fail = fail;
              uploadimg(data);
            }

          }
        });
      }
      function e() {
        console.log('请求接口', imgArray, imgArray.toString())
        //Assess
        app.util.request({
          'url': 'entry/wxapp/AddCoupon',
          'cachetime': '0',
          data: { store_id: mdid, type_id: yhqlx, name: tyqmc, number: ffsl, full: yhtj, reduce: yhje, money: lqje, end_time: timeend, details:syxz, img: imgArray.toString() },
          success: function (res) {
            if (res.data == '1') {
              wx.showModal({
                title: '提示',
                content: '提交成功',
              })
              setTimeout(function () {
                wx.navigateBack({
                  
                })
              }, 1000)
            }
            console.log('Assess', res.data)
          }
        });
      }
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
    app.setNavigationBarColor(this);
    var sjid = options.store_id;
    var that = this;
    var start = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(sjid,start.toString())
    this.setData({
      start: start,
      timestart: start,
      timeend: start,
      is_couset: 1,
      szlx: 1,
      sjid:sjid,
    });
    //isrz
    app.util.request({
      'url': 'entry/wxapp/StoreInfo',
      'cachetime': '0',
      data: { id: sjid },
      success: function (res) {
        console.log(res)
        // if (res.data != '') {
        //   that.setData({
        //     is_check: res.data.is_check,
        //     mdid: res.data.id,
        //     mdinfo: res.data
        //   })
        //   if (res.data.is_check == '2') {
        //     if (res.data.is_open == '1') {
        //       that.setData({
        //         issq: true,
        //       })
        //     }
        //   }
        //   if (res.data.is_rz != '1') {
        //     wx.showModal({
        //       title: '提示',
        //       content: '您的入驻已到期，请续费后发布券',
        //       success: function (res) {
        //         wx.navigateBack({

        //         })
        //       }
        //     })
        //   }
        // }
        // else {
        //   that.setData({
        //     issq: false,
        //   })
        // }
      }
    });
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/CouponType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '平台暂未添加分类，无法发布',
            success: function (res) {
              wx.navigateBack({

              })
            }
          })
        }
        that.setData({
          countries: res.data,
        })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})