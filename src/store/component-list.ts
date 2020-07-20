import { observable } from 'mobx'

export default class ComponentsListStore {
    static classFnName = 'ComponentsListStore'

    // 模板列表
    @observable comboList: Array<{
        name: string,
        source: string,
        id?: string
    }> = []
}