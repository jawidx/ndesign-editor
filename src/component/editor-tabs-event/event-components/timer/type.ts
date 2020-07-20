import { ApplicationStore, ViewportStore } from '../../../../store'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ApplicationStore?: ApplicationStore

    eventData?: Ndesign.EventActionTimer
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}
