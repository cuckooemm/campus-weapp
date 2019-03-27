import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '校园墙'
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
      <View className='index'>
        <Text>这页什么也没有</Text>
      </View>
    )
  }
}

