import * as React from 'react'
import { observer, inject } from 'mobx-react'
import * as _ from 'lodash';
import { Select, Form, Button, Modal, Tooltip, Row, Col, Icon, Tag, Radio } from 'antd';
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
import { SpecTypePropsVarData, SimpleProsVarData } from '../../../common'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import { ViewportStore } from '../../../../store'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    /**
     * 第几个事件
     */
    triggerKey: string
    eventData?: Ndesign.EventActionSettingGbData[]
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
}

@ModalHelp @inject('ViewportStore') @observer
export default class SettingGbData extends React.Component<ModalHelpProps & PropsDefine, any> {
    updateEventData = (value?: Ndesign.EventActionSettingGbData, idx?: number) => {
        let eventData = this.props.eventData && Array.isArray(this.props.eventData) ? [].concat(this.props.eventData) : []
        if (!value) {
            eventData.splice(idx, 1)
        } else {
            eventData.push(value)
        }

        this.props.handleChange(eventData)
    }

    onHandleOk = (value: Ndesign.EventActionSettingGbData) => {
        this.updateEventData(value)
        this.props.closeModal()
    }

    handleDelete = (idx) => {
        this.updateEventData(null, idx)
    }

    render() {
        const curProps = this.props.ViewportStore.currComInfo.props;
        const eventData = this.props.eventData && Array.isArray(this.props.eventData.slice()) ? this.props.eventData : [];

        // let curEventData = (eventInfo.eventData || [])
        // curEventData = ( curEventData.constructor.name === 'Array' ? curEventData : []   ) as Ndesign.EventActionSettingGbData[]
        let settingDatas: SettingDatas = [];
        (!isNaN(Number(this.props.triggerKey)) && curProps.event.triggers[this.props.triggerKey].stateOut || []).forEach((stateOut, idx) => {
            settingDatas.push({
                name: stateOut,
                value: idx,
                type: 'stateOut'
            })
        });
        (curProps._ndsPropsIn || []).forEach((propsIn, idx) => {
            settingDatas.push({
                name: propsIn,
                value: idx,
                type: 'propsIn'
            })
        })

        return (
            <div className="_namespace eventDataEditor">
                <div className="item-list-contain">
                    {
                        eventData.map((item, key) => {
                            let isPropsIn = item.setData.type === 'propsIn';
                            return (<div key={key} className="item-list">
                                <div className="desc">
                                    <div>修改字段: {item.source.colls[0].value.key}</div>
                                    <div>值：
                                        <Tag style={{ marginRight: '5px' }} className="tag-id" color={isPropsIn ? 'blue' : 'green'}>
                                            {item.setData.name}
                                        </Tag>
                                    </div>
                                </div>
                                <div className="opreate-icon">
                                    <div className="delete icon"
                                        onClick={this.handleDelete.bind(this, key)}>
                                        <Icon type="delete" />
                                    </div>
                                </div>
                            </div>)
                        })
                    }
                </div>

                <Button icon="file-add" onClick={() => { this.props.openModal() }}>添加</Button>
                <ModelFormCreate
                    visible={this.props.getModalVisible()}
                    onHandleCancel={this.props.closeModal}
                    onHandleOk={this.onHandleOk}
                    settingDatas={settingDatas}
                />
            </div>
        )
    }
}

type SettingDatas = Ndesign.EventActionSettingGbData_setData[]

interface ModelFormType {
    visible?: boolean
    onHandleCancel: () => void
    onHandleOk: (settingGbData: Ndesign.EventActionSettingGbData) => void
    settingDatas: SettingDatas
}

