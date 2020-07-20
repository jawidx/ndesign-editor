import { ViewportStore } from '../../store'
import { inject } from '../../../../util'

export default class TreeStore {
    static classFnName = 'TreeStore'
    @inject('ViewportStore')
    private viewport: ViewportStore

    // 树根节点实例
    treeRootDom: HTMLElement = null

    // 所有树节点实例
    treeDoms = new Map<string, HTMLElement>()

    // 当前 hover 的树 dom 节点
    /* @computed */
    get currentHoverTreeDom() {
        return this.treeDoms.get(this.viewport.currHoverComKey)
    }
    /* @computed */
    get currentEditorTreeDom() {
        return this.treeDoms.get(this.viewport.currComKey)
    }
}