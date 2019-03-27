import Taro, {Config, Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components';
import './message.scss'
import { messageUrl } from '../../utils/httpurl';
import { getAuthorization } from '../../../pages/utils/utils';
import { logError } from '../../utils/error';
import { MessageData } from '../../../model/model';
import MessageItem from '../../../components/messageItem/messageItem';

export default class Message extends Component<{},{list:Array<MessageData>,end:boolean,current:number}>{
	config:Config = {
		navigationBarTitleText:'消息',
		enablePullDownRefresh:true
	}
  constructor(){
		super(...arguments)
		this.state = {
			list:[],
			end:false,
			current:1
		}
	}
	onPullDownRefresh(){
		this.getMessage()
	}
	onReachBottom(){
		if(!this.state.end){
			this.getMoreMessage()
		}
	}
	componentDidMount(){
		this.getMessage()
	}
	getMessage(){
		Taro.showNavigationBarLoading()
		Taro.request({
			url:messageUrl,
			method:'GET',
			header:getAuthorization(),
			dataType:'json'
		}).then(res => {
			if(res.statusCode == 200 && res.data.code == 200){
				let next = res.data.data.links.next == ''
				this.setState({
					list:res.data.data.list,
					end:next,
					current:next ? this.state.current : res.data.data.meta.current_page + 1
				})
			}
			Taro.stopPullDownRefresh()
			Taro.hideNavigationBarLoading()
		},err => {
			Taro.stopPullDownRefresh()
			Taro.hideNavigationBarLoading()
			logError('api','获取消息',err)
		})
	}

	getMoreMessage(){
		Taro.request({
			url:messageUrl,
			method:'GET',
			header:getAuthorization(),
			data:{
				'page':this.state.current,
			},
			dataType:'json'
		}).then(res => {
			if(res.statusCode == 200 && res.data.code == 200){
				var more = this.state.list.concat(res.data.data.list)
				let next = res.data.data.links.next == ''
				this.setState({
					list:more,
					end:next,
					current:next ? this.state.current : res.data.data.meta.current_page + 1
				})
			}
		},err => {
			logError('api','获取消息',err)
		})
	}
	render(){
		return(
			<ScrollView
			className='message'
			scrollY={true}
			scrollWithAnimation
			enableBackToTop={true}>
				{this.state.list.map((element,index) => {
					return(
						<MessageItem key={index} data={element} />
					)
				})}
			</ScrollView>
		)
	}
}