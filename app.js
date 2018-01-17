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
    if (this.globalData.loginInfo) {
      console.log("无需再次登陆")
      cb && cb(this.globalData.loginInfo)
    } else {
      //调用登录接口
      wx.login({
        success(res) {
          console.log("登陆成功:" + res.code);
          wx.getUserInfo({
            success: function (userRes)
            {
              console.log("success:" + userRes.iv)
              fetch({
                url: 'user/toLoginWx',
                data: {
                  wx_code: res.code,
                  encryptedData: userRes.encryptedData,
                  iv: userRes.iv 
                },
                success(data) {
                  console.log("用户信息:" + JSON.stringify(data));
                  getApp().globalData.loginInfo = data
                  cb && cb(data)
                }
              })
            },
            fail:function()
            {
              console.log("fail:")
            }
          })            
        },
        error(res) {
          alert(res['errMsg'])
          error && error(res['errMsg'])
        }
      })
    }
  },
  /*setLoginInfo(loginInfo) {
    if (loginInfo.session_3rd) {
      wx.setStorageSync('session_3rd', loginInfo.session_3rd)
    }
    this.globalData.loginInfo = loginInfo
  },*/

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
      this.getLoginInfo(loginInfo => {
        if (loginInfo.is_login) {
          this.findNearbyUserAddr(userAddress => {
            if (!userAddress) {
              return
            }
            that.setCurrentAddress(userAddress)
          })
        }
      })
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