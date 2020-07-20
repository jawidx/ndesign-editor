import { inject } from '../../../util/inject-instance'
import { action } from '../../../util/trans-mobx';
import * as LZString from 'lz-string'
import { ApplicationStore, ComponentsListStore } from '../store'

export default class ComponentsListAction {
    static classFnName = 'ComponentsListAction'
    @inject('ComponentsListStore') private componentsListStore: ComponentsListStore
    @inject('ApplicationStore') private applicationStore: ApplicationStore

    onInit() {
        this.setDefault()
    }

    @action('设置默认数据源') setDefault() {
        let extraInfo = this.applicationStore.editorProps.extraInfo;
        if (extraInfo) {
            let extraInfoComboList = ((JSON.parse(LZString.decompressFromBase64(extraInfo) || {}) as Ndesign.AppDataExtraInfo)).comboList
            if (extraInfoComboList && extraInfoComboList.length) {
                this.componentsListStore.comboList = extraInfoComboList
            }
        }
    }


    @action('添加一个模板') addCombo(name: string, info: Ndesign.ViewportComponentFullInfo) {
        this.componentsListStore.comboList.push({
            name,
            source: LZString.compressToBase64(JSON.stringify(info))
        })
    }

    @action('移除一个模板') removeCombo(idx: number) {
        this.componentsListStore.comboList.splice(idx, 1)
    }

    @action('获取模板组件store') getComboStore() {
        let comboList = this.componentsListStore.comboList;
        return comboList.length ? comboList : null
    }
}