
import { ViewportStore, EditorEventStore } from '../../../store'
import { ViewportAction, EditorEventAction } from '../../../action'
import TreeAction from '../action'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EditorEventStore?: EditorEventStore
    TreeAction?: TreeAction
    ViewportAction?: ViewportAction
    EditorEventAction?: EditorEventAction

    /**
     * 对应的组件信息 key
     */
    mapKey?: string
}
