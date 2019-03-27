import Taro from '@tarojs/taro'

export const logError = (name, action, info) => {
    if (!info) {
      info = 'empty'
    }
    var device = "null"
    try {
      let deviceInfo = Taro.getSystemInfoSync()
      device = JSON.stringify(deviceInfo)
    } catch (e) {
      console.error('not support getSystemInfoSync api', e.message)
    }
    let time = formatTime(new Date())
    if (typeof info === 'object') {
        info = JSON.stringify(info)
      }
    console.error(time, name, action, info, device)
  }

  export const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  export const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }