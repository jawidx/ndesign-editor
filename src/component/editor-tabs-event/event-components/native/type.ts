import { ApplicationStore } from '../../../../store'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore

    eventData?: Ndesign.EventActionNative
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}

export interface StateDefine {
    editorType: string
}

export class State implements StateDefine {
    editorType = 'input'
}