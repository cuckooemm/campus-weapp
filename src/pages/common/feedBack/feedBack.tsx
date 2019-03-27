import Taro, { Config,Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtTextarea, AtButton } from 'taro-ui'
import './feedBack.scss'
import { feedbackUrl } from '../../utils/httpurl';
import { logError } from '../../utils/error';

export default class FeedBack extends Component<{},{content:string}>{
  constructor(){
    super(...arguments)
    this.state = {
      content:''
    }
	}
	contentChange (event) {
    this.setState({
      content: event.target.value
    })
	}
	onSubmit(){
		const {content} = this.state
		if(content.length > 0){
			Taro.request({
				url:feedbackUrl,
				method:'POST',
				data:{
					'content':content
				},
				dataType:'json'
			}).then(res => {
				if(res.statusCode == 200 && res.data.code == 200){
					Taro.navigateBack()
				}
				Taro.showToast({
					title:res.data.msg,
					icon:'none'
				})
			},err => {
				logError('api',"反馈提交",err)
			})
		}
	}
	render(){
		return(
			<View className='feedback'>
				<AtTextarea
          value={this.state.content}
          onChange={this.contentChange.bind(this)}
          maxlength='500'
          height={400}
          placeholder='软件BUG 建议反馈 都可以从这里告诉我哦...'
        />
				<View className='submit'>
					<AtButton type='primary' full={true} size='normal' onClick={this.onSubmit} >提交</AtButton>
				</View>
			</View>
		)
	}
}