import { ViewportStore, DataStore } from '../../../store'
import Action from '../action'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EditorTabDataAction?: Action
    DataStore?: DataStore
}
