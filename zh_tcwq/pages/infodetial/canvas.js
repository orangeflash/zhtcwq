// zh_tcwq/pages/infodetial/canvas.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      img_height: options.img_height,
      img_width: options.img_width,
      proportion: options.proportion,
    })
    // 获取系统设置
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight,
        })
      }
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function(res) {
        console.log(res)
        that.setData({
          system: res.data,
        })
      }
    })
    // 获取url
    app.util.request({
      'url': 'entry/wxapp/Url2',
      'cachetime': '0',
      success: function(res) {
        console.log(res)
        console.log(res.data + options.qr_code)
        wx.downloadFile({
          url: res.data + options.qr_code, //仅为示例，并非真实的资源
          success: function(res) {
            console.log(res.tempFilePath)
            var qr_code = res.tempFilePath
            that.setData({
              qr_code: qr_code
            })
            // ------------------------------获取帖子信息-------------------------
            app.util.request({
              'url': 'entry/wxapp/PostInfo',
              'cachetime': '0',
              data: {
                id: options.post_info_id
              },
              success: function(res) {
                console.log(res)
                res.data.tz.details = res.data.tz.details.replace(/[\r\n]/g, "")
                if (res.data.tz.img != '') {
                  res.data.tz.img = res.data.tz.img.split(",")
                  that.setData({
                    post: res.data.tz
                  })
                  that.logo()
                } else {
                  that.setData({
                    post: res.data.tz
                  })
                  that.canvas()
                }
              },
            })
          }
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function(res) {
        that.setData({
          url: res.data
        })
      },
    })
  },
  logo: function(e) {
    var that = this
    var a = that.data
    console.log(a)
    wx.downloadFile({
      url: a.url + a.post.img[0], //仅为示例，并非真实的资源
      success: function(res) {
        console.log(res.tempFilePath)
        var logo = res.tempFilePath
        that.setData({
          logo: logo
        })
        that.canvas()
      }
    })
  },
  canvas: function(e) {
    var that = this
    var a = that.data
    var logo = a.logo
    var width = a.width
    var height = a.height
    var text_width = a.width - 40
    that.setData({
      text_width: text_width
    })
    var proportion = a.proportion
    var text = that.data.post.details
    var chr = text.split(""); //这个方法是将一个字符串分割成字符串数组
    console.log(chr)
    var temp = "";
    var row = [];
    var ctx = wx.createCanvasContext('firstCanvas')
    // for (var a = 0; a < chr.length; a++) {
    //   if (ctx.measureText(temp).width < text_width) {
    //     temp += chr[a];
    //   } else {
    //     row.push(temp);
    //     temp = "";
    //   }
    // }
    // row.push(temp)
    // for (var b = 0; b < row.length; b++) {
    //   row[b] = row[b].replace(/[\r\n]/g, "")
    // }
    var row = [];
    for (var i = 0, len = chr.length; i < len; i += text_width/14) {
      row.push(chr.slice(i, i + text_width / 14));
    }
    console.log(row)
    for(let i in row){
      row[i] = row[i].join("")
    }
    var text_height = 180 + row.length * 30
    if (logo != null) {
      var canvas_height = 200 + row.length * 30 + text_width * proportion
    } else {
      var canvas_height = 200 + row.length * 30
    }
    console.log(canvas_height)
    that.setData({
      canvas_height: canvas_height,
      text_height: text_height,
      row: row
    })
    // canvasContext.clearActions()
    that.save_canvas()
  },
  save_canvas: function(e) {
    var that = this
    var a = that.data
    var logo = a.logo
    var width = a.width
    var proportion = a.proportion
    var text_width = a.width - 40
    var canvas_height = a.canvas_height
    var ctx = wx.createCanvasContext('firstCanvas')
    ctx.setFillStyle('#fff')
    ctx.rect(0, 0, width, canvas_height)
    ctx.fill()
    ctx.drawImage(a.qr_code, width - 120, 20, 100, 100)
    ctx.fillStyle = "#999";
    ctx.setFontSize(14)
    ctx.fillText("长按识别二维码,查看详情", width - 110, 150, 80, 80);
    ctx.fillStyle = "#000";
    ctx.setFontSize(18)
    ctx.fillText(that.data.post.type_name, 20, 60);
    ctx.fillStyle = "#999";
    ctx.setFontSize(14)
    ctx.fillText(app.ormatDate(a.post.sh_time) + '发布', 20, 90);
    ctx.fillText(a.post.views + '人浏览', 20, 110);
    var text = that.data.post.details; //这是要绘制的文本
    console.log(text)
    var chr = text.split(""); //这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    ctx.setFontSize(14)
    ctx.setFillStyle("#000")
    var row = a.row
    for (var b = 0; b < row.length; b++) {
      console.log(row[b])
      ctx.fillText(row[b], 20, 180 + b * 30, text_width);
    }
    if (logo != null) {
      ctx.drawImage(logo, 20, 180 + b * 30, text_width, text_width * proportion)
    }
    ctx.draw()
  },
  // 保存图片
  totemp: function(e) {
    var that = this
    var width = this.data.width
    var height = this.data.canvas_height
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      canvasId: 'firstCanvas',
      success: function(res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            console.log(res)
            wx.showToast({
              title: '保存成功',
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 2
              })
            }, 1500)
          },
          fail: res => {
            //  console.log(res)
          },
          complete: res => {
            // console.log(res)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})