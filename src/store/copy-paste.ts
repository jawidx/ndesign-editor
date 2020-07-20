import { observable } from 'mobx'

export default class CopyPasteStore {
    static classFnName = 'CopyPasteStore'

    // 存储粘贴板的存储信息
    @observable copyComponent?: Ndesign.ViewportComponentFullInfo = null

    @observable copyStyle?: {
        comKey: string
        stylePoly: Ndesign.ComponentStylePoly
    } = null
}
