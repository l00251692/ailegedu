// var host = "apitest.ipaotui.com"
//var host = "api.ipaotui.com"
var host = "localhost"
//var host = "ailogic.xin"
const debug = wx.getStorageSync('debug')
if (debug) {
  host = "ailogic.xin"
}

module.exports = {
  host,
  qqmapKey: 'FPOBZ-UT2K2-ZFYUC-CX67E-IOOYS-7XFQ6'
}
