import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { DynamicItemData } from '../../model/model';
import { timestampFormat, getAuthorization, checkLogin } from '../../pages/utils/utils';
import NineGridView from '../nineGridView/nineGridView';
import './dynamicItem.scss'
import { dynamicPraiseUrl } from '../../pages/utils/httpurl';
import { logError } from '../../pages/utils/error';

if (process.env.TARO_ENV === "weapp") {
    require("taro-ui/dist/weapp/css/index.css")
  } else if (process.env.TARO_ENV === "h5") {
    require("taro-ui/dist/h5/css/index.css")
  }
  
export default class DynamicItem extends Component<{data:DynamicItemData},{data:DynamicItemData}>{
    static defaultProps: {  };
    constructor(){
      super(...arguments)
	    this.state = {
	      data:this.props.data
      }
    }
    componentWillReceiveProps(nextProps){
      this.setState({
        data:nextProps.data
      })
    }
    // 跳转评论页
    toCommentDetails(){
      Taro.navigateTo({
        url:'/pages/dynamic/commentDetails/commentDetails?id=' + this.state.data.id + '&browse=' + this.state.data.browse + '&comment_count=' + this.state.data.comment_count + '&praise_count=' + this.state.data.praise_count
      })
    }
    onSendPraise(){
      if(checkLogin()){
        Taro.request({
          url:dynamicPraiseUrl,
          method:'PUT',
          header:getAuthorization(),
          data:{
            'id':this.state.data.id
          },
          dataType:'json'
        }).then(res => {
          this.showTaost(res.data.msg)
        },err => {
          logError('api','praise',err)
        })
      }else{
        this.showTaost('请先登录')
      }
    }
    showTaost(msg){
      Taro.showToast({
        title:msg,
        icon:'none'
      })
    }
    render(){
      return(
        <View className='item'>
          <View className='header'>
            <AtAvatar size='small' circle={true} image={this.state.data.avatar}></AtAvatar>
            <View className='name'>
              <View style='padding:0px;'>{this.state.data.name}</View>
              <Text style='font-size:12px;padding:0px;'>{timestampFormat(this.state.data.created_at)}</Text>
            </View>
          </View>
          <View className='at-row content'>
					<Text className='at-col at-col-12 at-col--wrap' selectable={true}>{this.state.data.content}</Text>
				</View>
          {this.state.data.image && <NineGridView images={this.state.data.image}/>}
          <View className='item-buttom'>
            <View>浏览{this.state.data.browse}</View>
            <View onClick={this.toCommentDetails}>评论{this.state.data.comment_count}</View>
            <View onClick={this.onSendPraise}>点赞{this.state.data.praise_count}</View>
          </View>
        </View>
      )
    }
}

DynamicItem.defaultProps = {
    data:{
      created_at:0
    }
}