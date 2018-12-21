const app = getApp()
var util = require('../../utils/util.js');
const siteinfo = require('../../../siteinfo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "../../images/gobg.png",
    wechat: "../../images/wechat.png",
    quan: "../../images/quan.png",
    code: "E7AI98",
    inputValue: "",
    maskHidden: false,
    name: "",
    touxiang: "",
    code: "E7A93C",
    jjz:true,
  },
  //获取输入框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //点击提交按钮
  btnclick: function () {
    var text = this.data.inputValue
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    wx.setNavigationBarTitle({
      title: '海报',
    })
    var that = this, uid = wx.getStorageSync('users').id,siteroot = siteinfo.siteroot.slice(0, siteinfo.siteroot.length - 14);
    console.log(uid, options, siteroot)
    app.util.request({
      'url': 'entry/wxapp/GoodsInfo',
      'cachetime': '0',
      data: { goods_id: options.id },
      success: function (res) {
        console.log(res.data)
        res.data.goods.end_time = util.ormatDate(res.data.goods.end_time)
        that.setData({
          url:options.url,
          QgGoodInfo: res.data.goods,
        })
        wx.downloadFile({
          url: options.url + res.data.goods.logo, //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res)
            that.setData({
              qglogo: res.tempFilePath
            })
          }
        })
        //取商家详情;
        app.util.request({
          'url': 'entry/wxapp/StoreInfo',
          'cachetime': '0',
          data: { id: res.data.goods.store_id },
          success: function (res) {
            console.log(res.data)
            var stores = res.data.store[0]
            // 商家的logo
            var logo = options.url + stores.logo
            //poster;
            app.util.request({
              'url': 'entry/wxapp/GoodsCode',
              'cachetime': '0',
              data: { goods_id: options.id },
              success: function (res) {
                console.log(res)
                // 二维码的图片
                var logo1 = res.data
                console.log('商家的logo', logo, '小程序码logo1', siteroot +logo1)
                wx.downloadFile({
                  url: logo, //仅为示例，并非真实的资源
                  success: function (res) {
                    console.log(res)
                    that.setData({
                      logo: res.tempFilePath
                    })
                    wx.downloadFile({
                      url: siteroot +logo1, //仅为示例，并非真实的资源
                      success: function (res) {
                        console.log(res)
                        that.setData({
                          logo1: res.tempFilePath
                        })
                        that.ctx()
                      }
                    })
                  }
                })
              }
            });
            that.setData({
              sjinfo: res.data.store[0],
              score: Number(res.data.score).toFixed(1)
            })
          }
        });
      }
    })
    // wx.getUserInfo({
    //   success: res => {
    //     console.log(res.userInfo, "huoqudao le ")
    //     this.setData({
    //       name: res.userInfo.nickName,
    //     })
    //     wx.downloadFile({
    //       url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
    //       success: function (res) {
    //         // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //         if (res.statusCode === 200) {
    //           console.log(res, "reererererer")
    //           that.setData({
    //             touxiang: res.tempFilePath
    //           })
    //         }
    //       }
    //     })
    //   }
    // })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight,
        })
      }
    })
  },
  ctx: function (e) {
    var that = this
    var a = that.data
    var width = a.width//屏幕宽度
    var height = a.height//屏幕高度
    var leiWid = (width - 150) / 2
    // 声明画布
    var ctx = wx.createCanvasContext('ctx')
    ctx.drawImage(a.logo1, 0, 0, 150, 150)
    ctx.save()
    ctx.beginPath()
    ctx.arc(75, 75, 35, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(a.logo, 35, 35, 75, 75)
    ctx.restore()
    ctx.draw()
    setTimeout(function (e) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 150,
        height: 150,
        canvasId: 'ctx',
        success: function (res) {
          console.log(res.tempFilePath)
          that.setData({
            xcxm: res.tempFilePath
          })
          that.formSubmit();
        }
      })
    }, 500)
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#fff")
    context.fillRect(0, 0, 375, 667)
    var qglogo = that.data.qglogo, xcxm = that.data.xcxm;
    console.log(qglogo, xcxm, "qglogo")
    //绘制头像
    // context.drawImage(path2, 126, 186, 120, 120);
    // context.save(); // 保存当前context的状态
    var name = that.data.sjinfo.store_name, money = '￥' + that.data.QgGoodInfo.pt_price, price = '￥' + that.data.QgGoodInfo.y_price, title = that.data.QgGoodInfo.pt_price + '元,' + that.data.QgGoodInfo.people + '人拼团抢' + that.data.QgGoodInfo.name, endtime = "拼团结束日期:" +that.data.QgGoodInfo.end_time;
    //绘制名字
    context.setFontSize(24);
    context.setFillStyle('#000000');
    context.setTextAlign('center');
    context.fillText(name, 187.5, 50);
    context.stroke();
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    context.drawImage(qglogo, 40, 80, 295, 175);
    //绘制标语
    context.setFontSize(18);
    context.setFillStyle('#000000');
    context.setTextAlign('center');
    context.fillText(title, 187.5, 290);
    //绘制抢购价
    context.setFontSize(16);
    context.setFillStyle('#999');
    context.setTextAlign('center');
    context.fillText('拼团价', 80, 340);
    //绘制抢购价
    context.setFontSize(16);
    context.setFillStyle(that.data.color);
    context.setTextAlign('center');
    context.fillText(money, 135, 340);
    //绘制原价
    context.setFontSize(16);
    context.setFillStyle('#999');
    context.setTextAlign('center');
    context.fillText('原价', 220, 340);
    //绘制原价
    context.setFontSize(16);
    context.setFillStyle('#999');
    context.setTextAlign('center');
    context.fillText(price, 275, 340);
    context.stroke();
    context.setStrokeStyle('#999')
    context.moveTo(200, 335)
    context.lineTo(315, 335)
    context.stroke()
    context.setTextBaseline('middle')
    //线
    context.setStrokeStyle('#999')
    context.setLineDash([3, 5], 1);
    context.beginPath();
    context.moveTo(40, 310);
    context.lineTo(335, 310);
    context.stroke();
    //小程序码
    context.drawImage(that.data.xcxm, 125, 370, 125, 125);
    //
    context.setFillStyle('#000');
    context.setFontSize(16);
    context.setTextAlign('center');
    context.fillText("长按二维码识别小程序参与拼团", 187.5, 529);
    //
    context.setFillStyle('#333');
    context.setFontSize(13);
    context.setTextAlign('center');
    context.fillText(endtime, 187.5, 565);
    // context.drawImage(path5, 238, 618, 95, 28);
    // //绘制标语
    // context.setFontSize(24);
    // context.setFillStyle('#333333');
    // context.setTextAlign('center');
    // context.fillText(title, 60, 450);
    // context.stroke();
    // //绘制code码
    // context.setFontSize(16);
    // context.setFillStyle('#f44444');
    // context.setTextAlign('left');
    // context.fillText(that.data.yhqjetext, 40, 390);
    // context.stroke();
    // // context.setFontSize(14);
    // // context.setFillStyle('#D8D8D8');
    // // context.setTextAlign('left');
    // // context.fillText("元", 105, 385);
    // context.setFontSize(14);
    // context.setFillStyle('#999');
    // context.setTextAlign('left');
    // context.fillText(that.data.yhq.conditions, 40, 440);
    // context.stroke();
    // context.setFontSize(14);
    // context.setFillStyle('#999');
    // context.setTextAlign('left');
    // context.fillText("有效期至" + that.data.yhq.end_time, 150, 440);
    // context.drawImage(path2, 150, 365, 40, 40);
    // context.fillText(that.data.yhq.md_name, 200, 385);
    // //绘制左下角文字背景图
    // context.drawImage(path4, 25, 510, 184, 82);
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("长按识别图中右侧小程序码", 35, 530);
    // context.stroke();
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("进入小程序领取优惠券，数", 35, 550);
    // context.stroke();
    // context.setFontSize(12);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("量有限赶快哦~", 35, 570);
    // context.stroke();
    // //绘制右下角扫码提示语
    // context.drawImage(that.data.xcxm, 228, 488, 120, 120);
    // context.drawImage(path5, 238, 618, 95, 28);
    // context.setFillStyle('#ffe200');
    // context.fillText("扫码进入小程序", 242, 639);
    // context.stroke();
    // context.arc(186, 200, 50, 0, 2 * Math.PI) //画出圆
    // // context.strokeStyle = "#ffe200";
    // context.clip(); //裁剪上面的圆形
    // context.drawImage(path1, 136, 150, 100, 100); // 在刚刚裁剪的园上画图
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true,
            jjz:false,
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            wx.navigateBack({
              
            })
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (res) {
  //   return {
  //     title: "这个是我分享出来的东西",
  //     success: function (res) {
  //       console.log(res, "转发成功")
  //     },
  //     fail: function (res) {
  //       console.log(res, "转发失败")
  //     }
  //   }
  // }
})