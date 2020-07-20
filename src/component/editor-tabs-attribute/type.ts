import { ApplicationAction, ViewportAction, CopyPasteAction } from '../../action'
import { ViewportStore, CopyPasteStore, EventStore } from '../../store'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EventStore?: EventStore
    ViewportAction?: ViewportAction
    ApplicationAction?: ApplicationAction
    CopyPasteAction?: CopyPasteAction
    CopyPasteStore?: CopyPasteStore
}

export interface StateDefine {
    activeCollapseKey?: string[]
}

export class State implements StateDefine {
    activeCollapseKey = []
}