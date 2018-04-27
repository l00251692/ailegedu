
import {
  createProject, getUnivList, updateProjectImg, updateProjectInfoImg, getQiniuToken
} from '../../utils/api'

import {
  uploadFile,alert, getPrevPage
} from '../../utils/util'

import dateFormat from '../../utils/dateformat'
import { host } from '../../config'

const qiniuUploader = require("../../utils/qiniuUploader")


Page({

    data:{
      tempFilePaths:null,
      // provinceList: [
      //   { "proviceId": "1", "name": "江苏" }
      // ],
      // univList: [
      //   {
      //     "provinceId": "1",
      //     "univs": [
      //       { "id": "1", "name": "南京林业大学" },
      //       { "id": "2", "name": "河海大学" }
      //     ]
      //   },
      // ],
      selectProv: '',
      selectUniv: '不限',
      uploadimgs: [], //上传图片列表
    },
    onLoad: function (options) {
      this.callback = options.callback || 'callback'
      var { provinceList, univList} = this.data
      var that = this
      getUnivList({
        flag:0,
        success(data)
        {
          console.log(JSON.stringify(data))
          var tmp = new Date()
          var milliseconds = tmp.getTime() + 1000 * 60 * 60 * 24 * 30;
          var tmp_date = dateFormat(new Date(milliseconds), "yyyy-mm-dd")
          that.setData({
            provinceList: data.provinceList,
            univList: data.univList,
            university: [data.provinceList, data.univList[0].univs],
            date: tmp_date
          })
        }
      })
    },

    bindMultiPickerChange: function (e) {
      console.log("bindMultiPickerChange", e)
      var { provinceList, univList} = this.data
      this.setData({
        selectProv: provinceList[e.detail.value[0]].name,
        selectUniv: univList[e.detail.value[0]].univs[e.detail.value[1]].name
      })
      console.log(univList[e.detail.value[0]].univs[e.detail.value[1]].name)
      console.log(e.detail.value[1])
      
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
        }
      })
    },

    chooseImage2: function ()  {
      console.log("chooseImage2")
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          that.setData({
            uploadimgs: that.data.uploadimgs.concat(res.tempFilePaths)
          })
        }
      })
    },

    editImage2: function () {
      this.setData({
        editable: !this.data.editable
      })
    },

    deleteImg2: function (e) {
      const imgs = this.data.uploadimgs
      this.setData({
        uploadimgs: imgs.remove(e.currentTarget.dataset.index)
      })
    },

    onTitleInput(e) {
      var { value: title } = e.detail
      this.setData({
        title
      })
    },

    onConcatInput(e) {
      var { value: concat } = e.detail
        this.setData({
          concat
      })
    },

    onInstructionInput(e) {
      var { value: instruction } = e.detail
      this.setData({
        instruction
      })
    },

    bindDateChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      if (new Date(e.detail.value) < new Date())
      {
        return alert("截止时间不能小于当前日期")
      }
      if (e.detail.value)
      this.setData({
        date: e.detail.value
      })
    },

    onSubmit: function () {
      var that = this
      var {
        tempFilePaths, title, concat, instruction, date, selectUniv, uploadimgs
      } = this.data

      if (title == null) {
        return alert('请输入标题')
      }

      if (instruction == null) {
        return alert('请输入内容介绍')
      }

      if (tempFilePaths == null)
      {
        return alert('请上传封面')
      }

      this.setData({
        loading: true
      })

      createProject({
        title, concat, instruction, date, selectUniv,
        success(data)
        {
          //获取上传七牛云的token
          var token = ''
          var project_id = data.project_id
          getQiniuToken({
            success(data)
            {
              token = data.upToken;
              console.log("上传" + token)
              qiniuUploader.upload(tempFilePaths[0], (res) => {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                console.log("上传图片成功:"+ JSON.stringify(res))
                updateProjectImg({
                  project_id,
                  head_img: res.imageURL,
                  success(data) {
                    //逐张内容图片上传
                    var fail_num = 0;
                    for (var i = 0; i < uploadimgs.length; i++) {
                      var filePath_tmp = uploadimgs[i]
                      qiniuUploader.upload(filePath_tmp, (res) => {
                        //成功后将地址更新到服务器
                        updateProjectInfoImg({
                          project_id,
                          info_img_url: res.imageURL,
                        })

                      }, (error) => {
                        fail_num++
                        console.log('error: ' + error);
                      },
                        {
                          region: 'ECN', //华东
                          domain: 'img.ailogic.xin',
                          key: 'prj_' + project_id + '_' + filePath_tmp.substr(30,50),
                          uptoken: token
                        }, (res) => {
                          console.log('上传进度', res.progress)
                          console.log('已经上传的数据长度', res.totalBytesSent)
                          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                        });
                    }

                    if (fail_num == 0){
                      that.setData({
                        loading: false
                      })

                      wx.showToast({
                        title: '创建项目成功',
                      })
                      //刷新项目列表
                      getPrevPage()[that.callback]()

                      wx.redirectTo({
                        url: '/pages/project/detail?id=' + project_id,
                      })
                    }
                  },
                  error(data) {
                    console.log('error: ' + error);
                    alert("更新项目封面失败，请稍后")
                    that.setData({
                      loading: false
                    })
                  }
                })
              },
                (error) => {
                  console.log("error" + error)
                  alert("上传项目封面失败，请稍后")
                  that.setData({
                    loading: false
                  })
                }, {
                  region: 'ECN', //华东
                  domain: 'img.ailogic.xin', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
                  //key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
                  key: 'prj_' + project_id , //项目ID不重复
                  // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
                  uptoken: token, // 由其他程序生成七牛 uptoken
                  //uptokenURL: '${host}/project/getQiniuTokenWx', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
                  //uptokenFunc: function () { return '[yourTokenString]'; }
                }, (res) => {
                  console.log('上传进度', res.progress)
                  console.log('已经上传的数据长度', res.totalBytesSent)
                  console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                });
            },
            error(data){
              return alert("连接服务器失败请稍后");
            }
          })
        },
        error(data) {
         alert('创建项目失败，请稍后')
         that.setData({
            loading: false
         })
       }
      })   
    }
})