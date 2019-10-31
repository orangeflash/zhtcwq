// pages/infodetial/infodetial.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reply: false,
    comment: false,
    select: 0,
    arrow: 1,
    sure: false,
    receive: false,
    rob_redbag: false,
    share: false,
    hb_share: false,
    share_red: false,
  },
  wyfb(){
    wx.navigateTo({
      url: '/zh_tcwq/pages/fabu/fabu/fabu',
    })
  },
  openshare: function () {
    var page = this;
    page.setData({
      share_modal_active: "active",
    });
  },
  showShareModal: function () {
    var page = this;
    page.setData({
      share_modal_active: "active",
    });
  },
  shareModalClose: function () {
    var page = this;
    page.setData({
      share_modal_active: "",
    });
  },
  updateUserInfo: function (res) {7
    console.log(res)
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        hydl: false,
      })
      this.getUserinfo();
    }
  },
  getUserinfo:function(){
    var that=this;
    wx.login({
      success: function (res) {
        var code = res.code
        wx.setStorageSync("code", code)
        wx.getSetting({
          success: function (res) {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  // ----------------------------------异步保存用户登录信息----------------------------------
                  wx.setStorageSync("user_info", res.userInfo)
                  // ----------------------------------用户登录的名字----------------------------------
                  var nickName = res.userInfo.nickName
                  // ----------------------------------用户登录的头像----------------------------------
                  var avatarUrl = res.userInfo.avatarUrl
                  app.util.request({
                    'url': 'entry/wxapp/openid',
                    'cachetime': '0',
                    data: { code: code },
                    success: function (res) {
                      // 异步保存session-key
                      wx.setStorageSync("key", res.data.session_key)
                      //  -------------------------需要上传给后台的值 包括名字和头像----------------------------------
                      var img = avatarUrl
                      var name = nickName
                      // 异步7保存用户openid
                      wx.setStorageSync("openid", res.data.openid)
                      var openid = res.data.openid
                      //---------------------------------- 获取用户登录信息----------------------------------
                      app.util.request({
                        'url': 'entry/wxapp/Login',
                        'cachetime': '0',
                        data: { openid: openid, img: img, name: name },
                        success: function (res) {
                          // ----------------------------------异步保存用户信息----------------------------------
                          wx.setStorageSync('users', res.data)
                          wx.setStorageSync('uniacid', res.data.uniacid)
                          that.reload()
                          that.setData({
                            user_id: res.data.id,
                            user_name: name
                          })
                        },
                      })
                    },
                  })
                }
              })
            }
            else {
              console.log('未授权过')
              that.setData({
                hydl: true,
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          system: res.data,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/HdPoster',
      'cachetime': '0',
      data: {
        id: options.id
      },
      success: function (res) {
        console.log(res)
        that.setData({
          qr_code: res.data,
        })
      },
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth / 2
        var windowHeight = windowWidth * 1.095
        that.setData({
          width: windowWidth,
          height: windowHeight
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        wx.setStorageSync('url', res.data)
        that.setData({
          url: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Url2',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          url2: res.data,
        })
      },
    })
    var user_id = wx.getStorageSync('users').id
    if (options.type != null) {
      that.getUserinfo();
      that.setData({
        post_info_id: options.my_post,
      })
      // that.reload()
    } else {
      if (options.scene != null) {
        that.setData({
          user_id: user_id,
          post_info_id: options.scene,
          user_name: wx.getStorageSync('users').name,
        })
        that.reload()
      } else {
        that.setData({
          user_id: user_id,
          post_info_id: options.id,
          user_name: wx.getStorageSync('users').name,
        })
        that.reload()
      }
    }
    app.util.request({
      'url': 'entry/wxapp/Llz',
      'cachetime': '0',
      data: { cityname: wx.getStorageSync('city'), type: 1 },
      success: function (res) {
        console.log(res)
        that.setData({
          unitid: res.data,
        })
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.system.indexOf("iOS") != -1) {
          that.setData({
            isios: true
          })
        }
      },
    })
  },
  reload: function (e) {
    var that = this
    // ============================帖子id=============================
    var post_info_id = that.data.post_info_id
    // ----------------------------------查看是否收藏
    // IsCollection
    app.util.request({
      'url': 'entry/wxapp/IsCollection',
      'cachetime': '0',
      data: { information_id: post_info_id, user_id: that.data.user_id },
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            Collection: true
          })
        } else {
          that.setData({
            Collection: false
          })
        }
      },
    })
    // ============================平台信息=============================
    var system = wx.getStorageSync('System')
    that.setData({
      system_name: system.pt_name
    })

    // ------------------------------获取帖子信息-------------------------
    app.util.request({
      'url': 'entry/wxapp/PostInfo',
      'cachetime': '0',
      data: { id: post_info_id, user_id: wx.getStorageSync('users').id },
      success: function (res) {
        console.log(res)
        if (res.data.tz.type2_name == null) {
          var type2_name = ''
        } else {
          var type2_name = res.data.tz.type2_name
        }
        wx.setNavigationBarTitle({
          title: res.data.tz.type_name + ' ' + type2_name
        })
        var time1 = that.ormatDate(res.data.tz.sh_time)
        res.data.tz.time2 = time1.slice(0, 16)
        for (let i in res.data.pl) {
          res.data.pl[i].time = that.ormatDate(res.data.pl[i].time)
          res.data.pl[i].time = res.data.pl[i].time.slice(0, 16)
        }
        var givelike = res.data.tz.givelike
        res.data.tz.img = res.data.tz.img.split(",")
        function rgb() {
          var r = Math.floor(Math.random() * 255);
          var g = Math.floor(Math.random() * 255);
          var b = Math.floor(Math.random() * 255);
          var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
          return rgb;
        }
        for (let i in res.data.label) {
          res.data.label[i].number = rgb()
        }

        var hb_num = Number(res.data.tz.hb_num)
        var hb_random = Number(res.data.tz.hb_random)
        var hb_type = Number(res.data.tz.hb_type)
        if (hb_random == 1) {
          res.data.tz.hb_money = res.data.tz.hb_money
        } else {
          res.data.tz.hb_money = (Number(res.data.tz.hb_money) * hb_num).toFixed(2)
        }
        app.util.request({
          'url': 'entry/wxapp/HongList',
          'cachetime': '0',
          data: { id: res.data.tz.id },
          success: function (res) {
            console.log(res)
            var hongbao = res.data
            var price = 0
            function isInArray(arr, value) {
              for (var i = 0; i < arr.length; i++) {
                if (value === arr[i].user_id) {
                  return true;
                }
              }
              return false;
            }
            var hongbao_use = isInArray(hongbao, that.data.user_id)
            if (hongbao_use == true) {
              var hongbao_use = 2
            } else {
              if (hb_num == hongbao.length) {
                var hongbao_use = 1
              } else {
                var hongbao_use = 3
              }
            }
            // 计算随机分配和平均分的金额
            for (let i in hongbao) {
              price += Number(hongbao[i].money)
            }
            that.setData({
              price: price.toFixed(2),
              hongbao_use: hongbao_use,
              hongbao_len: res.data.length,
              hongbao: hongbao
            })
          },
        })
        res.data.tz.details = res.data.tz.details.replace("↵", "\n");
        res.data.tz.trans1 = 1
        res.data.tz.trans2 = 1
        res.data.tz.dis1 = 'block'
        res.data.tz.trans_1 = 2
        res.data.tz.trans_2 = 1
        res.data.tz.copyuser_tel = res.data.tz.user_tel.substr(0, 3) + '****' + res.data.tz.user_tel.substr(7);
        let alreadyCharge;
        if (res.data.call){
          alreadyCharge = true;
        }
        else{
          if (+res.data.tz.tel_money > 0) {
            alreadyCharge = false;
          }
          else {
            alreadyCharge = true;
          }
        }
        that.setData({
          post: res.data.tz,
          dianzan: res.data.dz,
          // user_name: res.data.tz.user_name,
          givelike: givelike,
          post_info_id: post_info_id,
          tei_id: res.data.tz.id,
          criticism: res.data.pl,
          label: res.data.label,
          alreadyCharge,
        })
      },
    })
  },
  // -----------------------------时间戳转换日期时分秒--------------------------------
  ormatDate: function (dateNum) {
    var date = new Date(dateNum * 1000);
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);
    function fixZero(num, length) {
      var str = "" + num;
      var len = str.length;
      var s = "";
      for (var i = length; i-- > len;) {
        s += "0";
      }
      return s + str;
    }
  },
  // 点击显示
  rob_redbag: function (e) {
    var that = this
    var rob_redbag = that.data.rob_redbag
    var hongbao_use = that.data.hongbao_use
    if (rob_redbag == true) {
      that.setData({
        rob_redbag: false
      })
    } else {
      that.setData({
        rob_redbag: true
      })
    }

  },

  trans1: function (e) {
    var that = this
    var store = that.data.post
    var num = that.data.num
    if (that.data.system.is_hbzf == 2) {
      if (num == null) {
        num = 1
      } else {

      }
      if (num == 1) {
        store.trans1 = 'trans1'
        store.trans2 = 'trans2'
        var user_id = wx.getStorageSync('users').id
        var id = that.data.post_info_id
        app.util.request({
          'url': 'entry/wxapp/GetHong',
          'cachetime': '0',
          data: { id: id, user_id: user_id },
          success: function (res) {
            console.log('领取')
            console.log(res)
            if (res.data == 'error') {
              wx.showModal({
                title: '提示',
                content: '手慢了，' + that.data.system.hb_name +'被抢光了',
              })
            }
          },
        })
        setTimeout(function () {
          store.trans_1 = 1
          store.trans_2 = 2
          store.dis1 = 'none'
          store.dis2 = 'block'
          that.setData({
            store: store
          })
        }, 500)
        setTimeout(function () {
          store.trans_1 = 2
          store.trans_2 = 1
          store.dis1 = 'block'
          store.dis2 = 'none'
          that.setData({
            store: store
          })
        }, 1000)
        setTimeout(function () {
          store.trans_1 = 1
          store.trans_2 = 2
          store.dis1 = 'none'
          store.dis2 = 'block'
          that.setData({
            store: store
          })
        }, 1500)
        setTimeout(function () {
          wx: wx.navigateTo({
            url: '../redbag/redinfo/see_rob?id=' + that.data.post_info_id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })

          that.setData({
            rob_redbag: false
          })
        }, 1300)
      }
      that.setData({
        post: store,
        num: num + 1
      })
    } else {
      that.setData({
        share_red: true,
        rob_redbag: false
      })
    }

  },
  trans2: function (e) {
    var that = this
    var store = that.data.store
    wx: wx.navigateTo({
      url: '../redbag/redinfo/see_rob?id=' + that.data.post_info_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    that.setData({
      rob_redbag: false
    })
  },
  weixin: function (e) {
    this.setData({
      hb_share: false
    })
  },
  // ------------------------------------点击回到首页
  shouye: function (e) {
    wx: wx.reLaunch({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // -------------------------------------领取-----------------------
  // gethong: function (e) {
  //   var that = this
  //   var user_id = wx.getStorageSync('users').id
  //   var id = that.data.post_info_id
  //   app.util.request({
  //     'url': 'entry/wxapp/GetHong',
  //     'cachetime': '0',
  //     data: { id: id, user_id: user_id },
  //     success: function (res) {
  //       that.reload()
  //       that.setData({
  //         receive: true
  //       })
  //     },
  //   })
  // },
  // ----------------------------点击取消显示-------------------
  receive1: function (e) {
    var that = this
    this.setData({
      receive: false
    })
  },
  // ------------------------------------点击入驻商家
  fabu: function (e) {
    var that = this
    wx: wx.reLaunch({
      url: '../fabu/fabu/fabu',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // --------------------------------------------图片预览
  previewImage: function (e) {
    var that = this
    var url = that.data.url
    var urls = []
    var inde = e.currentTarget.dataset.inde
    var pictures = that.data.post.img

    for (let i in pictures) {
      urls.push(url + pictures[i]);
    }
    wx.previewImage({
      current: url + pictures[inde],
      urls: urls
    })
  },
  // -----------------------------------------------点赞-----------------------------------------------
  // thumbs_up: function (e) {
  //   var that = this
  //   var post_info_id = that.data.tei_id
  //   var user_id = wx.getStorageSync('users').id
  //   var thumbs_up = Number(that.data.givelike)
  //   app.util.request({
  //     'url': 'entry/wxapp/Like',
  //     'cachetime': '0',
  //     data: { information_id: post_info_id, user_id: user_id },
  //     success: function (res) {
  //       if (res.data != 1) {
  //         wx: wx.showModal({
  //           title: '提示',
  //           content: '不能重复点赞',
  //           showCancel: true,
  //           cancelText: '取消',
  //           cancelColor: '',
  //           confirmText: '确认',
  //           confirmColor: '',
  //           success: function (res) { },
  //           fail: function (res) { },
  //           complete: function (res) { },
  //         })
  //       } else {
  //         that.reload()
  //         that.setData({
  //           thumbs_ups: true,
  //           thumbs_up: thumbs_up + 1
  //         })
  //       }
  //     },
  //   })

  // },
  // -----------------------------------------------收藏-----------------------------------------------
  Collection: function (e) {
    var that = this
    var post_info_id = that.data.tei_id
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/Collection',
      'cachetime': '0',
      data: { information_id: post_info_id, user_id: user_id },
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            Collection: true
          })
          wx: wx.showToast({
            title: '收藏成功',
            icon: '',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          wx: wx.showToast({
            title: '取消收藏成功',
            icon: 'fail',
            image: '',
            duration: 2000,
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          that.setData({
            Collection: false
          })
        }
      },
    })

  },
  // ----------------------------------判断口令输入的是否正确-------------------------------
  hb_keyword: function (e) {
    var that = this
    var value = e.detail.value
    var post = that.data.post
    if (post.hb_keyword == value) {
      that.setData({
        sure: true
      })
    } else {
      wx: wx.showModal({
        title: '提示',
        content: '输入的口令错误，请重新输入',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) {
          e.detail.value == ''
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  // ---------------------------------------点击评论弹出评论框
  comment: function (e) {
    var that = this
    var user_id = wx.getStorageSync('users').id
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data.state == 1) {
          that.setData({
            comment: true
          })
        } else {
          wx: wx.showModal({
            title: '提示',
            content: '您的账号异常，请尽快联系管理员',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确定',
            success: function (res) {
              // wx: wx.navigateBack({
              //   delta: 1,
              // })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
    })

  },
  // ------------------------------发表评论的内容
  complete: function (e) {
    this.setData({
      complete: e.detail.value
    })
  },
  // ------------------------------商家回复的内容
  complete1: function (e) {
    this.setData({
      complete1: e.detail.value
    })
  },
  complete2: function (e) {
    this.setData({
      complete2: e.detail.value
    })
  },
  // ---------------------------------------发表评论
  formid_two: function (e) {
    console.log(e)
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: wx.getStorageSync('users').id,
        form_id: e.detail.formId,
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {

      },
    })
    var that = this
    var form_id = e.detail.formId
    var details = that.data.complete
    var user_id = that.data.user_id
    var post_info_id = that.data.post_info_id
    var tz_user_id = that.data.post.user_id
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
    function fun_submit(arg) {
      var date1 = new Date();
      var date2 = new Date(date1);
      date2.setDate(date1.getDate() + 7);
      var times = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
      return times
    }
    if (details == '' || details == null) {
      wx.showToast({
        title: '内容为空',
        icon: 'loading',
        duration: 1000,
      })
    } else {
      that.setData({
        replay: false,
        comment: false,
        complete: ''
      })
      app.util.request({
        'url': 'entry/wxapp/Comments',
        'cachetime': '0',
        data: { information_id: post_info_id, details: details, user_id: user_id },
        success: function (res) {
          if (res.data != 'error') {
            wx.showToast({
              title: '评论成功',
            })
            setTimeout(function () {
              that.reload()
            }, 1000)
          }
          else {
            wx.showToast({
              title: '评论失败',
              icon: 'loading',
            })
          }
        },
      })
    }
  },
  // ————————————————点击回复，弹出回复框——————————————————————
  reply1: function (e) {
    var that = this
    // 要回复的id
    var id = e.currentTarget.dataset.reflex_id
    var reflex_name = e.currentTarget.dataset.name
    var user_id = that.data.user_id
    var post_user_id = that.data.post.user_id
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data.state == 1) {
          that.setData({
            reply: true,
            reflex_id: id,
            reflex_name: '回复' + reflex_name
          })
        } else {
          wx: wx.showModal({
            title: '提示',
            content: '您的账号异常，请尽快联系管理员',
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
    })
    // if (post_user_id == user_id) {
    // }
    // else {
    //   wx.showToast({
    //     title: '管理员可回复',
    //     icon: 'loading',
    //     duration: 1000,
    //   })
    // }
  },
  formid_one: function (e) {
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: wx.getStorageSync('users').id,
        form_id: e.detail.formId,
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {

      },
    })
    var that = this
    that.setData({
      reply: false,
      comment: false,
      replyhf: false,
    })
  },
  SaveFormid: function (e) {
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: wx.getStorageSync('users').id,
        form_id: e.detail.formId,
      },
      success: function (res) {

      },
    })
  },
  // ------------------------------商家回复
  reply3: function (e) {
    var that = this, user_id = that.data.user_id, post_info_id = that.data.post_info_id
    // 商家要回复的评论id
    var reflex_id = that.data.reflex_id
    // 商家要回复的内容
    var details = that.data.complete1
    if (details == '' || details == null) {
      wx.showToast({
        title: '内容为空',
        icon: 'loading',
        duration: 1000,
      })
    } else {
      that.setData({
        reply: false,
        complete1: ''
      })
      app.util.request({
        'url': 'entry/wxapp/Comments',
        'cachetime': '0',
        data: { information_id: post_info_id, details: details, user_id: user_id, bid: reflex_id },
        success: function (res) {
          console.log(res)
          if (res.data != 'error') {
            wx.showToast({
              title: '回复成功',
            })
            setTimeout(function () {
              that.reload()
            }, 1000)
          }
        },
      })
    }

  },
  openhf: function (e) {
    var that = this
    // 要回复的id
    var id = e.currentTarget.dataset.reflex_id
    var reflex_name = e.currentTarget.dataset.name
    var hfid = e.currentTarget.dataset.hfid
    app.util.request({
      'url': 'entry/wxapp/GetUserInfo',
      'cachetime': '0',
      data: { user_id: that.data.user_id },
      success: function (res) {
        console.log(res)
        if (res.data.state == 1) {
          that.setData({
            replyhf: true,
            reflex_id: id,
            hfid: hfid,
            reflex_name: '回复' + reflex_name
          })
        } else {
          wx: wx.showModal({
            title: '提示',
            content: '您的账号异常，请尽快联系管理员',
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
    })
  },
  huifu: function (e) {
    var that = this, user_id = that.data.user_id, post_info_id = that.data.post_info_id, hfid = this.data.hfid
    // 商家要回复的评论id
    var reflex_id = this.data.reflex_id
    // 商家要回复的内容
    var details = that.data.complete2
    console.log(post_info_id, details, user_id, reflex_id, hfid)
    if (details == '' || details == null) {
      wx.showToast({
        title: '内容为空',
        icon: 'loading',
        duration: 1000,
      })
    } else {
      that.setData({
        replyhf: false,
        complete2: ''
      })
      app.util.request({
        'url': 'entry/wxapp/Comments',
        'cachetime': '0',
        data: { information_id: post_info_id, details: details, user_id: user_id, bid: reflex_id, hf_id: hfid },
        success: function (res) {
          console.log(res)
          if (res.data != 'error') {
            wx.showToast({
              title: '回复成功',
            })
            setTimeout(function () {
              that.reload()
            }, 1000)
          }
        },
      })
    }
  },
  // -----------------------------------拨打电话
  phone: function (e) {
    var that = this, user_id = wx.getStorageSync('users').id, openid = wx.getStorageSync("openid"), post = that.data.post
    if (this.data.alreadyCharge) {
      wx.makePhoneCall({
        phoneNumber: post.user_tel
      })
    }
    else {
      if (this.data.isios && this.data.system.is_pgzf == '2'){
        return wx.showModal({
          title: '暂不支持',
          content: '由于相关规范，iOS功能暂不可用',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#666'
        })
      }
      wx.showModal({
        title: '提示',
        content: '拨打电话需支付' + post.tel_money + '元',
        success: (res) => {
          if(res.confirm){
          app.util.request({
            'url': 'entry/wxapp/Call',
            data: { post_id: post.id, user_id, },
            success: function (res) {
              let order_id=res.data
              app.util.request({
                'url': 'entry/wxapp/CallPay',
                data: { order_id, },
                success: function (res) {
                  wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function (res) {
                      console.log('这里是支付成功')
                    },
                    'complete': function (res) {
                      console.log(res);
                      if (res.errMsg == 'requestPayment:fail cancel') {
                        wx.showToast({
                          title: '取消支付',
                          icon: 'loading',
                          duration: 1000
                        })
                      }
                      if (res.errMsg == 'requestPayment:ok') {
                        that.reload()
                        wx.showToast({
                          title: '支付成功',
                        })
                      }
                    }
                  })
                }
              })
            },
          })
          }
        }
      })
    }
  },
  // ----------------------------------动态改变样式
  move: function (e) {
    var that = this
    var select = that.data.select
    var arrow = that.data.arrow
    if (arrow == 1) {
      setTimeout(function () {
        that.setData({
          arrow: 2
        })
      }, 1500)
    } else {
      setTimeout(function () {
        that.setData({
          arrow: 1
        })
      }, 1500)
    }
    if (select == 1) {
      that.setData({
        select: 0
      })
    } else {
      that.setData({
        select: 1
      })
    }

  },
  formSubmit: function (e) {
    app.util.request({
      'url': 'entry/wxapp/SaveFormid',
      'cachetime': '0',
      data: {
        user_id: wx.getStorageSync('users').id,
        form_id: e.detail.formId,
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {

      },
    })
    var form_id = e.detail.formId
    console.log('用户的form——id是' + form_id)
    console.log(this.data)
    var openid = wx.getStorageSync("openid")
    console.log(openid)
    var that = this
    var post_info_id = that.data.tei_id
    var user_id = wx.getStorageSync('users').id
    var thumbs_up = Number(that.data.givelike)
    var tz_user_id = that.data.post.user_id
    app.util.request({
      'url': 'entry/wxapp/Like',
      'cachetime': '0',
      data: { information_id: post_info_id, user_id: user_id },
      success: function (res) {
        console.log(res)
        if (res.data == '1') {
          wx.showToast({
            title: '点赞成功',
            duration: 1000,
          })
          that.reload()
          that.setData({
            thumbs_ups: true,
            thumbs_up: thumbs_up + 1
          })
        }
        if (res.data == '不能重复点赞!') {
          wx: wx.showModal({
            title: '提示',
            content: '不能重复点赞',
            showCancel: true,
            cancelText: '取消',
            confirmText: '确认',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          that.setData({
            thumbs_ups: true,
          })
        }
      },
    })
  },
  shou: function (e) {
    wx: wx.reLaunch({
      url: '../index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  post: function (e) {
    wx: wx.reLaunch({
      url: '../fabu/fabu/fabu',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    this.reload()
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
    this.reload()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var ishbzf = this.data.system.is_hbzf;
    console.log(res, ishbzf)
    var that = this
    console.log(that.data)
    that.setData({
      share: true,
    })
    var name = that.data.post.user_name, uid = that.data.user_id
    var my_post = that.data.post_info_id
    var hb_money = Number(that.data.post.hb_money)
    var hb_content = that.data.system.hb_content
    var hbimg = that.data.system.hb_img
    console.log(hbimg)
    if (hbimg == '') {
      var fxhbimg = that.data.url2 + 'addons/zh_tcwq/template/images/hongbao.jpg'
    }
    else {
      var fxhbimg = that.data.url + that.data.system.hb_img
    }
    console.log(hb_money, hb_content, fxhbimg)
    if (hb_content == '') {
      var title = that.data.user_name + '邀您一起拆' + name + '的' + that.data.system.hb_name
    }
    else {
      var title = that.data.system.hb_content.replace('name', that.data.user_name)
      title = title.replace('type', '【' + that.data.post.type_name + '】')
    }
    app.util.request({
      'url': 'entry/wxapp/HbFx',
      'cachetime': '0',
      data: { information_id: that.data.post.id, user_id: uid },
      success: function (res) {
      },
    })
    that.setData({
      share_red: false
    })
    if (hb_money > 0 && res.from == "button" && ishbzf == '1') {
      return {
        title: title,
        path: '/zh_tcwq/pages/infodetial/infodetial?user_id=' + that.data.user_id + '&my_post=' + my_post + '&type=' + 1,
        imageUrl: fxhbimg,
        success: function (res) {
          console.log('这是转发成功')
          var user_id = that.data.user_id
          var id = that.data.post_info_id
          console.log(id, user_id)
          app.util.request({
            'url': 'entry/wxapp/GetHong',
            'cachetime': '0',
            data: { id: id, user_id: user_id },
            success: function (res) {
              console.log('领取')
              console.log(res)
              if (res.data == 'error') {
                wx.showModal({
                  title: '提示',
                  content: '手慢了，' + that.data.system.hb_name +'被抢光了',
                })
              }
            },
          })
          wx: wx.navigateTo({
            url: '../redbag/redinfo/see_rob?id=' + that.data.post_info_id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          that.setData({
            share: true,
            hb_share: false,
            rob_redbag: false
          })
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    else if (hb_money > 0 && res.from == "button" && ishbzf == '2') {
      return {
        title: title,
        path: '/zh_tcwq/pages/infodetial/infodetial?user_id=' + that.data.user_id + '&my_post=' + my_post + '&type=' + 1,
        success: function (res) {
          console.log('这是转发成功')
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    else if (hb_money > 0 && res.from == "menu") {
      return {
        title: title,
        path: '/zh_tcwq/pages/infodetial/infodetial?user_id=' + that.data.user_id + '&my_post=' + my_post + '&type=' + 1,
        success: function (res) {
          console.log('这是转发成功')
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
    else {
      return {
        title: '【' + that.data.post.type_name + '】' + ' ' + that.data.post.details,
        path: '/zh_tcwq/pages/infodetial/infodetial?user_id=' + that.data.user_id + '&my_post=' + my_post + '&type=' + 1,
        success: function (res) {
          console.log('这是转发成功')
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  },
  // 动态获取图片的宽高比例
  image: function (e) {
    if (e.currentTarget.dataset.inde == 0) {
      var that = this
      console.log(e)
      var img_height = e.detail.height
      var img_width = e.detail.width
      that.setData({
        proportion: img_height / img_width,
        img_height: img_height,
        img_width: img_width,
      })
    }
  },
  canvas: function (e) {
    console.log(this.data.url2 + this.data.qr_code)
    wx.navigateTo({
      url: 'canvas?proportion=' + this.data.proportion + '&img_height=' + this.data.img_height + '&img_width=' + this.data.width + '&post_info_id=' + this.data.post_info_id + '&qr_code=' + this.data.qr_code,
    })
  },
})