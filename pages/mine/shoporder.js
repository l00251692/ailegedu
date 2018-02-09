// pages/order/list.js
import { ORDER_STATES } from '../order/constant'
import {
  getOrders, getPayment, setRecvOrder, setRejectOrder, getShopOrders
} from '../../utils/api'

import {
  datetimeFormat, requestPayment
} from '../../utils/util'

var initData = {
  websocketFlag:false,
  tip: '',
  page: 0,
  hasMore: true,
  loading: false,
  list: null
}

Page({
  data: {
    ORDER_STATES,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('min load')
    this.id = options.id
    var that = this
    if (getApp().globalData.loginInfo.is_login) {
      that.initData()
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
    this.setData({
      websocketFlag: false
    })
  },
  initData(cb) {
    this.setData(initData)
    this.loadData(cb)
    this.connectWebsocket()
  },
  loadData(cb) {
    var that = this
    var {
      loading, page
    } = this.data
    if (loading) {
      return
    }

    this.setData({
      loading: true
    })
    getShopOrders({
      campus_id:this.id,
      page,
      success(data) {
        var { list } = that.data
        var { list: list2, count, page } = data
        console.log("orderlist:" + JSON.stringify(data))
        list2 = list2.map(item => {
          item['add_time_format'] = datetimeFormat(item.add_time)
          return item
        })
        that.setData({
          loading: false,
          list: list ? list.concat(list2) : list2,
          hasMore: count == 5,
          page: page + 1
        })

        cb && cb()

      }
    })
  },

  connectWebsocket: function () {
    var that = this
    var websocketFlag  = wx.getStorageSync('websocketFlag')
    if (websocketFlag)
    {
      this.setData({
        tip:'您已登录商家系统，请保持小程序不要关闭'
      })
      return
    }
    var { user_id, user_token } = getApp().globalData.loginInfo.userInfo
    wx.connectSocket({
      url: 'ws://localhost/webSocketServer?x=' + user_id,
      data: {
        y:'',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "GET"
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      wx.setStorageSync('websocketFlag', true)
      that.setData({
        tip:'您已登录商家系统，请保持小程序不要关闭'
      })
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
      wx.setStorageSync('websocketFlag', false)
    })
    wx.onSocketMessage(function (res) {
  
      if (res.data == '连接成功')
      {
         console.log('连接成功')
      }
      else if (res.data == '新订单')
      {
          wx.playBackgroundAudio({
            //播放地址
            dataUrl: 'http://localhost/order.mp3',
            title: '积木',
            coverImgUrl: ''
          })
          that.setData({
            tip: '您有新的订单，请及时处理'
          })
          that.loadData()        
      }
      
    })
  },

  onRecvOrderTap(e) {
    var { id } = e.currentTarget
    var that = this
    var { list, loading } = this.data
    if (loading) {
      return;
    }

    this.setData({
      loading: true
    })
    var { order_id } = list[id]
    setRecvOrder({
      order_id,
      success(data) {
        wx.stopBackgroundAudio()
        that.initData();
        that.setData({
          loading: false,
          tip: '您已登录商家系统，请保持小程序不要关闭'
        })
      },
      error() {
        that.setData({
          loading: false,
          tip: '订单未成功接收，请联系管理员'
        })
      }
    })
  },

  onRejectOrderTap(e) {
    var { id } = e.currentTarget
    var that = this
    var { list, loading } = this.data
    if (loading) {
      return;
    }

    this.setData({
      loading: true
    })
    var { order_id } = list[id]
    setRejectOrder({
      order_id,
      success(data) {
        wx.stopBackgroundAudio()
        that.initData();
        that.setData({
          loading: false,
          tip: '您已登录商家系统，请保持小程序不要关闭'
        })
      },
      error() {
        that.setData({
          loading: false,
          tip: '订单未成功拒绝，请联系管理员'
        })
      }
    })
  },
  onReachBottom(e) {
    var {
      hasMore, loading
    } = this.data
    if (getApp().globalData.loginInfo.is_login && hasMore && !loading) {
      this.loadData()
    }
  },
  onPullDownRefresh() {
    if (getApp().globalData.loginInfo.is_login) {
      wx.showNavigationBarLoading()
      this.initData(() => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
    } else {
      wx.stopPullDownRefresh()
    }
  },

  callback(loginInfo) {
    if (this.data.list) {
      this.onLoad()
    }
  },
  onShareAppMessage() {
    return {
      title: '我的订单',
      path: '/pages/order/list'
    }
  }
})