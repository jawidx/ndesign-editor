import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import EditorTabsDataVisible from './visible-components'
import CollectionComponent from './collection-components'
import PropsInComponent from './props-in-components'
import DataSourceConfComponent from './data-source-conf'
import { Collapse } from 'antd'
const Panel = Collapse.Panel
import { Position } from '../../helper'
import Action from './action'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'EditorTabDataAction', 'ApplicationStore')
@observer
export default class EditorTabsData extends React.Component<typings.PropsDefine, any> {
    static position = Position.editorTabData
    static Action = Action

    handleCollectSelect = (value: string) => {
        this.props.EditorTabDataAction.updateCollection(this.props.ViewportStore.currComKey, value)
    }

    render() {
        if (this.props.ViewportStore.currComKey === null || !this.props.ViewportStore.currComInfo) {
            return null
        }
        return (
            <div className="_namespace">
                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel header="显示条件（display）" key="tab-data-p1">
                        <EditorTabsDataVisible />
                    </Panel>
                    {
                        this.props.ViewportStore.currComInfo.props.ndsCollectionAble &&
                        <Panel header="组件循环能力（collection）" key="tab-data-p2">
                            <CollectionComponent />
                        </Panel>
                    }
                    <Panel header="组件透传入数据（ in props ）" key="tab-data-p3">
                        <PropsInComponent />
                    </Panel>
                    <Panel header="添加组件数据源" key="tab-data-p4">
                        <DataSourceConfComponent />
                    </Panel>
                </Collapse>
            </div>
        )
    }
}
