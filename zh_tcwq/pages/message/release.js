// zh_tcwq/pages/message/release.js
var app = getApp()
var imgArray1 = []
var imgArray2 = []
var imgArray3 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add1: [
      {
        id: 'imgArray' + '1'
      }
    ],
    length1:540,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(this);
    var url = wx.getStorageSync("url2")
    var img_url = wx.getStorageSync("url")
    that.setData({
      url: url,
      img_url: img_url
    })
    app.util.request({
      'url': 'entry/wxapp/ZxType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          zx:res.data
        })
      }
    })
  },
  imgArray1: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    var img_length = 9 - imgArray1.length
    console.log(img_length)
    if (img_length > 0 && img_length <= 9) {
      // 选择图片
      wx.chooseImage({
        count: img_length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.showToast({
            icon: "loading",
            title: "正在上传"
          })
          var imgsrc = res.tempFilePaths;
          that.uploadimg({
            url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=Upload&m=zh_tcwq',
            path: imgsrc
          });
        }
      })
    } else {
      wxd: wx.showModal({
        title: '上传提示',
        content: '最多上传9张图片',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,
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
          imgArray1.push(resp.data)
          that.setData({
            imgArray1: imgArray1
          })
          console.log('上传商家轮播图时候提交的图片数组', imgArray1)
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
          that.setData({
            images: data.path
          });
          wx.hideToast();
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });
  },
  classifation: function (e) {
    var that = this
    console.log(that.data)
    var zx = that.data.zx
    var index = e.currentTarget.dataset.index
    var type_id = e.currentTarget.dataset.id
    that.setData({
      activeIndex: index,
      index: index,
      type_id: type_id
    })
  },













  //  ----------------------------------删除商家上传的轮播图----------------------------------
  delete1: function (e) {
    var that = this
    console.log(e)
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };
    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    var index = e.currentTarget.dataset.inde
    imgArray1.remove(imgArray1[index])
    that.setData({
      imgArray1: imgArray1
    })
  },
  add: function (e) {
    var that = this
    wx:wx.reLaunch({
      url: '../index/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  formSubmit: function (e) {
    console.log(e)
    var that = this
    var city_type = wx.getStorageSync('city_type')
    // if (city_type == 1) {
    //   var city = wx.getStorageSync('city')
    // } else {
    //   var city = wx.getStorageSync('city1')
    // }
    var city = wx.getStorageSync('city')
    var add1 = that.data.add1
    var text1 = e.detail.value.text1, video = e.detail.value.video;
    // 替换回车符
    var text1 = text1.replace("\n", "↵");
    var details = e.detail.value.details
    var user_id = wx.getStorageSync("users").id
    console.log(user_id)
    var type_id = that.data.type_id
    var title = ''
    if (type_id == null) {
      title = '还没有选择分类哦'
    }else if (details == '') {
      title = '标题不能为空'
    }else if (add1.length == 1) {
      if (text1 == '') {
        title = '内容不能为空'
      }else if(imgArray1.length==0){
        var img = ''
      }else if(imgArray1.length>0){
        var img = imgArray1.join(",") 
      }
    } 
    if (title != '') {
      wx: wx.showModal({
        title: '提示',
        content: title,
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      app.util.request({
        'url': 'entry/wxapp/Zx',
        'cachetime': '0',
        data:{
          type_id:type_id,
          user_id:user_id,
          title:details,
          content: text1,
          imgs:img,
          cityname: city,
          video: video,
        },
        success: function (res) {
          console.log(res)
          if(res.data==1){
            wx:wx.showToast({
              title: '发布成功',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
            setTimeout(function(){
              wx: wx.redirectTo({
                url: 'message',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            },2000)
          }
        }
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
    imgArray1.splice(0, imgArray1.length)
    imgArray3.splice(0, imgArray3.length)
    imgArray2.splice(0, imgArray2.length)
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