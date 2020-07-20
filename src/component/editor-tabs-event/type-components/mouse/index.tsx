import * as React from 'react'
import { observer, inject } from 'mobx-react'
import * as _ from 'lodash'
import { Form, Select } from 'antd'
const Option = Select.Option;
import { ViewportStore } from '../../../../store'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore

    value?: Ndesign.EventTriggerEvent
    onChange?: (eventData: Ndesign.EventTriggerEvent) => void
}

@inject('ViewportStore') @observer
export default class extends React.Component<PropsDefine, any> {
    private _value: Ndesign.EventTriggerEventMouse = {}
    componentWillMount() {
        this._value = (_.assign({ eventType: "onClick" }, this.props.value)) as Ndesign.EventTriggerEventMouse
        this.handleChange()
    }
    handleChange = (value: Ndesign.EventTriggerEventMouse = {}) => {
        _.assign(this._value, value)
        this.props.onChange && this.props.onChange(this._value)
    }
    render() {
        const customData = this._value
        return (
            // <Form className='_namespace'>
            <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 13 }} label="事件类型">
                <Select placeholder="事件类型" defaultValue={customData.eventType}
                    onSelect={(value: string) => {
                        this.handleChange({ eventType: value })
                    }} dropdownClassName="_namespace">
                    <Option value='onClick' key='onClick'>
                        点击 <span className='eventType'>click</span>
                    </Option>
                    <Option value='onDoubleClick' key='onDoubleClick'>
                        双击 <span className='eventType'>dblClick</span>
                    </Option>
                    <Option value='onMouseEnter' key='onMouseEnter'>
                        移入 <span className='eventType'>mouseEnter</span>
                    </Option>
                    <Option value='onMouseLeave' key='onMouseLeave'>
                        移出 <span className='eventType'>mouseLeave</span>
                    </Option>
                    <Option value='onMouseDown' key='onMouseDown'>
                        按下 <span className='eventType'>mouseDown</span>
                    </Option>
                    <Option value='onMouseUp' key='onMouseUp'>
                        释放 <span className='eventType'>mouseUp</span>
                    </Option>
                </Select>
            </Form.Item>
            // </Form>
        )
    }
}