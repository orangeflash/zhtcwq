const app = getApp()
var util = require('../../utils/util.js');
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
    var that = this, uid = wx.getStorageSync('users').id;
    console.log(uid, options)
    app.util.request({
      'url': 'entry/wxapp/GoodInfo',
      'cachetime': '0',
      data: { id: options.id },
      success: function (res) {
        res.data.good.lb_imgs = res.data.good.lb_imgs.split(",")
        console.log(res.data)
        that.setData({
          url:options.url,
          QgGoodInfo:res.data,
        })
        var logo = options.url + res.data.good.lb_imgs[0];
        app.util.request({
          'url': 'entry/wxapp/StoreGoodCode',
          'cachetime': '0',
          data: { store_id: options.id },
          success: function (res) {
            console.log(res)
            // 二维码的图片
            var logo1 = res.data
            console.log('商品的logo', logo, '小程序码logo1', logo1)
            wx.downloadFile({
              url: logo, //仅为示例，并非真实的资源
              success: function (res) {
                console.log(res)
                that.setData({
                  logo: res.tempFilePath
                })
                wx.downloadFile({
                  url: logo1, //仅为示例，并非真实的资源
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
      }
    })
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })
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
    var qglogo = that.data.logo, xcxm = that.data.xcxm;
    console.log(qglogo, xcxm, "qglogo")
    //绘制头像
    context.drawImage(qglogo, 12.5, 16, 350, 350);
    // //绘制名字
    var text = that.data.QgGoodInfo.good.goods_name;//这是要绘制的文本
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(22)
    context.setFillStyle("#000000")
    for (var a = 0; a < chr.length; a++) {
      if (context.measureText(temp).width < 250) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (context.measureText(test).width < 220) {
          test += rowPart[a];
        }
        else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..."//这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      context.fillText(row[b], 25, 490 + b * 30, 180);
    }
    //线
    context.setStrokeStyle('#999')
    context.setLineDash([3, 5], 1);
    context.beginPath();
    context.moveTo(20, 390);
    context.lineTo(355, 390);
    context.stroke();
    //小程序码
    context.drawImage(that.data.xcxm, 230, 450, 125, 125);
    //
    context.setFillStyle('#666');
    context.setFontSize(16);
    context.fillText("长按识别小程序", 240, 609);
    context.setFillStyle('#FF3030');
    context.setFontSize(24);
    context.fillText("￥"+that.data.QgGoodInfo.good.goods_cost, 20, 609);
    //绘制头像
    context.drawImage(that.data.touxiang, 20, 406, 30, 30);
    context.setFillStyle('#666');
    context.setFontSize(14);
    context.fillText(that.data.name + "为你推荐", 60, 425);
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