import { DataStore } from '../../../store'

export interface PropsDefine {
    DataStore?: DataStore
}

export interface EditorModalType {
    show?: boolean
    onCancel?: () => void
    DataStore?: DataStore
    onOk?: (dataConf: Ndesign.DataConf) => void
    dataConf?: Ndesign.DataConf
}

export interface StateDefine {
    fieldsKeys: Array<any>,
    visible?: boolean,
    selectJsonTreeShow?: boolean,
    selectJsonFieldMapKey?: string
}
