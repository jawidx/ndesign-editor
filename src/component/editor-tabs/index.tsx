import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { ApplicationAction } from '../../action'
import { ViewportStore } from '../../store'
import { Tabs } from 'antd'
import Icon from '../common/icon'
import { Position } from '../../helper'
import './style.scss'

export interface PropsDefine {
    ApplicationAction?: ApplicationAction
    ViewportStore?: ViewportStore
}

@inject('ViewportStore', 'ApplicationAction')
@observer
export default class EditorTabs extends React.Component<PropsDefine, any> {
    static position = Position.editorTab

    render() {
        const unSelected = this.props.ViewportStore.currComKey === null || !this.props.ViewportStore.currComInfo
        return (
            <div className="_namespace">
                <Tabs defaultActiveKey="attribute"
                    className="editor_tabs"
                    animated={false}
                    size={'small'}>
                    {
                        [
                            { name: '属性', key: "attribute", plug: Position.editorTabAttr },
                            { name: '事件', key: "event", plug: Position.editorTabEvent },
                            { name: '数据', key: "data", plug: Position.editorTabData },
                            { name: '导航树', key: "navigatorTree", plug: Position.editorTabTree }
                        ].map((item, idx) =>
                            <Tabs.TabPane tab={item.name} key={item.key} className="tab-panel">
                                {
                                    !unSelected
                                        ? this.props.ApplicationAction.loadingPluginByPosition(item.plug)
                                        : <div className="unexist-current-dom">
                                            <Icon type='ndssvg-handle-click' />选中页面元素后进行操作
                                        </div>
                                }
                            </Tabs.TabPane>
                        )
                    }
                </Tabs>
            </div>
        )
    }
}