// pages/tongcheng/tongcheng.js
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
};
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  inputValue: '',
  data: {
    page: 1,
    refresh_top: false,
    seller: [],
    typeid:'',
    infortype: [{ id: 0, type_name: "推荐" }],
    activeIndex: 0,
    swiperCurrent: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    slide: [
      { img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1513057315830&di=28c50097b1b069b2de68f70d625df8e2&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fa8014c086e061d95cb1b561170f40ad162d9cabe.jpg', },
      { img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=570437944,358180613&fm=27&gp=0.jpg', }
    ],
  },

  // ———————————轮播滑动事件———————————
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
    })
    if (options.name) {
      wx.setNavigationBarTitle({
        title: options.name,
      })
    }
    this.setData({
      titlename:options.name,
      System: wx.getStorageSync('System'),
    })
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/VideoType',
      'cachetime': '0',
      //  data: { cityname: city },
      success: function (res) {
        console.log(res, that.data.infortype)
        var vdarr = that.data.infortype.concat(res.data)
        console.log(vdarr)
        that.setData({
          infortype: vdarr,
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Url',
      'cachetime': '0',
      success: function (res) {
        that.setData({
          url: res.data
        })
      },
    })
    this.seller(this.data.typeid)
  },
  tabClick: function (e) {
    console.log(e.currentTarget.id, e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index==0){
      var typeid='';
    }
    else{
      var typeid = e.currentTarget.id;
    }
    this.setData({
      page: 1,
      refresh_top: false,
      seller: [],
      activeIndex: e.currentTarget.dataset.index,
      typeid: typeid,
    });
    setTimeout(()=>{
      this.seller(typeid)
    },300)
  },
  // -----------------------------------帖子信息--------------------------------
  seller: function (typeid) {
    console.log('typeid为', typeid)
    var that = this
    var city = wx.getStorageSync('city')
    var page = that.data.page
    var seller = that.data.seller
    console.log(city)
    app.util.request({
      'url': 'entry/wxapp/VideoList',
      'cachetime': '0',
      data: { type_id: typeid, page: page,pagesize:5, cityname: city },
      success: function (res) {
        console.log(res.data)
        if (res.data.length <5) {
          that.setData({
            refresh_top: true
          })
        } else {
          that.setData({
            refresh_top: false,
            page: page + 1
          })
        }
        seller = seller.concat(res.data)
        function unrepeat(arr) {
          var newarr = [];
          for (var i = 0; i < arr.length; i++) {
            if (newarr.indexOf(arr[i]) == -1) {
              newarr.push(arr[i]);
            }
          }
          return newarr;
        }
        seller = unrepeat(seller)
        console.log(seller)
        that.setData({
          seller: seller
        })
        // if (res.data.length > 0) {
        //   for (let i in res.data) {
        //     var time1 = app.ormatDate(res.data[i].tz.sh_time);
        //     res.data[i].tz.img = res.data[i].tz.img.split(",")
        //     if (res.data[i].tz.img.length > 4) {
        //       res.data[i].tz.img_length = Number(res.data[i].tz.img.length) - 4
        //     }
        //     if (res.data[i].tz.img.length >= 4) {
        //       res.data[i].tz.img1 = res.data[i].tz.img.slice(0, 4)
        //     } else {
        //       res.data[i].tz.img1 = res.data[i].tz.img
        //     }
        //     res.data[i].tz.time = time1.slice(0, 16)

        //   }
        //   function rgb() {
        //     var r = Math.floor(Math.random() * 255);
        //     var g = Math.floor(Math.random() * 255);
        //     var b = Math.floor(Math.random() * 255);
        //     var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
        //     return rgb;
        //   }
        //   for (let i in seller) {
        //     for (let j in seller[i].label) {
        //       seller[i].label[j].number = rgb()
        //     }

        //     that.setData({
        //       seller: seller
        //     })
        //   }
        // } else {
        //   that.setData({
        //     seller: seller
        //   })
        // }
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
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
    console.log('上拉触底')
    if (this.data.refresh_top == false) {
      this.seller(this.data.typeid)
    } else {
      console.log('没有更多了')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var titlename = this.data.titlename;
    console.log(titlename)
    return {
      title: titlename,
      path: '/zh_tcwq/pages/spzx/spzx?name=' + titlename,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})