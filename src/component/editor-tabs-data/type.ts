import { ApplicationStore, ViewportStore } from '../../store'
import Action from './action'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ApplicationStore?: ApplicationStore
    EditorTabDataAction?: Action
}
