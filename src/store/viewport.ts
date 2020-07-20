import { observable } from 'mobx'

export default class ViewportStore {
    static classFnName = 'ViewportStore'
    // 视图区域组件集合
    @observable components = observable.map<Ndesign.ViewportComponentInfo>()
    // 视图区域 dom 集合
    comDomInstances = new Map<string, HTMLElement>()

    // 根节点key
    @observable rootKey: string = null
    // 视图区域 dom 节点
    viewportDom: HTMLElement = null

    // 当前hover元素
    @observable currHoverComKey: string = null
    /* @computed */
    get currHoverComDom() {
        return this.comDomInstances.get(this.currHoverComKey)
    }

    // 当前编辑元素
    @observable currComKey: string = null
    /* @computed */
    get currComDom() {
        return this.comDomInstances.get(this.currComKey)
    }
    /* @computed */
    get currComInfo() {
        return this.components.get(this.currComKey)
    }

    // 当前拖拽元素信息
    @observable currDragComInfo: Ndesign.CurrentDragComponentInfo = null

    // 是否显示编辑组件
    @observable showEditComponents = false
    // 布局元素是否高亮
    @observable isLayoutComActive = true

    // 当前编辑元素的寻找路径
    /* @computed */
    get currComPath() {
        let finderPath: Array<string> = [this.currComKey]

        if (this.currComKey === null) {
            return [] as Array<string>
        }

        let nowComponent = this.components.get(this.currComKey)
        // 如果已经是根元素, 直接返回空数组
        if (!nowComponent || nowComponent.parentKey === null) {
            return [this.rootKey]
        }

        // 直到父级是根元素为止
        while (this.components.get(nowComponent.parentKey).parentKey !== null) {
            finderPath.unshift(nowComponent.parentKey)
            nowComponent = this.components.get(nowComponent.parentKey)
        }

        finderPath.unshift(this.rootKey)
        return finderPath
    }

    // 中间件处理函数
    middleware = new Map<string, Array<any>>()
}