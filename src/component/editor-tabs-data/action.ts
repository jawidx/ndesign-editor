import { observable, extendObservable } from 'mobx'
import { inject } from '../../../../util/inject-instance'
import { action } from '../../../../util/trans-mobx';
import { ViewportStore, } from '../../store'
import * as _ from 'lodash'

export default class EditorTabDataAction {
    static classFnName = 'EditorTabDataAction'
    @inject('ViewportStore') private viewport: ViewportStore

    @observable observeClass = true

    @action('增加修改显示条件') updateCondition(mapKey: string, visibleCondition: Ndesign.ConditionAtom, index: number = -1) {
        const componentInfo = this.viewport.components.get(mapKey)
        const eventData: Ndesign.ConditionAtom = visibleCondition

        componentInfo.props._ndsVisible ? '' : extendObservable(componentInfo.props, { _ndsVisible: [] })
        if (index !== -1) {
            if (eventData) {
                componentInfo.props._ndsVisible.splice(index, 1, eventData)
            } else {
                componentInfo.props._ndsVisible.splice(index, 1)
            }
        } else {
            componentInfo.props._ndsVisible.push(eventData)
        }
    }

    @action('更改组件循环能力数据') updateCollection(mapKey: string, value) {
        const componentInfo = this.viewport.components.get(mapKey)
        extendObservable(componentInfo.props, { _ndsCollectDatas: value })
    }

    @action('透传组件props') updatePropsIn(mapKey: string, value?: string, delIndex?: number) {
        const componentInfo = this.viewport.components.get(mapKey)
        let propsIn = componentInfo.props._ndsPropsIn || []
        value && propsIn.push(value)
        typeof delIndex !== 'undefined' && propsIn.splice(delIndex, 1)
        extendObservable(componentInfo.props, { _ndsPropsIn: propsIn })
    }

    @action('增加修改组件数据源') updateDataConf(mapKey: string, dataConf: Ndesign.DataConf, index: number = -1) {
        const componentInfo = this.viewport.components.get(mapKey)
        const confData: Ndesign.DataConf = dataConf

        componentInfo.props.dataConfs ? '' : extendObservable(componentInfo.props, { dataConfs: [] })

        if (index !== -1) {
            if (confData) {
                componentInfo.props.dataConfs.splice(index, 1, confData)
            } else {
                componentInfo.props.dataConfs.splice(index, 1)
            }
        } else {
            componentInfo.props.dataConfs.push(confData)
        }
    }
}