export interface PropsDefined {
    onChange?: (value: Ndesign.PropsVarData) => void
    defaultValue?: Ndesign.PropsVarData
    value?: Ndesign.PropsVarData
    isStopArray?: boolean
    // 数据源类型
    dataSourceType?: Ndesign.dataSourceType | Ndesign.dataSourceType[]
}

export interface StateDefined {
    varDatas: Ndesign.PropsVarDataType_coll
}
