
Page({
  data: {
    list:[
      {
        msg_id:0,
        type:1,
        title:'项目召集啊啊',
        user:'你好啊poue王磊都快来啊回复',
        color: 'inherit'
      },
      {
        msg_id: 1,
        type: 1,
        title: '项目召集啊啊2',
        color: 'inherit'
      },
      {
        msg_id: 2,
        type: 1,
        title: '项目召集啊啊3',
        color: '#999'
      }
    ]

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
  onPullDownRefresh(){
    this.loadData(function() {
      wx.stopPullDownRefresh()
    })
  },
  loadData(cb) {
    var that = this
    var {loading} = this.data
    if(loading) {
      return
    }
    this.setData({
      loading: true
    })
  },
  callback() {
    this.loadData()
  },
  onMsginfo:function (e)
  {
    wx.navigateTo({
      url: '/pages/project/detail?id=' + e.currentTarget.dataset.msgId
    })
  }
})