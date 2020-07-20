import { ApplicationStore, ViewportStore, EditorEventStore, DataStore } from '../../../store'
import { ApplicationAction, ViewportAction, EditorEventAction } from '../../../action'

export interface PropsDefine {
    /**
     * store map 中的唯一 id
     */
    mapKey?: string

    ApplicationStore?: ApplicationStore
    ViewportStore?: ViewportStore
    EditorEventStore?: EditorEventStore
    ApplicationAction?: ApplicationAction
    ViewportAction?: ViewportAction
    EditorEventAction?: EditorEventAction
    DataStore?: DataStore

    /**
     * 可能是任何组件希望传递的数据
     */
    flowComData?: any
}
