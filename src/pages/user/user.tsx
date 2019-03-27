import Taro, {Config, Component } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components';
import { AtButton } from "taro-ui"
import './user.scss'
import UserInfoLayout from '../../components/userInfoLayout/userInfoLayout'
import UserItemView from '../../components/userItemView/userItemView'
import { logError } from '../utils/error';
import { checkLogin, getAuthorization } from '../utils/utils';
import { userinfoUrl, loginUrl } from '../utils/httpurl';
import { setGolbal } from '../../global_data';

export default class User extends Component<{},{login:boolean,nickname:string,avatar:string}>{
  config: Config = {
    enablePullDownRefresh:true,
    navigationBarTitleText:'我',
  }
  constructor () {
    super(...arguments)
    this.state = {
      login:false,
      nickname:'',
      avatar:''
    }
  }
    // 程序被载入	在微信小程序中这一生命周期方法对应 app 的 onLaunch
  componentWillMount () {}
  // 程序被载入	在微信小程序中这一生命周期方法对应 app 的 onLaunch，在 componentWillMount 后执行
    componentDidMount () {
      this.setState({
        login:checkLogin()
      })
      this.getUserInfo()
    }
  
  // 页面退出	在微信小程序中这一生命周期方法对应 onUnload
    componentWillUnmount () { }
  // 程序展示出来	在微信小程序中这一生命周期方法对应 onShow，在 H5 中同样实现
    componentDidShow () {
      this.setState({
        login:checkLogin(),
      })
      if(this.state.login){
        let name = Taro.getStorageSync('user_nickname')
        let at = Taro.getStorageSync('user_avatar')
        this.setState({
          nickname:name,
          avatar:at
        })
      }
    }
  // 程序被隐藏	在微信小程序中这一生命周期方法对应 onHide，在 H5 中同样实现
    componentDidHide () { }
    onPullDownRefresh(){
      this.getUserInfo()
    }
    getUserInfo(){
    // 获取用户信息
    if(checkLogin()){
      Taro.request({
        url:userinfoUrl,
        method:'GET',
        header:getAuthorization(),
        dataType:'json'
      }).then(res => {
        if(res.statusCode == 200 && res.data.code == 200){
          try{
            Taro.setStorageSync('user_id',res.data.data.uid)
            Taro.setStorageSync('user_nickname',res.data.data.nickname)
            Taro.setStorageSync('user_email',res.data.data.email)
            Taro.setStorageSync('user_phone',res.data.data.phone)
            Taro.setStorageSync('user_qq_id',res.data.data.qq_id)
            Taro.setStorageSync('user_weapp_id',res.data.data.weapp_id)
            Taro.setStorageSync('user_avatar',res.data.data.avatar)
            Taro.setStorageSync('user_gender',res.data.data.gender)
            Taro.setStorageSync('user_school',res.data.data.school)
            Taro.setStorageSync('user_birthday',res.data.data.birthday)
            Taro.setStorageSync('user_bio',res.data.data.bio)
          }catch(e){
            logError('api','保存用户信息',e)
          }
        }
        if(res.statusCode == 200 && res.data.code == 4000){
          Taro.clearStorageSync()
          Taro.showToast({
            title:'您的账号已在它出登录，请重新登录',
            icon:'none'
          })
          this.setState({
            login:false
          })
          setGolbal('token',undefined)
        }
        Taro.stopPullDownRefresh()
      },err => {
        logError('api','获取用户信息',err)
        Taro.stopPullDownRefresh()
      })
    }
    }

    // 获取微信授权
    wxAuthorization(userInfo){
      Taro.login().then(res => {
         this.showLoading()
          Taro.request({
            url:loginUrl,
            method:'POST',
            data:{
              wx_code:res.code,
              nickname:userInfo.detail.userInfo.nickName,
              avatar:userInfo.detail.userInfo.avatarUrl,
              gender:userInfo.detail.userInfo.gender
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
                  logError('auth','登录失败',e)
                }
                // 变更登录状态
                this.setState({
                  login:true
                },() => {
                  this.getUserInfo()
                })
                setGolbal('token',res.data.token)
            }
            this.showToast(res.data.msg)
            this.hideLoading()
          },err => {
            this.hideLoading()
            logError('auth','获取授权失败',err)
          })
        },err => {
          logError('wx','微信获取授权失败',err)
        })
    }
    showLoading(){
      Taro.showLoading({
        title:'登录中'
      })
    }
    hideLoading(){
      Taro.hideLoading()
    }
    showToast(message: string){
      Taro.showToast({
        title:message,
        icon:'none',
        duration:1500,
        mask:true
      })
    }

    render () {
      const { login } = this.state
      return (
        <ScrollView className='user'
        scrollY={true}
        scrollWithAnimation>
          {login && <UserInfoLayout nickname={this.state.nickname} avatar={this.state.avatar} />}
          {!login && <AtButton className='loginButton' type='primary' size='normal' openType='getUserInfo' onGetUserInfo={this.wxAuthorization}>登录</AtButton>}
          
          <UserItemView content='我的动态' leftUrl='/pages/user/userDynamic/userDynamic' rightUrl='/pages/dynamic/publish/publish' />
          <UserItemView content='我的消息' hint='查看' rightUrl='/pages/user/message/message' />
          <UserItemView content='反馈建议' hint='反馈' rightUrl='/pages/common/feedBack/feedBack' />
        </ScrollView>
      )
    }
}