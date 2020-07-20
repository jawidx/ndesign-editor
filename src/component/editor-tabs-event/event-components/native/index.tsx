import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { InputEditor } from '../../../common'
import { Form, Select, Button, Input, Row, Col } from 'antd'
import * as typings from './type'
import './style.scss'
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
}

@inject('ApplicationStore') @observer
export default class Native extends React.Component<typings.PropsDefine, typings.StateDefine> {
    public state: typings.StateDefine = new typings.State()
    _value: Ndesign.EventActionNative = {}
    componentWillMount() {
        this._value = toJS(this.props.eventData) || { data: [] }
    }

    handleChange = (eventData: Ndesign.EventActionNative) => {
        Object.assign(this._value, eventData)
        this.forceUpdate()

        if (!this._value.type || !this._value.pid) {
            return;
        }
        if (this._value.data && this._value.data.some((item) => { return !item.key })) {
            return;
        }
        this.props.handleChange(this._value)
    }

    render() {
        const customData = this._value;
        const nativeConfig = this.props.ApplicationStore.editorProps.nativeConfig;
        let callData = (this._value.data || []).slice()
        return (
            <div className="_namespace">
                <Form.Item {...formItemLayout} label="调用类型">
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        dropdownMatchSelectWidth={false}
                        placeholder="调用类型"
                        defaultValue={customData && customData.type}
                        optionFilterProp="children"
                        onChange={(value: string) => this.handleChange({ type: value })}
                    >
                        {
                            nativeConfig.map((item) => {
                                return <Select.Option value={item.type} key={'k-na-la-' + item.type}>
                                    {`${item.name}(${item.type})`}
                                </Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item {...formItemLayout} label="调用能力">
                    <Input value={customData && customData.pid} onChange={(e) => {
                        this.handleChange({ pid: e.target.value })
                    }} />
                </Form.Item>
                <Form.Item className="callData" {...formItemLayout} label="传入数据">
                    {customData.data && customData.data.map((data, idx) => {
                        return (
                            <Row className="callData__item" key={'k-na-data-r-' + idx}>
                                <Col span={5}>
                                    key:<Input value={data.key} onChange={(e) => {
                                        callData[idx].key = e.target.value;
                                        this.handleChange({ data: callData })
                                    }} />
                                </Col>
                                <Col span={12} offset={0.5} style={{ paddingLeft: 3 }}>
                                    data:<InputEditor value={data.value} type={data.editor} inputType='specPD' onChange={(value) => {
                                        callData[idx].value = value;
                                        this.handleChange({ data: callData })
                                    }} />
                                </Col>
                                <Col span={5} style={{ paddingLeft: 3 }}>
                                    格式<Select value={data.editor || 'input'} onSelect={(value: any) => {
                                        callData[idx].editor = value;
                                        this.handleChange({ data: callData })
                                    }}>
                                        <Select.Option value='input'>输入框</Select.Option>
                                        <Select.Option value='json'>json</Select.Option>
                                    </Select>
                                </Col>
                                <Col span={2} style={{ marginLeft: 3 }}>
                                    <br /><Button size='default' icon="delete" onClick={() => {
                                        callData.splice(idx, 1)
                                        this.handleChange({ data: callData })
                                    }}></Button>
                                </Col>
                            </Row>
                        )
                    })}
                    <Button size='small' onClick={() => {
                        this.handleChange({
                            data: [].concat(callData).concat([{ key: '' }])
                        })
                    }}>添加</Button>
                </Form.Item>
            </div>
        )
    }
}