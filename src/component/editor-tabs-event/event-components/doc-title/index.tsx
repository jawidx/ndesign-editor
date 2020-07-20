import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Form } from 'antd'
import { ProsVarData } from '../../../common'
import { ViewportStore } from '../../../../store'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    eventData?: Ndesign.EventActionDocTitle
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}

@inject('ViewportStore') @observer
export default class DocTitle extends React.Component<PropsDefine, any> {
    _value: Ndesign.EventActionDocTitle = {}
    componentWillMount() {
        this._value = this.props.eventData || {}
    }
    
    handleChange(eventData: Ndesign.EventActionDocTitle) {
        Object.assign(this._value, eventData)
        this.props.handleChange(this._value)
    }

    render() {
        const customData = this.props.eventData || {} as Ndesign.EventActionDocTitle
        return (
            <div className="_namespace">
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="title" style={{ margin: 0 }}>
                    <ProsVarData
                        onChange={(value) => { this.handleChange({ title: value }) }}
                        defaultValue={customData.title} />
                </Form.Item>
            </div>
        )
    }
}