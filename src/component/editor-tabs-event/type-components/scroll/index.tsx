import * as React from 'react'
import { observer, inject } from 'mobx-react'
import * as _ from 'lodash'
import { Form, Select, InputNumber, Switch } from 'antd'
const Option = Select.Option;
import { EventAction } from '../../../../action'

export interface PropsDefine {
    EventAction?: EventAction

    value?: Ndesign.EventTriggerEvent
    onChange?: (eventData: Ndesign.EventTriggerEvent) => void
}

@inject('EventAction') @observer
export default class extends React.Component<PropsDefine, any> {
    private _value: Ndesign.EventTriggerEventScroll = {}
    componentWillMount() {
        this._value = (_.assign({ position: "container", throttle: 90 }, this.props.value)) as Ndesign.EventTriggerEventScroll
        this.handleChange()
    }
    handleChange = (value: Ndesign.EventTriggerEventScroll = {}) => {
        _.assign(this._value, value)
        this.props.onChange && this.props.onChange(this._value)
    }
    render() {
        const customData = this._value
        const datas = this.props.EventAction.getEventListName().map(name => {
            return {
                text: name,
                value: name
            }
        })
        return (
            <Form>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 13 }} label="位置">
                    <Select placeholder="滚动位置" defaultValue={customData.position} onSelect={(value: string) => {
                        this.handleChange({ position: value })
                    }}>
                        <Option value='container' key='container'>container</Option>
                        <Option value='window' key='window'>window</Option>
                    </Select>
                </Form.Item>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 13 }} label="延迟">
                    <InputNumber min={0} defaultValue={customData.throttle} step={15}
                        onChange={(value: number) => {
                            this.handleChange({ throttle: value })
                        }}
                        formatter={(value) => {
                            return value + 'ms'
                        }}
                        parser={(value) => { let _v = parseInt(value); return isNaN(_v) ? 0 : _v }}
                    />
                </Form.Item>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 13 }} label="触底执行">
                    <Switch defaultChecked={customData.distTrigger !== undefined}
                        onChange={(value) => {
                            this._value.distTrigger = value ? 0 : undefined;
                            this.handleChange({})
                            this.forceUpdate()
                        }} />
                    {
                        this._value.distTrigger !== undefined && <InputNumber min={0} defaultValue={customData.distTrigger || 0} step={15}
                            onChange={(value: number) => {
                                this.handleChange({ distTrigger: value })
                            }}
                            style={{ marginLeft: 10 }}
                            formatter={(value) => {
                                return value + 'px'
                            }}
                            parser={(value) => { let _v = parseInt(value); return isNaN(_v) ? 0 : _v }}
                        />
                    }
                </Form.Item>
            </Form>
        )
    }
}