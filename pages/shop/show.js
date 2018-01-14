// pages/shop/show.js

import {
  makePhoneCall,
  datetimeFormat
} from '../../utils/util'

import {
  getSellerInfo,
  getReviews, addQuasiOrder
} from '../../utils/api'


var initOrder = {
  totalNum: 0,
  totalPrice: 0,
  totalGoodsPrice: 0,
  totalPackingFee: 0,
  goodsNums: {},
  goods: []
}

Page({
  data: {
    tabs: ["商品", "评价", "商家"],
    activeIndex: 0,

    activeMenuIndex: 0,
    showCart: false,

    showSubGoods: false,

    order: initOrder,

    review: {
      hasMore: true,
      loading: false,
      page: 0,
    },


  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.id = options.id || 2
    console.log('ID:' + this.id)
    this.loadData()
    //this.loadReview()
    
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
    var id = this.id;
    wx.showNavigationBarLoading()
    getSellerInfo({
      seller_id: id,
      success(data) {
        var a = []
        a = JSON.parse(data)
        console.log("sellerinfo:" + data);
        a['distanceFormat'] = +(a['distance'] / 1000).toFixed(2)
        that.setData({
          info: a
        })
        wx.setNavigationBarTitle({
          title: a.seller_name
        })
      },
      complete() {
        wx.hideNavigationBarLoading()
      }
    })
  },

  loadReview() {
    var that = this;
    var id = this.id
    var {review: {
      page, loading
    }} = this.data
    if (loading) {
      return;
    }

    this.setData({
      'review.loading': true
    })
    getReviews({
      page,
      seller_id: id,
      success(data) {
        var {review: {
          list
        }} = that.data
        var a = []
        a = JSON.parse(data)
        var list2 = a.list.map(item => {
          item['timeFormat'] = datetimeFormat(item['time']);
          return item
        })

        that.setData({
          'review.list': list ? list.concat(list2) : list2,
          'review.loading': false,
          'review.page': page + 1,
          'review.hasMore': data.count == 10
        })
      }
    })
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

  swiperChange(e) {
    var {current} = e.detail
    this.setData({
      activeIndex: current
    })
  },
  menuClick: function (e) {
    this.setData({
      activeMenuIndex: e.currentTarget.id
    })
  },

  addGoods(goods, item) {
    var { goods_id, sub_id, select_property, num} = item
    var itemIndex;
    if (sub_id) {
      itemIndex = goods.findIndex(item => {
        return item['goods_id'] == goods_id && item['sub_id'] == sub_id && item['select_property'] == select_property
      })
    } else {
      itemIndex = goods.findIndex(item => {
        return item['goods_id'] == goods_id && item['select_property'] == select_property
      })
    }
    if (itemIndex >= 0) {
      goods[itemIndex]['num'] += num
    } else {
      goods.push(item)
    }
    return goods
  },
  removeGoods(goods, item) {
    var { goods_id, sub_id, select_property,num} = item
    console.log("remove:" + select_property);
    var itemIndex;
    if (sub_id) {
      itemIndex = goods.findIndex(item => {
        if (select_property)
        {
          return item['goods_id'] == goods_id && item['sub_id'] == sub_id && item['select_property'] == select_property
        }
        else
        {
          return item['goods_id'] == goods_id && item['sub_id'] == sub_id
        }      
      })
    } else {
      itemIndex = goods.findIndex(item => {
        if (select_property)
        {
          return item['goods_id'] == goods_id && item['selectProperty'] == selectProperty
        }
        else
        {
          return item['goods_id'] == goods_id
        }
      })
    }
    console.log("dd:" + itemIndex);
    console.log("goods:" + JSON.stringify(goods));
    if (itemIndex >= 0) {
      item = goods[itemIndex]
      if (item.num > num) {
        item.num -= num
      } else {
        goods.splice(itemIndex, 1)
      }
    }
    return goods
  },

  increase(e) {
    var {order, info: {goods_map}} = this.data;
    var { goodsId, subId, tmpf, tmps, tmpt, selectProperty} = e.currentTarget.dataset;
    console.log(goodsId)
    console.log("3333")
    console.log(e.currentTarget.dataset)
    for (var i = 0; i < goods_map.length; i++) {
      if (goods_map[i].goods_id == goodsId) {
        var goods = goods_map[i];
        break;
      }
    }
    var selectPropertyTmp = null;
  
    if (selectProperty != null)
    {
      console.log("here");
      selectPropertyTmp = selectProperty;
    }
    else
    {
      if ((tmpf != null) && (goods.property!= null) && goods.property.length > 0 ) {
        selectPropertyTmp = goods.property[0].property_value[tmpf].value_name;
      }
      if ((tmps != null) && (goods.property != null) && goods.property.length > 1 ) {
        selectPropertyTmp = selectPropertyTmp + "," + goods.property[1].property_value[tmps].value_name;
      }
      if ((tmpt != null) && (goods.property != null) && goods.property.length > 2 ) {
        selectPropertyTmp = selectPropertyTmp + "," + goods.property[2].property_value[tmpt].value_name;
      }
    }
    
    console.log(selectPropertyTmp);
    
    var {goods_id, goods_name} = goods
    if (subId) {
      goods = goods.sub_goods[subId];
      var {sub_id, sub_name} = goods
    }
    order.totalNum += 1;
    order.totalGoodsPrice += +goods.price;
    order.totalPackingFee += +goods.packing_fee;
    order.totalPrice = +((order.totalGoodsPrice + order.totalPackingFee).toFixed(2));

    order.goods = this.addGoods(order.goods, {
      goods_id, goods_name,
      sub_id, sub_name,
      select_property: selectPropertyTmp,
      price: goods.price,
      packing_fee: goods.packing_fee,
      num: 1
    })
    order.goodsNums = this.calcGoodsNums(order.goods)

    this.setData({
      order
    })

    if (subId) {
      this.setData({
        showSubGoods: false,
        activeSubGoods: Object.assign(this.data.activeSubGoods, {
          subNums: this.calcSubNums(order.goods, goodsId)
        })
      })
    }

  },
  decrease(e) {
    var {order, info: {goods_map}} = this.data;
    var { goodsId, subId, selectProperty} = e.currentTarget.dataset;
    console.log("hh:"+ selectProperty);
    console.log("goodsId:" + goodsId);
    console.log("subId:" + subId);
    for (var i = 0; i < goods_map.length; i++) {
      if (goods_map[i].goods_id == goodsId) {
        var goods = goods_map[i];
        break;
      }
    }
    
    if (subId) {
      if (goods.sub_goods)
      { 
        goods = goods.sub_goods[subId];
      }
      
    }

    
    order.totalNum -= 1;
    order.totalGoodsPrice -= +goods.price;
    order.totalPackingFee -= +goods.packing_fee;
    order.totalPrice = +((order.totalGoodsPrice + order.totalPackingFee).toFixed(2));
    order.goods = this.removeGoods(order.goods, {
      goods_id: goodsId,
      sub_id: subId,
      select_property: selectProperty,
      num: 1
    })
    order.goodsNums = this.calcGoodsNums(order.goods)
    this.setData({
      order
    })

    if (subId) {
      this.setData({
        activeSubGoods: Object.assign(this.data.activeSubGoods, {
          subNums: this.calcSubNums(order.goods, goodsId)
        })
      })
    }

    if (order.totalNum == 0) {
      this.hideCart()
    }
  },
  calcGoodsNums(goods) {
    var goodsNums = {}
    for (let i = 0, len = goods.length; i < len; i++) {
      let {goods_id, num} = goods[i]
      if (goodsNums[goods_id]) {
        goodsNums[goods_id] += num
      } else {
        goodsNums[goods_id] = num
      }
    }
    return goodsNums
  },
  calcSubNums(goods, goodsId) {
    var subNums = {}
    for (let i = 0, len = goods.length; i < len; i++) {
      let {goods_id, sub_id, num} = goods[i]
      if (goods_id == goodsId) {
        subNums[sub_id] = num
      }
    }
    return subNums
  },
  clearCart(e) {
    this.setData({
      order: initOrder,
      showCart: false
    })
  },
  hideCart(e) {
    this.setData({
      showCart: false
    })
  },
  toggleCart(e) {
    var {showCart, order: {totalNum}} = this.data

    if (totalNum <= 0) {
      return;
    }
    this.setData({
      showCart: !showCart
    })
  },

  showSubGoods(e) {
    var {info: {goods_map}, order} = this.data;
    var {goodsId} = e.currentTarget.dataset;
    for(var i = 0; i< goods_map.length; i++)
    {
      if (goods_map[i].goods_id == goodsId)
      {
        var { goods_id, goods_name, property, sub_goods } = goods_map[i];
        break;
      }
    }

    this.setData({
      showSubGoods: true,
      activeSubGoods: {
        goods_name, goods_id,
        property,
        sub_goods,
        activeIndex: 0,
        tmp0: 0,  //目前 先手写最多支持配置商品三个属性，实在想不到好的方法 
        tmp1: 0,
        tmp2: 0,
        subNums: this.calcSubNums(order.goods, goodsId)
      }
    })
  },
  hideSubGoods(e) {
    this.setData({
      showSubGoods: false
    })
  },
  changeSubGoods(e) {
    var {subIndex} = e.currentTarget.dataset;
    var {activeSubGoods} = this.data;
    activeSubGoods['activeIndex'] = subIndex
    console.log(subIndex);
    this.setData({
      activeSubGoods
    })
  },
  selectProperty0(e) {
    var { index,propertyName, propertyValue } = e.currentTarget.dataset;
    var { activeSubGoods } = this.data;
    console.log("111:" + index);
    activeSubGoods['tmp0'] = index;
    this.setData({
      activeSubGoods
    })
  },
  selectProperty1(e) {
    var { index, propertyName, propertyValue } = e.currentTarget.dataset;
    var { activeSubGoods } = this.data;
    console.log("111:" + index);
    activeSubGoods['tmp1'] = index;
    this.setData({
      activeSubGoods
    })
  },
  selectProperty2(e) {
    var { index, propertyName, propertyValue } = e.currentTarget.dataset;
    var { activeSubGoods } = this.data;
    console.log("111:" + index);
    activeSubGoods['tmp2'] = index;
    this.setData({
      activeSubGoods
    })
  },
  onPhoneTap(e) {
    var {phone} = e.currentTarget.dataset
    makePhoneCall(phone)
  },

  onScrolltolower(e) {
    var {
      hasMore, loading
    } = this.data.review
    if (hasMore && !loading) {
      this.loadReview()
    }
  },
  onAddQuasiOrder(e) {
    var that = this
    var {
      info: {seller_id},
      order: {goods},
      loading
    } = this.data
    if (loading) {
      return
    }

    this.setData({
      loading: true
    })
    getApp().getLoginInfo(loginInfo => {
      if(!loginInfo.is_login) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
        this.setData({
          loading: false
        })
        return
      }
      addQuasiOrder({
        seller_id, goods,
        success(data) {

          that.setData({
            loading: false
          })
          wx.navigateTo({
            url: `/pages/order/quasi?id=${data.quasi_order_id}`
          })
        },
        error() {
          that.setData({
            loading: false
          })
        }
      })
    })
  },
  onShareAppMessage() {
    var {info:{seller_id, seller_name}} = this.data
    return {
      title: seller_name,
      path: `/pages/shop/show?id=${seller_id}`
    }
  }
})