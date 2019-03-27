import Taro, { Component } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { AtAvatar,AtButton,AtInput} from 'taro-ui'
import './replyItem.scss'
import { CommentReplyData } from '../../model/model';
import { timestampFormat } from '../../pages/utils/utils';
if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}
export default class ReplyItem extends Component<{data:CommentReplyData},{data:CommentReplyData}> {
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
	
	render(){
		return(
			<View className='item'>
				<View className='header'>
          <AtAvatar size='small' circle={true} image={this.state.data.avatar}></AtAvatar>
          <View className='name'>
            <View style='padding:0px;'>{this.state.data.name}</View>
            <Text style='font-size:12px;padding:0px;'>{timestampFormat(this.state.data.created_at)}</Text>
          </View>
					<View className='r-name'>回复: {this.state.data.r_name}</View>
        </View>
				<View className='at-row content'>
					<Text className='at-col at-col-12 at-col--wrap' selectable={true}>{this.state.data.content}</Text>
				</View>
			</View>
		)
	}
}
ReplyItem.defaultProps = {
	data:{
		created_at:0
	}
}