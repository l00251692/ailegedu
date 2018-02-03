// pages/mine/mine.js
import { getUserInfo, makePhoneCall } from '../../utils/util'
import { logout, getMineInfo } from '../../utils/api'

const app = getApp()
Page({
  data: { 
    loginInfo:{}
  },
  onLoad:function(options){

    var that = this
    getUserInfo(userInfo => {
      that.setData({
        userInfo
      })
    })

    getMineInfo({
      success(data) {
        console.log("hakdh" + JSON.stringify(data))
        that.setData({
          campus_id: data.campus_id
        })
      }
    })  
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    /*var that = this
    app.getLoginInfo(loginInfo => {
      that.setData({
        loginInfo: loginInfo.user_info
      })
    })*/
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onPhoneTap(e) {
    makePhoneCall(e.currentTarget.dataset.phone)
  },
  onLogout(e) {
    var that = this
    var {loginInfo: {phone}, loading} = this.data
    if(loading) {
      return
    }
    this.setData({
      loading: true
    })
    logout({
      phone,
      success(data) {
        app.setLoginInfo(data)
        that.setData({
          loginInfo: null,
          loading: false
        })
      }
    })
  },
  /*callback(loginInfo) {
    this.setData({
      loginInfo: loginInfo.user_info
    })
  },*/
  onShareAppMessage() {
    return {
      title: '我的信息',
      path: '/pages/mine/mine'
    }
  }
})