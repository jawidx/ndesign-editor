import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { ViewportAction, ComponentsListAction } from '../../../action'
import { ApplicationStore, ComponentsListStore } from '../../../store'
import { Button, Tooltip, Collapse, message } from 'antd'
const Panel = Collapse.Panel
import NdsIcon from '../../common/icon'
import { Position } from '../../../helper'
import './styles.scss'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ViewportAction?: ViewportAction
    ComponentsListStore?: ComponentsListStore
    ComponentsListAction?: ComponentsListAction
}

@inject('ApplicationStore', 'ViewportAction', 'ComponentsListStore', 'ComponentsListAction')
@observer
export default class extends React.Component<PropsDefine, any> {
    static position = Position.leftBarComponentsList
    static Action = ComponentsListAction
    static Store = ComponentsListStore
    baseComEle: any
    comboComEle: any

    componentDidMount() {
        [this.baseComEle, this.comboComEle].forEach((comEle) => {
            comEle && this.props.ViewportAction.registerOuterDrag(ReactDOM.findDOMNode(comEle) as HTMLElement, '.componentListDragHandle')
        })
    }

    // registerDrag = (comEle) => {
    //     comEle && this.props.ViewportAction.registerOuterDrag(ReactDOM.findDOMNode(comEle) as HTMLElement)
    // }

    render() {
        const BaseDraggableItems = this.props.ApplicationStore.editorProps.baseComponents.map((ComponentClass, index) => {
            return (
                <div key={index}
                    data-unique-key={ComponentClass.defaultProps.key}
                    className="componentlistDraggableItem componentListDragHandle">
                    <div className="componentlistDraggableItem__itemIconBox">
                        <NdsIcon type={ComponentClass.defaultProps.icon} className="componentlistDraggableItem__itemIcon" />
                    </div>
                    <div className="componentlistDraggableItem__info">{ComponentClass.defaultProps.name}</div>
                </div>
            )
        })

        const ComboDraggableItems = this.props.ComponentsListStore.comboList.map((combo, index) => {
            return (
                <div key={index}
                    data-source={combo.source}
                    className="component-draggable-item componentlistDraggableItem comboComListDraggableItem">
                    <div className="componentListDragHandle">
                        <div className="componentlistDraggableItem__itemIconBox">
                            <NdsIcon type='api' className="componentlistDraggableItem__itemIcon" />
                        </div>
                        <div className="componentlistDraggableItem__info">
                            <div>{combo.name}</div>
                            <div className="componentlistDraggableItem__infoPub">未发布的组件</div>
                        </div>
                    </div>
                    <Button.Group size='small'>
                        <Tooltip title='项目中移除此模板'>
                            <Button icon='delete'
                                onClick={() => { this.props.ComponentsListAction.removeCombo(index) }} />
                        </Tooltip>
                        <Tooltip title='发布'>
                            <Button icon='rocket' onClick={() => { message.info('敬情期此功能~') }} />
                        </Tooltip>
                    </Button.Group>
                </div>
            )
        })

        return (
            <div className="_namespace">
                <div className="title">
                    添加组件
                </div>
                <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                    <Panel header="基础组件" key="1">
                        <div className='componentsListBox' ref={(item) => { this.baseComEle = item }}>
                            {BaseDraggableItems}
                        </div>
                    </Panel>
                    <Panel header="模板" key="2">
                        <div className='componentsListBox comboComListBox' ref={(item) => { this.comboComEle = item }}>
                            {ComboDraggableItems}
                        </div>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}