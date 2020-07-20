import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { AssetAction, ViewportAction } from '../../../action'
import { AssetStore } from '../../../store'
import { Collapse } from 'antd'
const Panel = Collapse.Panel
import ImageListEditor from './image-list'
import { Position } from '../../../helper'
import './styles.scss'

export interface PropsDefine {
    ViewportAction?: ViewportAction
    AssetStore?: AssetStore
    AssetAction?: AssetAction
}

@inject('AssetStore', 'AssetAction')
@observer
export default class extends React.Component<PropsDefine, any> {
    static position = Position.leftBarAssetsEditor
    static Action = AssetAction
    static Store = AssetStore

    render() {
        return (
            <div className="_namespace">
                <div className="title">资源管理</div>
                <div className="container">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header="图片" key="1">
                            <ImageListEditor />
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}