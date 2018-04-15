import {
  getMyProjectList
} from '../../utils/api'

Page({
  data: {
    page: 0,
    hasMore: true,
    loading: false
  },
    onLoad: function () {
      var that = this
      this.init()  
    },
    onShow: function () {
      // 页面显示
    },
    init()
    {
      var that = this
      this.initData()
      this.getMyProjectList()
    },
    initData() {
      this.setData({
        page: 0,
        hasMore: true,
        loading: false,
        projectList: null
      })
    },
    
    getMyProjectList: function (e) { 
      if (this.data.loading) {
        return;
      }
      var that = this;
      var { page } = this.data

      this.setData({
        loading: true
      })
      
      getMyProjectList(
      {
          page,
          success(data) {
            var list  = data.list
            var { projectList} = that.data
            that.setData({
              projectList: projectList ? projectList.concat(list) : list,
              page: page + 1,
              hasMore: data.count == 10, //一次最多10个，如果这次取到10个说明还有
              loading: false
            })
          }
      })
    },
    onReachBottom(e) {
       if (this.data.hasMore && !this.data.loading) {
         this.getMyProjectList();
       }
    },
    
    callback() {
       this.init()
    },
})
