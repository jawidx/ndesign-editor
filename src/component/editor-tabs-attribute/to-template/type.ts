import { ApplicationStore, ViewportStore } from '../../../store'
import { ApplicationAction, ViewportAction, ComponentsListAction } from '../../../action'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ViewportStore?: ViewportStore
    ViewportAction?: ViewportAction
    ComponentsListAction?: ComponentsListAction
    ApplicationAction?: ApplicationAction
}

export interface StateDefine {
    show?: boolean
    templateName?: string
}

export class State implements StateDefine {
    show = false
    templateName = '模板1'
}