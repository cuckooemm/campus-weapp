import Taro, {Config, Component } from '@tarojs/taro'
import { View, Text,OpenData,Button } from '@tarojs/components'
import { AtAvatar,AtButton,AtModal} from 'taro-ui'
import './userDynamicItem.scss'
import { timestampFormat, getAuthorization } from '../../pages/utils/utils';
import { UserDynamicData } from '../../model/model';
import { userDynamicUrl } from '../../pages/utils/httpurl';
import { logError } from '../../pages/utils/error';
if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}
export default class UserDynamicItem extends Component<{data:UserDynamicData},{data:UserDynamicData,deleteButton:boolean}>{
	static defaultProps: {  };
	constructor(){
		super(...arguments)
		this.state = {
			data:this.props.data,
			deleteButton:false
		}
	}
	
	componentWillReceiveProps(nextProps){
    this.setState({
      data:nextProps.data
    })
	}
	onDeleteDynamic(){
		Taro.request({
			url:userDynamicUrl + '?id=' + this.state.data.id,
			method:'DELETE',
			header:getAuthorization(),
			dataType:'json'
		}).then(res => {
			if(res.statusCode == 200 && res.data.code == 200){
	
			}
			Taro.showToast({
				title:res.data.msg,
				icon:'none'
			})
			this.setState({
				deleteButton:false
			})
		},err => {
			logError('api','删除动态',err)
		})
	}
	onShowConfirm(){
		this.setState({
			deleteButton:true
		})
	}
	onHideConfirm(){
		this.setState({
			deleteButton:false
		})
	}
	render(){
		return(
			<View className='user-dynamic-item'>
			<AtModal
			  isOpened={this.state.deleteButton}
			  title='删除动态?'
			  cancelText='取消'
				confirmText='删除'
				onCancel={this.onHideConfirm}
			  onConfirm={ this.onDeleteDynamic }
			  content={'你要删除内容为\n ' + this.state.data.content + '\n的动态吗？删除后不可恢复'}
			/>
        <View className='header'>
          <AtAvatar size='small' circle={true} openData={{type: 'userAvatarUrl'}}></AtAvatar>
          <View className='name'>
            <OpenData className='nickname' type='userNickName'/>
            <Text>{timestampFormat(this.state.data.created_at)}</Text>
          </View>
        </View>
				<View className='at-row content'>
					<Text className='at-col at-col-12 at-col--wrap' selectable={true}>{this.state.data.content}</Text>
				</View>
				<View className='button-right'>
          <AtButton onClick={this.onShowConfirm} type='secondary' size='small'>删除</AtButton>
        </View>
			</View>
		)
	}
}
UserDynamicItem.defaultProps = {
	data:{
		created_at:0
	}
}