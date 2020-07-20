import { ViewportStore } from '../../../store'
import Action from '../action'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EditorTabDataAction?: Action
}

export interface StateDefine {
    visible?: boolean
    currentUpdateIndex?: number
}

export class State implements StateDefine {
    currentUpdateIndex = -1
}