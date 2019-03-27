import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './NineGridView.scss'
import { getGolbal } from '../../global_data';
import { IMG } from '../../model/model';
export default class NineGridView extends Component<{images:IMG},{images:IMG,width:number,count:number}>{
    static defaultProps: {  };
    constructor(){
      super(...arguments)
      this.state = {
          images:this.props.images,
          width:0,
          count:this.props.images.url.length
      }
      this.measureWidth()
    }
    componentWillReceiveProps(nextProps){
        this.setState({
          images:nextProps.images,
          count:nextProps.images.url.length
        },() => {
            this.measureWidth()
        })
      }
    measureWidth(){
        const { count } = this.state
        let windowsW = getGolbal('windowsW')
        if(count > 4){
            this.setState({
              width: (windowsW - 40) / 3 
            })
        }else if(count > 1){
            this.setState({
                width: (windowsW - 32) / 2
              })
        }else{
            this.setState({
                width: windowsW - 24
              })
        }

    }
     // 预览大图
	previewImage(index){
		const { images } = this.state
		if(images === undefined){
			return
		}
		Taro.previewImage({
			urls:images.url_original,
			current:images.url_original[index]
		}).then().catch(err => {
			console.log(err)
		})
	}
    render(){
        const {images} = this.state
        const {width} = this.state
      return(
        <View className='nine-grid-view'>
          {images && images.url.map((element,index) => {
		    return(
			  <Image key={index} mode='aspectFill' className='nine-image' onClick={this.previewImage.bind(this,index)} style={'width:' + width + 'px;height:' + width + 'px'}  src={element} />
			 )
		  })}
        </View>  
      )
    }
}

NineGridView.defaultProps = {
    images:{
        url:[],
        url_original:[]
    }
}