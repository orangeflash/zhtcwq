// // zh_cjpt/pages/canvas/collageInfo.js
// const app = getApp()
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     group: '拼团开始',
//     button_text: '我要参团',
//     sec: ''
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     var that = this
//     app.getUrl(that)
//     app.setNavigationBarColor(that);
//     wx.setNavigationBarTitle({
//       title: options.title,
//     })
//     app.getUserInfo(function (userInfo) {
//       console.log(userInfo)
//       that.setData({
//         userInfo: userInfo
//       })
//       if (userInfo.id == options.user_id) {
//         that.setData({
//           button_text: '邀请好友参团',
//           button: 'invite',
//           button_type: "share"
//         })
//       } else {
//         that.setData({
//           button_text: '我要参团',
//           button: 'join_group'
//         })
//       }
//     })
//     console.log(options)
//     that.setData({
//       id: options.id,
//       options: options,
//       goods_id: options.goods_id,
//       num_peo: Number(options.group_num)
//     })
//     // that.refresh()
//     that.reload()
//     // that.getCountDown(Number(options.time))
//   },

//   tjddformSubmit: function (e) {
//     console.log(e)
//     var user_id = wx.getStorageSync('users').id;
//     app.util.request({
//       'url': 'entry/wxapp/SaveFormid',
//       'cachetime': '0',
//       data: {
//         user_id: user_id,
//         form_id: e.detail.formId
//       },
//       success: function (res) {
//         console.log(res.data)
//       },
//     })
//   },
//   // 获取商品和已经开团的数据
//   reload: function (e) {
//     var that = this
//     var a = that.data
//     // 商品详情
//     app.util.request({
//       'url': 'entry/wxapp/GoodsInfo',
//       'cachetime': '0',
//       data: {
//         goods_id: that.data.goods_id,
//       },
//       success: res => {
//         console.log(res)
//         that.getCountDown(Number(res.data.goods.end_time))
//         that.setData({
//           goods:res.data.goods
//         })
//         for (let i in res.data.group) {
          
