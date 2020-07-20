import * as React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as _ from 'lodash'
import { Form, InputNumber, Checkbox } from 'antd'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ApplicationStore') @observer
export default class extends React.Component<typings.PropsDefine, any> {
    _value: Ndesign.EventActionTimer = {}
    componentWillMount() {
        this._value = toJS(this.props.eventData) || {}
    }
    handleChange = (eventData: Ndesign.EventActionTimer) => {
        Object.assign(this._value, eventData)
        this.forceUpdate()

        if (_.isNaN(Number(this._value.timer))) {
            return;
        }
        this.props.handleChange(this._value)
    }

    render() {
        const customData = this._value || {};
        return (
            <div className="_namespace">
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="毫秒" style={{ margin: 0 }}>
                    <InputNumber value={customData.timer} onChange={(value) => {
                        this.handleChange({ timer: +value })
                    }} />
                </Form.Item>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 10 }} label="循环">
                    <Checkbox
                        defaultChecked={customData.loop}
                        onChange={(e) => { this.handleChange({ loop: e.target.checked }) }} />
                </Form.Item>
            </div>
        )
    }
}