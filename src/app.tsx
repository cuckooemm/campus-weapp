import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import './app.scss'
import { setGolbal } from './global_data';
import { refreshTokenUrl } from './pages/utils/httpurl';
import { logError } from './pages/utils/error';

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/campus/campus',
      'pages/user/user',
      'pages/dynamic/publish/publish',
      'pages/dynamic/commentDetails/commentDetails',
      'pages/dynamic/replyDetails/replyDetails',
      'pages/user/userinfo/userinfo',
      'pages/user/message/message',
      'pages/user/userDynamic/userDynamic',
      'pages/common/feedBack/feedBack'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      "color": "#626567",
      "selectedColor": "#2A8CE5",
      "backgroundColor": "#FBFBFB",
      "borderStyle": "white",
      "list": [{
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/index.png",
        "selectedIconPath": "images/index_focus.png"
      }, {
        "pagePath": "pages/campus/campus",
        "text": "校园",
        "iconPath": "images/campus.png",
        "selectedIconPath": "images/campus_focus.png"
      }, {
        "pagePath": "pages/user/user",
        "text": "我",
        "iconPath": "images/user.png",
        "selectedIconPath": "images/user_focus.png"
      }]
    }
  }
  
  componentDidMount () {
    let info = Taro.getSystemInfoSync()
    this.checkToken()
    setGolbal('windowsH',info.windowHeight)
    setGolbal('windowsW',info.windowWidth)
  }
  
  checkToken(){
    // 获取本地Token  并判断是否过期
    let expires_at = Taro.getStorageSync('token_expires_at')
    let token = Taro.getStorageSync('token')
    if(token && expires_at > new Date().getTime() / 1000){
      setGolbal('token',token)
    }else{
      let invalide_at = Taro.getStorageSync('token_invalid_at')
      if(token && Number(invalide_at) > new Date().getTime() / 1000){
        // 刷新Token 
        Taro.request({
          url:refreshTokenUrl,
          method:'GET',
          header:{
            'Authorization':token
          },
          dataType:'json'
        }).then(res => {
          if(res.statusCode == 200 && res.data.code == 200){
            // 保存token
            try{
              Taro.setStorageSync('token',res.data.token)
              Taro.setStorageSync('token_expires_at',res.data.expires_at)
              Taro.setStorageSync('token_invalid_at',res.data.invalid_at)
            }catch(e){
              logError('auth','刷新授权',e)
            }
            setGolbal('token',res.data.token)
          }else{
            Taro.clearStorageSync()
          }
        },err => {
          logError('auth','刷新授权',err)
        })
      }
    }
  }
  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
