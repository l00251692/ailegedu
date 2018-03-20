import {
  getProjectInfo, sendProjdectComment, getCommentList, setProjectLikeStatus
} from '../../utils/api'
import {
  alert
} from '../../utils/util'
Page({
  data: {
    art: {},
    tabs: ["项目详情", "评论"],
    activeIndex: 0,
    hasMore: true,
    loading: false,
    page: 0,
    isShow: false,//控制emoji表情是否显示
    isLoad: true,//解决初试加载时emoji动画执行一次
    content: "",//评论框的内容
    //isLoading: true,//是否显示加载数据提示
    disabled: true,
    cfBg: false,
    _index: 0,
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [],//qq、微信原始表情
    alipayEmoji: [],//支付宝表情
    title: ''//页面标题,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.id = options.id
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
    var emojis = []
    var em = {}
    var emChar = that.data.emojiChar.split("-");
    that.data.emoji.forEach(function (v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      emojis.push(em)
    });
    
    that.setData({
      emojis: emojis
    })

    getProjectInfo(
      {
        project_id: id,
        success(data) {
          console.log(JSON.stringify(data))
          that.setData({
            info: data
          })
        }
      }
    )
  },

  initComment(){
    this.setData({
      page: 0,
      hasMore: true,
      loading: false,
      comments: null
    })
  },

  loadReview() {
    var that = this;
    var id = this.id
    var { comments, page, loading } = this.data
    if (loading) {
      return;
    }
    this.setData({
      loading: true
    })

    getCommentList({
      project_id:id,
      page,
      success(data)
      {
        var list = data.list;
        that.setData({
          loading: false,
          comments: comments ? comments.concat(list) : list,
          page: page + 1,
          hasMore: data.count == 10
        })
      },
      error(data)
      {
        that.setData({
          loading: false
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
  onScrolltolower(e) {
    console.log("onScrolltolower")
    var {
      hasMore, loading
    } = this.data
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
  },

  // onReachBottom: function () {
  //   var conArr = [], that = this;
  //   that.data.cfBg = false;
  //   console.log("onReachBottom")
  //   if (that.data._index < 5) {
  //     for (var i = 0; i < 5; i++) {
  //       conArr.push({
  //         avatar: "http://soupu.oss-cn-shanghai.aliyuncs.com" + "/images/banner5.jpg",
  //         uName: "雨碎江南",
  //         time: "2012-12-13",
  //         content: "我是上拉加载的新数据" + i
  //       })

  //     }
  //     //模拟网络加载
  //     setTimeout(function () {
  //       that.setData({
  //         comments: that.data.comments.concat(conArr)
  //       })
  //     }, 1000)
  //   } else {
  //     that.setData({
  //       isLoading: false
  //     })
  //   }
  //   ++that.data._index;
  // },
  //解决滑动穿透问题
  emojiScroll: function (e) {
    console.log(e)
  },
  //文本域失去焦点时 事件处理
  // textAreaBlur: function (e) {
  //   //获取此时文本域值
  //   console.log(e.detail.value)
  //   this.setData({
  //     content: e.detail.value
  //   })

  // },
  //文本域获得焦点事件处理
  textAreaFocus: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },
  //点击表情显示隐藏表情盒子
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.false
    })
  },
  //表情选择
  emojiChoose: function (e) {
    //当前输入内容和表情合并
    this.setData({
      content: this.data.content + e.currentTarget.dataset.emoji
    })
  },
  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function () {
    this.setData({
      isShow: false,
      cfBg: false
    })
  },

  onCommentInput(e) {
    var { value: conent } = e.detail
    this.setData({
      content
    })
  },
  //发送评论评论 事件处理
  send: function () {
    var that = this
    if (that.data.content.trim().length > 0) {
      sendProjdectComment({
        project_id:this.id,
        comment: that.data.content,
        //comment:"你好啊",
        success(data)
        {
          that.setData({
            content: "",//清空文本域值
            isShow: false,
            cfBg: false
          })
          that.initComment()
          that.loadReview()
        },
        error(data)
        {
          alert("提交评论失败，请稍后")
        }
      })
      
    } else {
      that.setData({
        content: ""//清空文本域值
      })
    }
  },

  onLike: function (e) {
    var{ id, info:{isLike} } = this.data
    console.log("onLike1:" + JSON.stringify(isLike))
    var that = this

    setProjectLikeStatus({
      status: !isLike,
      project_id : that.id,
      success(data)
      {
        that.setData({
          'info.isLike': !isLike 
        })
        console.log("onLike2:" + JSON.stringify(that.data.info.isLike))
        wx.showToast({
          title: !isLike ? '关注成功' : '取消成功',
          icon: 'none',
          duration: 1500
        });
      }
    })     
  },
  onShareAppMessage() {
    var { info } = this.data
    return {
      title: info.item_title,
      path: '/pages/project/detail'
    }
  }
})
