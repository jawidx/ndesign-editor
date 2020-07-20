import { ApplicationStore, VersionStore } from '../../store'
import { VersionAction } from '../../action'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    VersionStore?: VersionStore
    VersionAction?: VersionAction
}

export interface StateDefine {
    selectedVersion?: string
    desc?: string
}
