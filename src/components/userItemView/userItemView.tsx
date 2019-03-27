import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './userItemView.scss'

if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}
export default class UserItemView extends Component <{content:string,leftUrl?:string,rightUrl:string,hint?:string},{}>{
  static defaultProps: {  };

  onLeftButtonClick(){
    const { leftUrl} = this.props
    if(leftUrl != undefined){
      Taro.navigateTo({
          url:leftUrl
      })
    }
  }

  onRightButtonClick(){
    Taro.navigateTo({
      url:this.props.rightUrl
    })
  }

    render(){
      const { content, hint } = this.props
      return(
        <View className='user-item-view'>
          <View className='at-row at-row__align--center'>
            <View onClick={this.onLeftButtonClick} className='at-col at-col-9'><Text className='user-item-view-content'>{content}</Text></View>
            <View onClick={this.onRightButtonClick} className='at-col at-col-2 at-col--auto' ><Text className='user-item-view-content'>{hint}</Text></View>
            <AtIcon className='at-col at-col-1 at-col--auto' value='chevron-right' size='24' color='#333'></AtIcon>
          </View>
        </View>
      )
    }
}

UserItemView.defaultProps = {
  hint:'发布'
}