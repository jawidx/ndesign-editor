import { ViewportAction } from '../../action'
import { ApplicationStore, ViewportStore } from '../../store'
import TreeAction from './action'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ApplicationStore?: ApplicationStore
    ViewportAction?: ViewportAction
    TreeAction?: TreeAction
}
