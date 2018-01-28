
Page({
  data: {
    art: {},
    tabs: ["详情", "讨论"],
    activeIndex: 0,
    review: {
      list: [{
        nick: "年年年",
        timeFormat:"2017-02-03 12:05:01",
        content:"这个挺好的怎么联系啊，这个挺好的怎么联系啊，这个挺好的怎么联系啊，这个挺好的怎么联系啊"
      },
      {
        nick: "2018",
        timeFormat: "2017-02-03 12:05:01",
        content: "这个挺好的怎么联系啊，我也觉得"
      }],
      hasMore: true,
      loading: false,
      page: 0,
    },


  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.id = options.id
    console.log('ID:' + this.id)
    this.loadData()
    this.loadReview()
    
  },
  onReady: function () {
    // 页面渲染完成
    wx.setNavigationBarTitle({
      title: "项目详情"
    })
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
  onScrolltolower(e) {
    var {
      hasMore, loading
    } = this.data.review
    if (hasMore && !loading) {
      this.loadReview()
    }
  },

  onShareAppMessage() {
    var {info:{seller_id, seller_name}} = this.data
    return {
      title: seller_name,
      path: `/pages/shop/show?id=${seller_id}`
    }
  }
})