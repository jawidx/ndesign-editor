import * as React from 'react'
import * as _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Button, Modal, Input, Form, Col, Row, Icon, Tooltip, Switch, Radio, Popconfirm, Tag, Collapse } from 'antd'
const FormItem = Form.Item;
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
import JsonTreeSelect from '../json-tree-select'
import JsonEditor from '../json-editor'
import { SpecTypePropsVarData } from '../../common'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import * as typings from './type'
import './style.scss'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 14,
            offset: 6,
        },
    },
};

/**
 * 选择数据源弹窗组件
 */
class SelectDataJsonTree extends React.Component<{
    jsonTreeData: Object,
    show?: boolean,
    onHandleCancel?: () => void
    onHandleSubmit?: (value: string) => void
}, { selectedJson?: string }> {
    constructor(props) {
        super(props)
    }
    handleSubmit = () => {
        this.props.onHandleSubmit(this.state.selectedJson.replace('[]', ''))
    }
    onSelectJsonTree = (value) => {
        this.setState({
            selectedJson: value
        })
    }
    render() {
        return (
            this.props.show ? <Modal wrapClassName="_namespace"
                title="选择数据源Json"
                maskClosable={false}
                visible={this.props.show}
                onOk={this.handleSubmit}
                onCancel={this.props.onHandleCancel}>
                <JsonTreeSelect isStopArray jsonTreeData={toJS(this.props.jsonTreeData)} onSelectJsonTree={this.onSelectJsonTree} />
            </Modal> : null
        )
    }
}

/**
 * 添加 url post 相关参数组件
 */
