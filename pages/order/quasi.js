// pages/order/quasi.js
import {
  getQuasiOrderInfo, updateOrderAddr, updateOrderCoupon,
  addOrder, getPayment, paySuccess
} from '../../utils/api'

import {
  alert,
  requestPayment, getCurrentPage
} from '../../utils/util'
Page({
  data: {
    content: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.id = options.id || '2908'
    this.loadData()
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
  loadData() {
    var that = this
    var {id} = this
    var {loading} = this.data
    if(loading) {
      return
    }
    this.setData({
      loading: true
    })
    wx.showNavigationBarLoading()
    getQuasiOrderInfo({
      quasi_order_id: id,
      success(data) {
        var a = [];
        a = JSON.parse(data)
        that.setData({
          info: a,
          loading: false
        })
        wx.hideNavigationBarLoading()
      },
      error() {
        wx.hideNavigationBarLoading()
      }
    })
    
  },
  //用户选择地址时修改地址信息回调函数
  callbackAddress(addr_id) {
    var that = this
    var {id} = this
    var { info: { receiver_addr_id, receiver, receiver_phone, receiver_addr}, loading} = this.data
    
    if (loading) {
      return
    }
    this.setData({
      loading: true
    })
    wx.showNavigationBarLoading()
    updateOrderAddr({
      quasi_order_id: id,
      addr_id,
      success(data) {
        console.log( "updateaddr:" + JSON.stringify(data))
        that.setData({
          'info.receiver_addr_id': data.receiver_addr_id,
          'info.receiver': data.receiver,
          'info.receiver_phone': data.receiver_phone,
          'info.receiver_addr': data.receiver_addr,
          loading: false
        })
        wx.hideNavigationBarLoading()
      },
      error() {
        that.setData({
          loading: false
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  callbackCoupon(user_coupon_id) {
    var that = this
    var {id} = this
    var {loading} = this.data
    if (loading) {
      return
    }
    this.setData({
      loading: true
    })
    wx.showNavigationBarLoading()
    updateOrderCoupon({
      quasi_order_id: id,
      user_coupon_id,
      success(data) {
        data['cut_money_total'] = +data.cut_money + +data.coupon_money
        that.setData({
          info: data,
          loading: false
        })
        wx.hideNavigationBarLoading()
      },
      error() {
        that.setData({
          loading: false
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  callbackContent(content) {
    this.setData({
      content
    })
  },
  onAddOrder(e) {
    var that = this
    var {id} = this
    var {loading, content, info} = this.data
    
    if (loading) {
      return
    }
    if (!info.receiver_addr_id) {
      return alert('请选择收货地址')
    }
    this.setData({
      loading: true
    })
    addOrder({
      remark: content,
      quasi_order_id: id,
      addr_id: info.receiver_addr_id,
      success(data) {
        getPayment({
          order_id:id,
          pay_money: info.pay_price,
          success(data) {
            requestPayment({
              data,
              success()
              {
                paySuccess({   
                  order_id: id,
                  prepay_id: data.prepay_id,
                  success(data){
                    that.setData({
                      loading: false
                    })
                    wx.navigateTo({
                      url: `/pages/order/list`
                    })
                  }               
                })
              },
              // complete() {
              //   that.setData({
              //     loading: false
              //   })
              //   wx.navigateTo({
              //     url: `/pages/order/list`
              //   })
              //   /*wx.switchTab({
              //     url: '/pages/shop/show',
              //     success(res) {
              //       var {callback} = getCurrentPage()
              //       callback && callback()
              //     }
              //   })*/
              // }
            })
          },
          error() {
            that.setData({
              loading: false
            })
          }
        })
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
  }
})