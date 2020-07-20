import { DataStore } from '../../../store'
import { DataAction } from '../../../action'

export interface PropsDefine {
    DataAction?: DataAction
    DataStore?: DataStore
}

export interface EditorModalType {
    show?: boolean
    onHandleCancel?: () => void
    DataStore?: DataStore
    onHandleOk?: (dataConf: Ndesign.DataConf) => void
    dataConf?: Ndesign.DataConf
}

export interface StateDefine {
    /**
      * 是否显示
      */
    showApiModal?: boolean
    showStateModal?: boolean
    name?: string
    type?: string
    // 当前操作数据源index
    currentEditDataConfIdx?: number
}

export class State implements StateDefine {
    show = false
    name = ''
    type = 'number'
}