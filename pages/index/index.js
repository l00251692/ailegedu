      import {
  getBannerInfo,getProjectList
} from '../../utils/api'

var app = getApp();

Page({
  data: {
    page: 0,
    hasMore: true,
    loading: false
  },

    onLoad: function () {

        wx.getLocation({
            success: function (res) {
                console.log(res);
            },
        })        
        this.getBanner();
        this.getProjectList();  
    },
    onShow: function () {
      // 页面显示
    },
    search: function (e) {

        wx.navigateTo({
            url: '/pages/activity/search/index'
        });

    },
    getBanner:function(e) {
        var that = this;
        getBannerInfo(
        {
            success(data) {
              that.setData({
                banner_arr: JSON.parse(data)
              })
            }
        }) 
        console.log("111:" + this.banner_arr)      
    },
    getProjectList: function (e) {
      var that = this;
      var { page } = this.data

      getProjectList(
      {
          page,
          success(data) {
            console.log("getProjectList:" + data)
            var list  = JSON.parse(data)
            var { projectList} = that.data
            that.setData({
              projectList: projectList ? projectList.concat(list) : list,
              page: page + 1,
              hasMore: data.count == 10,
              loading: false
            })
          }
      })
    },
    create_project:function(e)
    {
      wx.navigateTo({
        url: '/pages/project/create'
      });
    }

})
