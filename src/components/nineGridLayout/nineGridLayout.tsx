import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components';
import './nineGridLayout.scss'
import { getGolbal } from '../../global_data';

if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}

export default class NineGridLayout extends Component<{images?:Array<string>},{images?:Array<string>,width:number}>{
	static defaultProps: {  };
  constructor () {
		super(...arguments)
		this.state = {
			images:undefined,
			width:0
		}
		this.measureWidth()
	}
	measureWidth(){
		let windowsW = getGolbal('windowsW')
		this.setState({
			images:this.props.images,
			width: (windowsW - 26) / 3 
		})
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			images:nextProps.images
		})
	}
 // 预览图片
	previewImage(index){
		const { images } = this.state
		if(images === undefined){
			return
		}
		Taro.previewImage({
			urls:images,
			current:images[index]
		}).then().catch(err => {
			console.log(err)
		})
	}
    render(){
			const { images } = this.props
			const { width } = this.state
      return(
		<View className='nine-grid-layout'>
		  {images && images.map((element,index) => {
			 return(
			  <Image key={index} mode='aspectFill' className='nine-image' onClick={this.previewImage.bind(this,index)} style={'width:' + width + 'px;height:' + width + 'px'}  src={element} />
			 )
		  })}
		</View>
		)
    }
}

NineGridLayout.defaultProps = {
	images:null
}