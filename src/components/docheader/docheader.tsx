import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './docheader.scss'

export default class DocsHeader extends Component<{title:string},{}> {
  static defaultProps: { };
  render () {
    const { title } = this.props

    return (
      <View className='doc-header'>
        <View className='doc-header__title'>{title}</View>
      </View>
    )
  }
}

DocsHeader.defaultProps = {
  title: '标题'
}
