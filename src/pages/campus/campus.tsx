import Taro, { Config,Component } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { AtDivider  } from 'taro-ui'
import './campus.scss'
import { dynamicListUrl } from '../utils/httpurl';
import { logError } from '../utils/error';
import { DynamicItemData } from '../../model/model';
import DynamicItem from '../../components/dynamicItem/dynamicItem';

export default class Campus extends Component<{},{current: number,list:Array<DynamicItemData>,end:boolean}>{
  config: Config = {
    enablePullDownRefresh:true,
    navigationBarTitleText:'动态'
  }
  constructor () {
      super(...arguments)
      this.state = {
        current: 0,
        list: [],
        end:false
      }
    }
      
// 程序被载入	在微信小程序中这一生命周期方法对应 app 的 onLaunch
  componentWillMount () { }
  // 程序被载入	在微信小程序中这一生命周期方法对应 app 的 onLaunch，在 componentWillMount 后执行
    componentDidMount () {
      this.getDynamicList()
    }
  // 页面退出	在微信小程序中这一生命周期方法对应 onUnload
    componentWillUnmount () { }
  // 程序展示出来	在微信小程序中这一生命周期方法对应 onShow，在 H5 中同样实现
    componentDidShow () { 
    
    }
  // 程序被隐藏	在微信小程序中这一生命周期方法对应 onHide，在 H5 中同样实现

    componentDidHide () { }
    onPullDownRefresh(){
      this.getDynamicList()
    }
    onReachBottom(){
      if(!this.state.end){
        this.getMoreDynamicList()
      }
    }
     // 获取动态
    getDynamicList(){
      Taro.showNavigationBarLoading()
      Taro.request({
          url:dynamicListUrl,
          method:'GET',
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
          Taro.showToast({
            title:res.data.msg,
            icon:'none',
            duration:1500
          })
        }
        Taro.hideNavigationBarLoading()
        Taro.stopPullDownRefresh()
      },err => {
        Taro.hideNavigationBarLoading()
        Taro.stopPullDownRefresh()
        logError('api','获取动态',err)
      })
    }
    // 获取更多动态
    getMoreDynamicList(){
      Taro.request({
        url:dynamicListUrl,
        method:'GET',
        data:{
          'page':this.state.current
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
        Taro.showToast({
          title:res.data.msg,
          icon:'none',
          duration:1500
        })
      }
    },err => {
      logError('api','获取动态',err)
    })
    }

    handleClick (value) {
        this.setState({
          current: value
        })
      }

      render () {
      return (
        <ScrollView
        className="scrollview"
        scrollY={true}
        scrollWithAnimation
        enableBackToTop={true}
        >
        {this.state.list.map((element,index) => {
          return (
            <DynamicItem key={index} data={element} />
          )
        })}
        {this.state.end && <AtDivider content='我是有底线的' fontColor='#ed3f14' lineColor='#ed3f14' />}
        </ScrollView>
      )
    }

}