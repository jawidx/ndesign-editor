/**
 * @desc   条件选择器弹窗 (单个条件)
 * @prop   ModelFormType
 *              1.  visible         是否显示
 *              2.  conditionData   修改条件的数据
 *              3.  conditionLen    业务条件数据的长度
 *              4.  onHandleCancel  取消弹窗回调
 *              5.  onHandleOk      条件输入完成回调
 * @return  Ndesign.ConditionAtom
 */
import * as React from 'react'
import * as _ from 'lodash'
import { Collapse, Button, Select, Input, Form, Modal, Col, Icon, Tooltip } from 'antd'
import { SimpleProsVarData, SpecTypePropsVarData } from '../../'
const Panel = Collapse.Panel
const Option = Select.Option
const FormItem = Form.Item

interface ModelFormType {
    title?: string
    visible?: boolean
    conditionData?: Ndesign.ConditionAtom
    conditionLen?: number
    onHandleCancel: () => void
    onHandleOk: (conditionData: Ndesign.ConditionAtom) => void
}

class ModelForm extends React.Component<{ form: any } & ModelFormType, {}>{
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onHandleOk(values)
            }
        });
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        }
        let { form: { getFieldDecorator, getFieldValue }, visible } = this.props;
        let { conditionData } = this.props;
        conditionData = conditionData || {} as Ndesign.ConditionAtom;

        getFieldDecorator('valueType', { initialValue: '' });
        return (
            visible ? <Modal
                title={this.props.title || "添加条件"}
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.onHandleCancel}
                wrapClassName="_namespace"
            >
                <Form onSubmit={this.handleOk}>
                    <FormItem label="条件描述" {...formItemLayout} >
                        {
                            getFieldDecorator('desc', {
                                rules: [{ required: true, message: '必填' }],
                                initialValue: conditionData.desc || `第${this.props.conditionLen || 0 + 1}个条件`
                            })(
                                <Input placeholder="描述这个条件，以便查看" />
                            )
                        }
                    </FormItem>
                    <FormItem label="数据源" {...formItemLayout} >
                        {
                            getFieldDecorator('source', {
                                rules: [{ required: true, message: '必选' }],
                                initialValue: conditionData.source || ''
                            })(
                                (() => {
                                    let fieldMapValue: Ndesign.PropsVarData = getFieldValue('source');
                                    return <Tooltip title='选择数据源'>
                                        <SimpleProsVarData onChange={(value) => {
                                            this.props.form.setFieldsValue({
                                                'source': value
                                            })
                                        }}>
                                            {
                                                fieldMapValue ?
                                                    <Button><Icon type="edit" />{fieldMapValue.colls[0].value.key} </Button> :
                                                    <Button><Icon type="plus" /> 选择数据源 </Button>
                                            }
                                        </SimpleProsVarData>
                                    </Tooltip>
                                })()
                            )
                        }
                    </FormItem>
                    <FormItem label="条件"  {...formItemLayout}  >
                        <Col span={10}>
                            {
                                getFieldDecorator('props', {
                                    rules: [{ required: true, message: '必填' }],
                                    initialValue: conditionData.props || 'value'
                                })(
                                    <Select
                                        style={{ width: '100%', marginRight: '10px' }}
                                        placeholder="数据属性">
                                        <Option value="value">值(value)</Option>
                                        <Option value="length">长度(length)</Option>
                                    </Select>
                                )
                            }
                        </Col>
                        <Col span={13} offset={1}>
                            {
                                getFieldDecorator('condition', {
                                    rules: [{ required: true, message: '必填' }],
                                    initialValue: conditionData.condition || 'exist'
                                })(
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="选择一个条件">
                                        <Option value="exist"> 存在（除了undefined）</Option>
                                        <Option value=">"> 大于（>）</Option>
                                        <Option value="<">{`小于（<）`}</Option>
                                        <Option value="==">等于（=）</Option>
                                        <Option value="!=">非等于（!=）</Option>
                                    </Select>
                                )
                            }
                        </Col>
                    </FormItem>
                    <FormItem label="判断值" {...formItemLayout} >
                        {
                            getFieldDecorator('value', {
                                initialValue: conditionData.value || {}
                            })(
                                // defaultValue={conditionData.value}
                                <SpecTypePropsVarData onChange={(value) => {
                                    this.props.form.setFieldsValue({ 'value': value })
                                }} />
                            )
                        }
                    </FormItem>
                </Form>
            </Modal> : null
        )
    }
}

export default Form.create<ModelFormType>()(ModelForm)