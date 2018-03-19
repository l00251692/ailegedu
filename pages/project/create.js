
import {
  createProject, getUnivList
} from '../../utils/api'

import {
  uploadFile,alert, getPrevPage
} from '../../utils/util'
import dateFormat from '../../utils/dateformat'

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
    onLoad: function () {
      var { provinceList, univList} = this.data
      var that = this
      getUnivList({
        success(data)
        {
          console.log(JSON.stringify(data))
          var tmp_date = dateFormat(new Date(), "yyyy-mm-dd")
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
    chooseImage2: function (type) {
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],
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
        success(data) {
          uploadFile(
            {
              url: 'project/updateProjectImgWx',
              data: {
                project_id: data.project_id,
                filePath: tempFilePaths[0] //filePath为必须，在公共函数里写了
              },
              success(data) {
                //逐章内容图片上传
                var fail_num = 0;
                for (var i=0; i<uploadimgs.length; i++)
                {
                  var filePath_tmp = uploadimgs[i]
                  //上传图片
                  uploadFile(
                    {
                      url: 'project/updateProjectInfoImgWx',
                      data: {
                        project_id: data.project_id,
                        filePath: filePath_tmp //filePath为必须，在公共函数里写了
                      },
                      error(data)
                      {
                        fail_num++;
                      }
                    })
                }
                that.setData({
                  loading: false
                })
                alert('创建项目成功', function () {
                  var callback = getPrevPage()['callback']
                  callback && callback()
                  wx.navigateBack()
                }) 
              },
              error(data) {
                alert('创建失败，请稍后')
                that.setData({
                  loading: false
                })
              }
            }) 
        },
        error(data) {
          that.setData({
            loading: false
          })
        }
      })
    }
})