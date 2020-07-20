import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import * as _ from 'lodash'
import JsonTreeSelect from '../json-tree-select'
import { Modal, Form, Row, Select, Tag } from 'antd'
const Option = Select.Option
import * as typings from './type'
import './style.scss'

@inject('DataStore', 'ViewportStore')
@observer
export default class SelectDataSource extends React.Component<typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    handleOk = (selectedValue: typings.SlectValueType) => {
        this.setState({ visible: false })
        this.props.onSelect && this.props.onSelect({
            key: selectedValue.key,
            dataConf: selectedValue.dataConf
        })
    }
    handleCancel = () => {
        this.setState({ visible: false })
    }
    /** 循环获取组件数据源 */
    getCommponentSourceConf = () => {
        let dataSources: Ndesign.DataConf[] = [] // 组件数据源
        let collectIdxs = [];
        let currentEditCom = this.props.ViewportStore.currComInfo;
        let i = 0;
        while (currentEditCom) {
            if (currentEditCom.props.dataConfs) {
                dataSources = dataSources.concat(currentEditCom.props.dataConfs.slice())
            }
            if (i > 0 && currentEditCom.props._ndsCollectDatas) {
                collectIdxs.unshift(currentEditCom.props.name + ' 组件')
                // collectIdxSource.dataSourceJson[]
            }
            currentEditCom = this.props.ViewportStore.components.get(currentEditCom.parentKey);
            i++
        }
        if (collectIdxs.length) {
            let collectIdxSource: Ndesign.DataConf = {
                dataSourceName: '组件循环idx',
                dataSourceId: '__collectIdxs__',
                dataSourceType: -1,
                dataSourceJson: {}
            } // 此组件涉及的循环idx

            collectIdxs.forEach((cname, idx) => {
                collectIdxSource.dataSourceJson[idx] = `第${cname}层index`
            })
            dataSources.push(collectIdxSource)
        }
        return dataSources
    }
    // 获取循环组件idx数据
    // getFlowDataCollectIdxs = () => {
    //     // debugger
    //     // let currentEditCom = this.props.ViewportStore.currComInfo;
    //     // while (currentEditCom) {
    //     //     if (currentEditCom.props.dataConfs) {
    //     //         // dataSources = dataSources.concat(currentEditCom.props.dataConfs.slice())
    //     //     }
    //     //     currentEditCom = this.props.ViewportStore.components.get(currentEditCom.parentKey)
    //     // }
    // }
    render() {
        let selectModalEle
        if (this.state.visible) {
            let { dataConfs = [] } = this.props.DataStore
            dataConfs = dataConfs.slice();
            let dataSourceType: any;
            if (typeof this.props.dataSourceType === 'undefined') {
                dataSourceType = [0, 1, 2, 3, undefined]
            } else {
                dataSourceType = Array.isArray(this.props.dataSourceType) ? this.props.dataSourceType : [this.props.dataSourceType]
            }
            dataConfs = dataConfs.filter((dconf) => { return dataSourceType.indexOf(dconf.dataSourceType) > -1 })

            dataSourceType.indexOf(2) > -1 && (dataConfs = dataConfs.concat(this.getCommponentSourceConf()));
            selectModalEle = (<SelectDataSourceModal
                dataSourcesConfs={toJS(dataConfs)}
                dataSourceType={dataSourceType}
                title={this.props.title}
                value={this.props.value}
                onSelect={this.handleOk}
                visible={this.state.visible}
                handleCancel={this.handleCancel}
                isStopArray={this.props.isStopArray} />)
        }

        return (
            <div className="_namespace">
                <div onClick={() => { this.setState({ visible: true }) }} >
                    {this.props.children}
                </div>
                {selectModalEle}
            </div>
        )
    }
}

