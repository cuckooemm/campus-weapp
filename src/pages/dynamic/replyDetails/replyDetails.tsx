import Taro, { Config,Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtDivider } from 'taro-ui';
import './replyDetails.scss'
import { CommentReplyData } from '../../../model/model'
import { commentReplyUrl } from '../../utils/httpurl'
import { logError } from '../../utils/error'
import ReplyItem from '../../../components/replyItem/replyItem'

export default class ReplyDetails extends Component<{},{id:string,list:Array<CommentReplyData>,current:number,end:boolean}>{
	config:Config= {
		navigationBarTitleText:'回复',
		enablePullDownRefresh:true,
	}
	
	constructor(){
		super(...arguments)
		let param = this.$router.params
		this.state ={
			id:param.id ? param.id : '0',
			list: [],
			current: 0,
			end:false
		}
  }
	onPullDownRefresh(){
		this.getReplyList()
	}
	onReachBottom(){
		if(!this.state.end){
			this.getMoreReplyList()
		}
	}
	componentDidMount() {
		this.getReplyList()
	}
	getReplyList(){
		if(this.state.id == '0'){
			// 显示加载错误页面
			console.log('执行了这个');
		}else{
			Taro.showNavigationBarLoading()
			Taro.request({
				url:commentReplyUrl,
				method:'GET',
				data:{
					'id':this.state.id
				},
				dataType:'json'
			}).then(res => {
				if(res.statusCode == 200 && res.data.code == 200){
					let next = res.data.data.links.next == ''
					this.setState({
						list:res.data.data.list,
						end:next,
						current:next ? this.state.current : res.data.data.meta.current_page + 1
					})
				}else{
					// 显示错误页面
				}
				Taro.stopPullDownRefresh()
				Taro.hideNavigationBarLoading()
			},err => {
				Taro.stopPullDownRefresh()
				Taro.hideNavigationBarLoading()
				logError('api','获取回复' + this.state.id + '的回复',err)
			})
		}
	}
	getMoreReplyList(){
		Taro.request({
			url:commentReplyUrl,
			method:'GET',
			data:{
				'page':this.state.current,
				'id':this.state.id
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
			}else{
				// 显示错误页面
			}
		},err => {
			logError('api','获取回复' + this.state.id + '的回复',err)
		})
	}
	render(){
		return(
		<ScrollView
        className='reply-details'
        scrollY={true}
        scrollWithAnimation
        enableBackToTop={true}
        >
			{this.state.list.map((element,index) => {
				return(
					<ReplyItem key={index} data={element} />
				)
			})}
			{this.state.end && <AtDivider content='我是有底线的' fontColor='#ed3f14' lineColor='#ed3f14' />}
		</ScrollView>
		)
	}
}