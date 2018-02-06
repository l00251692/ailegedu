//app.js
import {
  getLoginInfo, getUserAddrs
} from './utils/api'
import {
  getCurrentAddress, getUserInfo,
  coordFormat, fetch
} from './utils/util'
import {
  gcj02tobd09
} from './utils/coordtransform'
import distance from './utils/distance'
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  },
  getLoginInfo: function (cb) {
    var that = this
    if (this.globalData.loginInfo) 
    {
      cb && cb(this.globalData.loginInfo)
    } 
    else 
    {
      getLoginInfo({
        success(data)
        {
          getApp().setLoginInfo(data)
          cb && cb(data)
        },
        error(res) {
          alert("登录失败，请稍后...")
        }
      })
    }
  },
  setLoginInfo(loginInfo) {
    console.log("setLoginInfo:" + JSON.stringify(loginInfo))
    if (loginInfo.session_key) {
      wx.setStorageSync('session_3rd', loginInfo.session_key)
    }
    this.globalData.loginInfo = loginInfo
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      cb && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      getUserInfo({
        success(data) {
          that.setUserInfo(data)
          cb && cb(data)
        }
      })
    }
  },

  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
  },


  // 获取当前地址
  getCurrentAddress(cb) {
    var that = this
    if (this.globalData.currentAddress) {
      return cb && cb(this.globalData.currentAddress)
    }

    getCurrentAddress(address => {
      address = that.setCurrentAddress(address)
      cb(address)
      // this.getLoginInfo(loginInfo => {
      //   if (loginInfo.is_login) {
      //     this.findNearbyUserAddr(userAddress => {
      //       if (!userAddress) {
      //         return
      //       }
      //       that.setCurrentAddress(userAddress)
      //     })
      //   }
      // })
    })
  },
  setCurrentAddress(address) {
    if (address.addr_id) {
      address.title = `${address.addr} ${address.detail}`
      address.city = address.city_name
      address.district = address.district_name
      address.location = {
        longitude: address.longitude,
        latitude: address.latitude
      }
    } else {
      address.location = coordFormat(address.location)
    }
    this.globalData.currentAddress = address
    return address
  },

  findNearbyUserAddr(cb, radius = 100) {
    radius /= 100
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var [lng1, lat1] = gcj02tobd09(res.longitude, res.latitude)
        getUserAddrs({
          success(addressList) {
            for (let i = 0, len = addressList.length; i < len; i++) {
              var address = addressList[i]
              var {
                longitude: lng2,
                latitude: lat2
              } = address
              if (distance(lat1, lng1, lat2, lng2) <= radius) {
                return cb(address)
              }
            }
            return cb()
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
        alert('获取用户地址失败')
      }
    })
  },

  globalData: {
    loginInfo: null,
    currentAddress: null
  }
})