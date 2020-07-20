import * as React from 'react'
import * as _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Button, Modal, Input, Form, Icon } from 'antd'
const FormItem = Form.Item;
import JsonEditor from '../json-editor'
import * as typings from './type'

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

@inject('DataStore')
@observer
class DataSourceStateModal extends React.Component<{ form: any } & typings.EditorModalType, typings.StateDefine> {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let dataConf: Ndesign.DataConf = {
                    dataSourceName: values.dataSourceName,
                    dataSourceId: values.dataSourceId,
                    dataSourceJson: values.dataSourceJson,
                    dataSourceType: 1
                } as Ndesign.DataConf
                this.props.onOk(dataConf)
            }
        });
    }
    handleUpdateDataSourceJson = (value) => {
        this.setState({
            visible: value
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
    render() {
        let { form: { getFieldDecorator }, dataConf = {} as any } = this.props;
        let existIds = _.without(_.map(this.props.DataStore.dataConfs, 'dataSourceId'), dataConf.dataSourceId)

        let existGbDataLength = this.props.DataStore.dataConfs.filter((item) => { return item.dataSourceType === 1 }).length

        return (
            this.props.show ?
                <Modal className="_namespace"
                    title="新增全局状态数据源"
                    visible={this.props.show}
                    onOk={this.handleSubmit}
                    onCancel={this.props.onCancel}>
                    <div className="editor-form">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label="数据源名称">
                                {getFieldDecorator('dataSourceName', {
                                    initialValue: dataConf.dataSourceName || `全局状态数据源${existGbDataLength + 1}`,
                                    rules: [
                                        { required: true, message: '填写数据源名称' }
                                    ]
                                })(
                                    <Input prefix={<Icon type="bell" style={{ fontSize: 13 }} />} placeholder="数据源名称" />
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
                                    <Input prefix={<Icon type="database" style={{ fontSize: 13 }} />} placeholder="数据源ID" />
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} label="">
                                {
                                    getFieldDecorator('dataSourceJson', {
                                        initialValue: dataConf.dataSourceJson || ''
                                    })(
                                        <Button type="primary" onClick={() => this.handleUpdateDataSourceJson(true)} style={{ width: '60%' }}> <Icon type="edit" /> 修改数据格式 </Button>
                                    )
                                }
                            </FormItem>
                        </Form>
                        <JsonEditor
                            show={this.state.visible}
                            onCancel={() => this.handleUpdateDataSourceJson(false)}
                            onOk={this.handleUpdateDataSourceJsonSubmit}
                            jsonData={this.props.form.getFieldValue('dataSourceJson') || ''} />
                    </div>
                </Modal> : null
        )
    }
}

export default Form.create<typings.EditorModalType>()(DataSourceStateModal)
