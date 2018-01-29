
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
      page: 0
    },
  isShow: false,//控制emoji表情是否显示
    isLoad: true,//解决初试加载时emoji动画执行一次
    content: "",//评论框的内容
    isLoading: true,//是否显示加载数据提示
    disabled: true,
    cfBg: false,
    _index: 0,
    comments: [
      {
        avatar: "http://soupu.oss-cn-shanghai.aliyuncs.com" + "/images/banner4.jpg",
        uName: "😝雨碎江南",
        time: "2016-12-11",
        content: "九九八十一难，最难过的，其实是女儿国这一关，因为比起其他的艰难困苦来说，此时的唐僧是真的动心了，一句“来生若有缘分”道尽一切，只是为了心中崇高的理想，纵使心动也要断绝柔情继续西行。为国王惋惜，同时也对唐僧充满崇敬，尤其是了解了史上真实的唐玄奘以后，更是觉得此人了不起。"
      },
      {
        avatar: "http://soupu.oss-cn-shanghai.aliyuncs.com" + "/images/banner6.jpg",
        uName: "张珊珊",
        time: "2016-12-11",
        content: "音乐不分年纪，不过令人开心的是你们也不会年轻太久。😝😝😝😝"
      },
      {
        avatar: "http://soupu.oss-cn-shanghai.aliyuncs.com" + "/images/banner2.jpg",
        uName: "麦田的守望者",
        time: "2016-12-11",
        content: "看的时候还很小，不太明白里面的故事，长大后才发现西游记里水太深了。😢😢😡😡😼😼🍆🍇🍇🍆👧👰👨💑💇💅🐶🐶🙏✈🚲🚲😡😅👿😖😨😢😻🚃🚃🚌"
      },
      {
        avatar: "http://soupu.oss-cn-shanghai.aliyuncs.com" + "/images/Screenshot_2016-12-13-10-13-16-926.png",
        uName: "~LUCK",
        time: "2016-12-11",
        content: "86版《西游记》绝对是那代人的国民记忆，放假天天等着看，一遍又一遍，悟空被压在五指山下经历春夏秋冬，寒冬大雪里一个人吃雪，路过的小牧童送来水果，那一段我和小伙伴们哭的稀里哗啦，当年的特技后期制作还很落后，但所有演员都是用心在塑造角色，没有艳俗的服装造型，良心制作！ 以后会陪孩子再看"
      },
      {
        avatar: "http://soupu.oss-cn-shanghai.aliyuncs.com" + "/images/banner3.jpg",
        uName: "沃德天·娜么帥",
        time: "2016-12-11",
        content: "想起，小时候，父亲教我这首歌的样子。"
      },
      {
        avatar: "http://soupu.oss-cn-shanghai.aliyuncs.com" + "/images/Screenshot_2016-12-13-10-13-38-305.png",
        uName: "雨碎江南",
        time: "2016-12-11",
        content: "我的宿命，分两段， 未遇见你时，和遇见你以后。 你治好我的忧郁，而后赐我悲伤。 忧郁和悲伤之间的片刻欢喜， 透支了我生命全部的热情储蓄。 想饮一些酒，让灵魂失重，好被风吹走。 可一想到终将是你的路人， 便觉得，沦为整个世界的路人。 风虽大，都绕过我灵魂。"
      },
      {
        avatar: "http://soupu.oss-cn-shanghai.aliyuncs.com" + "/images/banner5.jpg",
        uName: "雨碎江南",
        time: "2016-12-01",
        content: "九九八十一难，最难过的，其实是女儿国这一关，因为比起其他的艰难困苦来说，此时的唐僧是真的动心了，一句“来生若有缘分”道尽一切，只是为了心中崇高的理想，纵使心动也要断绝柔情继续西行。为国王惋惜，同时也对唐僧充满崇敬，尤其是了解了史上真实的唐玄奘以后，更是觉得此人了不起。"
      }
    ],
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
  },

  onReachBottom: function () {
    var conArr = [], that = this;
    that.data.cfBg = false;
    console.log("onReachBottom")
    if (that.data._index < 5) {
      for (var i = 0; i < 5; i++) {
        conArr.push({
          avatar: util.ossAliyuncs + "/images/banner5.jpg",
          uName: "雨碎江南",
          time: util.formatTime(new Date()),
          content: "我是上拉加载的新数据" + i
        })

      }
      //模拟网络加载
      setTimeout(function () {
        that.setData({
          comments: that.data.comments.concat(conArr)
        })
      }, 1000)
    } else {
      that.setData({
        isLoading: false
      })
    }
    ++that.data._index;
  },
  //解决滑动穿透问题
  emojiScroll: function (e) {
    console.log(e)
  },
  //文本域失去焦点时 事件处理
  textAreaBlur: function (e) {
    //获取此时文本域值
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })

  },
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
  //发送评论评论 事件处理
  send: function () {
    var that = this, conArr = [];
    //此处延迟的原因是 在点发送时 先执行失去文本焦点 再执行的send 事件 此时获取数据不正确 故手动延迟100毫秒
    setTimeout(function () {
      if (that.data.content.trim().length > 0) {
        conArr.push({
          avatar: util.ossAliyuncs + "/images/banner5.jpg",
          uName: "雨碎江南",
          time: util.formatTime(new Date()),
          content: that.data.content
        })
        that.setData({
          comments: that.data.comments.concat(conArr),
          content: "",//清空文本域值
          isShow: false,
          cfBg: false
        })
      } else {
        that.setData({
          content: ""//清空文本域值
        })
      }
    }, 100)
  }
})