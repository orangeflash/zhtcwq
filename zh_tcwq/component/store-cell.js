// zh_tcwq/component/store-cell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object,
      value: {},
    },
    url: {
      type: String,
      value: '',
    },
    type:{
      type: String,
      value: '1',
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        is_style: getApp().xtxx ? getApp().xtxx.is_style:1
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    star: [{
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }],
    star1: [{
      img: '../image/xing.png'
    }, {
      img: '../image/star_none.png'
    }, {
      img: '../image/star_none.png'
    }, {
      img: '../image/star_none.png'
    }, {
      img: '../image/star_none.png'
    }],
    star2: [{
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/star_none.png'
    }, {
      img: '../image/star_none.png'
    }, {
      img: '../image/star_none.png'
    }],
    star3: [{
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/star_none.png'
    }, {
      img: '../image/star_none.png'
    }],
    star4: [{
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/xing.png'
    }, {
      img: '../image/star_none.png'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // -----------------------------------跳转商家详情界面-------------------------------
    store: function (e) {
      var that = this
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../sellerinfo/sellerinfo?id=' + id,
      })
    },
    preimg(e){
      let imgs = this.data.content.ad.map(item=>this.data.url+item)
      wx.previewImage({
        current: imgs[e.currentTarget.dataset.idx],
        urls: imgs,
      })
    },
  }
})