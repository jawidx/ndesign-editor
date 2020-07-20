import * as React from 'react'
import * as _ from 'lodash'
import { Button, Modal, Input, message, Col, Row, Popover, Form } from 'antd'
import './style.scss'

interface DataMonacoEditorType {
    show?: boolean
    onCancel?: () => void
    onOk?: (dataSourceJson?: Object) => void
    jsonData?: Object
}

// TODO common/json-editor
export default class JsonEditor extends React.Component<DataMonacoEditorType, { inputValue: string }> {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: (typeof this.props.jsonData !== 'undefined' && JSON.stringify(this.props.jsonData, null, 4)) || JSON.stringify({}, null, 4)
        }
    }
    formatJson = (callback?: (value: string) => void) => {
        try {
            this.setState({
                inputValue: JSON.stringify(JSON.parse(this.state.inputValue), null, 4)
            }, () => { callback && typeof callback === 'function' && callback(this.state.inputValue) })
        } catch (e) {
            message.error(e.message)
        }
    }
    handleSubmit = () => {
        if (!this.state.inputValue) {
            message.error('请填写json')
        }

        this.formatJson((inputValue) => {
            this.props.onOk(JSON.parse(inputValue))
        })
    }
    onChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    }
    render() {
        return (
            <Modal wrapClassName="_namespace"
                className="dataMonacoEditor"
                title="json编辑"
                maskClosable={false}
                visible={this.props.show}
                onOk={this.handleSubmit}
                onCancel={this.props.onCancel}>
                <Row >
                    <Col span={24}>
                        <Input.TextArea
                            rows={15}
                            className="json-textarea"
                            value={this.state.inputValue}
                            onChange={this.onChange}>
                        </Input.TextArea>
                    </Col>
                </Row>
                <Row>
                    <Button onClick={() => { this.formatJson() }}>格式化</Button>
                    <Popover trigger={'click'} content={
                        <QuickGeneDataForm onChange={(value) => {
                            this.setState({
                                inputValue: JSON.stringify(value)
                            })
                        }} />
                    }>
                        <Button onClick={() => { this.formatJson() }}>快速生成数组</Button>
                    </Popover>
                </Row>
            </Modal>
        )
    }
}

class QuickGeneData extends React.Component<any, any>{
    handSubmit: any = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let result = []
                _.times(values.number, (idx) => {
                    result.push(values.value.replace(/\$\{index\}/g, idx))
                })
                this.props.onChange(result)
            }
        });
    }
    render(): any {
        let layout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        }
        let { form: { getFieldDecorator } } = this.props;
        
        return <Form style={{ width: '150px' }} className="_namespace">
            <Form.Item label="触发类型"  {...layout}>
                {
                    getFieldDecorator('value', {
                        rules: [{ required: true, message: '必填' }],
                        initialValue: 'init${index}'
                    })(<Input />)
                }
            </Form.Item>
            <Form.Item label="个数"  {...layout}>
                {
                    getFieldDecorator('number', {
                        rules: [{ required: true, message: '必填' }],
                        initialValue: 10
                    })(<Input />)
                }
            </Form.Item>
            <Form.Item>
                <Col offset={layout.labelCol.span}>
                    <Button onClick={this.handSubmit}>生成</Button>
                </Col>
            </Form.Item>
        </Form>
    }
}
const QuickGeneDataForm = Form.create<any>()(QuickGeneData)
