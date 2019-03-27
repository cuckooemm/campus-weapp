import Taro, {Config, Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components';
import { AtAvatar,AtInput,Picker,AtTextarea,AtButton,AtModal  } from "taro-ui"
import './userinfo.scss'
import { userinfoUrl } from '../../utils/httpurl';
import { getAuthorization } from '../../utils/utils';
import { logError } from '../../utils/error';
import DocsHeader from '../../../components/docheader/docheader';
import { setGolbal } from '../../../global_data';
if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}

export default class UserInfo extends Component<{},{avatar:string,gender:string,nickname:string,bio:string,birthday:string,
	nicknameUpdate:boolean,newNickname:string,genderString:Array<string>,deleteButton:boolean}>{

	config:Config = {
		navigationBarTitleText:'个人信息'
	}
	constructor(){
		super(...arguments)
		this.state ={
			avatar:Taro.getStorageSync('user_avatar'),
			nickname:Taro.getStorageSync('user_nickname'),
			newNickname:'',
			nicknameUpdate:false,
			gender:Taro.getStorageSync('user_gender'),
			genderString:['女','男','保密'],
			bio:Taro.getStorageSync('user_bio'),
			birthday:Taro.getStorageSync('user_birthday'),
			deleteButton:false
		}
	}
	nicknameInput (value:string) {
		this.setState({
			newNickname:value
		})
  }
	nicknameUpdateInput(){
		this.setState({nicknameUpdate:true})
	}
	nicknameDone(){
		this.closeNicknameInput()
		if(this.state.newNickname == this.state.nickname){
			return
		}
		let data = {'nickname':this.state.newNickname}
		let task = this.updateInfo(data)
		task.then(res => {
			if(res.statusCode == 200 && res.data.code == 200){
				this.setState({
					nickname:this.state.newNickname
				})
				Taro.setStorageSync('user_nickname',this.state.newNickname)
			}else{
				Taro.showToast({
					title:res.data.msg,
					icon:'none'
				})
			}
		},err => {
			logError('api','更新昵称',err)
		})
	}
	closeNicknameInput(){
		this.setState({nicknameUpdate:false})
	}
	onGenderChange(e){
		let newGender = e.detail.value
		if(this.state.gender == newGender){
			return
		}
		let task = this.updateInfo({'gender':newGender})
		task.then(res => {
			if(res.statusCode == 200 && res.data.code == 200){
				this.setState({
					gender: newGender
				})
				Taro.setStorageSync('user_gender',newGender)
			}
			Taro.showToast({
				title:res.data.msg,
				icon:'none'
			})
		},err =>{
			logError('api','修改性别',err)
		})
	}
	onBirthdayChange(e){
		let newBirthday = e.detail.value
		if(newBirthday == this.state.birthday){
			return
		}
		let task = this.updateInfo({'birthday':newBirthday})
		task.then(res => {
			if(res.statusCode == 200 && res.data.code == 200){
				this.setState({
					birthday: newBirthday
				})
				Taro.setStorageSync('user_birthday',newBirthday)
			}
			Taro.showToast({
				title:res.data.msg,
				icon:'none'
			})
		},err =>{
			logError('api','更新生日',err)
		})
	}
	onBioChange(event){
      this.setState({
        bio:event.target.value
      })
	}
	onBioConfirm(){
		let task = this.updateInfo({'bio':this.state.bio})
		task.then(res => {
			if(res.statusCode == 200 && res.data.code == 200){
				Taro.setStorageSync('user_bio',this.state.bio)
			}
			Taro.showToast({
				title:res.data.msg,
				icon:'none'
			})
		},err => {
			logError('api','更新简介',err)
		})
	}
	updateInfo(param){
		return Taro.request({
			url:userinfoUrl,
			method:'PUT',
			header:getAuthorization(),
			data:param,
			dataType:'json'
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
	logout(){
		Taro.clearStorageSync()
		setGolbal('token',undefined)
		this.setState({
			deleteButton:false
		})
		Taro.navigateBack()
	}

	render() {
	  return(
			<View className='userinfo'>
				<View className='userinfo__item'>
					<View>头像</View>
					<AtAvatar size='normal' circle={true} image={this.state.avatar}/>
				</View>
				<View className='userinfo__item'>
					<View>昵称</View>
					{!this.state.nicknameUpdate && <View onClick={this.nicknameUpdateInput}>{this.state.nickname}</View>}
					{this.state.nicknameUpdate && <AtInput
        		name='nickname'
						type='text'
						placeholder={this.state.nickname}
        		value={this.state.newNickname}
						onChange={this.nicknameInput.bind(this)}
						onConfirm={this.nicknameDone}
						onBlur={this.closeNicknameInput}
						confirmType='修改'
      		/>}
				</View>
				<View className='userinfo__item'>
					<View>性别</View>
					<Picker mode='selector' range={this.state.genderString} onChange={this.onGenderChange} value={this.state.gender}>
                <View className='picker'>
                  {this.state.genderString[this.state.gender]}
                </View>
          </Picker>
				</View>
				<View className='userinfo__item'>
					<View>生日</View>
					<Picker mode='date' onChange={this.onBirthdayChange} value={this.state.birthday} start='1990-01-01' end='2010-01-01'>
                <View className='picker'>
                  {this.state.birthday}
                </View>
              </Picker>
				</View>
				<DocsHeader title='简介'/>
				<AtTextarea
          		value={this.state.bio}
          		onChange={this.onBioChange.bind(this)}
				maxlength='120'
				showConfirmBar={true}
				onConfirm={this.onBioConfirm}/>
				<AtModal
			  isOpened={this.state.deleteButton}
			  title='退出登录?'
			  cancelText='手滑'
				confirmText='要走了'
				onCancel={this.onHideConfirm}
			  onConfirm={ this.logout }
			  content={'你要走了吗?'}
			/>
				<AtButton onClick={ this.onShowConfirm } type='primary' size='normal'>退出登录</AtButton>
			</View>
	  )
	}
}