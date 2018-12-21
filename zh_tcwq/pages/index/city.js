// // var city = require('../../utils/city.js');
// var many_city = require('../../utils/many_city.js');
var app = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dqwz: "定位中...",
    hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' }, { cityCode: 120000, city: '天津市' }, { cityCode: 610100, city: '西安市' },],
    commonCityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }],
    countyList: [{ cityCode: 110000, county: 'A区' }, { cityCode: 310000, county: 'B区' }, { cityCode: 440100, county: 'C区' }, { cityCode: 440300, county: 'D区' }, { cityCode: 330100, county: 'E县' }, { cityCode: 320100, county: 'F县' }, { cityCode: 420100, county: 'G县' }],
    region: ['北京市', '北京市', '东城区'],
    radioItems: [],
  },
  bindRegionChange: function (e) {
    var dq = e.detail.value
    var radioItems = [], dwmore = this.data.System.dw_more;
    console.log('picker发送选择改变，携带值为', e.detail.value, dwmore)
    if (dwmore == '2') {
      for (let i = 1; i < dq.length; i++) {
        var obj = {}
        if (dq[i] == '县') {
          obj.name = dq[i - 1], obj.value = i;
        }
        else {
          obj.name = dq[i], obj.value = i;
        }
        radioItems.push(obj)
      }
    }
    if (dwmore == '1'){
      var obj = {}
      obj.name = dq[2], obj.value = 2;
      radioItems.push(obj)
    }
    console.log(radioItems)
    radioItems[0].checked = true
    this.setData({
      region: e.detail.value,
      radioItems: radioItems,
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].name == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var xzcity = e.detail.value.radiogroup
    console.log(xzcity)
    wx.setStorageSync('city', xzcity);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      city: xzcity,
      page: 1,
      activeIndex: 0,
      swipecurrent: 0,
      seller: [],
    })
    prevPage.reload()
    prevPage.refresh()
    prevPage.seller()
    wx.setStorageSync('city_type', 1)
    wx: wx.navigateBack({
      url: 'index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/System',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          System: res.data,
        })
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: res.data.mapkey
        }), that.getLocation();
        // var dq = that.data.region
        // var radioItems = [], dwmore = res.data.dw_more;
        // console.log(dq,dwmore)
        // if (dwmore == '2') {
        //   for (let i = 1; i < dq.length; i++) {
        //     var obj = {}
        //     if (dq[i] == '县') {
        //       obj.name = dq[i - 1], obj.value = i;
        //     }
        //     else {
        //       obj.name = dq[i], obj.value = i;
        //     }
        //     radioItems.push(obj)
        //   }
        // }
        // if (dwmore == '1') {
        //   var obj = {}
        //   obj.name = dq[2], obj.value = 2;
        //   radioItems.push(obj)
        // }
        // console.log(radioItems)
        // radioItems[0].checked = true
        // that.setData({
        //   radioItems: radioItems,
        // })
      }
    });
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        // 调用接口
        qqmapsdk.reverseGeocoder({
          coord_type:1,
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res);
            that.setData({
              dqwz: res.result.formatted_addresses.recommend,
              region: [res.result.address_component.province, res.result.address_component.city, res.result.address_component.district]
            })
            var dq = that.data.region
            var radioItems = [], dwmore = that.data.System.dw_more;
            console.log(dq, dwmore)
            if (dwmore == '2') {
              for (let i = 1; i < dq.length; i++) {
                var obj = {}
                if (dq[i] == '县') {
                  obj.name = dq[i - 1], obj.value = i;
                }
                else {
                  obj.name = dq[i], obj.value = i;
                }
                radioItems.push(obj)
              }
            }
            if (dwmore == '1') {
              var obj = {}
              obj.name = dq[2], obj.value = 2;
              radioItems.push(obj)
            }
            console.log(radioItems)
            radioItems[0].checked = true
            that.setData({
              radioItems: radioItems,
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
// Page({
//   data: {
//     showLetter: "",
//     winHeight: 0,
//     tHeight: 0,
//     bHeight: 0,
//     startPageY: 0,
//     cityList: [],
//     isShowLetter: false,
//     scrollTop: 0,
//     city: "",
//     activeIndex: 'A',
//     index: 'A',
//     result: [],
//     activeIndex1: 0,
//     activeIndex2: 0,
//     activeIndex3: 0,
//     show: true,
//   },
//   onLoad: function (options) {
//     var that = this
//     // 生命周期函数--监听页面加载
//     // var province = many_city.city
//     // var province_city = province[0].cityList
//     // var province_area = province_city[0].areaList
//     // console.log(province_city,province_area)
//     // that.setData({
//     //   many_city: many_city.city,
//     //   province_city: province_city,
//     //   province_area: province_area
//     // })
//     wx.getSystemInfo({
//       success: function (res) {
//         that.setData({
//           windowHeight: res.windowHeight,
//           search_top: 0
//         })
//       }
//     })
//     wx.setNavigationBarColor({
//       frontColor: '#ffffff',
//       backgroundColor: wx.getStorageSync('color'),
//       animation: {
//         duration: 0,
//         timingFunc: 'easeIn'
//       }
//     })
//     var getCityList = wx.getStorageSync('getCityList')
//     console.log(getCityList)
//     if (getCityList) {
//       var res = getCityList
//       var province = res.result[0], province_cidx = province[0].cidx;
//       var province_city = res.result[1].slice(province_cidx[0], province_cidx[1] + 1), province_citycidx = province_city[0].cidx;
//       if (province_citycidx == null) {
//         var province_city = []
//         var province_area = res.result[1].slice(province_cidx[0], province_cidx[1] + 1);
//       }
//       else {
//         var province_city = res.result[1].slice(province_cidx[0], province_cidx[1] + 1);
//         var province_area = res.result[2].slice(province_citycidx[0], province_citycidx[1] + 1);
//       }
//       console.log(province, province_cidx, province_city, province_citycidx, province_area)
//       that.setData({
//         show: false,
//         allcitydata: res.result,
//         many_city: province,
//         province_city: province_city,
//         province_area: province_area
//       })
//     }
//     else {
//       app.util.request({
//         'url': 'entry/wxapp/System',
//         'cachetime': '0',
//         success: function (res) {
//           console.log(res)
//           // 实例化API核心类
//           qqmapsdk = new QQMapWX({
//             key: res.data.mapkey
//           });
//           // 调用接口
//           qqmapsdk.getCityList({
//             success: function (res) {
//               console.log(res);
//               wx.setStorageSync('getCityList', res)
//               var province = res.result[0], province_cidx = province[0].cidx;
//               var province_city = res.result[1].slice(province_cidx[0], province_cidx[1] + 1), province_citycidx = province_city[0].cidx;
//               if (province_citycidx == null) {
//                 var province_city = []
//                 var province_area = res.result[1].slice(province_cidx[0], province_cidx[1] + 1);
//               }
//               else {
//                 var province_city = res.result[1].slice(province_cidx[0], province_cidx[1] + 1);
//                 var province_area = res.result[2].slice(province_citycidx[0], province_citycidx[1] + 1);
//               }
//               console.log(province, province_cidx, province_city, province_citycidx, province_area)
//               that.setData({
//                 show: false,
//                 allcitydata: res.result,
//                 many_city: province,
//                 province_city: province_city,
//                 province_area: province_area
//               })
//             },
//             fail: function (res) {
//               console.log(res);
//             },
//             complete: function (res) {
//               console.log(res);
//             }
//           });
//         }
//       })
//     }
//     // app.util.request({
//     //   'url': 'entry/wxapp/GetCity',
//     //   'cachetime': '0',
//     //   data: { user_id: wx.getStorageSync('users').id },
//     //   success: function (res) {
//     //     console.log(res)
//     //     for (let i in res.data) {
//     //       res.data[i].cityname = res.data[i].cityname.substr(0, res.data[i].cityname.length - 1)
//     //     }
//     //     that.setData({
//     //       search_ji: res.data
//     //     })
//     //     if (res.data.length != 0) {
//     //       wx.getSystemInfo({
//     //         success: function (res) {
//     //           that.setData({
//     //             windowHeight: res.windowHeight - 146,
//     //             search_top: 146
//     //           })
//     //         }
//     //       })
//     //     } else {
//     //       wx.getSystemInfo({
//     //         success: function (res) {
//     //           that.setData({
//     //             windowHeight: res.windowHeight - 73,
//     //             search_top: 80
//     //           })
//     //         }
//     //       })
//     //     }
//     //   },
//     // })
//   },
//   refresh: function (e) {
//     var that = this
//     var value = that.data.value
//     var sz = that.data.sz
//     if (value != '') {
//       var result = sz.filter(item => item.indexOf(value) >= 0)
//     } else {
//       var result = []
//     }
//     that.setData({
//       result: result
//     })
//   },
//   // 第一个滚动框选择省份
//   selectMenu: function (e) {
//     this.setData({
//       activeIndex2: 0,
//       activeIndex3: 0,
//     })
//     var allcitydata = this.data.allcitydata;
//     var index = e.currentTarget.dataset.itemIndex, province_cidx = allcitydata[0][index].cidx;
//     console.log(index)
//     var province_city = allcitydata[1].slice(province_cidx[0], province_cidx[1] + 1), province_citycidx = province_city[0].cidx;
//     if (province_citycidx == null) {
//       var province_city = []
//       var province_area = allcitydata[1].slice(province_cidx[0], province_cidx[1] + 1);
//     }
//     else {
//       var province_city = allcitydata[1].slice(province_cidx[0], province_cidx[1] + 1);
//       var province_area = allcitydata[2].slice(province_citycidx[0], province_citycidx[1] + 1);
//     }
//     console.log(province_city, province_cidx, province_citycidx, province_area)
//     this.setData({
//       // toView: index,
//       // index_one: index,
//       activeIndex1: index,
//       province_city: province_city,
//       province_area: province_area,
//     })
//   },
//   // 第二个滚动框选择城市
//   selectMenu_city: function (e) {
//     this.setData({
//       activeIndex3: 0,
//     })
//     console.log(e)
//     var allcitydata = this.data.allcitydata;
//     // 获取选择城市的下标
//     var index = e.currentTarget.dataset.itemIndex;
//     console.log(index)
//     // 获取所属城市下面的区
//     var province_city = this.data.province_city, province_citycidx = province_city[index].cidx;
//     if (province_citycidx == null) {
//       var province_area = []
//     }
//     else {
//       var province_area = allcitydata[2].slice(province_citycidx[0], province_citycidx[1] + 1);
//     }
//     console.log(province_city, province_citycidx, province_area)
//     // 输出所属结果
//     this.setData({
//       activeIndex2: index,
//       province_area: province_area,
//     })
//   },
//   // 第三个滚动框选择区
//   selectMenu_area: function (e) {
//     console.log(e)
//     var province_area = this.data.province_area
//     // 获取所选择的区
//     var index = e.currentTarget.dataset.itemIndex;
//     console.log(index, province_area)
//     this.setData({
//       activeIndex3: index,
//     })
//   },
//   xzcs: function () {
//     var that = this;
//     var activeIndex1 = this.data.activeIndex1, activeIndex2 = this.data.activeIndex2;
//     console.log(activeIndex1, activeIndex2, this.data.province_city, this.data.province_area)
//     if (this.data.province_city.length == 0) {
//       var xzcity = this.data.allcitydata[0][activeIndex1].fullname
//     }
//     else {
//       var xzcity = this.data.province_city[activeIndex2].fullname;
//     }
//     console.log(xzcity)
//     // var arr = ['北京', '上海', '天津', '重庆'],xzcity;
//     // if (arr.indexOf(this.data.many_city[activeIndex1].name)==-1){
//     //    console.log('省')
//     //    console.log(this.data.province_city[activeIndex2].name)
//     //    if (this.data.province_city[activeIndex2].name == '省直辖县级行政单位' || this.data.province_city[activeIndex2].name == '省直辖行政单位') {
//     //      wx.showModal({
//     //        title: '提示',
//     //        content: '请选择有效的城市',
//     //      })
//     //      return false;
//     //    }
//     //    xzcity = this.data.province_city[activeIndex2].name
//     // }
//     // else{
//     //   console.log(arr.indexOf(this.data.many_city[activeIndex1].name))
//     //   console.log('直辖市', this.data.many_city[activeIndex1].name)
//     //   xzcity = this.data.many_city[activeIndex1].name + '市'
//     // }
//     // console.log(xzcity)
//     wx.setStorageSync('city', xzcity);
//     //---------------------------------- 传入最新城市----------------------------------
//     // app.util.request({
//     //   'url': 'entry/wxapp/SaveHotCity',
//     //   'cachetime': '0',
//     //   data: { cityname: xzcity, user_id: wx.getStorageSync('users').id },
//     //   success: function (res) {
//     //     console.log(res)
//     //   },
//     // })
//     var pages = getCurrentPages();
//     var currPage = pages[pages.length - 1]
//     var prevPage = pages[pages.length - 2]
//     prevPage.setData({
//       city: xzcity,
//       page: 1,
//       activeIndex: 0,
//       swipecurrent: 0,
//       seller: [],
//     })
//     prevPage.reload()
//     prevPage.refresh()
//     prevPage.seller()
//     wx.setStorageSync('city_type', 1)
//     wx: wx.navigateBack({
//       url: 'index',
//     })
//   },
//   xzqx: function () {
//     var that = this;
//     var activeIndex1 = this.data.activeIndex1, activeIndex2 = this.data.activeIndex2, activeIndex3 = this.data.activeIndex3, xzqx;
//     if (this.data.province_area.length == 0) {
//       wx.showModal({
//         title: '提示',
//         content: '你选择的当前城市属于地级市，没有下辖区县',
//       })
//       return false;
//     }
//     console.log(activeIndex1, activeIndex2, activeIndex3, this.data.province_area[activeIndex3].fullname)
//     xzqx = this.data.province_area[activeIndex3].fullname;
//     //   if (this.data.province_area[activeIndex3] =='市辖区'){
//     //     wx.showModal({
//     //       title: '提示',
//     //       content: '请选择有效的区县',
//     //     })
//     //     return false;
//     //   }
//     //   else{
//     //     xzqx = this.data.province_area[activeIndex3]
//     //   }
//     //   console.log(xzqx)
//     wx.setStorageSync('city', xzqx);
//     //   //---------------------------------- 传入最新城市----------------------------------
//     //   // app.util.request({
//     //   //   'url': 'entry/wxapp/SaveHotCity',
//     //   //   'cachetime': '0',
//     //   //   data: { cityname: xzqx, user_id: wx.getStorageSync('users').id },
//     //   //   success: function (res) {
//     //   //     console.log(res)
//     //   //   },
//     //   // })
//     var pages = getCurrentPages();
//     var currPage = pages[pages.length - 1]
//     var prevPage = pages[pages.length - 2]
//     prevPage.setData({
//       city: xzqx,
//       page: 1,
//       activeIndex: 0,
//       swipecurrent: 0,
//       seller: [],
//     })
//     prevPage.reload()
//     prevPage.refresh()
//     prevPage.seller()
//     wx.setStorageSync('city_type', 1)
//     wx: wx.navigateBack({
//       url: 'index',
//     })
//   },
//   // // selectMenu: function (e) {
//   // //   console.log(e)
//   // //   var index = e.currentTarget.dataset.itemIndex;
//   // //   this.setData({
//   // //     toView: index,
//   // //     index: index,
//   // //     activeIndex: index
//   // //   })
//   // // },
//   // select_city: function (e) {
//   //   var that = this
//   //   var city = e.currentTarget.dataset.city + '市';
//   //   wx.setStorageSync('city', city);
//   //   //---------------------------------- 传入最新城市----------------------------------
//   //   app.util.request({
//   //     'url': 'entry/wxapp/SaveHotCity',
//   //     'cachetime': '0',
//   //     data: { cityname: city, user_id: wx.getStorageSync('users').id },
//   //     success: function (res) {
//   //       console.log(res)
//   //     },
//   //   })
//   //   var pages = getCurrentPages();
//   //   var currPage = pages[pages.length - 1]
//   //   var prevPage = pages[pages.length - 2]
//   //   prevPage.setData({
//   //     city: city,
//   //     page: 1,
//   //     activeIndex: 0,
//   //     swipecurrent: 0,
//   //     seller: [],
//   //   })
//   //   prevPage.reload()
//   //   prevPage.refresh()
//   //   prevPage.seller()
//   //   wx.setStorageSync('city_type', 1)
//   //   wx: wx.navigateBack({
//   //     url: 'index',
//   //   })
//   //},
//   select_citys: function (e) {
//     var that = this
//     var city = e.currentTarget.dataset.city + '市';
//     wx.setStorageSync('city', city);
//     //---------------------------------- 传入最新城市----------------------------------
//     app.util.request({
//       'url': 'entry/wxapp/SaveHotCity',
//       'cachetime': '0',
//       data: { cityname: city, user_id: wx.getStorageSync('users').id },
//       success: function (res) {
//         console.log(res)
//       },
//     })
//     var pages = getCurrentPages();
//     var currPage = pages[pages.length - 1]
//     var prevPage = pages[pages.length - 2]
//     prevPage.setData({
//       city: city,
//       page: 1,
//       activeIndex: 0,
//       swipecurrent: 0,
//       seller: [],
//     })
//     prevPage.reload()
//     prevPage.refresh()
//     prevPage.seller()
//     wx.setStorageSync('city_type', 1)
//     wx: wx.navigateBack({
//       url: 'index',
//     })
//   },
//   search: function (e) {
//     console.log(e)
//     var value = e.detail.value
//     // var city = value + '市'
//     // wx.setStorageSync('city', city)
//     // wx.setStorageSync('city_type', 1)
//     this.setData({
//       value: value
//     })
//     this.refresh()
//   },
//   onReady: function () {
//     // 生命周期函数--监听页面初次渲染完成

//   },
//   onShow: function () {
//     // 生命周期函数--监听页面显示

//   },
//   onHide: function () {
//     // 生命周期函数--监听页面隐藏

//   },
//   onUnload: function () {
//     // 生命周期函数--监听页面卸载

//   },
//   onPullDownRefresh: function () {
//     // 页面相关事件处理函数--监听用户下拉动作

//   },
//   onReachBottom: function () {
//     // 页面上拉触底事件的处理函数

//   },
//   // onShareAppMessage: function () {
//   //   // 用户点击右上角分享
//   //   return {
//   //     title: 'title', // 分享标题
//   //     desc: 'desc', // 分享描述
//   //     path: 'path' // 分享路径
//   //   }
//   // }
// })