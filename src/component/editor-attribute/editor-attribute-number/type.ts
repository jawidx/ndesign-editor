import { ViewportAction } from '../../../action'
import { ViewportStore } from '../../../store'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ViewportAction?: ViewportAction

    index?: number
    editInfo?: Ndesign.ComponentPropsEdit
}

export interface StateDefine {
    value: number
    unit?: string
}