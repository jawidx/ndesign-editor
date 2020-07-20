import * as React from 'react'
import * as _ from 'lodash'
import { inject, observer } from 'mobx-react'
import JsonEditor from '../../left-bar-data/json-editor'
import { Button, Modal, Input, Form, Icon } from 'antd'
const FormItem = Form.Item;
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

enum ModalKey {
    'dataSource', //数据源编辑器
    'JsonEditor' // json编译器
}

@ModalHelp(ModalKey.dataSource, ModalKey.JsonEditor)
@inject('ViewportStore', 'EditorTabDataAction')
@observer
class DataSourceConfModal extends React.Component<{ form: any } & typings.EditorModalType & ModalHelpProps, any> {
    componentDidMount() {
        this.props.observeModalClose(ModalKey.dataSource, () => {
            this.props.removeModalStateData(ModalKey.dataSource)
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let comKey = this.props.ViewportStore.currComKey;
                let dataConf: Ndesign.DataConf = {
                    dataSourceName: values.dataSourceName,
                    dataSourceId: values.dataSourceId,
                    dataSourceJson: values.dataSourceJson,
                    comKey: comKey,
                    dataSourceType: 2
                } as Ndesign.DataConf
                // this.props.onOk(dataConf)
                let idxData = this.props.getModalStateData<{ idx: number }>(ModalKey.dataSource)
                this.props.EditorTabDataAction.updateDataConf(comKey, dataConf, idxData ? idxData.idx : -1)
                this.props.closeModal(ModalKey.dataSource)
            }
        });
    }
    handleUpdateDataSourceJsonSubmit = (dataSourceJson: Object) => {
        this.props.closeModal(ModalKey.JsonEditor)
        this.props.form.setFieldsValue({
            dataSourceJson: dataSourceJson,
        });
    }
    getRenderModal() {
        let { form: { getFieldDecorator } } = this.props;
        let { dataConfs = [] } = this.props.ViewportStore.currComInfo.props
        let idxData = this.props.getModalStateData<{ idx: number }>(ModalKey.dataSource)
        let dataConf = !idxData ? {} as Ndesign.DataConf : dataConfs[idxData.idx]

        // let existIds = _.without(_.map(this.props.DataStore.dataSourcesConfs, 'dataSourceId'), dataConf.dataSourceId)

        // let existGbDataLength = this.props.DataStore.dataSourcesConfs.filter((item) => { return item.dataSourceType === 1 }).length

        return (
            this.props.getModalVisible(ModalKey.dataSource) ?
                <Modal className="_namespace"
                    title="新增组件数据源"
                    visible={this.props.getModalVisible(ModalKey.dataSource)}
                    onOk={this.handleSubmit}
                    onCancel={() => { this.props.closeModal(ModalKey.dataSource) }}>
                    <div className="editor-form">
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label="数据源名称">
                                {getFieldDecorator('dataSourceName', {
                                    initialValue: dataConf.dataSourceName || `组件数据源`,
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
                                        {/* {
                                        validator: (rule, value, callback) => {
                                            if (_.indexOf(existIds, value) !== -1) {
                                                callback('已存在唯一ID,请更换')
                                            }
                                            callback()
                                        }
                                    } */}
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
                                        <Button type="primary" onClick={() => {
                                            this.props.openModal(ModalKey.JsonEditor)
                                        }} style={{ width: '60%' }}>
                                            <Icon type="edit" /> 修改数据格式
                                        </Button>
                                    )
                                }
                            </FormItem>
                        </Form>
                        <JsonEditor
                            show={this.props.getModalVisible(ModalKey.JsonEditor)}
                            onCancel={() => { this.props.closeModal(ModalKey.JsonEditor) }}
                            onOk={this.handleUpdateDataSourceJsonSubmit}
                            jsonData={this.props.form.getFieldValue('dataSourceJson') || ''} />
                    </div>
                </Modal> : null
        )
    }
    renderConfList = () => {
        let { dataConfs = [] } = this.props.ViewportStore.currComInfo.props
        return (
            <div className="item-list-contain">
                {
                    dataConfs.map((item, key) => {
                        return (<div key={key} className="item-list">
                            <div className="desc">{item.dataSourceName}</div>
                            <div className="sourceId">{item.dataSourceId}</div>
                            <div className="opreate-icon">
                                <div className="update icon"
                                    onClick={() => {
                                        this.props.storeModalStateData(ModalKey.dataSource, { idx: key })
                                        this.props.openModal(ModalKey.dataSource)
                                    }}>
                                    <Icon type="edit" style={{ fontSize: 13 }} />
                                </div>
                                <div className="delete icon"
                                    onClick={() => {
                                        this.props.EditorTabDataAction.updateDataConf(this.props.ViewportStore.currComKey, null, key)
                                    }}>
                                    <Icon type="delete" style={{ fontSize: 13 }} />
                                </div>
                            </div>
                        </div>)
                    })
                }
            </div>
        )
    }
    render() {
        return (<div className='_namespace'>
            {this.renderConfList()}
            <Button onClick={() => { this.props.openModal(ModalKey.dataSource) }}>添加组件数据源</Button>
            {this.getRenderModal()}
        </div>)
    }
}

export default Form.create<typings.EditorModalType>()(DataSourceConfModal)
