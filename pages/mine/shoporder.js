// pages/order/list.js
import { ORDER_STATES } from '../order/constant'
import {
  getOrders, getPayment, setRecvOrder, setRejectOrder, getShopOrders
} from '../../utils/api'

import {
  datetimeFormat, requestPayment
} from '../../utils/util'

var initData = {
  page: 0,
  hasMore: true,
  loading: false,
  list: null
}

Page({
  data: {
    ORDER_STATES
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
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
  },
  initData(cb) {
    this.setData(initData)
    this.loadData(cb)
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
        
        that.initData();
        that.setData({
          loading: false
        })
      },
      error() {
        that.setData({
          loading: false
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

        that.initData();
        that.setData({
          loading: false
        })
      },
      error() {
        that.setData({
          loading: false
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