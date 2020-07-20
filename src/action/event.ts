import { observable } from 'mobx'
import { inject } from '../../../util/inject-instance'
import { action } from '../../../util/trans-mobx';
import { ViewportStore } from '../store'
import * as _ from 'lodash'

export default class EventAction {
    static classFnName = 'EventAction'
    @inject('ViewportStore') private viewport: ViewportStore

    @observable observeClass = true

    @action('删除一个事件') removeEvent(mapKey: string, index: number) {
        const componentInfo = this.viewport.components.get(mapKey)
        componentInfo.props.eventData.splice(index, 1)
    }

    /**
     * 
     * @param key      当前编辑组件唯一KEY
     * @param dataIndex         组件事件数据索引
     * @param triggerKey        触发条件key
     * @param eventActionKey    触发动作key
     * @param eventData         事件数据
     * @param typeData          事件触发条件相关信息
     */
    @action('更新事件')
    updateCurdEvent(
        key: string,
        dataIndex: number = -1,
        handlers: Ndesign.EventHandlers,
        eventActions: Ndesign.eventActionData[]
    ) {
        const componentInfo = this.viewport.components.get(key)
        const eventSource: Ndesign.EventData = {
            handlers,
            eventActions
        }

        if (dataIndex != -1 && _.isNumber(dataIndex)) {
            componentInfo.props.eventData.splice(dataIndex, 1, eventSource)
        } else {
            componentInfo.props.eventData.push(eventSource)
        }
    }

    @action('获取所有 event 事件名列表')
    getEventListName() {
        const eventList: Array<string> = []
        this.viewport.components.forEach(component => {
            component.props.eventData.forEach(eventData => {
                // eventData.handlers.name
                // eventData.eventActions[eventData.]
                if (eventData.event === 'emit') {
                    eventList.push((eventData.eventData as Ndesign.EventActionEvent).emit)
                }
            })
        })
        return eventList
    }
}