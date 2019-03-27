import Taro, { Component } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { AtAvatar,AtButton,AtInput} from 'taro-ui'
import './commentItem.scss'
import { timestampFormat, getAuthorization, checkLogin } from '../../pages/utils/utils';
import { DynamicCommentData } from '../../model/model'
import { commentReplyUrl } from '../../pages/utils/httpurl';
import { logError } from '../../pages/utils/error';
if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}

export default class CommentItem extends Component<{data:DynamicCommentData},{data:DynamicCommentData,shouMoreButton:boolean,replyView:boolean,
  replyContent:string,replyButtonText:string,replyButtonLoading:boolean}>{
  static defaultProps: {  };
  constructor(){
    super(...arguments)
	  this.state = {
      data:this.props.data,
      shouMoreButton:this.props.data.reply_count != 0 ? false : true,
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
  onReplyDetails(){
    // 跳转评论详情
    Taro.navigateTo({
      url:'/pages/dynamic/replyDetails/replyDetails?id=' + this.state.data.id
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
            shouMoreButton:false,
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
        {this.state.replyView && 
          <View className='reply-view'>
          <AtInput name='reply' type='text' placeholder={'回复: ' + this.state.data.name}  value={this.state.replyContent} onChange={this.onReplyChange.bind(this)}/>
          <AtButton type='primary' size='small' loading={this.state.replyButtonLoading} onClick={this.onSendReply}>回复</AtButton>
        </View>}

        <View className='button-right'>
          <AtButton onClick={this.onReplyDetails} type='secondary' size='small' disabled={this.state.shouMoreButton}>查看回复{this.state.shouMoreButton ? '' : this.state.data.reply_count}</AtButton>
          <AtButton onClick={this.onShowReplyView} type='secondary' size='small'>{this.state.replyButtonText}</AtButton>
        </View>

			</View>
		)
	}
}
CommentItem.defaultProps = {
  data:{
    created_at:0
  }
}