class SelectDataSourceModal extends React.Component<{
    dataSourcesConfs: Ndesign.DataConf[],
    title?: string
    dataSourceType?: Array<any>
    value: Ndesign.PropsVarData,
    onSelect: (value: typings.SlectValueType) => void,
    visible: boolean,
    handleCancel: () => void
    isStopArray: boolean
}, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    componentWillMount() {
        let dataSourcesConfs = this.props.dataSourcesConfs;
        if (dataSourcesConfs.length > 0) {
            let valueConf = (this.props.value ? this.props.value.colls[0].value : null) as Ndesign.PropsVarValueType_conf;
            let dataSourceId = valueConf ? valueConf.conf.dataSourceId : dataSourcesConfs[0].dataSourceId;
            let dataConfs = dataSourcesConfs.filter(dconf => dconf.dataSourceId == dataSourceId);

            this.setState({
                // selectDataSourceId: dataSourcesConfs[0].dataSourceId,
                // jsonTreeData: this.getMapJson(toJS(dataSourcesConfs[0])),
                selectDataSourceId: dataSourceId,
                selectedField: valueConf ? valueConf.key : '',
                jsonTreeData: this.getMapJson(toJS(valueConf ? dataConfs[0] : dataSourcesConfs[0]))
            })
        }
    }
    getMapJson = (dataSourcesConf: Ndesign.DataConf) => {
        let result = {};
        if (!dataSourcesConf.dataSourceType) {
            dataSourcesConf.dataSourceFieldsMap.forEach((item) => {
                result[item.name] = _.get(dataSourcesConf.dataSourceJson, item.map)
            })
            /** 如果接口数据源增加 是否loading字段 ， */
            result['isLoading'] = false
            result['errorInfo'] = {
                no: 0,
                msg: '错误信息'
            }

            /** 是否翻页模式 */
            if (dataSourcesConf.isPageMode) {
                // result['hasMore'] = false
                result['page'] = 0
            }
        } else {
            result = dataSourcesConf.dataSourceJson
        }

        return {
            [dataSourcesConf.dataSourceId]: result
        }
    }
    handleOk = () => {
        this.props.onSelect({
            key: this.state.selectedField || '',
            dataConf: _.find(this.props.dataSourcesConfs, item => item.dataSourceId === this.state.selectDataSourceId)
        })
    }
    handleSelectDataSource = (value) => {
        let dataSourcesConf = _.find(this.props.dataSourcesConfs, item => item.dataSourceId === value)
        this.setState({
            selectDataSourceId: dataSourcesConf.dataSourceId,
            jsonTreeData: this.getMapJson(toJS(dataSourcesConf)),
            selectedField: ''
        })
    }
    handleSelectJsonTree = (value: string) => {
        this.setState({
            selectedField: value
        })
    }
    getSuppuestSource = () => {
        let result = [];
        let dataSourcesConf = this.state.selectDataSourceId && _.find(this.props.dataSourcesConfs, item => item.dataSourceId === this.state.selectDataSourceId) || {} as Ndesign.DataConf
        this.props.dataSourceType.map((sourceType, idx) => {
            let activeClass = (dataSourcesConf.dataSourceType || 0) === sourceType ? 'sourceTitle__item_active' : ''
            switch (sourceType) {
                case 0:
                    result.push(<div className={`sourceTitle__item ${activeClass} api`} key={idx}>接口</div>);
                    break;
                case 1:
                    result.push(<div className={`sourceTitle__item ${activeClass} gbData`} key={idx}>全局状态</div>);
                    break;
                case 2:
                    result.push(<div className={`sourceTitle__item ${activeClass} comSource`} key={idx}>组件</div>);
                    break;
                case 3:
                    result.push(<div className={`sourceTitle__item ${activeClass} inSource`} key={idx}>内部</div>);
                    break;
                default:
                    result.push(<div className={`sourceTitle__item ${activeClass} other`} key={idx}>其它</div>);
                    break;
            }
        })
        return result;
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 24 },
            wrapperCol: { span: 24 },
        };
        let dataSourceTags = [
            <Tag color="blue">接</Tag>,
            <Tag color="green">全</Tag>,
            <Tag color="purple">组</Tag>,
            <Tag color="orange">内</Tag>
        ]
        let dataSourcesConfs = this.props.dataSourcesConfs

        return (
            <div onClick={() => { this.setState({ visible: true }) }} className="_namespace">
                {this.props.children}
                <Modal
                    title={this.props.title || '数据源字段选择'}
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.props.handleCancel}
                    wrapClassName="_namespace"
                >
                    <Row>
                        <Form.Item label={
                            <div className="sourceTitle">
                                <div>数据源：</div>
                                {this.getSuppuestSource()}
                            </div>
                        } {...formItemLayout}>
                            <Select
                                showSearch
                                style={{ width: "80%" }}
                                placeholder="选择一个数据源"
                                optionFilterProp="children"
                                value={this.state.selectDataSourceId}
                                onChange={this.handleSelectDataSource}
                                filterOption={(input, option) => {
                                    return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }}
                            >
                                {
                                    dataSourcesConfs.map((item, idx) => {
                                        return (
                                            <Option value={item.dataSourceId} key={idx}>
                                                {item.dataSourceType > -1 ? dataSourceTags[item.dataSourceType]
                                                    : <Tag color="cyan">其</Tag>}
                                                {item.dataSourceName + `(${item.dataSourceId})`}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Row>
                    <JsonTreeSelect
                        isStopArray={this.props.isStopArray}
                        selectedField={this.state.selectedField}
                        onSelectJsonTree={this.handleSelectJsonTree}
                        jsonTreeData={this.state.jsonTreeData} />
                </Modal>
            </div>
        )
    }
}
