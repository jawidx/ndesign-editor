import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { AutoComplete, Form } from 'antd'
import { ViewportStore } from '../../../../store'
import { EventAction } from '../../../../action'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EventAction?: EventAction

    value?: Ndesign.EventTriggerEvent
    onChange?: (eventData: Ndesign.EventTriggerEvent) => void
}

@inject('ViewportStore', 'EventAction') @observer
export default class Event extends React.Component<PropsDefine, any> {
    handleChange = (value: string) => {
        this.props.onChange && this.props.onChange({ listen: value })
    }
    render() {
        const customData = this.props.value || {}

        const datas = this.props.EventAction.getEventListName().map(name => {
            return {
                text: name,
                value: name
            }
        })

        return (
            <Form>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 13 }} label="事件名称">
                    <AutoComplete dataSource={datas}
                        placeholder="监听的事件名称"
                        onSelect={this.handleChange} />
                </Form.Item>
            </Form>
        )
    }
}