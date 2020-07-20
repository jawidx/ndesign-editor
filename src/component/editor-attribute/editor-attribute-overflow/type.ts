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
     * 是否展开成 X Y
     */
    expand?: boolean
}
