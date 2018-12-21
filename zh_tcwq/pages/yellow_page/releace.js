// zh_tcwq/pages/yellow_page/releace.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'USA', value: '一天  费用 0.2 元' },
      { name: 'CHN', value: '一月  费用 20 元', checked: 'true' },
      { name: 'BRA', value: '一年  费用 200 元' }
    ],
    region: ['广东省', '广州市', '海珠区'],
    index:0,
    index1:0,
    multiIndex:[0,0]
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      radio: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var that = this
    var index = e.detail.value
    var index1 = e.detail.column
    var nav = that.data.nav
    if (e.detail.column==0){
      var name = nav[0][index]
      var store = that.data.store
      var multiIndex = []
      multiIndex[0] = e.detail.value
      multiIndex[1] = 0
      for (let i in store) {
        if (store[i].type_name == name) {
          var big_id = store[i].id
          app.util.request({
            'url': 'entry/wxapp/StoreType2',
            'cachetime': '0',
            data: { type_id: store[i].id },
            success: function (res) {
              var store_type_two = []
              res.data.map(function (item) {
                var arr = {}
                arr = item.name
                store_type_two.push(arr)
              })
              nav[1] = store_type_two
              that.setData({
                nav: nav,
                multiIndex: multiIndex
              })
            }
          })
        }
      }
    }else{
      that.setData({
        multiIndex: [that.data.multiIndex[0], e.detail.value]
      })
    }
    
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.refresh()
  },
  refresh: function (e) {
    var that = this
    app.util.request({
      'url': 'entry/wxapp/StoreType',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var store = res.data
        var store_type_one = []
        store.map(function (item) {
          var arr = {}
          arr = item.type_name
          store_type_one.push(arr)
        })
        console.log(store_type_one)
        app.util.request({
          'url': 'entry/wxapp/StoreType2',
          'cachetime': '0',
          data: { type_id: store[0].id },
          success: function (res) {
            console.log(res)
            store[0].classification = res.data
            var store_type_two = []
            store[0].classification.map(function (item) {
              var arr = {}
              arr = item.name
              store_type_two.push(arr)
            })
            console.log(store_type_two)
            var store_type_one = []
            store.map(function (item) {
              var arr = {}
              arr = item.type_name
              store_type_one.push(arr)
            })
            var nav= []
            nav[0] = store_type_one
            nav[1] = store_type_two
            console.log(nav)
            that.setData({
              nav: nav,
              store:store
            })
          }
        })

      }
    })
  },
  name(res) {
    console.log(res)
    this.setData({
      name: res.detail.value
    })
  },
  address(res) {
    console.log(res)
    this.setData({
      address: res.detail.value
    })
  },

  tel(res) {
    console.log(res)
    this.setData({
      tel: res.detail.value
    })
  },
  text(res) {
    console.log(res)
    this.setData({
      text: res.detail.value
    })
  },
  apply(res){
    var that = this
    console.log(that.data)
    var region = that.data.region
    var name = that.data.name
    var address = that.data.address
    var tel = that.data.tel
    var text = that.data.text
    var title = ''
    if(name==null){
      title='请输入公司名称'
    } else if (address == null) {
      title = '请输入公司地址'
    } else if (tel == null) {
      title = '请输入联系电话'
    } else if (text == null) {
      title = '请输入关键字'
    }
    if(title!=''){
      wx:wx.showModal({
        title: '提示',
        content: title,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
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