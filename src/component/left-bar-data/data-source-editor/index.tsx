import * as React from 'react'
import * as _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Button, Icon, Tooltip, Switch, Tag } from 'antd'
import DataSourceApiForm from '../data-source-api'
import DataSourceStateForm from '../data-source-state'
import { DataAction } from '../../../action'
import { DataStore } from '../../../store'
import { Position } from '../../../helper'
import * as typings from './type'
import './style.scss'

@inject('DataAction', 'DataStore')
@observer
export default class DataSourceEditor extends React.Component<typings.PropsDefine, typings.StateDefine> {
    public state: typings.StateDefine = new typings.State()
    static position = Position.leftBarEditorDataSource
    static Action = DataAction
    static Store = DataStore

    handleShowModal = (type: number, index?: number) => {
        this.setState({
            currentEditDataConfIdx: typeof index === 'undefined' ? -1 : index
        }, () => {
            this.setState({
                showStateModal: type === 1,
                showApiModal: type !== 1
            })
        })
    }

    handleOk = (dataConf) => {
        this.setState({
            showStateModal: false,
            showApiModal: false
        }, () => {
            if (this.state.currentEditDataConfIdx >= 0) {
                this.props.DataAction.updateDataConf(this.state.currentEditDataConfIdx, dataConf)
            } else {
                this.props.DataAction.addDataConf(dataConf)
            }
        })
    }

    handleCancel = () => {
        this.setState({
            showStateModal: false,
            showApiModal: false
        })
    }

    handleChangeType = (type: string) => {
        this.setState({
            type
        })
    }

    handleDelete = (index: number) => {
        this.props.DataAction.removeDataConf(index)
    }

    render() {
        const items = this.props.DataStore.dataConfs.map((param, index) => {
            let tag = <Tag color="blue">接</Tag>
            switch (param.dataSourceType) {
                case 1:
                    tag = <Tag color="green">全</Tag>;
                    break;
                case 3:
                    tag = <Tag color="orange">内</Tag>;
            }

            return (
                <div className="global-param" key={index}>
                    <div className="global-param__name-container">
                        <div className="global-param__name-container__name">
                            {tag}
                            {param.dataSourceName}
                        </div>
                        {/* <div className="global-param__name-container__type"><Tag color={!param.dataSourceType ? 'blue' : 'green'}>{param.dataSourceId}</Tag></div> */}
                    </div>
                    {
                        param.dataSourceType !== 3 && <div className="global-param__delete"
                            onClick={this.handleShowModal.bind(this, param.dataSourceType, index)}>
                            <Icon type="edit" style={{ fontSize: 13 }} />
                        </div>}
                    {
                        param.dataSourceType !== 3 && <div className="global-param__delete"
                            onClick={this.handleDelete.bind(this, index)}>
                            <Icon type="delete" style={{ fontSize: 13 }} />
                        </div>
                    }
                </div>
            )
        })
        return (
            <div className="_namespace">
                <div className="title">
                    数据源列表
                </div>
                <div className="container">
                    {items}

                    <Button className="add-param" onClick={() => { 
                        this.handleShowModal(0) }}>+接口数据</Button>
                    <Button className="add-param" onClick={() => { 
                        this.handleShowModal(1) }}>+全局数据</Button>
                    {
                        this.state.showApiModal ? <DataSourceApiForm
                            show={this.state.showApiModal}
                            onCancel={this.handleCancel}
                            onOk={this.handleOk}
                            dataConf={this.props.DataStore.dataConfs[this.state.currentEditDataConfIdx]} />
                            : null
                    }
                    {
                        this.state.showStateModal ? <DataSourceStateForm
                            show={this.state.showStateModal}
                            onCancel={this.handleCancel}
                            onOk={this.handleOk}
                            dataConf={this.props.DataStore.dataConfs[this.state.currentEditDataConfIdx]} />
                            : null
                    }
                </div>
                <div className="func-area">
                    <Tooltip title='此功能需要数据源中的接口格式数据~' placement='topLeft'>
                        <Switch
                            checkedChildren="mock data"
                            unCheckedChildren="mock data"
                            checked={this.props.DataStore.mockPreviewAble}
                            onChange={() => { this.props.DataAction.switchMockPreviewAble() }}
                        />
                    </Tooltip>
                </div>
            </div>
        )
    }
}
