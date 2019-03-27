import Taro, {Config, Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar,AtButton,AtInput} from 'taro-ui'
import './messageItem.scss'
import { MessageData } from '../../model/model';
import { timestampFormat, getAuthorization, checkLogin } from '../../pages/utils/utils';
import { logError } from '../../pages/utils/error';
import { commentReplyUrl } from '../../pages/utils/httpurl';
if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}
export default class MessageItem extends Component<{data:MessageData},{data:MessageData,replyView:boolean,replyContent:string,replyButtonText:string,
  replyButtonLoading: boolean}>{
    static defaultProps: {  };
    constructor(){
    super(...arguments)
    this.state = {
        data:this.props.data,
        replyView:false,
        replyContent:'',
        replyButtonText:'回复',
        replyButtonLoading:false
    }
	}
	componentWillReceiveProps(nextProps){
    this.setState({
      data:nextProps.data
    })
  }
  onShowReplyView(){
    if(this.state.replyView){
      this.setState({
        replyView:false,
        replyButtonText:'回复'
      })
    }else{
      this.setState({
        replyView:true,
        replyButtonText:'关闭'
      })
    }
  }
  onReplyChange(value:string){
    this.setState({
      replyContent:value
    })
  }
  onSendReply(){
    if(checkLogin()){
      if(this.state.replyContent.length < 1){
        return
      }
      this.setState({
        replyButtonLoading:true
      })
      Taro.request({
        url:commentReplyUrl,
        method:'POST',
        header:getAuthorization(),
        data:{
          'comment_id':this.state.data.id,
          'content':this.state.replyContent
        },
        dataType:'json'
      }).then(res => {
        if(res.statusCode == 200 && res.data.code == 200){
          // 回复成功 
          this.setState({
            replyView:false,
            replyButtonText:'回复',
            replyContent:'',
            replyButtonLoading:false
          })
        }
        Taro.showToast({
          title:res.data.msg,
          icon:'none'
        })
        this.setState({
          replyButtonLoading:false
        })
      },err => {
        this.setState({
          replyButtonLoading:false
        })
        logError('api','向评论' + this.state.data.id + '发送回复',err)
      })
    }else{
      Taro.showToast({
        title:'请先登录',
        icon:'none'
      })
    }
  }
	render(){
		return(
			<View className='message-item'>
				<View className='header'>
          <AtAvatar size='small' circle={true} image={this.state.data.avatar}></AtAvatar>
          <View className='name'>
            <View style='padding:0px;'>{this.state.data.name}</View>
            <Text style='font-size:12px;padding:0px;'>{timestampFormat(this.state.data.created_at)}</Text>
          </View>
					<View className='message-type'>{this.state.data.type == 0 ? '评论了你的动态 :' : '回复了你 :'}</View>
        </View>
				<View className='at-row message'>
          <Text className='at-col at-col-12 at-col--wrap' selectable={true}>{this.state.data.message}</Text>
        </View>
        <View className='at-row content'>
          <View className='at-col at-col-10 at-col__offset-2 at-col--wrap'>
            {this.state.data.content}
          </View>
        </View>
        {this.state.replyView && 
          <View className='reply-view'>
          <AtInput name='reply' type='text' placeholder={'回复: ' + this.state.data.name}  value={this.state.replyContent} onChange={this.onReplyChange.bind(this)}/>
          <AtButton type='primary' size='small' loading={this.state.replyButtonLoading} onClick={this.onSendReply}>回复</AtButton>
        </View>}
        <View className='button-right'>
          <AtButton onClick={this.onShowReplyView} type='secondary' size='small' circle={true}>{this.state.replyButtonText}</AtButton>
        </View>
			</View>
		)
	}
}
MessageItem.defaultProps = {
  data:{
    created_at:0
  }
}