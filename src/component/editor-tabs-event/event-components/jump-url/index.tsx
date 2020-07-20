import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Checkbox, Form } from 'antd'
import { ProsVarData } from '../../../common'
import { ViewportStore } from '../../../../store'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    eventData?: Ndesign.EventActionJumpUrl
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}

@inject('ViewportStore') @observer
export default class JumpUrl extends React.Component<PropsDefine, any> {
    _value: Ndesign.EventActionJumpUrl = {}
    componentWillMount() {
        this._value = this.props.eventData || {}
    }
    
    handleChange(eventData: Ndesign.EventActionJumpUrl) {
        Object.assign(this._value, eventData)
        if (!this._value.url || !this._value.url.colls || !this._value.url.colls.length) {
            return
        }
        this.props.handleChange(this._value)
    }

    render() {
        const customData = this.props.eventData || {}

        return (
            <div className="_namespace">
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="url" style={{ margin: 0 }}>
                    <ProsVarData
                        onChange={(value) => { this.handleChange({ url: value }) }}
                        defaultValue={customData.url} />
                </Form.Item>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="新页面">
                    <Checkbox
                        defaultChecked={customData.newTarget}
                        onChange={(e) => { this.handleChange({ newTarget: e.target.checked }) }} />
                </Form.Item>
            </div>
        )
    }
}