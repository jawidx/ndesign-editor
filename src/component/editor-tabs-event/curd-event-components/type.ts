import { ViewportStore, EventStore } from '../../../store'
import { EventAction } from '../../../action'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EventStore?: EventStore
    EventAction?: EventAction

    dataIndex?: number
}

export class Props implements PropsDefine {
    dataIndex = -1
}
