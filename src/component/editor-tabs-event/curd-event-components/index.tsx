import * as React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import { Select, Form, Modal } from 'antd'
import EventActionComponent from '../event-components'
import { EventType, ScrollType, MouseEventType } from '../type-components'
import * as typings from './type'
import './index.scss'
const Option = Select.Option
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
}

interface ModelFormType {
    visible?: boolean
    onHandleCancel: () => void
    onHandleOk: (values) => void
}

type CompPropsDefine = { form: any } & ModelFormType & typings.PropsDefine

@inject('ViewportStore', 'EventStore', 'EventAction')
@observer
class ModelForm extends React.Component<CompPropsDefine, any>{
    eventDataInfo: Ndesign.EventData = null
    componentWillReceiveProps(nextProps: CompPropsDefine) {
        if (nextProps.visible && !this.props.visible) {
            if (nextProps.dataIndex > -1) {
                const eventDataInfo = this.props.ViewportStore.currComInfo.props.eventData[nextProps.dataIndex]
                this.eventDataInfo = eventDataInfo
            } else {
                this.eventDataInfo = {} as Ndesign.EventData
            }
        }
    }
    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onHandleOk(values)
                _.forOwn(values, (value, key) => {
                    values[key] = toJS(value)
                })
                this.props.EventAction.updateCurdEvent(
                    this.props.ViewportStore.currComKey,
                    this.props.dataIndex,
                    this.getHandlers(),
                    values.eventActions
                )
            }
        });
    }
    getHandlers = () => {
        let { form: { getFieldValue } } = this.props;
        let name = getFieldValue('eventHandlers');
        let customIdx = Number(name);
        let comEvent = this.props.ViewportStore.currComInfo.props.event;

        customIdx = _.isNaN(customIdx) ? -1 : customIdx;

        name = customIdx > -1 ? comEvent && comEvent.triggers && comEvent.triggers[customIdx].type : name;
        return {
            name: name,
            customIdx: customIdx,
            data: getFieldValue('eventHandlersData')
        }
    }
    // 获取事件句柄
    getRenderEventHandlers = () => {
        let { form: { getFieldDecorator } } = this.props;
        const typeOptions = [].concat(this.props.EventStore.eventTriggerKeys);
        let { handlers = {} as Ndesign.EventHandlers } = this.eventDataInfo;

        let currCompProps = this.props.ViewportStore.currComInfo.props;
        (currCompProps.event && currCompProps.event.triggers)
            && currCompProps.event.triggers.forEach((trigger, index) => {
                typeOptions.push({
                    key: index.toString(),
                    value: trigger.name
                })
            })

        let selectValue = handlers.customIdx > -1 ? handlers.customIdx + '' : handlers.name
        return <FormItem
            label="触发句柄" {...formItemLayout}>
            {
                getFieldDecorator('eventHandlers', {
                    rules: [{ required: true, message: '必填' }],
                    initialValue: selectValue || 'init'
                })(
                    <Select placeholder="触发句柄">
                        {
                            typeOptions.map((settingData, index) => {
                                return <Option value={settingData.key} key={index}>
                                    {settingData.value}
                                </Option>
                            })
                        }
                    </Select>
                )
            }
        </FormItem>
    }
    // 获取 事件句柄数据编辑器
    getRenderHandlersDataEditor = () => {
        let { form: { getFieldValue, getFieldDecorator } } = this.props;
        let eventHandlers = getFieldValue('eventHandlers')
        let { handlers = {} as Ndesign.EventHandlers } = this.eventDataInfo
        switch (eventHandlers) {
            case 'listen':
                return (
                    <FormItem>
                        {getFieldDecorator('eventHandlersData', { initialValue: handlers.data || '', rules: [{ required: true, message: '必填' }] })(
                            <EventType
                            /* value={getFieldValue('triggerData')} */
                            />
                        )}
                    </FormItem>
                )
                break;
            case 'scroll':
                return (
                    <FormItem>
                        {getFieldDecorator('eventHandlersData', { initialValue: handlers.data || '', rules: [{ required: true, message: '必填' }] })(
                            <ScrollType
                            /* value={getFieldValue('triggerData')} */
                            />
                        )}
                    </FormItem>
                )
                break;
            case 'mouse':
                return (
                    <FormItem>
                        {getFieldDecorator('eventHandlersData', { initialValue: handlers.data || '', rules: [{ required: true, message: '必填' }] })(
                            <MouseEventType
                            /* value={getFieldValue('triggerData')} */
                            />
                        )}
                    </FormItem>
                )
                break;
        }
    }

    render() {
        let { form: { getFieldDecorator, getFieldValue }, visible } = this.props;
        return (
            visible ? <Modal
                title={"添加事件"}
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.onHandleCancel}
                wrapClassName="_namespace"
            >
                <Form onSubmit={this.handleOk}>
                    {this.getRenderEventHandlers()}
                    {this.getRenderHandlersDataEditor()}
                    {
                        getFieldDecorator('eventActions', {
                            initialValue: this.eventDataInfo.eventActions || '',
                            rules: [{ required: true }]
                        })(
                            <EventActionComponent handlers={this.getHandlers()} />
                        )
                    }
                </Form>
            </Modal> : null
        )
    }
}

export default Form.create<ModelFormType & typings.PropsDefine>()(ModelForm)