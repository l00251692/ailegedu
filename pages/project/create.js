
import {
  createProject
} from '../../utils/api'

import {
  uploadFile,alert, getPrevPage
} from '../../utils/util'

Page({

    data:{
      tempFilePaths: ['/images/index/pro_img.png'],
    },
    onLoad: function () {

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
    onTitleInput(e) {
      var { value: title } = e.detail
      this.setData({
        title
      })
    },
    onInstructionInput(e) {
      var { value: instruction } = e.detail
      this.setData({
        instruction
      })
    },
    onSubmit: function () {
      var that = this
      var {
        tempFilePaths, title, instruction
      } = this.data

      if (title == null) {
        return alert('请输入标题')
      }

      if (instruction == null) {
        return alert('请输入内容介绍')
      }

      this.setData({
        loading: true
      })
      createProject({
        title, instruction, 
        success(data) {
          if (tempFilePaths[0] == '/images/index/pro_img.png')
          {
            that.setData({
              loading: false
            })
            alert('创建项目成功', function () {
              var callback = getPrevPage()['callback']
              callback && callback()
              wx.navigateBack()
            })
          }
          else
          {
            uploadFile(
              {
                url: 'project/updateProjectImgWx',
                data: {
                  project_id: data.project_id,
                  filePath: tempFilePaths[0] //filePath为必须，在公共函数里写了
                },
                success(data) {
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
          } 
        },
        error(data) {
          that.setData({
            loading: false
          })
        }
      })
    }
})