//           if (res.data.group[i].name.length >= 6) {
//             res.data.group[i].name = res.data.group[i].name.slice(0, 6) + '...'
//           }
//           // if (res.data.group[i].user_id == a.options.user_id) {
//           //   console.log('已经有开的团了')
//           //   var sy_num = Number(res.data.group[i].kt_num) - Number(res.data.group[i].yg_num)
//           //   that.setData({
//           //     already_group: true,
//           //     already: res.data.group[i],
//           //     sy_num: sy_num.toFixed(0)
//           //   })
//           //   that.refresh()
//           // }
//           var sy_num = Number(res.data.group[i].kt_num) - Number(res.data.group[i].yg_num)
//           that.setData({
//             already_group: true,
//             already: res.data.group[i],
//             sy_num: sy_num
//           })
//           that.refresh()
//         }
//       }
//     })
//   },
//   refresh: function (e) {
//     var that = this
//     var a = that.data
//     let group_id = a.already.id
//     // 拼团详情
//     app.util.request({
//       url: 'entry/wxapp/GroupInfo',
//       data: {
//         group_id: group_id
//       },
//       success: res => {
//         console.log(res)
//         that.setData({
//           goods_info: res.data
//         })
//       }
//     })
//     // 拼团人数详情
//     app.util.request({
//       url: 'entry/wxapp/GetGroupUserInfo',
//       data: {
//         group_id: group_id
//       },
//       success: res => {
//         console.log(res)
//         for (let i in res.data) {
//           if (wx.getStorageSync('userInfo').name == res.data[i].name && wx.getStorageSync('userInfo').id != that.data.options.user_id) {
//             that.setData({
//               button_text: '您已经参过团了',
//               button: 'gfawgaw'
//             })
//           }
//         }
//         that.setData({
//           group_user: res.data
//         })
//       }
//     })
//   },
//   getCountDown: function (timestamp) {
//     var that = this
//     var group = that.data.group
//     if (group == '拼团开始') {
//       setInterval(function () {
//         var nowTime = new Date();
//         var endTime = new Date(timestamp * 1000);
//         var t = endTime.getTime() - nowTime.getTime();
//         var hour = Math.floor(t / 1000 / 60 / 60) + ''
//         var min = Math.floor(t / 1000 / 60 % 60) + ''
//         var sec = Math.floor(t / 1000 % 60) + ''
//         // console.log(hour)
//         if (t > 0) {
//           if (hour < 10) {
//             hour = "0" + hour;
//           }
//           if (min < 10) {
//             min = "0" + min;
//           }
//           if (sec < 10) {
//             sec = "0" + sec;
//           }
//           hour = hour.split("")
//           min = min.split("")
//           sec = sec.split("")
//           that.setData({
//             hour: hour,
//             min: min,
//             sec: sec,
//           })
//         } else {
//           that.setData({
//             group: '拼团已结束'
//           })
//         }
//       }, 1000)
//     }
//   },
//   // 这是邀请好友参团
//   invite: function (e) {
//     var that = this
//     var a = that.data
//     // wx.showModal({
//     //   title: '',
//     //   content: '这是邀请参团',
//     // })
//   },
//   // 这是参团
//   join_group: function (e) {
//     var that = this
//     var a = that.data
//     wx.redirectTo({
//       url: 'place_order?id=' + a.goods.id + '&type=' + 2 + '&group_id=' + a.already.id+'&price='+a.goods.pt_price 
//     })
//   },
//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {
//     var that = this
//     var a = that.data
//     return {
//       title: wx.getStorageSync('users').name + '邀请您一起来拼团',
//       path: '/zh_tcwq/pages/collage/group?user_id=' + a.options.user_id +'&goods_id=' + a.options.goods_id,
//       success: res => {
//         console.log(res)
//       },
//       complete: res => {
//         console.log('执行')
//       }
//     }
//   }
// })
// zh_cjpt/pages/canvas/collageInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: '拼团开始',
    num: 3,
    button_text: '我要参团',
    sec: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.setNavigationBarColor(that); app.getUrl(that)
    console.log('传递过来的参数', options)
    that.setData({
      id: options.id,//团id
      options: options,
      goods_id: options.goods_id,//商品id
      num_peo: Number(options.group_num)
    })
  },
  // 获取商品和已经开团的数据
  reload: function (e) {
    var that = this
    var a = that.data
    // 商品详情
    app.util.request({
      'url': 'entry/wxapp/GoodsInfo',
      'cachetime': '0',
      data: {
        goods_id: that.data.goods_id,
      },
      success: res => {
        console.log('商品的详情', res)
        that.getCountDown(Number(res.data.goods.end_time))
        that.setData({
          goods: res.data.goods
        })
        for (let i in res.data.group) {

          if (res.data.group[i].name != '' && res.data.group[i].name != null && res.data.group[i].name.length >= 6) {
            res.data.group[i].name = res.data.group[i].name.slice(0, 6) + '...'
          }
          if (that.data.goods_info.user_id == res.data.group[i].user_id) {
            that.setData({
              already_group: true,
              already: res.data.group[i]
            })
          }
        }
      }
    })
  },
  refresh: function (e) {
    var that = this
    var a = that.data
    let group_id = a.id
    // 拼团详情
    app.util.request({
      url: 'entry/wxapp/GroupInfo',
      data: {
        group_id: group_id
      },
      success: res => {
        console.log('团的详情', res)
        var sy_num = Number(res.data.kt_num) - Number(res.data.yg_num)
        that.setData({
          goods_info: res.data,
          sy_num: sy_num
        })
        that.reload()
      }
    })
    // 拼团人数详情
    app.util.request({
      url: 'entry/wxapp/GetGroupUserInfo',
      data: {
        group_id: group_id
      },
      success: res => {
        console.log('这是团id', group_id)
        console.log('这是参团的人数', res)
        console.log('这是用户的信息', that.data.userInfo)
        for (let i in res.data) {
          console.log(that.data.userInfo.name)
          console.log(res.data[i].name)
          if (that.data.userInfo.name == res.data[i].name) {
            that.setData({
              button_text: '邀请好友参团',
              button: 'invite',
              button_type: "share"
            })
            break
          } else {
            that.setData({
              button_text: '我要参团',
              button: 'join_group'
            })
          }
        }
        that.setData({
          group_user: res.data
        })
      }
    })
  },
  getCountDown: function (timestamp) {
    var that = this
    var group = that.data.group
    if (group == '拼团开始') {
      setInterval(function () {
        var nowTime = new Date();
        var endTime = new Date(timestamp * 1000);
        var t = endTime.getTime() - nowTime.getTime();
        var hour = Math.floor(t / 1000 / 60 / 60) + ''
        var min = Math.floor(t / 1000 / 60 % 60) + ''
        var sec = Math.floor(t / 1000 % 60) + ''
        if (t > 0) {
          if (hour < 10) {
            hour = "0" + hour;
          }
          if (min < 10) {
            min = "0" + min;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          hour = hour.split("")
          min = min.split("")
          sec = sec.split("")
          that.setData({
            hour: hour,
            min: min,
            sec: sec,
          })
        } else {
          that.setData({
            group: '拼团已结束'
          })
        }
      }, 1000)
    }
  },
  // 这是邀请好友参团
  invite: function (e) {
    var that = this
    var a = that.data
    // wx.showModal({
    //   title: '',
    //   content: '这是邀请参团',
    // })
  },
  // 这是参团
  join_group: function (e) {
    var that = this
    var a = that.data
    wx.redirectTo({
      // url: 'place_order?store_id=' + a.goods.store_id + '&goods_id=' + a.goods_id + '&type=' + 2 + '&group_id=' + a.id + '&end_time=' + a.goods.end_time + '&xf_time=' + a.goods.xf_time,
      url: 'place_order?id=' + a.goods.id + '&type=' + 2 + '&group_id=' + a.already.id + '&price=' + a.goods.pt_price + '&store_id=' + a.goods.store_id
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
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      that.refresh()
    })
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
    var that = this
    var a = that.data, b = a.options
    return {
      title: wx.getStorageSync('users').name + '邀请您一起来拼团',
      path: '/zh_tcwq/pages/collage/group?user_id=' + a.options.user_id + '&goods_id=' + a.options.goods_id + '&id=' + a.options.id,
      success: res => {
        console.log(res)
      },
      complete: res => {
        console.log('执行')
      }
    }
  }
})