
import * as React from 'react'
import * as _ from 'lodash'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Button, Select, Form, Modal, Row, Col, Icon, Popconfirm } from 'antd'
import JumpUrlEvent from './jump-url'
// import CallEvent from './call/call.component'
import EventEvent from './event'
// import UpdatePropsEvent from './update-props/update-props.component'
import DataSourceEvent from './data-source'
import DataGlobalEvent from './data-global'
import NativeEventCall from './native'
import TiebaTrackEvent from './track'
import TimerEvent from './timer'
import DocTitle from './doc-title'
import { ModalHelp, ModalHelpProps, getUniqueid } from 'ND-Util'
import { MuiltCondition } from '../../common'
import { ApplicationStore, ViewportStore, EventStore } from '../../../store'
import './style.scss'

const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

interface PropsDefined {
    // dataIndex?: number
    handlers?: Ndesign.EventHandlers

    ViewportStore?: ViewportStore
    ApplicationStore?: ApplicationStore
    EventStore?: EventStore

    value?: Ndesign.eventActionData[]

    onChange?: (eventActions: Ndesign.eventActionData[]) => void
    title?: string
}

@ModalHelp
@inject('ViewportStore', 'EventStore', 'ApplicationStore')
@observer
export class EventActionsComponent extends React.Component<PropsDefined & ModalHelpProps & { form: any }, any> {
    componentDidMount() {
        this.props.observeModalClose(() => {
            this.props.removeModalStateData()
        })
    }
    onEventdataEditorChange = (eventData: Ndesign.eventDataAtom) => {
        let { form: { setFieldsValue, getFieldValue } } = this.props;
        setFieldsValue({
            data: eventData
        })
    }

    setImmutableChange = (data, key: string, operate: 'update' | 'add' | 'delete', value?) => {
        let result;
        let keyArr = key.split('.') as any[];
        data = data.slice && data.slice() || data;
        if (data.constructor.name === 'Object') {
            result = _.assign({}, data)
        }
        if (data.constructor.name === 'Array') {
            result = [].concat(data)
        }

        if (keyArr.length > 1) {
            result[keyArr[0]] = this.setImmutableChange(result[keyArr[0]], keyArr.slice(1).join('.'), operate, value)
        } else {
            if (operate === 'delete') {
                if (result.constructor.name === 'Object') {
                    delete result[keyArr[0]]
                }
                if (result.constructor.name === 'Array') {
                    result.splice(keyArr[0], 1)
                }
            } else {
                result[keyArr[0]] = value
            }

        }
        return result
    }

    onOK = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                _.forOwn(values, (value, key) => {
                    values[key] = toJS(value)
                })
                let oriEventDatas = [].concat(this.props.value && this.props.value.slice() || []) as Ndesign.eventActionData[];
                let curidxs = this.props.getModalStateData() as number[];
                let resultEventDatas = [].concat(oriEventDatas) as Ndesign.eventActionData[];

                let customIdx = Number(values.name);
                customIdx = _.isNaN(customIdx) ? -1 : customIdx;
                let comEvent = this.props.ViewportStore.currComInfo.props.event;
                let name = customIdx > -1 ? comEvent && comEvent.effects && comEvent.effects[customIdx].type : values.name;

                let setEventDatas = {
                    name: name,
                    customIdx: customIdx,
                    data: values.data,
                    condition: values.condition,
                    eventActions: values.eventActions,
                    async: values.async,
                    eId: getUniqueid('ndsEvent')
                }

                if (_.isArray(curidxs) && curidxs.length > 0) {
                    resultEventDatas = this.setImmutableChange(toJS(resultEventDatas), curidxs.join('.eventActions.'), 'update', setEventDatas)
                } else {
                    resultEventDatas.push(setEventDatas)
                }
                this.props.onChange(resultEventDatas)

