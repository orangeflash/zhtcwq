//index.js
var app = getApp()
var util = require('../../utils/util.js');
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const dayInMonth = date.getDate();
const dayInWeek = date.getDay();
let selected = [year, month, dayInMonth];

const week = [
  { 'value': '日', 'class': 'weekend' },
  { 'value': '一', 'class': '' },
  { 'value': '二', 'class': '' },
  { 'value': '三', 'class': '' },
  { 'value': '四', 'class': '' },
  { 'value': '五', 'class': '' },
  { 'value': '六', 'class': 'weekend' },
];

let isLeapYear = function (y) {
  return y % 400 == 0 || (y % 4 == 0 && y % 100 != 0);
}

let isToday = function (y, m, d) {
  return y == year && m == month && d == dayInMonth;
}

let isWeekend = function (emptyGrids, d) {
  return (emptyGrids + d) % 7 == 0 || (emptyGrids + d - 1) % 7 == 0
}

let calEmptyGrid = function (y, m) {
  return new Date(`${y}/${m}/02 00:00:00`).getUTCDay();
}

let calDaysInMonth = function (y, m) {
  let leapYear = isLeapYear(y);
  if (month == 2 && leapYear) {
    return 29;
  }
  if (month == 2 && !leapYear) {
    return 28;
  }
  if ([4, 6, 9, 11].includes(m)) {
    return 30;
  }
  return 31;
}

let calWeekDay = function (y, m, d) {
  return new Date(`${y}/${m}/${d} 00:00:00`).getUTCDay();
}
let getThisMonthDays = function (year, month) {
  return new Date(year, month, 0).getDate();
}
let calDays = function (y, m) {
  const thisMonthDays = getThisMonthDays(y, m);
  let emptyGrids = calEmptyGrid(y, m);
  let days = [];
  for (let i = 1; i <= thisMonthDays; i++) {
    let ifToday = isToday(y, m, i);
    let isSelected = selected[0] == y && selected[1] == m && selected[2] == i;
    let today = ifToday ? 'today' : '';
    let select = isSelected ? 'selected' : '';
    let weekend = isWeekend(emptyGrids, i) ? 'weekend' : '';
    let todaySelected = ifToday && isSelected ? 'today-selected' : '';
    // var d = i < 10 ? '0' + i : i;  
    let day = {
      'value': i,
      'date':[y,m,i],
      'class': `date-bg ${weekend} ${today} ${select} ${todaySelected}`,
    }
    days.push(day);
  }
  return days.slice(0, calDaysInMonth(y, m));
}

