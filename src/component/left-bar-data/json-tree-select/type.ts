export interface PropsDefine {
    jsonTreeData: Object
    selectedField?: string
    onSelectJsonTree: (value: string) => void
    // 是否只到数组级别
    isStopArray?: boolean
}

export interface StateDefine {
    selectedJsonValue: string
    expandedKeys?: any
    searchValue?: string
    autoExpandParent?: boolean
    fieldEditing?: boolean
}

export class State implements StateDefine {
    selectedJsonValue = ''
    expandedKeys = []
}