interface CurdFeatchReqDataProps {
    title?: string
    visible?: boolean
    reqData?: Ndesign.dataSourceReqDataType
    onhandleOk?: (value: Ndesign.dataSourceReqDataType) => void
    onHandleCancel?: () => void
}
class CurdFeatchReqData extends React.Component<{ form: any } & CurdFeatchReqDataProps, any> {
    onhandleOk = () => {
        let { form: { validateFields }, onhandleOk } = this.props
        validateFields((err, values) => {
            if (!err) {
                onhandleOk({
                    key: values.dataKey,
                    value: values.dataValue
                })
            }
        });
    }
    render() {
        let { form: { getFieldDecorator }, reqData = {} as Ndesign.dataSourceReqDataType } = this.props;

        return (
            this.props.visible ? <Modal wrapClassName="_namespace"
                title={this.props.title || '添加参数'}
                maskClosable={false}
                visible={this.props.visible}
                onOk={this.onhandleOk}
                onCancel={this.props.onHandleCancel}>
                <FormItem  {...formItemLayout} label="字段名称">
                    {getFieldDecorator('dataKey', {
                        initialValue: reqData.key || ''
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label="字段值">
                    {getFieldDecorator('dataValue', {
                        initialValue: reqData.value || null,
                    })(
                        <SpecTypePropsVarData />
                    )}
                </FormItem>
            </Modal> : null
        )
    }
}
const CurdFeatchReqDataForm = Form.create<CurdFeatchReqDataProps>()(CurdFeatchReqData)


enum ModalKey {
    'CurdReqDataModal' //参数弹窗
}
@ModalHelp(ModalKey.CurdReqDataModal)
@inject('DataStore')
@observer
class DataSourceApiModal extends React.Component<{ form: any } & ModalHelpProps & typings.EditorModalType, typings.StateDefine> {
    private uuid = 0
    constructor(props) {
        super(props)
        this.state = {
            fieldsKeys: []
        }
    }
    componentDidMount() {
        // this.resetForm()
        let { dataSourceFieldsMap = [] } = this.props.dataConf || {}
        let setKeys = []
        if (dataSourceFieldsMap.length) {
            dataSourceFieldsMap.forEach(() => {
                setKeys.push(this.uuid++)
            })
        } else {
            setKeys.push(this.uuid++)
        }
        this.setState({
            fieldsKeys: setKeys
        })

        this.props.observeModalClose(ModalKey.CurdReqDataModal, () => {
            this.props.removeModalStateData(ModalKey.CurdReqDataModal)
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let dataConf: Ndesign.DataConf = {
                    dataSourceName: values.dataSourceName,
                    dataSourceId: values.dataSourceId,
                    dataSourceHost: values.dataSourceHost,
                    dataSourceUrl: values.dataSourceUrl,
                    dataSourceJson: values.dataSourceJson,
                    isPageMode: values.isPageMode,
                    dsMethod: values.dsMethod,
                    dsPageField: values.dsPageField,
                    // daParams: values.daParams,
                    // daPostDatas: values.daPostDatas,
                    dsReqDatas: values.dsReqDatas,
                    dataSourceType: 0
                } as Ndesign.DataConf

                let dataSourceFieldsMap = []
                Object.keys(values).forEach((keys) => {
                    if (keys.indexOf('dataSourceFieldsMap') !== -1) {
                        let _karr = keys.split('-')
                        dataSourceFieldsMap[+_karr[2]] = dataSourceFieldsMap[+_karr[2]] || {}
                        dataSourceFieldsMap[+_karr[2]][_karr[1]] = values[keys]
                    }
                })
                dataConf.dataSourceFieldsMap = _.compact(dataSourceFieldsMap)
                this.props.onOk(dataConf)
            }
        });
    }
    remove = (k) => {
        this.setState({
            fieldsKeys: _.difference(this.state.fieldsKeys, [k])
        })
    }
    add = () => {
        this.setState({
            fieldsKeys: [].concat(this.state.fieldsKeys).concat([this.uuid++])
        })
    }
    getDataSourceFieldMap = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 18, offset: 6 },
            },
        };
        // getFieldDecorator('keys', { initialValue: [] });
        const keys = this.state.fieldsKeys;
        let fieldMapValue

        return keys.map((k, index) => {
            let { dataSourceFieldsMap = [] } = this.props.dataConf || {}
            let dataSourceField = dataSourceFieldsMap[k] || {} as any
            let filedMapKey = `dataSourceFieldsMap-map-${k}`;
            let filedNameKey = `dataSourceFieldsMap-name-${k}`;
            return (
                <FormItem
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '数据源映射' : ''}
                    required={false}
                    key={k}
                >
                    <Row gutter={0}>
                        <Col span={8}>
                            {getFieldDecorator(filedNameKey, {
                                initialValue: `${dataSourceField.name || ''}`,
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: "必填",
                                }],
                            })(
                                <Input placeholder="字段" />
                            )}
                        </Col>
                        <Col span={2}>
                            <p className="ant-form-split">-</p>
                        </Col>
                        <Col span={8}>
                            {getFieldDecorator(filedMapKey, {
                                initialValue: `${dataSourceField.map || ''}`,
                                rules: [{ required: true, message: '必填' }],
                            })(
                                (() => {
                                    let fieldMapValue = getFieldValue(filedMapKey);
                                    return <Tooltip title='选择接口字段'>
                                        {
                                            fieldMapValue ?
                                                <Button onClick={() => { this.handleSelectJsonOpen(filedMapKey) }} ><Icon type="edit" />{fieldMapValue} </Button> :
                                                <Button type="dashed" onClick={() => { this.handleSelectJsonOpen(filedMapKey) }} ><Icon type="plus" /> 选择接口字段 </Button>
                                        }
                                    </Tooltip>
                                })()
                            )}
                        </Col>
                        <Col span={3} offset={1}>
                            {keys.length > 1 ? (
                                <Icon
                                    className="dynamic-delete-button"
                                    type="minus-circle-o"
                                    onClick={() => this.remove(k)}
                                />
                            ) : null}
                        </Col>
                    </Row>
                </FormItem>
            );
        });
    }
    // 接口格式
    handleUpdateDataSourceJson = () => {
        this.setState({
            visible: true
        })
    }
    handleUpdateDataSourceJsonCancel = () => {
        this.setState({
            visible: false
        })
    }
    handleUpdateDataSourceJsonSubmit = (dataSourceJson: Object) => {
        this.setState({
            visible: false
        }, () => {
            this.props.form.setFieldsValue({
                dataSourceJson: dataSourceJson,
            });
        })
    }
    // 映射数据
    handleSelectJsonOpen = (fieldMapKey) => {
        this.setState({
            selectJsonTreeShow: true,
            selectJsonFieldMapKey: fieldMapKey
        })
    }
    handleSelectJsonCancel = () => {
        this.setState({
            selectJsonTreeShow: false
        })
    }
    handleSelectJsonSubmit = (value: string) => {
        this.props.form.setFieldsValue({
            [this.state.selectJsonFieldMapKey]: value
        })
        this.setState({
            selectJsonTreeShow: false
        })
    }

    shouldComponentUpdate(nextProps) {
        if (!this.props.show && !nextProps.show) {
            return false
        }
        return true
    }

    getReqDataEditor = (paramsType: 'dsReqDatas') => {
        let {
            form: { getFieldDecorator, getFieldValue, setFieldsValue },
            dataConf = {} as any
        } = this.props;
        return <FormItem {...formItemLayout} label={'请求数据'}>
            {getFieldDecorator(paramsType, {
                initialValue: dataConf[paramsType] || [],
            })}
            {
                (getFieldValue(paramsType) as Ndesign.dataSourceReqDataType[] || []).map((data, index) => {
                    return <Popconfirm trigger='hover' title={data.key} okText='编辑' cancelText='删除'
                        onConfirm={() => {
                            this.props.storeModalStateData(ModalKey.CurdReqDataModal, { type: paramsType, index, data })
                            this.props.openModal(ModalKey.CurdReqDataModal)
                        }}
                        onCancel={() => {
                            let value = [].concat(getFieldValue(paramsType))
                            value.splice(index, 1)
                            setFieldsValue({
                                [paramsType]: value
                            })
                        }}>
                        <Tag key={index} className='condition__itemTag' > 参数{index + 1} </Tag>
                    </Popconfirm>
                })
            }
            <Button onClick={() => {
                this.props.storeModalStateData(ModalKey.CurdReqDataModal, { type: paramsType })
                this.props.openModal(ModalKey.CurdReqDataModal)
            }}>add</Button>
        </FormItem>
    }

    render() {
        let { form: { getFieldDecorator, getFieldValue, setFieldsValue }, dataConf = {} as any } = this.props;
        let existIds = _.without(_.map(this.props.DataStore.dataConfs, 'dataSourceId'), dataConf.dataSourceId)
        let reqEditorData = this.props.getModalStateData<{ type: string, index: number, data: any }>(ModalKey.CurdReqDataModal)
        let dataSourceHost = getFieldValue('dataSourceHost')

        return (
            this.props.show ? <Modal className="_namespace"
                width={650}
                title="新增接口数据源"
                visible={this.props.show}
                onOk={this.handleSubmit}
                onCancel={this.props.onCancel}>
                <div className="editor-form">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label="数据源名称">
                            {getFieldDecorator('dataSourceName', {
                                initialValue: dataConf.dataSourceName || '',
                                rules: [
                                    { required: true, message: '填写数据源名称' }
                                ]
                            })(
                                <Input prefix={<Icon type="bell" style={{ fontSize: 13 }} />}
                                    placeholder="数据源名称" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="数据源唯一ID">
                            {getFieldDecorator('dataSourceId', {
                                initialValue: dataConf.dataSourceId || '',
                                rules: [
                                    { required: true, message: '输入数据源唯一ID' },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (_.indexOf(existIds, value) !== -1) {
                                                callback('已存在唯一ID,请更换')
                                            }
                                            callback()
                                        }
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="database" style={{ fontSize: 13 }} />}
                                    placeholder="数据源ID" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="数据源url">
                            {getFieldDecorator('dataSourceHost', {
                                initialValue: dataConf.dataSourceHost || ''
                            })}
                            {getFieldDecorator('dataSourceUrl', {
                                initialValue: dataConf.dataSourceUrl || '',
                                rules: [{ required: true, message: '必填' }]
                            })(
                                <Input
                                    addonBefore={
                                        <Input style={{ width: 150 }} size='small'
                                            placeholder='http://haokan.baidu.com'
                                            value={dataSourceHost}
                                            onChange={(e) => {
                                                setFieldsValue({ dataSourceHost: e.target.value })
                                            }}
                                            onBlur={() => {
                                                if (dataSourceHost && !dataSourceHost.startsWith('http')) {
                                                    setFieldsValue({ dataSourceHost: '' })
                                                }
                                            }} />
                                    } />
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout} label="">
                            {
                                getFieldDecorator('dataSourceJson', {
                                    initialValue: dataConf.dataSourceJson || {},
                                    rules: [{ required: true, message: '必填' },
                                    {
                                        validator: (rule, value, callback) => {
                                            if (Object.keys(value).length < 1) {
                                                callback('请添加接口格式')
                                            }
                                            callback()
                                        }
                                    }]
                                })(
                                    Object.keys(this.props.form.getFieldValue('dataSourceJson')).length ?
                                        <Button type="primary" onClick={this.handleUpdateDataSourceJson} style={{ width: '60%' }}> <Icon type="edit" /> 修改接口格式 </Button> :
                                        <Button type="dashed" onClick={this.handleUpdateDataSourceJson} style={{ width: '60%' }}> <Icon type="plus" /> 添加接口格式 </Button>
                                )
                            }
                        </FormItem>
                        {this.getDataSourceFieldMap()}
                        <Row>
                            <Col xs={{ span: 24 }} sm={{ span: 14, offset: 6 }}>
                                <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                    <Icon type="plus" /> Add field
                                </Button>
                            </Col>
                        </Row>
                        <Collapse bordered={false} >
                            <Collapse.Panel header="高级模式" key="1">
                                <FormItem {...formItemLayout} label="翻页模式">
                                    <Col span={5}>
                                        <FormItem>
                                            {getFieldDecorator('isPageMode', {
                                                initialValue: dataConf.isPageMode || false,
                                                valuePropName: 'checked'
                                            })(
                                                <Switch />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={2}></Col>
                                    <Col span={11}>
                                        {getFieldValue('isPageMode') && <FormItem>
                                            {getFieldDecorator('dsPageField', {
                                                initialValue: dataConf.dsPageField || '',
                                            })(
                                                <Input placeholder='接口页码字段' />
                                            )}
                                        </FormItem>}
                                    </Col>
                                </FormItem>
                                <FormItem {...formItemLayout} label="请求类型">
                                    {getFieldDecorator('dsMethod', {
                                        initialValue: dataConf.dsMethod || 'GET',
                                    })(
                                        <RadioGroup>
                                            <RadioButton value="GET">GET</RadioButton>
                                            <RadioButton value="POST">POST</RadioButton>
                                            {/* <RadioButton value="">item 3</RadioButton> */}
                                        </RadioGroup>
                                    )}
                                </FormItem>
                                {this.getReqDataEditor('dsReqDatas')}
                            </Collapse.Panel>
                        </Collapse>
                    </Form>
                    <JsonEditor
                        show={this.state.visible}
                        onCancel={this.handleUpdateDataSourceJsonCancel}
                        onOk={this.handleUpdateDataSourceJsonSubmit}
                        jsonData={this.props.form.getFieldValue('dataSourceJson')} />
                    <SelectDataJsonTree
                        jsonTreeData={this.props.form.getFieldValue('dataSourceJson')}
                        show={this.state.selectJsonTreeShow}
                        onHandleCancel={this.handleSelectJsonCancel}
                        onHandleSubmit={this.handleSelectJsonSubmit} />
                    {
                        reqEditorData && <CurdFeatchReqDataForm
                            visible={this.props.getModalVisible(ModalKey.CurdReqDataModal)}
                            reqData={reqEditorData.data}
                            onHandleCancel={() => { this.props.closeModal(ModalKey.CurdReqDataModal) }}
                            onhandleOk={(value) => {
                                if (reqEditorData.type) {
                                    let setValue = getFieldValue(reqEditorData.type)
                                    setValue = setValue && setValue.slice();

                                    if (_.isNumber(reqEditorData.index)) {
                                        setValue.splice(reqEditorData.index, 1)
                                    }
                                    setValue = [].concat(setValue).concat([value])
                                    setFieldsValue({ [reqEditorData.type]: setValue })
                                    this.props.closeModal(ModalKey.CurdReqDataModal)
                                }
                            }} />
                    }
                </div>
            </Modal> : null
        )
    }
}

export default Form.create<typings.EditorModalType>()(DataSourceApiModal)
