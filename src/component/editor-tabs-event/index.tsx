import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Table } from 'antd'
import CurdEventComponent from './curd-event-components'
import * as _ from 'lodash'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import { EventAction } from '../../action'
import { EventStore } from '../../store'
import { Position } from '../../helper'
import * as typings from './type'
import './style.scss'

@ModalHelp
@inject('ViewportStore', 'EventStore', 'EventAction')
@observer
export default class EditorTabsEvent extends React.Component<ModalHelpProps & typings.PropsDefine, typings.StateDefine> {
    public state: typings.StateDefine = new typings.State()

    static position = Position.editorTabEvent
    static Action = EventAction
    static Store = EventStore

    componentWillMount() {
        this.props.observeModalClose(() => {
            this.setState({
                dataIndex: -1
            })
        })
    }

    handleAddEvent() {
        this.props.openModal()
    }

    handleRemoveEvent(index: number) {
        this.props.EventAction.removeEvent(this.props.ViewportStore.currComKey,
            index)
    }

    getListRender = () => {
        const currentComInfo = this.props.ViewportStore.currComInfo;
        const eventDatas = currentComInfo.props.eventData.map((eventData, index) => {
            let comEvent = currentComInfo.props.event;
            if (!eventData.handlers) {
                return {
                    handlers: (eventData as any).type || 'erro',
                    actionName: (eventData as any).event || 'erro'
                }
            }
            let handlers = eventData.handlers.customIdx > -1 ?
                (comEvent && comEvent.triggers && comEvent.triggers[eventData.handlers.customIdx].name) :
                this.props.EventStore.eventTriggerKeys.find((item) => { return item.key === eventData.handlers.name }).value;

            let actionName = eventData.eventActions.map((action) => {
                return action.customIdx > -1 ?
                    (comEvent && comEvent.effects ? comEvent.effects[action.customIdx].name : '') :
                    this.props.EventStore.eventActionKeys.find((item) => { return item.key === action.name }).value
            }).join('|')
            // let actionName = eventData.eventActions > -1 ?

            return {
                key: index,
                handlers,
                actionName
            }
        })

        if (!eventDatas.length) return null

        return <Table bordered
            columns={[
                { title: '触发', dataIndex: 'handlers' },
                { title: '动作', dataIndex: 'actionName' },
                {
                    title: '', key: 'action', dataIndex: 'typeName', width: 90,
                    render: (text, record: any) => {
                        return <div className="tablelist__operateBtn">
                            <Button icon="edit" size="small"
                                onClick={() => {
                                    this.setState({ dataIndex: record.key }, () => {
                                        this.props.openModal()
                                    })
                                }} />
                            <Button icon="delete" size="small"
                                onClick={() => {
                                    this.handleRemoveEvent(record.key)
                                }} />
                        </div>
                    }
                }
            ]}
            dataSource={eventDatas} />
    }

    render() {
        let { currComKey, currComInfo } = this.props.ViewportStore
        if (currComKey === null || !currComInfo) {
            return null
        }

        return (
            <div className="_namespace" key={currComKey}>
                {this.getListRender()}
                <CurdEventComponent
                    visible={this.props.getModalVisible()}
                    onHandleCancel={this.props.closeModal}
                    onHandleOk={(value) => { this.props.closeModal() }}
                    dataIndex={this.state.dataIndex} />

                <Button className="new-event-button"
                    onClick={this.handleAddEvent.bind(this)}>新建事件</Button>
            </div>
        )
    }
}