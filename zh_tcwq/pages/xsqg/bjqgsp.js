// zh_zbkq/pages/my/fbyhq.js
var app = getApp();
var util = require('../../utils/util.js'), siteinfo = require('../../../siteinfo.js');
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
    lbimages:[],
    jsimages:[],
    logo:'../image/splogo.png'
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
  bindTimeChange2: function (e) {
    console.log('picker  发生选择改变，携带值为', e.detail.value);
    this.setData({
      jztime: e.detail.value
    })
  },
  gongg: function (e) {
    console.log(e.detail.value)
    var zsnum = parseInt(e.detail.value.length);
    this.setData({
      zsnum: zsnum
    })
  },
  chooselogo: function (t) {
    var o = this,a;
    wx.chooseImage({
      count: 1,
      success: function (t) {
        a = t.tempFilePaths,
          o.setData({
            logo: a
          })
        console.log(a)
      }
    })
  },
  chooseImage: function (t) {
    var o = this,
      a = this.data.lbimages,
      e = a.length;
    console.log(a)
    wx.chooseImage({
      count: 3 - e,
      success: function (t) {
        a = a.concat(t.tempFilePaths),
          o.setData({
          lbimages: a
          })
        console.log(a)
      }
    })
  },
  lbdeleteImage: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      e = this.data.lbimg;
    console.log(i)
    e.splice(i, 1),
      o.setData({
      lbimg: e
      })
    console.log(e)
  },
  deleteImage: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      e = this.data.lbimages;
    console.log(i)
    e.splice(i, 1),
      o.setData({
      lbimages: e
      })
    console.log(e)
  },
  chooseImage1: function (t) {
    var o = this,
      a = this.data.jsimages,
      e = a.length;
    console.log(a)
    wx.chooseImage({
      count: 3 - e,
      success: function (t) {
        a = a.concat(t.tempFilePaths),
          o.setData({
          jsimages: a
          })
        console.log(a)
      }
    })
  },
  jsdeleteImage: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      e = this.data.jsimg;
    console.log(i)
    e.splice(i, 1),
      o.setData({
      jsimg: e
      })
    console.log(e)
  },
  deleteImage1: function (t) {
    var o = this,
      i = t.currentTarget.dataset.index,
      e = this.data.jsimages;
    console.log(i)
    e.splice(i, 1),
      o.setData({
      jsimages: e
      })
    console.log(e)
  },
  formSubmit: function (e) {
    var mdid = this.data.QgGoodInfo.store_id, spid = this.data.QgGoodInfo.id, state = this.data.QgGoodInfo.state, logo = typeof (this.data.logo) == 'string' ? this.data.QgGoodInfo.logo : this.data.logo, lbimg = this.data.lbimg, lbimages = this.data.lbimages, jsimages = this.data.jsimages, jsimg = this.data.jsimg;
    var uid = wx.getStorageSync('users').id;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var splx = this.data.countries[e.detail.value.splx], px = e.detail.value.px, spmc = e.detail.value.spmc,
      sj = e.detail.value.sj, yj = e.detail.value.yj, spsl = e.detail.value.spsl, starttime = e.detail.value.starttime, endtime = e.detail.value.endtime, jztime = e.detail.value.jztime, spjj = e.detail.value.spjj, spxq = e.detail.value.spxq;
    console.log(mdid, uid, splx, px, spmc, sj, yj, spsl, spjj, spxq, starttime, endtime, jztime, typeof (this.data.logo),logo,lbimg,lbimages,jsimages,jsimg)
    var warn = "";
    var flag = true;
    if (spmc == "") {
      warn = "请填商品名称！";
    } else if (logo == '../image/splogo.png') {
      warn = "请上传商品主图！";
    } else if (sj == "" || Number(sj) <= 0) {
      warn = "请填写大于0的售价！";
    } else if (yj == "" || Number(yj) <= 0 || Number(yj) < Number(sj)) {
      warn = "请填写合理的原价！";
    } else if (spsl == "") {
      warn = "请填写商品数量！";
    } else if (lbimg.length +lbimages.length ==0) {
      warn = "请上传顶部轮播图片！";
    } else if (!(util.validTime(starttime, endtime))) {
      warn = "请设置合理的活动日期！";
    } else if (jztime == ""||jztime==0) {
      warn = "请填写合理的截止时间！";
    } else if (spxq == "") {
      warn = "请填写商品详情！";
    } else {
      flag = false;
      var that = this;
      if (typeof (logo) == 'object') {
        var n = [{ pic_list: lbimages, uploaded_pic_list: [] }, { pic_list: jsimages, uploaded_pic_list: [] }, { pic_list: logo, uploaded_pic_list: [] }];
      }
      else {
        var n = [{ pic_list: lbimages, uploaded_pic_list: [] }, { pic_list: jsimages, uploaded_pic_list: [] }];
      } 
      console.log(n)
      wx.showLoading({
        title: "正在提交",
        mask: !0
      });
      a(0)
      function a(o) {
        if (o == n.length) return e();
        var i = 0;
        if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return a(o + 1);
        for (var s in n[o].pic_list) !
          function (e) {
            wx.uploadFile({
              url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_tcwq',
              name: "upfile",
              filePath: n[o].pic_list[e],
              success: function (resp) {
                console.log('上传图片返回值', resp)
                if (resp.data != '') {
                  n[o].uploaded_pic_list[e] = resp.data
                }
                // if (console.log(t), t.data) {
                //   var s = JSON.parse(t.data);
                //   0 == s.code && (n[o].uploaded_pic_list[e] = s.data.url)
                // }
                if (++i == n[o].pic_list.length) return a(o + 1)
              }
            })
          }(s)
      }
      function e() {
        var spzt = typeof (logo) == 'object' ? n[2].uploaded_pic_list.toString():logo, img = lbimg.concat(n[0].uploaded_pic_list),
          details_img = jsimg.concat(n[1].uploaded_pic_list);
        console.log('请求接口', n,spzt,img,details_img)
        //Assess
        app.util.request({
          'url': 'entry/wxapp/AddQgGood',
          'cachetime': '0',
          data: { store_id: mdid, num: px, name: spmc, logo: spzt, price: yj, money: sj, number: spsl, start_time: starttime, end_time: endtime, consumption_time: jztime, details: spxq, type_id: splx.id, img: img.toString(), details_img: details_img.toString(), content: spjj, id: spid},
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
    wx.setNavigationBarTitle({
      title: '编辑商品',
    })
    app.setNavigationBarColor(this);
    var that = this, url = wx.getStorageSync('url');
    var start = util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(options,start.toString())
    this.setData({
      start: start,
      spid:options.spid,
      url: url,
    });
    //取平台信息
    app.util.request({
      'url': 'entry/wxapp/QgType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        let QgType=res.data;
        if(res.data.length==0){
          wx.showModal({
            title: '提示',
            content: '平台暂未添加分类，无法发布商品',
            success: function (res) {
              wx.navigateBack({
                
              })
            }
          })
        }
        //QgGoodInfo
        app.util.request({
          'url': 'entry/wxapp/QgGoodInfo',
          'cachetime': '0',
          data: { id: options.spid },
          success: function (res) {
            console.log(res)
            res.data.logobf = url+res.data.logo;
            res.data.img = res.data.img.split(",");
            res.data.details_img = res.data.details_img==''?[]: res.data.details_img.split(",");
            res.data.start_time = util.ormatDate(res.data.start_time).substring(0,10)
            res.data.end_time = util.ormatDate(res.data.end_time).substring(0, 10)
            let ginfo=res.data;
            for (let i = 0; i < QgType.length;i++){
              if (res.data.type_id == QgType[i].id){
                that.setData({
                  countryIndex:i,
                })
              }
            }
            that.setData({
              QgGoodInfo: ginfo,
              logo: ginfo.logobf,
              lbimg:ginfo.img,
              jsimg: ginfo.details_img,
              px: ginfo.num,
              spmc: ginfo.name,
              sj: ginfo.money,
              yj: ginfo.price,
              spsl: ginfo.number,
              spjj: ginfo.content,
              timestart: ginfo.start_time,
              timeend: ginfo.end_time,
              jztime: ginfo.consumption_time,
              spxq: ginfo.details,
            })
          }
        });
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