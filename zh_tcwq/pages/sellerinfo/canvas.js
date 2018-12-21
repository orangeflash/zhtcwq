// zh_tcwq/pages/sellerinfo/canvas.js
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
  onLoad: function (options) {
    var that = this
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          v_wid: res.windowWidth-40
        })

        var text_width = res.windowWidth - 110
        // 商品名称
        var row = []
        for (var i = 0, len = options.title.length; i < len; i += text_width / 14) {
          row.push(options.title.slice(i, i + text_width / 14))
        }
        wx.downloadFile({
          url: options.url + options.img, //仅为示例，并非真实的资源
          success: function (res) {
            console.log(res)
            that.setData({
              logo1: res.tempFilePath,
              op: options,
              row: row
            })
            that.canvas()
          }
        })
      }
    })
  },

  canvas: function (e) {
    var that = this
    var a = that.data
    var width = a.width//屏幕宽度
    var height = a.height//屏幕高度
    var leiWid = (width - 150) / 2
    var imgWid = width-60
    var imgHei = width
    var row = a.row
    // 声明画布
    // console.log(a.logo1)
    var user_name = wx.getStorageSync('users').name
    console.log(a)
    var context = wx.createCanvasContext('firstCanvas')
    context.rect(0, 0, width, height)
    context.setFillStyle('#fff')
    context.fill()
    context.fillStyle = "red";
    context.setFontSize(16)
    context.fillText(user_name , 10, 30);
    context.fillStyle = "#222";
    context.setFontSize(16)
    context.fillText('分享给你一个商品', 10+user_name.length*17,30);
    context.drawImage(a.logo1, 10, 50, imgWid, imgHei)
    context.drawImage(a.op.logo, width - 130, imgWid + 140, 80, 80)
    context.fillStyle = "#333";
    context.setFontSize(12)
    console.log(row)
    for (var b = 0; b < row.length; b++) {
      console.log(row[b])
      context.fillText(row[b], 10, imgHei + 80 + 20 * b);
    }
    // 商品价格
    context.fillStyle = "red";
    context.setFontSize(16)
    context.fillText('￥', 10, imgHei + 130);
    context.fillStyle = "red";
    context.setFontSize(22)
    context.fillText(a.op.price, 30, imgHei + 130);
    // 长按识别二维码
    context.fillStyle = "#ccc";
    context.setFontSize(14)
    context.fillText('长按识别小程序码访问', 10, imgHei + 150);
    context.draw()
    // setTimeout(function (e) {
    //   wx.canvasToTempFilePath({
    //     x: 0,
    //     y: 0,
    //     width: 150,
    //     height: 150,
    //     canvasId: 'firstCanvas',
    //     success: function (res) {
    //       that.setData({
    //         logo: res.tempFilePath
    //       })
    //     }
    //   })
    // }, 100)

  },
  // 保存图片
  totemp: function (e) {
    var that = this
    var width = this.data.width
    var height = this.data.height
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      canvasId: 'firstCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            console.log(res)
            wx.showToast({
              title: '保存成功',
            })
            // setTimeout(function () {
            //   wx.navigateBack({
            //     delta: 2
            //   })
            // }, 1500)
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