class ModelForm extends React.Component<{ form: any } & ModelFormType, {}>{
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.setData = JSON.parse(values.setData)
                values.source = JSON.parse(values.source)
                this.props.onHandleOk(values)
            }
        });
    }

    getRenderSetData = () => {
        let { form: { getFieldDecorator, getFieldValue, setFieldsValue }, visible } = this.props;

        let FormItemEle: React.ReactElement<any>
        switch (getFieldValue('setDataType')) {
            case 'propsIn':
            case 'stateOut':
                FormItemEle = (
                    <Select placeholder="选择一个透传值，或组件内外传值" onSelect={(value) => {
                        setFieldsValue({ setData: value })
                    }}>
                        {
                            this.props.settingDatas.map((settingData) => {
                                let isPropsIn = settingData.type === 'propsIn';
                                let value = JSON.stringify(settingData)
                                return <Option value={value} >
                                    <Tag style={{ marginRight: '5px' }} className="tag-id" color={isPropsIn ? 'blue' : 'green'}>
                                        {isPropsIn ? '外PropsIn' : '内stateOut'}
                                    </Tag>
                                    {settingData.name}
                                </Option>
                            })
                        }
                    </Select>
                )
                break;
            case 'custom':
                let inputValue = getFieldValue('setData') || null;
                inputValue = inputValue && JSON.parse(inputValue)
                FormItemEle = (
                    <SpecTypePropsVarData defaultValue={inputValue} onChange={(value) => {
                        setFieldsValue({ 'setData': JSON.stringify({ name: '自定义', type: 'custom', value }) })
                    }} />
                )
                break;
            default:
                FormItemEle = null
        }
        return <Row><Col offset={6} span={14}>{FormItemEle}</Col></Row>
    }

    render() {
        let { form: { getFieldDecorator, getFieldValue, setFieldsValue }, visible } = this.props;
        return (
            visible ? <Modal
                title="添加更改状态数据源逻辑"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.onHandleCancel}
                wrapClassName="_namespace"
            >
                <Form onSubmit={this.handleOk}>
                    <FormItem label="状态数据源字段" {...formItemLayout}>
                        {
                            getFieldDecorator('source', {
                                rules: [{ required: true, message: '必选' }],
                                initialValue: ''
                            })(
                                (() => {
                                    let fieldMapValue = getFieldValue('source')
                                    fieldMapValue = fieldMapValue && JSON.parse(fieldMapValue);
                                    return <Tooltip title='选择数据源'>
                                        <SimpleProsVarData
                                            onChange={(value) => {
                                                // let result = {
                                                //     type: value.dataConf.dataSourceType,
                                                //     value: value.key,
                                                //     comKey: value.dataConf.comKey
                                                // }
                                                this.props.form.setFieldsValue({ 'source': JSON.stringify(value) })
                                            }}
                                            // 增加可设置接口返回的数据
                                            dataSourceType={[0, 1, 2, undefined]}>
                                            {
                                                fieldMapValue ?
                                                    <Button><Icon type="edit" />{fieldMapValue.colls[0].value.key} </Button> :
                                                    <Button><Icon type="plus" /> 选择状态数据源 </Button>
                                            }
                                        </SimpleProsVarData>
                                    </Tooltip>
                                })()
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="选择更改值"
                        {...formItemLayout}
                    >
                        {
                            // 'propsIn' | 'stateOut' | 'selfInverse' | 'custom'
                            getFieldDecorator('setDataType', {
                                initialValue: 'stateOut'
                            })(
                                <RadioGroup onChange={(e: any) => {
                                    let result: any = ''
                                    if (e.target.value === 'selfInverse') {
                                        result = { name: '自身求反', type: 'selfInverse' }
                                    }
                                    setFieldsValue({ 'setData': result && JSON.stringify(result) })
                                }}>
                                    <Radio value='propsIn'>外部透传</Radio>
                                    <Radio value='stateOut'>内传</Radio>
                                    <Radio value='selfInverse'>自身求反</Radio>
                                    <Radio value='custom'>自定义</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>
                    {getFieldDecorator('setData', { rules: [{ required: true, message: '必填' }], initialValue: '' })}
                    {this.getRenderSetData()}
                </Form>
            </Modal> : null
        )
    }
}

const ModelFormCreate = Form.create<ModelFormType>()(ModelForm)

