import { getMsgList, setProjectCommentRead } from '../../utils/api'
import {
  datetimeFormat
} from '../../utils/util'

Page({
  data: {

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.loadData()
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

    getMsgList({
      success(data) {
        var list2 = data.list.map(item => {
          item['time'] = datetimeFormat(item['time']);
          if (item['is_read'] == 1)
          {
            item['color'] ='#999'
          }
          else{
            item['color'] = 'inherit'
          }
          return item
        })
        that.setData({
          list: list2,
          msgCount: data.count
        })
      },
      error(data){
        that.setData({
          list: [],
          msgCount:0
        })
      }
    }) 
  },
  callback() {
    console.log("message callback")
    this.loadData()
  },
  onMsginfo:function (e)
  {
    //设置消息已读
    var project_id = e.currentTarget.dataset.projectId
    setProjectCommentRead({
      project_id,
      success(data){
      }
    })
    wx.navigateTo({
      url: '/pages/project/detail?id=' + project_id + ''
    })
  }
})