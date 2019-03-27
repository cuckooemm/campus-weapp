import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTextarea, AtButton, AtProgress } from 'taro-ui'
import NineGridLayout from '../../../components/nineGridLayout/nineGridLayout'
import { generateUUID, getAuthorization, checkLogin } from '../../utils/utils';
import { ossSignUrl, dynamicPublishUrl } from '../../utils/httpurl'
import { logError } from '../../utils/error'
import './publish.scss'

export default class DynamicPublish extends Component<{},{content:string,images?:Array<string>,progress:number,currentProgress:number,imagesKey:Array<string>}> {

  constructor () {
    super(...arguments)
      this.state = {
        content: '',
        images:[],
        currentProgress:0,
        progress:0,
        imagesKey:[]
      }
  }
  config: Config = {
    navigationBarTitleText: '发布动态'
  }

 contentChange (event) {
    this.setState({
      content: event.target.value
    })
  }
  choosePhoto(){
    Taro.chooseImage({
        count:9,
        sizeType:['compressed']
    }).then(res => {
        let path = res.tempFilePaths
        this.setState({
          images:path
        })
    })

  }

  publish(){
    // 检查是否有输入
    const { content, images} = this.state
    if(!checkLogin()){
      Taro.showToast({
        title:'您还未登录',
        icon:'none',
      })
      return
    }
    if(content.length){
      Taro.showLoading({title:'正在发布动态',mask:true})
      if(images && images.length > 0){
        Taro.request({
            url:ossSignUrl,
            method:'GET',
            header:getAuthorization(),
            dataType:'json'
        }).then(res => {
            if(res.statusCode == 200 && res.data.code == 200){
              this.uploadImage(res,images,0)
            }else{
              Taro.showToast({title:res.data.msg,icon:'none',duration:2000})
              Taro.hideLoading()
            }
        },err => {
          Taro.hideLoading()
          logError('api','OSS后端签名',err)
        })
      }else{
        let data = {
          'content':content
        }
        this.uploadDynamic(data)
      }
    }else{
      Taro.showToast({
        title:'说点什么吧…',
        icon:'none',
        duration:2000,
      })
    }
  }
uploadImage(respond,imageurl:Array<string>,index){
  let key = 'dynamic/' + generateUUID()
  var data = {
    'key':key,
    'policy':respond.data.data.policy,
    'OSSAccessKeyId':respond.data.data.accessid,
    'success_action_status':'200',
    'signature':respond.data.data.signature,
    }
  let task = Taro.uploadFile({
    url:respond.data.data.host,
    filePath:imageurl[index],
    name:'file',
    formData:data,
  })
  task.progress(res => {
    this.setState({
      currentProgress: index + 1,
      progress: res.progress
    })
  })
  task.then(() => {
    this.state.imagesKey.push(key)
    if(imageurl.length > index + 1){
      this.uploadImage(respond,imageurl,index + 1)
    }else{
      // 发布动态
      let key = this.state.imagesKey.join(',')
      let data = {
        'content':this.state.content,
        'images':key
      }
      this.uploadDynamic(data)
    }
  },err => {
    Taro.hideLoading()
    logError('OSS','上传图片',err)
  })
}

uploadDynamic(param){
  Taro.request({
    url:dynamicPublishUrl,
    method:'POST',
    header:getAuthorization(),
    data:param,
    dataType:'json'
  }).then(res => {
    if(res.statusCode == 200 && res.data.code == 200){
      // 成功
      Taro.navigateBack()
    }
    Taro.showToast({
      title:res.data.msg,
      icon:'none',
      duration:2000,
    })
    Taro.hideLoading()
  },err => {
    Taro.hideLoading()
    logError('api','发布动态',err)
  })
}
// 程序被载入	在微信小程序中这一生命周期方法对应 app 的 onLaunch
componentWillMount () { }
// 程序被载入	在微信小程序中这一生命周期方法对应 app 的 onLaunch，在 componentWillMount 后执行
  componentDidMount () { 

  }
// 页面退出	在微信小程序中这一生命周期方法对应 onUnload
  componentWillUnmount () { }
// 程序展示出来	在微信小程序中这一生命周期方法对应 onShow，在 H5 中同样实现
  componentDidShow () { }
// 程序被隐藏	在微信小程序中这一生命周期方法对应 onHide，在 H5 中同样实现
  componentDidHide () { }

  render () {
    return (
      <View className='dynamic'>
        <AtTextarea
          value={this.state.content}
          onChange={this.contentChange.bind(this)}
          maxlength='500'
          height={250}
          placeholder='说点什么吧...'
        />
        {this.state.currentProgress && <View>正在上传第{this.state.currentProgress}张图片</View>}
        {this.state.progress && <AtProgress percent={this.state.progress} />}
        {this.state.images && <NineGridLayout images={this.state.images} />}
        <View className='buttom'>
          <AtButton type='primary' size='normal' onClick={this.choosePhoto}>照片</AtButton>
          <AtButton type='primary' size='normal' onClick={this.publish}>发布</AtButton>
        </View>
      </View>
    )
  }
}