                this.props.closeModal()
            }
        });
    }

    deleteEventActions = (actionIdxs) => {
        let oriEventDatas = [].concat(this.props.value && this.props.value.slice() || []) as Ndesign.eventActionData[];
        let curidxs = actionIdxs as number[];
        this.props.onChange(this.setImmutableChange(toJS([].concat(oriEventDatas)), curidxs.join('.eventActions.'), 'delete'))
    }

    getCurrendEditEventAction = () => {
        let oriEventData = (this.props.value && this.props.value.slice() || []) as Ndesign.eventActionData[];
        let curidxs = this.props.getModalStateData() as number[];
        if (_.isArray(curidxs) && curidxs.length > 0) {
            let _cidxs = [].concat(curidxs);
            return _.get(oriEventData, _cidxs.join('.eventActions.'))
            // return curidxs.reduce((prevalue, cidx) => {
            //     if (prevalue && prevalue.length) {
            //         return prevalue[cidx].eventActions
            //     }
            // }, oriEventData)
        }
        return null

        // return (!_.isArray(curidxs) ? oriEventData[curidx] : null) as Ndesign.eventActionData;
    }

    eventActionNameMap = () => {
        // TODO 直接从store数据就可以了？
        const eventOptions = [].concat(this.props.EventStore.eventActionKeys);
        const currCompInfoProps = this.props.ViewportStore.currComInfo.props;

        (currCompInfoProps.event && currCompInfoProps.event.effects) && currCompInfoProps.event.effects.forEach((effect, index) => {
            eventOptions.push({
                key: index.toString(),
                value: effect.name
            })
        });
        return eventOptions as { key: string, value: string }[]
    }

    // 获取执行动作
    getRenderEventAction = () => {
        let { form: { getFieldDecorator } } = this.props;
        let eventOptions = this.eventActionNameMap();

        let currentData = (this.getCurrendEditEventAction() || {}) as Ndesign.eventActionData
        let selectValue = currentData.customIdx > -1 ? currentData.customIdx + '' : currentData.name;
        return <FormItem
            label="事件动作" {...formItemLayout}>
            <Row>
                <Col span={16}>
                    {getFieldDecorator('name', { initialValue: selectValue || '', rules: [{ required: true, message: '必填' }] })(
                        <Select
                            style={{ width: '100%' }}
                            placeholder="事件动作"
                            onChange={() => {
                                // this.onEventActionChange(null)
                                // this.props.form.setFieldsValue({ 'eventData': null })
                            }}>
                            {
                                eventOptions.map((settingData, index) => {
                                    return <Option value={settingData.key} key={'k-ac-i+'+index}>
                                        {settingData.value}
                                    </Option>
                                })
                            }
                        </Select>
                    )}
                </Col>
                <Col span={7} offset={1}>
                    {getFieldDecorator('async', { initialValue: currentData.async || 0 })(
                        <Select
                            style={{ width: '100%', marginLeft: 5 }}
                            placeholder="">
                            {
                                [
                                    { key: 0, value: '同步(sync)' },
                                    { key: 1, value: '异步(resolve)' },
                                    { key: 2, value: '异步(reject)' },
                                    { key: 3, value: '异步(finally)' },
                                ].map((async, index) => {
                                    return <Option value={async.key} key={'k-ac-sy-'+index}>
                                        <div className="abccc">{async.value}</div>
                                    </Option>
                                })
                            }
                        </Select>
                    )}
                </Col>
            </Row>
        </FormItem>
    }

    /** 获取执行动作事件数据编辑组件 */
    getRenderEventActionEditor = () => {
        let { form: { getFieldValue, getFieldDecorator } } = this.props;
        let eventActionType = getFieldValue('name')
        let currentData = (this.getCurrendEditEventAction() || {}) as Ndesign.eventActionData;
        let eventData = getFieldValue('data') || currentData.data as any;

        if (eventActionType && Number(eventActionType) > -1) {
            eventActionType = this.props.ViewportStore.currComInfo.props.event.effects[Number(eventActionType)].type
        }

        let ActionEditor: React.ReactElement<any>
        switch (eventActionType) {
            case 'jumpUrl':
                ActionEditor = (
                    <JumpUrlEvent
                        eventData={eventData}
                        handleChange={this.onEventdataEditorChange} />
                )
                break;
            // case 'call':
            //     ActionEditor = (
            //         <CallEvent
            //             eventData={eventData}
            //             handleChange={this.onEventdataEditorChange} />
            //     )
            //     break
            case 'emit':
                ActionEditor = (
                    <EventEvent
                        eventData={eventData}
                        handleChange={this.onEventdataEditorChange} />
                )
                break;
            // case 'updateProps':
            //     ActionEditor = (
            //         <UpdatePropsEvent />
            //     )
            //     break
            case 'dataSource':
                ActionEditor = (
                    <DataSourceEvent
                        eventData={eventData}
                        handleChange={this.onEventdataEditorChange} />
                )
                break;
            case 'settingGbData':
                ActionEditor = (
                    <DataGlobalEvent
                        handleChange={this.onEventdataEditorChange}
                        eventData={eventData}
                        triggerKey={getFieldValue('eventTrigger')} />
                )
                break;
            case 'native':
                ActionEditor = (
                    <NativeEventCall
                        handleChange={this.onEventdataEditorChange}
                        eventData={eventData} />
                )
                break;
            case 'track':
                ActionEditor = (
                    <TiebaTrackEvent
                        handleChange={this.onEventdataEditorChange}
                        eventData={eventData} />
                )
                break;
            case 'timer':
                ActionEditor = (
                    <TimerEvent
                        handleChange={this.onEventdataEditorChange}
                        eventData={eventData} />
                )
                break;
            case 'setDocTitle':
                ActionEditor = (
                    <DocTitle
                        handleChange={this.onEventdataEditorChange}
                        eventData={eventData} />
                )
                break;
        }

        return <div>
            {getFieldDecorator('data', {
                initialValue: (eventData) || '',
                rules: [{ required: true, message: '必填' }]
            })}
            {ActionEditor}
        </div>
    }

    renderEventActionList = (ationDatas?: Ndesign.eventActionData[], actionIdxs: number[] = []) => {
        let { value: eventActionDatas = [] as Ndesign.eventActionData[] } = this.props;
        eventActionDatas = ationDatas || eventActionDatas || [];
        let eventActionNameMap = this.eventActionNameMap();
        let evAcDataLen = eventActionDatas.length

        return evAcDataLen > 0 && <div className="eventActionList">
            {/* {actionIdxs.length > 0 && evAcDataLen > 1 &&
                <div className="eventActionList__topVerticalLine"></div>}
            {actionIdxs.length > 0 && evAcDataLen > 1 &&
                <div className="eventActionList__topline"></div>} */}
            <div className="eventActionList__listitem">
                {eventActionDatas.map((action, index) => {
                    let syncClass = ['sync', 'async_resolve', 'async_reject', 'async_finally'][action.async] || 'sync'
                    let showLineShadow = actionIdxs.length > 0 && evAcDataLen > 1
                        && (index === 0 || index === evAcDataLen - 1)

                    return (
                        <div className={`eventActionList__item  ${syncClass}`} key={'k-ev-ac-it-' + index}>
                            {showLineShadow && <div className="topLineShdow"><div className="inner"></div></div>}
                            {actionIdxs.length > 0 && <div className={`eventActionList__itemasync ${syncClass}`}></div>}
                            {actionIdxs.length > 0 && <Icon type="caret-down" className={`eventActionList__itemasyncIcon ${syncClass}`} />}
                            <Popconfirm
                                title='操作此动作'
                                onConfirm={() => {
                                    this.props.storeModalStateData([].concat(actionIdxs).concat([index]))
                                    this.props.openModal()
                                }}
                                onCancel={() => {
                                    this.deleteEventActions([].concat(actionIdxs).concat([index]))
                                }}
                                okText='修改'
                                cancelText="删除">
                                <div className={`eventActionList__iteminfo ${syncClass}`} onClick={() => {

                                }}>
                                    {(eventActionNameMap.find((item) => {
                                        return item.key === (action.customIdx > -1 ? action.customIdx : action.name).toString()
                                    }) || {} as any).value}
                                </div>
                            </Popconfirm>
                            {action.eventActions && action.eventActions.length > 0 &&
                                this.renderEventActionList(action.eventActions, [].concat(actionIdxs).concat([index]))}
                        </div>
                    )
                })}
            </div>
        </div >
    }

    /** 获取事件执行条件 编辑 */
    getRenderActionCondition = () => {
        let { form: { getFieldValue, getFieldDecorator } } = this.props;
        let currentData = (this.getCurrendEditEventAction() || {}) as Ndesign.eventActionData
        return (<div>
            <FormItem
                label="执行条件" {...formItemLayout}>
                {
                    getFieldDecorator('condition', {
                        rules: [],
                        initialValue: currentData.condition || []
                    })(<MuiltCondition />)
                }
            </FormItem>
        </div>)
    }

    getAsyncEventActions = () => {
        let { form: { getFieldValue, getFieldDecorator } } = this.props;
        let currentData = (this.getCurrendEditEventAction() || {}) as Ndesign.eventActionData
        return (
            <FormItem>{
                getFieldDecorator('eventActions', {
                    initialValue: currentData.eventActions || []
                })(
                    <FormEventActionsComponent title="添加事件异步动作" handlers={this.props.handlers} />
                )
            }
            </FormItem>
        )
    }

    render() {
        return <div className="_namespace">
            {this.renderEventActionList()}
            <div className="addNewBtn">
                <Button onClick={() => { this.props.openModal() }}>{this.props.title || '添加事件动作'}</Button>
            </div>
            {this.props.getModalVisible() && <Modal
                title='更新事件执行动作'
                visible={this.props.getModalVisible()}
                onCancel={() => this.props.closeModal()}
                onOk={this.onOK}>
                {this.getRenderEventAction()}
                {this.getRenderEventActionEditor()}
                {this.getRenderActionCondition()}
                {this.getAsyncEventActions()}
            </Modal>}
        </div>
    }
}

const FormEventActionsComponent = Form.create<PropsDefined>()(EventActionsComponent)

export default FormEventActionsComponent