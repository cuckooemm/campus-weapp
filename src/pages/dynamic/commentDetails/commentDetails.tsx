import Taro, { Config,Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import './commentDetails.scss'
import { dynamicCommentUrl, dynamicPraiseUrl } from '../../utils/httpurl';
import { logError } from '../../utils/error';
import { DynamicCommentData } from '../../../model/model';
import { AtTextarea, AtButton, AtDivider, AtIcon } from 'taro-ui';
import { getAuthorization, checkLogin } from '../../utils/utils';
import CommentItem from '../../../components/commentItem/commentItem';

export default class CommentDetails extends Component<{},{id:string,list:Array<DynamicCommentData>,browse:number,comment_count:number,
	praise_count:number,commentVisible:boolean,inputComment:string,commentButtonLoading:boolean,current:number,end:boolean,buttomText:string}>{
	config:Config= {
		navigationBarTitleText:'评论',
		enablePullDownRefresh:true,
	}
	constructor(){
		super(...arguments)
		let param = this.$router.params
		this.state = {
			id:param.id ? param.id : '0',
			browse:param.browse,
			comment_count:param.comment_count,
			praise_count:param.praise_count,
			list: [],
			commentVisible:false,
			inputComment:'',
			commentButtonLoading:false,
			current: 0,
			end:false,
			buttomText:'暂无评论'
		}
	}
	onPullDownRefresh(){
		this.getCommentList()
	}
	onReachBottom(){
		if(!this.state.end){
			this.getMoreComment()
		}
	}
	componentDidMount() {
		this.getCommentList()
	}
	// 获取评论
	getCommentList(){
	  if(this.state.id == '0'){
	  }else{
	  	Taro.showNavigationBarLoading()
	  	Taro.request({
	  	  url:dynamicCommentUrl,
	  	  method:'GET',
	  	  data:{
	  	  	'id':this.state.id
	  	  },
	  	  dataType:'json'
	  	}).then(res => {
	  		if(res.statusCode == 200 && res.data.code == 200){
	  			let next = res.data.data.links.next == ''
				  let isDataExist = res.data.data.meta.per_page == 0
				  this.setState({
	  		  	list:res.data.data.list,
	  		  	end:next,
	  		  	current:next ? this.state.current : res.data.data.meta.current_page + 1,
				  	buttomText: isDataExist ? '暂无评论' : '我是有底线的'
				  })
	  		  }else{
	  		  	// 显示错误页面
	  		  }
	  		  Taro.stopPullDownRefresh()
	  		  Taro.hideNavigationBarLoading()
	  	},err => {
	  		Taro.stopPullDownRefresh()
	  		Taro.hideNavigationBarLoading()
	  		logError('api','获取评论' + this.state.id + '的评论',err)
	  	})
	  }
	}

	// 获取更多评论
	getMoreComment(){
		Taro.request({
			url:dynamicCommentUrl,
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
			logError('api','获取评论' + this.state.id + '的评论',err)
		})
	}
	onShowCommentView(){
		if(this.state.commentVisible){
			this.setState({
				commentVisible:false
			})
		}else{
			this.setState({
				commentVisible:true
			})
		}
	}
	onInputCommentChange(event){
		this.setState({
			inputComment:event.target.value
		})
	}
	// 发送评论
	onUploadComment(){
		if(checkLogin()){
			this.setState({
				commentButtonLoading:true
			})
			
			Taro.request({
				url:dynamicCommentUrl,
				method:'POST',
				header:getAuthorization(),
				data:{
					'dynamic_id':this.state.id,
					'content':this.state.inputComment
				},
				dataType:'json'
			}).then(res => {
				if(res.statusCode == 200 && res.data.code == 200){
					this.setState({
						inputComment:'',
						commentVisible:false,
						comment_count:Number(this.state.comment_count + 1)
					})
				}
				Taro.showToast({title:res.data.msg,icon:'none'})
				this.setState({
					commentButtonLoading:false
				})
			},err => {
				logError('api','发布评论',err)
				this.setState({
					commentButtonLoading:false
				})
			})
		}else{
			Taro.showToast({
				title:'请先登录',
				icon:'none'
			})
		}
	}
	onSendPraise(){
		if(checkLogin()){
			Taro.request({
				url:dynamicPraiseUrl,
				method:'PUT',
				header:getAuthorization(),
				data:{
					'id':this.state.id
				},
				dataType:'json'
			}).then(res => {
				this.showToast(res.data.msg)
				this.setState({
					praise_count:Number(this.state.praise_count + 1)
				})
			},err => {
				logError('api','praise',err)
			})
		}else{
			this.showToast('请先登录')
		}
	}
	showToast(msg){
		Taro.showToast({
			title:msg,
			icon:'none'
		})
	}
  render() {
		return(
		<ScrollView
        className="comment-details"
        scrollY={true}
        scrollWithAnimation
        enableBackToTop={true}
        >
		{this.state.commentVisible && 				
			<View>
				<AtTextarea className='input-comment'
        value={this.state.inputComment}
        onChange={this.onInputCommentChange.bind(this)}
				maxlength='500'
				placeholder='想要评论些什么呢…' />
				<AtButton  onClick={this.onUploadComment} type='primary' loading={this.state.commentButtonLoading} >评论</AtButton>
			</View>
		}
		{this.state.list.map((element,index) => {
			return(
				<CommentItem key={index} data={element} />
			)
		})}
		{this.state.end && <AtDivider content={this.state.buttomText} fontColor='#ed3f14' lineColor='#ed3f14' />}
		<View className='comment-buttom'>
			<View>浏览 {this.state.browse}</View>
			<View onClick={this.onShowCommentView}>评论 {this.state.comment_count}</View>
			<View onClick={this.onSendPraise}>赞 {this.state.praise_count}</View>
		</View>
		</ScrollView>
		)
	}
}
