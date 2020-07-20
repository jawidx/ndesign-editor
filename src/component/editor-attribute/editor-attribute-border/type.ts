import { ViewportAction } from '../../../action'
import { ViewportStore } from '../../../store'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ViewportAction?: ViewportAction

    index?: number
    editInfo?: Ndesign.ComponentPropsEdit
}

export interface StateDefine {
    /**
     * 是否选中了上下左右边框
     */
    selectLeft?: boolean
    selectTop?: boolean
    selectRight?: boolean
    selectBottom?: boolean
    selectAll?: boolean
    // borderColor
    selectRadius?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
}

export class State implements StateDefine {
    selectAll = true
}