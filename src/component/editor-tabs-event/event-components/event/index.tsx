import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Input, Form } from 'antd'
import { ViewportStore } from '../../../../store'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    eventData?: Ndesign.EventActionEvent
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}

@inject('ViewportStore') @observer
export default class Event extends React.Component<PropsDefine, any> {
    handleChange(value: string) {
        this.props.handleChange({ emit: value })
    }

    render() {
        const customData = this.props.eventData || {}

        return (
            <Form.Item label="事件名称" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
                <Input value={customData.emit || ''}
                    onChange={(e) => { this.handleChange(e.target.value) }} />
            </Form.Item>
        )
    }
}