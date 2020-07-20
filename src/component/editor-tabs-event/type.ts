import { ViewportStore, EventStore } from '../../store'
import { EventAction } from '../../action'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EventStore?: EventStore
    EventAction?: EventAction
}

export interface StateDefine {
    dataIndex?: number
}

export class State implements StateDefine {
    dataIndex = -1
}