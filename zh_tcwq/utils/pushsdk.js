(function () {
  var e = "2.7";
  var t = "plog";
  var n = "default";
  var i = require("./push-stat-conf.js");
  var o = {};
  var a = "";
  var s = false;
  var f = 0;
  var r = {
    uu: "",
    ak: "",
    pm: "",
    wvv: "",
    wsdk: "",
    sv: "",
    wv: "",
    nt: "",
    ww: "",
    wh: "",
    pr: "",
    pp: "",
    lat: "",
    lng: "",
    ev: "",
    st: "",
    et: "",
    ppx: "",
    ppy: "",
    v: "",
    data: "",
    fid: "",
    lang: "",
    wsr: "",
    ifo: "",
    jscode: "",
    etype: ""
  };
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (e) {
      if (this == null) {
        throw new TypeError
      }
      var t = Object(this);
      var n = t.length >>> 0;
      if (n === 0) {
        return - 1
      }
      var i = 0;
      if (arguments.length > 1) {
        i = Number(arguments[1]);
        if (i != i) {
          i = 0
        } else if (i != 0 && i != Infinity && i != -Infinity) {
          i = (i > 0 || -1) * Math.floor(Math.abs(i))
        }
      }
      if (i >= n) {
        return - 1
      }
      var o = i >= 0 ? i : Math.max(n - Math.abs(i), 0);
      for (; o < n; o++) {
        if (o in t && t[o] === e) {
          return o
        }
      }
      return - 1
    }
  }
  function p(e) {
    var t = wx.getStorageSync("t_uuid");
    if (!t) {
      t = "" + Date.now() + Math.floor(Math.random() * 1e7);
      wx.setStorageSync("t_uuid", t);
      wx.setStorageSync("ifo", 1);
      r.ifo = true
    } else {
      r.ifo = false
    }
    return t
  }
  var u = function (e) {
    wx.getLocation({
      type: "wgs84",
      success: function (t) {
        r["lat"] = t["latitude"];
        r["lng"] = t["longitude"];
        v(e, "location", "location")
      },
      fail: function () { }
    })
  };
  var c = function (e) {
    wx.getSetting({
      success: function (t) {
        if (t.authSetting["scope.userLocation"]) {
          u(e)
        }
        if (t.authSetting["scope.userInfo"]) {
          l(e,
            function (t) {
              e.aldpush_login_data = t;
              v(e, "user_info", "userinfo")
            })
        }
      }
    })
  };
  var l = function (e, t) {
    if (!i["is_getUserinfo"]) {
      return false
    }
    wx.login({
      success: function (e) {
        if (e.code) {
          r.jscode = e.code;
          wx.getUserInfo({
            success: function (e) {
              t(e)
            },
            fail: function (e) {
              v(e, "user_info_close", "user_info_close")
            }
          })
        } else {
          r.jscode = 0
        }
      }
    })
  };
  var d = function (e, n, i) {
    if (typeof arguments[1] === "undefined") n = "GET";
    if (typeof arguments[2] === "undefined") i = "d.html";
    var o = 0;
    var a = function () {
      wx.request({
        url: "https://" + t + ".xiaoshentui.com/" + i,
        data: e,
        header: {},
        method: n,
        success: function () { },
        fail: function () {
          if (o < 2) {
            o++;
            e["retryTimes"] = o;
            a()
          }
        }
      })
    };
    a()
  };
  var h = function () {
    wx.request({
      url: "https://" + t + ".xiaoshentui.com/config/app.json",
      header: {
        AldStat: "MiniApp-Stat"
      },
      method: "GET",
      success: function (t) {
        if (t.statusCode === 200) {
          if (t.data["push_v"] != e) {
            console.warn("小神推sdk已更新,为不影响正常使用,请去官网(http://www.xiaoshentui.com/)下载最新版本")
          }
        }
      }
    })
  };
  function v(t, n, f) {
    var u = p(t);
    var c = 0;
    if (n == "app" && f == "hide") {
      var l = Date.now();
      c = wx.getStorageSync("ifo");
      wx.setStorageSync("ifo", 0)
    }
    var h = "";
    if (n == "user_info") {
      h = t.aldpush_login_data
    } else if (n == "user_info_close") {
      h = {
        status: 0
      }
    } else if (n == "event") {
      h = o
    } else if (n == "yyy") {
      h = o
    } else {
      h = 0
    }
    var v = n == "fpage" || n == "fhpage" ? r.fid : 0;
    var w = n == "page" || n == "app" || n == "fpage" || n == "fhpage" ? 0 : r.jscode;
    var y = {
      v: e,
      uu: u,
      ev: n,
      life: f,
      ak: i["app_key"].replace(/(^\s*)|(\s*$)/g, ""),
      pm: r.pm ? r.pm : 0,
      wvv: r.wvv ? r.wvv : 0,
      wsdk: r.wsdk ? r.wsdk : 0,
      sv: r.sv ? r.sv : 0,
      wv: r.wv ? r.wv : 0,
      nt: r.nt ? r.nt : 0,
      ww: r.ww ? r.ww : 0,
      wh: r.wh ? r.wh : 0,
      pr: r.pr ? r.pr : 0,
      pp: r.pp ? r.pp : 0,
      lat: r.lat ? r.lat : 0,
      lng: r.lng ? r.lng : 0,
      st: r.st || 0,
      et: l ? l : 0,
      ppx: r.ppx ? r.ppx : 0,
      ppy: r.ppy ? r.ppy : 0,
      data: h ? h : 0,
      fid: v,
      lang: r.lang ? r.lang : 0,
      wsr: n == "app" ? t.aldpush_showOptions : {},
      ifo: c,
      jscode: w ? w : 0,
      ust: Date.now()
    };
    if (t.aldpush_openid) {
      y["openid"] = t.aldpush_openid
    }
    if (a !== "" && (n === "event" || n === "yyy")) {
      y["etype"] = a
    }
    if (n === "yyy" && f === "postevent") {
      wx.request({
        url: "https://openapi.xiaoshentui.com/Main/action/Event/Event_upload/mobile_info",
        method: "POST",
        header: {
          "content-type": "application/json"
        },
        data: y,
        success: function (e) { }
      })
    } else if (n === "yyy" && s) {
      wx.request({
        url: "https://openapi.xiaoshentui.com/Main/action/Event/Event_upload/event_report",
        method: "POST",
        header: {
          "content-type": "application/json"
        },
        data: y,
        success: function (e) { }
      })
    } else {
      d(y, "GET", "d.html")
    }
  }
  function w(e) {
    this.app = e
  }
  w.prototype["pushuserinfo"] = function (e, t) {
    if (typeof e === "object") {
      var n = ["encryptedData", "errMsg", "iv", "rawData", "signature", "userInfo"];
      for (var i in e) {
        if (n.indexOf(i) < 0) {
          return
        }
      }
      this.app.aldpush_login_data = e;
      if (typeof t === "string") {
        r.jscode = t
      }
      v(this.app, "user_info", "userinfo")
    }
  };
  w.prototype["setopenid"] = function (e) {
    if (typeof e === "string") {
      this.app.aldpush_openid = e;
      v(this.app, "setopenid", "setopenid")
    }
  };
  function y(e) {
    this["aldpush"] = new w(this);
    var t = this;
    if (typeof e != "undefined") {
      t.aldpush_showOptions = e;
      n = e["path"];
      r.pp = e["path"]
    } else {
      t.aldpush_showOptions = {}
    }
    var i = function () {
      wx.getNetworkType({
        success: function (e) {
          r.nt = e["networkType"]
        }
      })
    };
    i();
    c(t);
    wx.getSystemInfo({
      success: function (e) {
        r.pm = e["model"];
        r.wv = e["version"];
        r.wsdk = typeof e["SDKVersion"] === "undefined" ? "1.0.0" : e["SDKVersion"];
        r.sv = e["system"];
        r.wvv = e["platform"];
        r.ww = e["screenWidth"];
        r.wh = e["screenHeight"];
        r.pr = e["pixelRatio"];
        r.lang = e["language"]
      }
    });
    wx.getSystemInfoSync({
      success: function (e) {
        r.wvv = e["platform"]
      }
    });
    if (r.wvv == "devtools") {
      h()
    }
  }
  function g(e) {
    var t = this;
    t.isShow = true;
    if (i["is_sendEvent"]) {
      O(t)
    }
    if (typeof e != "undefined") {
      t.aldpush_showOptions = e
    } else {
      t.aldpush_showOptions = {}
    }
    r.st = Date.now()
  }
  function _() {
    var e = this;
    e.isShow = false;
    v(e, "app", "hide");
    f = 0
  }
  function x(e) {
    var t = this;
    if (typeof e != "undefined") {
      t.options = e
    }
    if (n != "default" && n != t["__route__"]) {
      l(t,
        function (e) {
          t.aldpush_login_data = e;
          v(t, "user_info", "userinfo")
        })
    }
  }
  function m(e) {
    var t = this;
    if (typeof e != "undefined") {
      t.options = e
    }
    r.pp = t["__route__"];
    n = t["__route__"];
    v(getApp(), "page", "hide")
  }
  function S(e, t) {
    var n = r.ww;
    var i = r.wh;
    var o = this;
    var a = {
      length: [],
      is_showHideBtn: false
    };
    for (var s = 0; s <= 50; s++) {
      var f = Math.ceil(Math.random() * n);
      var p = Math.ceil(Math.random() * i);
      var u = '-webkit-transform: scale(0.5);transform:scale(1);content:"";height:88px;width:88px;border:1px solid transparent;background-color:transparent;position:fixed;z-index: 999;left:' + f + "px;top:" + p + "px;";
      a.length.push(u)
    }
    var c = wx.getStorageSync("isShowClick");
    o.setData({
      hideBtnData: a,
      isShowClick: Boolean(c)
    })
  }
  function k(e) {
    var t = this;
    r.ppx = e.detail.target.offsetLeft;
    r.ppy = e.detail.target.offsetTop;
    r.fid = e.detail.formId;
    function n() {
      wx.setStorageSync("isShowClick", "false");
      t.setData({
        is_showHideBtn: true,
        isShowClick: "false"
      })
    }
    l(t,
      function (e) {
        t.aldpush_login_data = e;
        v(t, "user_info", "userinfo");
        n()
      });
    if (i["is_Location"]) {
      u(t)
    }
    v(t, "fpage", "clickform")
  }
  function M(e) {
    var t = this;
    r.ppx = e.detail.target.offsetLeft;
    r.ppy = e.detail.target.offsetTop;
    r.fid = e.detail.formId;
    t.setData({
      is_showHideBtn: true
    });
    v(t, "fhpage", "hideclickform")
  }
  function D(e, t) {
    var n = "";
    var f = arguments;
    var r = this;
    if (!e) {
      e = f
    }
    if (e) {
      var p = ["onLoad", "onReady", "onShow", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom", "onShareAppMessage", "onPageScroll"];
      if (typeof e["type"] === "undefined") {
        if (typeof e["from"] === "undefined") {
          if (p.indexOf(t) >= 0) {
            a = "wechat_function"
          } else {
            a = "developer_function"
          }
        } else {
          a = e.from
        }
      } else {
        a = e.type
      }
      n = typeof f[0] !== "undefined" ? f[0] : {};
      o = n;
      var u = i["filterFunc"];
      if (u.indexOf(t) >= 0) { } else {
        v(r, "event", t)
      }
      if (s) {
        v(r, "yyy", t)
      }
    }
  }
  function O(e) {
    wx.onAccelerometerChange(function (t) {
      if (!e.isShow) {
        return
      }
      if (t.x > 1 && t.y > 1) {
        f += 1;
        if (f >= 3) {
          s = true;
          v(e, "yyy", "postevent")
        }
      }
    })
  }
  function j(e, t, n) {
    if (e[t]) {
      var i = e[t];
      e[t] = function (e) {
        n.call(this, e, t);
        return i.call.apply(i, [this].concat(Array.prototype.slice.call(arguments)))
      }
    } else {
      e[t] = function (e) {
        n.call(this, e, t)
      }
    }
  }
  var b = App;
  App = function (e) {
    j(e, "onLaunch", y);
    j(e, "onShow", g);
    j(e, "onHide", _);
    b(e)
  };
  var T = Page;
  Page = function (e) {
    for (var t in e) {
      if (typeof e[t] === "function") {
        if (t == "onLoad") {
          j(e, "onLoad", S);
          continue
        }
        if (t == "onHide") {
          j(e, "onHide", m);
          continue
        }
        j(e, t, D)
      }
    }
    j(e, "onShow", x);
    j(e, "hidepushFormSubmit", M);
    j(e, "pushFormSubmit", k);
    T(e)
  }
})();