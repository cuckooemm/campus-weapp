import Taro, {Config, Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components';
import { AtDivider } from "taro-ui"
import './userDynamic.scss'
import { userDynamicUrl } from '../../utils/httpurl';
import { getAuthorization } from '../../utils/utils';
import { logError } from '../../utils/error';
import { UserDynamicData } from '../../../model/model';
import UserDynamicItem from '../../../components/userDynamicItem/userDynamicItem';

export default class UserDynamic extends Component<{},{list:Array<UserDynamicData>,end:boolean,current:number,buttomText:string}>{
  config: Config = {
    navigationBarTitleText:'我的动态',
    enablePullDownRefresh:true
  }
  constructor(){
		super(...arguments)
		this.state = {
			list:[],
			end:false,
			current:0,
			buttomText:'你还没有发布动态呢'
		}
	}
	onPullDownRefresh(){
		this.getUserDynamic()
	}
	onReachBottom(){
		if(!this.state.end){
			this.getMoreUserDynamic()
		}
	}
	componentDidMount(){
		this.getUserDynamic()
	}
	getUserDynamic(){
		Taro.showNavigationBarLoading()
		Taro.request({
			url:userDynamicUrl,
			method:'GET',
			header:getAuthorization(),
			dataType:'json'
		}).then(res => {
			if(res.statusCode == 200 && res.data.code == 200){
				let isDataExist = res.data.data.meta.per_page == 0
				let next = res.data.data.links.next == ''
				this.setState({
					list:res.data.data.list,
					end:next,
					current:next ? this.state.current : res.data.data.meta.current_page + 1,
					buttomText: isDataExist ? '暂无评论' : '我是有底线的'
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
	getMoreUserDynamic(){
		Taro.request({
			url:userDynamicUrl,
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
      className='user-dynamic'
      scrollY={true}
      scrollWithAnimation
      enableBackToTop={true}
      >
			{this.state.list.map((element,index) => {
				return(
					<UserDynamicItem key={index} data={element} />
				)
			})}
			{this.state.end && <AtDivider content={this.state.buttomText} fontColor='#ed3f14' lineColor='#ed3f14' />}
			</ScrollView>
		)
	}
}