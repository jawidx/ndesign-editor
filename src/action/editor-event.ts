import { observable } from 'mobx'
export declare type EventType = number | string | any

/**
 * 事件
 */
export interface Event {
    callback: Function
    context: any
}

export default class EditorEventAction {
    static classFnName = 'EditorEventAction'
    // 所有事件
    private events: Map<EventType, Array<Event>> = new Map()

    @observable observableClass = true

    /**
     * 订阅事件
     */
    public on(eventType: EventType, callback: Function, context?: any) {
        let event: Event = {
            callback,
            context
        }

        if (this.events.get(eventType)) {
            // 存在, push 一个事件监听
            this.events.get(eventType).push(event)
        } else {
            // 不存在, 赋值
            this.events.set(eventType, [event])
        }
    }

    /**
     * 取消订阅
     */
    public off(eventType: EventType, callback: Function) {
        if (!this.events.get(eventType)) {
            return false
        }

        const events = this.events.get(eventType).filter(event => {
            return event.callback !== callback
        })

        this.events.set(eventType, events)

        return true
    }

    /**
     * 广播事件
     */
    public emit(eventType: EventType, context?: any) {
        if (typeof eventType === 'undefined' || !this.events.get(eventType)) {
            return false
        }

        this.events.get(eventType).forEach(event => {
            event.callback(event.context, context)
        })
    }
}