import { observable } from 'mobx'

export interface IStore {
    [x: string]: any
}

export default class SettingStore implements IStore {
    static classFnName = 'SettingStore'

    /**
     * 网页适配 pc 还是 mobile
     */
    @observable fitInWeb = 'mobile'
    /**
     * 编辑区域宽度
     */
    @observable vWidth = 1242 / 3
    /**
     * 编辑区域高度
     */
    @observable vHeight = 2208 / 3
}