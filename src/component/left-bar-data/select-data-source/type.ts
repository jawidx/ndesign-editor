import { ViewportStore, DataStore } from '../../../store'

export interface SlectValueType {
    key: string
    dataConf: Ndesign.DataConf
}
export interface PropsDefine {
    DataStore?: DataStore
    ViewportStore?: ViewportStore

    title?: string
    value: Ndesign.PropsVarData
    onSelect: (value: SlectValueType) => void
    isStopArray?: boolean
    // 数据源类型
    dataSourceType?: Ndesign.dataSourceType | Ndesign.dataSourceType[]
}

export class Props implements PropsDefine {
    value: Ndesign.PropsVarData
    onSelect: (string) => {}
}

export interface StateDefine {
    /**
      * 是否显示
      */
    visible?: boolean
    selectDataSourceId?: string
    jsonTreeData?: Object
    // dataConf?: Ndesign.dataConf
    selectedField?: any
}

export class State implements StateDefine {
    visible = false
}