
const dateTimePicker = require('../../utils/dateTimePicker');
Page({

    data:{
        tempFilePaths:"/images/default-project-head.png",
        date: '2018-10-01',
        time: '12:00',
        dateTimeArray: null,
        dateTime: null,
        dateTimeArray1: null,
        dateTime1: null,
        startYear: 2000,
        endYear: 2050
    },
    onLoad: function () {

        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        // var lastArray = obj1.dateTimeArray.pop();
        // var lastTime = obj1.dateTime.pop();

        // var lastArray = obj1.dateTimeArray.pop();
        var lastArray = obj1.dateTimeArray.splice(obj1.dateTime.length - 2,2);
        // var lastTime = obj1.dateTime.pop();
        var lastTime = obj1.dateTime.splice(obj1.dateTime.length - 2, 2);

        console.log(obj1);

        console.log(obj1.dateTimeArray);
        console.log(obj1.dateTime);

        this.setData({
            dateTime: obj.dateTime,
            dateTimeArray: obj.dateTimeArray,
            dateTimeArray1: obj1.dateTimeArray,
            dateTime1: obj1.dateTime
        });
    },
    publish: function () {

        wx.navigateTo({
            url: '/pages/publish/publish_success/index'
        });

    },
    changeDate(e) {
        this.setData({ date: e.detail.value });
    },
    changeTime(e) {
        this.setData({ time: e.detail.value });
    },
    changeDateTime(e) {
        this.setData({ dateTime: e.detail.value });
    },
    changeDateTime1(e) {
        this.setData({ dateTime1: e.detail.value });
    },
    changeDateTimeColumn(e) {
        var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray: dateArr,
            dateTime: arr
        });
    },
    changeDateTimeColumn1(e) {
        var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray1: dateArr,
            dateTime1: arr
        });
    },

    chooseImage: function () {
      var that = this;
      wx.chooseImage({
        count: 1, // 默认9 
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
        success: function (res) {
          that.setData({
            tempFilePaths: res.tempFilePaths
          }) 
          var tempFilePaths1 = res.tempFilePaths
          wx.uploadFile({
            url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址 
            filePath: tempFilePaths1[0],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (res) {
              var data = res.data
              //do something 
            }
          })
        }
      })
    }
})