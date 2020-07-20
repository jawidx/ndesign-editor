import { observable, observe } from 'mobx'
import { inject, action } from '../../../../util'
import { ViewportStore } from '../../store'
import { hasClass, removeClass } from '../../util/dom'
import TreeStore from './store'

export default class TreeAction {
    static classFnName = 'TreeAction'
    @inject('TreeStore')
    private tree: TreeStore
    @inject('ViewportStore')
    private ViewportStore: ViewportStore
    @observable observeClass = true

    onInit() {
        observe(this.ViewportStore, 'currComKey', ({ oldValue, newValue }) => {
            this.setSelectedStyle({ oldValue, newValue })
        })
    }

    setSelectedStyle({ oldValue, newValue }: { oldValue?, newValue?}) {
        const selectClass = 'tree-selected'

        // 清除已有选中样式
        if (oldValue !== null) {
            const prevEditDom = this.tree.treeDoms.get(oldValue)
            if (prevEditDom && hasClass(prevEditDom, selectClass)) {
                removeClass(prevEditDom, selectClass)
            }
        }

        // 设置新元素为选中样式
        if (newValue !== null) {
            const nextEditDom = this.tree.treeDoms.get(newValue)
            nextEditDom && (nextEditDom.className += ` ${selectClass}`)
        }
    }

    @action('设置树根节点')
    setTreeRootDom(dom: HTMLElement) {
        this.tree.treeRootDom = dom
    }

    @action('新增树 dom')
    addTreeDom(mapKey: string, dom: HTMLElement) {
        this.tree.treeDoms.set(mapKey, dom)
    }

    @action('移除树 dom')
    removeTreeDom(mapKey: string) {
        this.tree.treeDoms.delete(mapKey)
    }
}