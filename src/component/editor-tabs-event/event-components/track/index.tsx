import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { InputEditor } from '../../../common'
import { Form, Select, Button, Input, Row, Col } from 'antd'
import './style.scss'

export interface PropsDefine {
    eventData?: Ndesign.EventActionTrack
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}

@observer
export default class extends React.Component<PropsDefine, any> {
    _value: Ndesign.EventActionTrack = {}
    componentWillMount() {
        this._value = toJS(this.props.eventData) || { others: [] }
    }

    handleChange = (eventData: Ndesign.EventActionTrack) => {
        Object.assign(this._value, eventData)
        this.forceUpdate()

        if (this._value.others && this._value.others.some((item) => { return !item.key })) {
            return;
        }
        this.props.handleChange(this._value)
    }

    render() {
        const customData = this._value;
        let callData = (this._value.others || []).slice()
        return (
            <div className="_namespace">
                <Form.Item className="callData" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} label="参数字段">
                    {customData.others && customData.others.map((data, idx) => {
                        return (
                            // <div className="callData__item">
                            //     <div className="callData__itemKey"><Input value={data.key} /></div>
                            //     <div className="callData__itemValue"><InputEditor value={data.value} /></div>
                            // </div>
                            <Row className="callData__item">
                                <Col span={5}>
                                    key:<Input value={data.key} onChange={(e) => {
                                        callData[idx].key = e.target.value;
                                        this.handleChange({ others: callData })
                                    }} />
                                </Col>
                                <Col span={12} style={{ paddingLeft: 3 }}>
                                    data:<InputEditor value={data.value} inputType='specPD' onChange={(value) => {
                                        callData[idx].value = value;
                                        this.handleChange({ others: callData })
                                    }} />
                                </Col>
                                <Col style={{ paddingLeft: 3 }}>
                                    <br /><Button size='small' icon="delete" onClick={() => {
                                        callData.splice(idx, 1)
                                        this.handleChange({ others: callData })
                                    }}></Button>
                                </Col>
                            </Row>
                        )
                    })}

                    <Button size='small' onClick={() => {
                        this.handleChange({ others: [].concat(callData).concat([{ key: '' }]) })
                    }}>添加</Button>
                </Form.Item>
            </div>
        )
    }
}