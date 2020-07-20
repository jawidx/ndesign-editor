import { ViewportAction } from '../../../action'
import { ApplicationStore, ViewportStore } from '../../../store'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ApplicationStore?: ApplicationStore
    ViewportAction?: ViewportAction

    index?: number
    editInfo?: Ndesign.ComponentPropsEdit
}