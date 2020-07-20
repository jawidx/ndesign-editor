import { ApplicationAction, ViewportAction } from '../../../action'
import { ViewportStore } from '../../../store'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ViewportAction?: ViewportAction
    ApplicationAction?: ApplicationAction

    index?: number
    editInfo?: Ndesign.ComponentPropsEdit
}