Page({
  data: {
    currYear: year,
    currMonth: month,
    week: week,
    emptyGrids: calEmptyGrid(year, month),
    days: calDays(year, month),
    selected: selected,
    disabled: false,
    logintext: '点击签到',
    lxts:0,
    isbq:false,
    bqtext:'点击补签',
    fwxy:true,
    djqd: true,
    qdtc:true,
  },
  gbrl: function () {
    this.setData({
      djqd: true
    })
  },
  qqd:function(){
    this.setData({
      djqd: false
    })
  },
  ycqdtc: function () {
    this.setData({
      qdtc: true
    })
  },
  lookck: function () {
    this.setData({
      fwxy: false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true,
    })
  },
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    console.log(this.data.days, this.data.selected)
    function getNowFormatDate(date) {
      var seperator1 = "/";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      // if (month >= 1 && month <= 9) {
      //   month = "0" + month;
      // }
      // if (strDate >= 0 && strDate <= 9) {
      //   strDate = "0" + strDate;
      // }
      var currentdate = [date.getFullYear(), month, strDate]
      return currentdate;
    }
    this.setData({
      url:wx.getStorageSync('url')
    })
    var that = this;
    var user_info = wx.getStorageSync('user_info')
    console.log(user_info)
    app.util.request({
      'url': 'entry/wxapp/Signset',
      'cachetime': '0',
      success: function (res) {
        console.log('签到设置', res)
        that.setData({
          qdset: res.data,
          nowtime: getNowFormatDate(new Date(res.data[0].time*1000)),
          userinfo:user_info
        })
        that.reLoad();
      }
    })
    //查看连签奖励
    app.util.request({
      'url': 'entry/wxapp/ContinuousList',
      'cachetime': '0',
      success: function (res) {
        console.log('查看连签奖励', res)
        that.setData({
          jl: res.data,
        })
      }
    })
    this.lqts();
  },
  rank: function () {
    var that = this;
    var user_id = wx.getStorageSync('users').id
    //JrRank
    app.util.request({
      'url': 'entry/wxapp/JrRank',
      'cachetime': '0',
      data: { page: 1, pagesize: 10, },
      success: function (res) {
        console.log('JrRank', res.data)
        for (let i in res.data) {
          res.data[i].time3 = app.ormatDate(res.data[i].time3).substring(11);
        }
        that.setData({
          ranklist: res.data,
        })
      }
    })
    //MyJrRank
    app.util.request({
      'url': 'entry/wxapp/MyJrRank',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('MyJrRank', res.data)
        that.setData({
          MyRank: res.data,
        })
      }
    })
  },
  in_array: function (stringToSearch, arrayToSearch) {
    for (var s = 0; s < arrayToSearch.length; s++) {
      var thisEntry = arrayToSearch[s].toString();
      if (thisEntry == stringToSearch) {
        return true;
      }
    }
    return false;
  },
  lqts:function(){
    this.setData({
      isbq:false,
    })
    var that = this;
    var user_id = wx.getStorageSync('users').id
    console.log(user_id)
    //查看连续签到天数
    app.util.request({
      'url': 'entry/wxapp/Continuous',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('查看连续签到天数', res)
        that.setData({
          lxts: res.data,
        })
      }
    })
    //isbq
    app.util.request({
      'url': 'entry/wxapp/Isbq',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('isbq', res)
        that.setData({
          havebq: res.data,
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('个人信息', res)
        that.setData({
          grjf: res.data.total_score,
        })
      }
    })
  },
  reLoad: function () {
    var that = this;
    var user_id = wx.getStorageSync('users').id
    console.log(user_id)
    //我的签到
    app.util.request({
      'url': 'entry/wxapp/MySign',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log('我的签到', res)
        that.setData({
          wdqd:res.data,
        })
        var qdarr = [], days = that.data.days;
        for (let i = 0; i < res.data.length; i++) {
          qdarr.push(res.data[i].time)
        }
        console.log(qdarr,days)
        if (that.in_array(that.data.nowtime.toString(), qdarr)){
          console.log('今日已签到')
          that.setData({
            disabled: true,
            logintext: '今日已签到',
          })
        }
        else{
          console.log('今日未签到')
          that.setData({
            disabled: false,
            logintext: '点击签到',
          })
        }
        for (let i = 0; i < days.length; i++){
          if (that.in_array(days[i].date.toString(),qdarr)){
            days[i].isqd=1;
          }
        }
        //Special
        app.util.request({
          'url': 'entry/wxapp/Special',
          'cachetime': '0',
          success: function (res) {
            console.log('Special', res)
            var tsrq = res.data;
            for (let i = 0; i < tsrq.length; i++){
              tsrq[i].day = tsrq[i].day.split("-");
              var date = new Date(tsrq[i].day[0], tsrq[i].day[1] - 1, tsrq[i].day[2]);
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDate();
              tsrq[i].day = year+','+month+','+day;
            }
            console.log(tsrq)
            that.setData({
              special:tsrq,
            })
            for (let i = 0; i < days.length; i++) {
              for (let s = 0; s < tsrq.length; s++) {
                if (days[i].date.toString() == tsrq[s].day) {
                  days[i].tsrq = tsrq[s]
                }
              }
            }
            that.setData({
              days: days,
            })
            app.util.request({
              'url': 'entry/wxapp/MyJrSign',
              'cachetime': '0',
              data: { user_id: user_id },
              success: function (res) {
                console.log('jrsfqd', res)
                if (res.data == '2') {
                  console.log('未签到')
                  that.qd();
                }
                if (res.data == '1') {
                  console.log('已签到')
                  //MyJrJf
                  app.util.request({
                    'url': 'entry/wxapp/MyJrJf',
                    'cachetime': '0',
                    data: { user_id: user_id },
                    success: function (res) {
                      console.log('MyJrJf', res)
                      that.setData({
                        qdddjf: res.data,
                      })
                    }
                  })
                  that.rank();
                }
              }
            })
          }
        })
      }
    })
  },
  qd: function () {
    var that = this;
    var user_id = wx.getStorageSync('users').id,wdqd=this.data.wdqd;
    console.log(that.data.nowtime,that.data.special,that.data.qdset,wdqd)
    var integral = that.data.qdset[0].integral;
    for (let i = 0; i < that.data.special.length; i++){
      if (that.data.nowtime.toString() == that.data.special[i].day) {
         integral = that.data.special[i].integral
      }
    }
    if (wdqd.length == 0) {
      var scqd = that.data.qdset[0].one;
    }
    else {
      var scqd = 0;
    }
    console.log(integral, scqd)
    //qd
    app.util.request({
      'url': 'entry/wxapp/Sign',
      'cachetime': '0',
      data: { user_id: user_id, time: that.data.nowtime.toString(), integral: integral, one: scqd },
      success: function (res) {
        console.log(res)
        if(res.data=='1'){
          that.setData({
            qdddjf: integral,
            qdtc:false,
          })
          that.reLoad();
          that.lqts();
        }
      }
    })
  },
  bq: function (){
    var that = this;
    var user_id = wx.getStorageSync('users').id, wdqd = this.data.wdqd, grjf = Number(this.data.grjf);
    console.log(that.data.bqtime, that.data.special, that.data.qdset,wdqd,grjf);
      var integral = that.data.qdset[0].integral;
    for (let i = 0; i < that.data.special.length; i++) {
      if (that.data.bqtime.toString() == that.data.special[i].day) {
        integral = that.data.special[i].integral
      }
    }
    if(wdqd.length==0){
      var scqd = that.data.qdset[0].one;
    }
    else{
      var scqd =0;
    }
    console.log(integral,scqd)
    wx.showModal({
      title: '温馨提示',
      content: '补签将会扣除您' + that.data.qdset[0].bq_integral+'积分哦',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (Number(that.data.qdset[0].bq_integral) > grjf) {
            wx.showModal({
              title: '提示',
              content: '您的积分为'+grjf+',不足补签扣除',
            })
          }
          else{
            //qd
            app.util.request({
              'url': 'entry/wxapp/Sign2',
              'cachetime': '0',
              data: { user_id: user_id, time: that.data.bqtime.toString(), integral: integral,one:scqd },
              success: function (res) {
                console.log(res)
                that.reLoad();
                that.lqts();
              }
            })    
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  changeMonth: function (e) {
    let id = e.target.id;
    let currYear = this.data.currYear;
    let currMonth = this.data.currMonth;
    currMonth = id == 'prev' ? currMonth - 1 : currMonth + 1;
    if (id == 'prev' && currMonth < 1) {
      currYear -= 1;
      currMonth = 12;
    }
    if (id == 'next' && currMonth > 12) {
      currYear += 1;
      currMonth = 1;
    }
    this.setData({
      currYear: currYear,
      currMonth: currMonth,
      emptyGrids: calEmptyGrid(currYear, currMonth),
      days: calDays(currYear, currMonth)
    });
    this.reLoad();
  },

  selectDate: function (e) {
    var that=this;
    var havebq=this.data.havebq;
    var nowtime = that.data.nowtime, selected = e.currentTarget.dataset.selected, tsrq = e.currentTarget.dataset.tsrq;
    console.log(nowtime,selected, tsrq)
    that.setData({
      bqtime:selected,
    })
    var jrtime = new Date(nowtime[0], nowtime[1], nowtime[2]), xztime = new Date(selected[0], selected[1], selected[2]);
    var jrtimes=jrtime.getTime(),xztimes=xztime.getTime();
    console.log(jrtimes,xztimes,havebq)
    if(jrtimes>xztimes){
      console.log('以前')
      if(havebq==2){
        that.setData({
          bqdisabled: false,
          bqtext: '点击补签',
        })
      }
      else{
        that.setData({
          bqdisabled: true,
          bqtext: '今日已补签一次'
        })
      }
      that.setData({
        isbq:true,
      })
      if (tsrq.tsrq != null) {
        wx.showModal({
          title: tsrq.tsrq.day + '是' + tsrq.tsrq.title,
          content: '本日签到特殊奖励' + tsrq.tsrq.integral + '积分',
        })
      }
    }
    else if (jrtimes == xztimes){
      if (tsrq.tsrq != null) {
        wx.showModal({
          title: tsrq.tsrq.day + '是' + tsrq.tsrq.title,
          content: '本日签到特殊奖励' + tsrq.tsrq.integral + '积分',
        })
      }
      console.log('今日')
      that.setData({
        isbq: false,
      })
    }
    else{
      if (tsrq.tsrq!=null){
        wx.showModal({
          title: tsrq.tsrq.day + '是' + tsrq.tsrq.title,
          content: '本日签到特殊奖励' + tsrq.tsrq.integral+'积分',
        })
      }
      console.log('以后')
      that.setData({
        isbq: false,
      })
    }
    let xz = tsrq.value;
    this.setData({
      xz: xz
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  // onPullDownRefresh: function () {
  //   this.reLoad();
  //   this.lqts();
  //   setTimeout(function(){
  //     wx.stopPullDownRefresh();
  //   },1000)
  // },
})