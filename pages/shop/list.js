//index.js
//获取应用实例
import {
  getSellers, getUnivList
} from '../../utils/api'

Page({
  data: {
    category: [
      {
        "category_id": "1",
        "title": "美食小吃",
        "icon": "/images/category/1.png"
      },
      {
        "category_id": "2",
        "title": "宿舍小铺",
        "icon": "/images/category/2.png"
      },
      {
        "category_id": "3",
        "title": "好玩好物",
        "icon": "/images/category/3.png"
      },
      {
        "category_id": "4",
        "title": "技能补习",
        "icon": "/images/category/4.png"
      },
      {
        "category_id": "5",
        "title": "二手共享",
        "icon": "/images/category/5.png"
      },
      {
        "category_id": "6",
        "title": "众筹项目",
        "icon": "/images/category/6.png"
      },
      {
        "category_id": "7",
        "title": "校园服务",
        "icon": "/images/category/7.png"
      },
      {
        "category_id": "8",
        "title": "免费入驻",
        "icon": "/images/category/8.png"
      }
    ],
    msgList:[
      { url: "url", title: "简单让生活更美好", src: "/images/toutiao_ban_1.png" },
      { url: "url", title: "入驻热线：18261149716", src:"/images/toutiao_ban_2.png"},
    ],
    page: 0,
    hasMore: true,
    loading: false
  },
  onLoad: function () {
    this.initAddress()
  },

  initAddress() {
    var that = this
    this.invalidateData()
    this.loadData()
  },

  loadData(cb) {
    if (this.data.loading) {
      return;
    }
    var that = this
    var {
      page, provinceList, univList
    } = this.data

    this.setData({
      loading: true
    })
  
    getUnivList({
      flag: 1,
      success(data) {
        that.setData({
          provinceList: data.provinceList,
          univList: data.univList,
          university: [data.provinceList, data.univList[0].univs],
        })

        if (wx.getStorageSync('lastUniv')) {
          that.setData({
            lastUniv: wx.getStorageSync('lastUniv')
          })
        }
        else {
          wx.setStorageSync('lastUniv', data.univList[0].univs[0].name)
          that.setData({
            lastUniv: data.univList[0].univs[0].name
          })
        }

        getSellers({
          page,
          selectUniv: that.data.lastUniv,
          success(data) {
            var { shopList } = that.data
            var list = data.map(item => {
              item['distanceFormat'] = (item.distance / 1000).toFixed(2)
              return item
            })
            cb && cb()
            that.setData({
              shopList: shopList ? shopList.concat(list) : list,
              page: page + 1,
              hasMore: data.count == 0,
              loading: false
            })
          }
        })
      }
    }) 
  },

  invalidateData() {
    this.setData({
      page: 0,
      hasMore: true,
      loading: false,
      shopList: null
    })
  },
  bindMultiPickerChange: function (e) {
    var { provinceList, univList } = this.data
    this.setData({
      selectProv: provinceList[e.detail.value[0]].name,
      lastUniv: univList[e.detail.value[0]].univs[e.detail.value[1]].name
    })
    wx.setStorageSync('lastUniv', univList[e.detail.value[0]].univs[e.detail.value[1]].name)
    this.invalidateData()
    this.loadData()
  },

  bindMultiPickerColumnChange(e) {
    var { provinceList, univList } = this.data
    if (e.detail.column == 0) {
      var univs = [];
      for (var i = 0; i < univList.length; i++) {
        if (univList[i].provinceId == provinceList[e.detail.value].proviceId) {
          univs = univList[i].univs;
          break;
        }
      }
      this.setData({
        province: [provinceList, univs]
      })
    }
  },
  onReachBottom(e) {
    if (this.data.hasMore && !this.data.loading) {
      this.loadData()
    }
  },
  onPullDownRefresh() {
    if (getApp().globalData.loginInfo.is_login) {
      this.loadData(function () {
        wx.stopPullDownRefresh()
      })
    } else {
      wx.stopPullDownRefresh()
    }
  },
  callback(address) {
    getApp().setCurrentAddress(address)
    this.initAddress()
  },
  onShareAppMessage() {
    return {
      title: '逛一逛',
      path: '/pages/shop/list'
    }
  }
})
