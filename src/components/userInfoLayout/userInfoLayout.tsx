import Taro, { Component } from '@tarojs/taro'
import { View,Text,OpenData  } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import './userInfoLayout.scss'
if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}
export default class UserInfoLayout extends Component <{nickname?:string,avatar?:string},{nickname?:string,avatar?:string}>{
	static defaultProps: {  };
	constructor(){
		super(...arguments)
		this.state = {
			nickname:this.props.nickname,
			avatar:this.props.avatar
		}
	}
  toUserInfo(){
    Taro.navigateTo({
      'url':'/pages/user/userinfo/userinfo'
    })
	}
	componentWillReceiveProps(nextProps){
    this.setState({
			nickname:nextProps.nickname,
			avatar:nextProps.avatar,
    })
	}
  render () {
    const { nickname,avatar } = this.props
    return (
      <View className='user_info_view'>
      
        <View className='at-row at-row__justify--center' onClick={this.toUserInfo}>
            {avatar && <AtAvatar size='large' image={avatar} circle={true} />}
            {!avatar && <AtAvatar size='large' openData={{type: 'userAvatarUrl'}} circle={true} />}
        </View>
        <View className='at-row at-row__justify--center'>
          {nickname && <View className='nickname'>{nickname}</View>}
          {!nickname && <OpenData className='nickname' type='userNickName'/>}
        </View>
      </View>
    )
  }
}