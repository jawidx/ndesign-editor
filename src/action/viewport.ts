import { observable, extendObservable, isObservable, observe, runInAction, toJS } from 'mobx'
import { inject } from '../../../util/inject-instance'
import { action } from '../../../util/trans-mobx';
import ApplicationAction from './application'
import EditorEventAction from './editor-event'
import ComponentsListAction from './component-list'
import DataAction from './data'
import AssetAction from './asset'
import { ViewportStore, EditorEventStore } from '../store'
import * as Sortable from 'sortablejs'
import * as _ from 'lodash'
import * as LZString from 'lz-string'
import { hasClass, removeClass } from '../util/dom'

export default class ViewportAction {
    static classFnName = 'ViewportAction'
    @inject('ViewportStore') private viewport: ViewportStore
    @inject('ApplicationAction') private applicationAction: ApplicationAction
    @inject('EditorEventAction') private eventAction: EditorEventAction
    @inject('EditorEventStore') private event: EditorEventStore
    @inject('DataAction') private dataAction: DataAction
    @inject('AssetAction') private AssetAction: AssetAction
    @inject('ComponentsListAction') private ComponentsListAction: ComponentsListAction

    @observable observableClass = true

    onInit() {
        // 监听当前编辑组件变化
        observe(this.viewport, 'currComKey', ({ newValue, oldValue }) => {
            // 过 150 毫秒再显示编辑区域，不让动画被阻塞
            setTimeout(() => {
                this.viewport.showEditComponents = !!newValue
            }, 150)

            const selectClass = 'nd-selected'

            // 把上一个元素选中样式置空
            if (oldValue !== null) {
                const prevEditDom = this.viewport.comDomInstances.get(oldValue)
                if (hasClass(prevEditDom, selectClass)) {
                    removeClass(prevEditDom, selectClass)
                }
            }

            // 设置新元素为选中样式
            if (newValue !== null) {
                const nextEditDom = this.viewport.comDomInstances.get(newValue)
                nextEditDom.className += ` ${selectClass}`
            }
        })
    }

    @action('设置根节点唯一标识')
    setRootKey(key: string) {
        this.viewport.rootKey = key
    }

    @action('设置视图区域 dom 节点')
    setViewportDom(dom: HTMLElement) {
        this.viewport.viewportDom = dom
    }

    @action('在视图中设置组件信息')
    setComponent(key: string, componentInfo: Ndesign.ViewportComponentInfo) {
        let componentInfoClone = _.cloneDeep(toJS(componentInfo))
        componentInfoClone.props = this.completionEditProps(componentInfoClone.props)

        if (componentInfoClone.parentKey === null) {
            // 最外层必须相对定位，不能修改
            componentInfoClone.props.ndsEdit.style = componentInfoClone.props.ndsEdit.style.filter((edit: any) => {
                // todo add rootComponent不准修的改属性
                return edit.editor !== 'position' && edit !== '定位'
            })
        }

        const middlewares = this.viewport.middleware.get('setComponent')
        if (middlewares) {
            middlewares.forEach(middleware => {
                componentInfoClone = middleware(key, componentInfoClone)
            })
        }

        if (!isObservable(componentInfoClone.props)) {
            componentInfoClone.props = extendObservable({}, componentInfoClone.props)
        }

        this.viewport.components.set(key, componentInfoClone)
    }

    @action('新增全新的组件')
    addNewComponent(newInfo: Ndesign.CurrentDragComponentInfoNewInfo, parentKey: string, index: number) {
        const key = this.createUniqueKey()
        const ComponentClass = this.applicationAction.getComponentClassByKey(newInfo.key)
        const newProps = _.assign({}, _.cloneDeep(ComponentClass.defaultProps), newInfo.defaultProps || {})
        let component: Ndesign.ViewportComponentInfo = {
            props: newProps,
            parentKey: parentKey
        }
        if (ComponentClass.defaultProps.canDragIn) {
            component.layoutChilds = []
        }
        this.viewport.components.get(parentKey).layoutChilds.splice(index, 0, key)
        this.setComponent(key, component)

        // 自动为tab添加子元素
        if (newInfo.key == 'nd-tab') {
            this.addNewComponent({
                key: 'nd-layout',
                // defaultProps: {}
            }, key, 0);
            this.addNewComponent({
                key: 'nd-layout',
                // defaultProps: {}
            }, key, 1);
        }

        return key
    }

    @action('移动组件')
    moveComponent(sourceMapUKey: string, sourceIndex: number, targetMapUKey: string, targetIndex: number) {
        const sourceComponentInfo = this.viewport.components.get(sourceMapUKey)
        const targetComponentInfo = this.viewport.components.get(targetMapUKey)

        // 移动元素
        const moveComponentMapUKey = sourceComponentInfo.layoutChilds[sourceIndex]
        const moveComponentInfo = this.viewport.components.get(moveComponentMapUKey)
        moveComponentInfo.parentKey = targetMapUKey
        targetComponentInfo.layoutChilds.splice(targetIndex, 0, moveComponentMapUKey)
        // 拖拽源删除元素
        sourceComponentInfo.layoutChilds.splice(sourceIndex, 1)
    }

    @action('组件在同父级移动位置')
    horizontalMoveComponent(parentKey: string, beforeIndex: number, afterIndex: number) {
        const layoutChilds = this.viewport.components.get(parentKey).layoutChilds
        if (beforeIndex < afterIndex) {
            // 从左到右
            runInAction(() => {
                for (let index = beforeIndex; index < afterIndex; index++) {
                    const beforeUniqueKey = layoutChilds[index]
                    const afterUniqueKey = layoutChilds[index + 1]
                    layoutChilds[index] = afterUniqueKey
                    layoutChilds[index + 1] = beforeUniqueKey
                }
            })
        } else {
            // 从右到左
            runInAction(() => {
                for (let index = beforeIndex; index > afterIndex; index--) {
                    const beforeUniqueKey = layoutChilds[index]
                    const afterUniqueKey = layoutChilds[index - 1]
                    layoutChilds[index] = afterUniqueKey
                    layoutChilds[index - 1] = beforeUniqueKey
                }
            })
        }
    }

    /**
     * 添加一个复杂组件
     * 这个方法会在恢复元素时使用, 保证所有 key 都原封不动的恢复
     * 所以如果是新模版组件，请先调用 createCopyComponentWithNewUniqueKey 生成新的一套 uniqueKey
     */
    @action('新增模板组件')
    addComboComponent(parentKey: string, componentFullInfo: Ndesign.ViewportComponentFullInfo, index: number) {
        // 先把子元素添加回来
        Object.keys(componentFullInfo.childs).forEach(childKey => {
            const expendComponentInfo = this.applicationAction.expendComponent(JSON.parse(JSON.stringify(componentFullInfo.childs[childKey])))

            let component: Ndesign.ViewportComponentInfo = {
                props: expendComponentInfo.props,
                parentKey: expendComponentInfo.parentKey
            }

            if (expendComponentInfo.props.canDragIn) {
                // 如果是个布局元素, 将其 layoutChilds 设置为数组
                component.layoutChilds = expendComponentInfo.layoutChilds || []
            }
            this.setComponent(childKey, component)
        })

        // 再把这个组件添加回来
        const expendRootComponentInfo = this.applicationAction.expendComponent(JSON.parse(JSON.stringify(componentFullInfo.componentInfo)))
        let rootComponent: Ndesign.ViewportComponentInfo = {
            props: expendRootComponentInfo.props,
            parentKey: expendRootComponentInfo.parentKey
        }

        if (expendRootComponentInfo.props.canDragIn) {
            // 如果是个布局元素, 将其 layoutChilds 设置为数组
            rootComponent.layoutChilds = expendRootComponentInfo.layoutChilds || []
        }

        this.setComponent(componentFullInfo.mapKey, rootComponent)

        // 加到父级上
        this.addToParent(componentFullInfo.mapKey, parentKey, index)
    }

    @action('新增模板组件，源码是压缩后的')
    addComboComponentBySource(parentKey: string, componentFullInfoSource: string, index: number) {
        const componentFullInfo: Ndesign.ViewportComponentFullInfo = JSON.parse(LZString.decompressFromBase64(componentFullInfoSource))

        // 生成新的 uniqueKey，并将最顶层组件与父级 uniqueKey 绑定
        let componentFullInfoCopy = this.createCopyComponent(componentFullInfo, parentKey)

        // // 由于模板信息是瘦身后的，补全信息
        // componentFullInfoCopy.componentInfo = this.applicationAction.expendComponent(componentFullInfoCopy.componentInfo)
        // Object.keys(componentFullInfoCopy.childs).forEach(childKey => {
        //     componentFullInfoCopy.childs[childKey] = this.applicationAction.expendComponent(componentFullInfoCopy.childs[childKey])
        // })

        this.addComboComponent(parentKey, componentFullInfoCopy, index)
    }

    @action('移除组件')
    removeComponent(key: string) {
        const removeComInfo = this.viewport.components.get(key)
        if (removeComInfo.parentKey === null) {
            throw '不能删除根节点'
        }

        runInAction(() => {
            // 删除这个组件的子组件
            this.getAllChildsByKey(key).forEach(childKey => {
                this.viewport.components.delete(childKey)
            })
            // 从父组件的孩子节点列表中移除
            const parentComInfo = this.viewport.components.get(removeComInfo.parentKey)
            parentComInfo.layoutChilds = parentComInfo.layoutChilds.filter(childKey => childKey !== key)
            // 从 store 中删除
            this.viewport.components.delete(key)

            // 如果要删除的组件就是正在编辑的组件，退出编辑状态
            if (key === this.viewport.currComKey) {
                this.setCurrentEditCptKey(null)
            }
            // 如果要删除的组件就是正在 hover 的组件，退出编辑状态
            if (key === this.viewport.currHoverComKey) {
                this.setCurrentHoverCptKey(null)
            }
        })
    }

    @action('设置当前 hover 元素的 mapKey')
    setCurrentHoverCptKey(mapKey: string) {
        this.viewport.currHoverComKey = mapKey
    }

    @action('设置当前 edit 元素的 mapKey')
    setCurrentEditCptKey(mapKey: string) {
        // 如果和当前正在编辑元素相同，不做操作
        if (this.viewport.currComKey !== mapKey) {
            this.viewport.currComKey = mapKey
        }
    }

    @action('生成唯一 key')
    createUniqueKey() {
        return _.uniqueId('nd-com-' + new Date().getTime() + '-')
    }

    @action('设置视图 dom 实例')
    setDomInstance(mapKey: string, dom: HTMLElement) {
        this.viewport.comDomInstances.set(mapKey, dom)
    }

    @action('移除一个视图 dom 实例')
    removeDomInstance(mapKey: string) {
        this.viewport.comDomInstances.delete(mapKey)
    }

    @action('开始拖拽')
    startDrag(dragInfo: Ndesign.CurrentDragComponentInfo) {
        this.viewport.currDragComInfo = dragInfo;
    }

    @action('结束拖拽')
    endDrag() {
        this.viewport.currDragComInfo = null
    }

    @action('从视图中移动到新父级时，设置拖拽目标（父级）的信息')
    setDragTargetInfo(mapKey: string, index: number) {
        this.viewport.currDragComInfo.viewportInfo.targetKey = mapKey
        this.viewport.currDragComInfo.viewportInfo.targetIndex = index
    }

    @action('设置布局元素是否高亮')
    setLayoutComponentActive(active: boolean) {
        this.viewport.isLayoutComActive = active
    }

    @action('修改当前编辑组件的属性')
    updateCurrComProps(field: string, value: any) {
        this.updateComponentProps(this.viewport.currComKey, field, value)
    }

    @action('修改指定组件属性')
    updateComponentProps(mapKey: string, field: string, value: any) {
        value = (typeof value == 'number' && isNaN(value)) ? null : value;
        const componentInfo = this.viewport.components.get(mapKey)
        _.set(componentInfo.props, field, value)
        this.eventAction.emit(this.event.componentPropsUpdate, { uniqueKey: mapKey, field, value })
    }

    @action('重置属性')
    resetProps(mapKey: string) {
        const componentInfo = this.viewport.components.get(mapKey)
        const ComponentClass = this.applicationAction.getComponentClassByKey(componentInfo.props.key)
        componentInfo.props = _.cloneDeep(toJS(ComponentClass.defaultProps)) as Ndesign.ComponentProps
        this.completionEditProps(componentInfo.props)
        componentInfo.props = extendObservable({}, componentInfo.props) as Ndesign.ComponentProps
        this.eventAction.emit(this.event.componentPropsUpdate, { uniqueKey: mapKey, field: 'all', value: componentInfo.props })
    }

    @action('清空当前状态')
    clean() {
        runInAction(() => {
            this.viewport.currComKey = null
            this.viewport.currHoverComKey = null
            this.viewport.currDragComInfo = null
            this.viewport.showEditComponents = false
        })
    }

    /**
     * 需要保证这个组件的信息已经是完备的
     * 1. 存在于 this.components 中
     * 2. 如果是布局组件, 所有子元素也都存在于 this.components 中
     */
    @action('添加一个已存在的 component 到它的父级')
    addToParent(key: string, parentKey: string, index: number) {
        // 修改那个元素的父级
        this.viewport.components.get(key).parentKey = parentKey
        // 在父级中插入子元素
        this.viewport.components.get(parentKey).layoutChilds.splice(index, 0, key)
    }

    /**
     * 补全编辑状态的配置 会修改原对象
     */
    completionEditProps(comProps: Ndesign.ComponentProps) {
        comProps.eventData = comProps.eventData || [];
        comProps._ndsPropsIn = comProps._ndsPropsIn || [];

        const middlewares = this.viewport.middleware.get('completionEditProps')
        if (middlewares) {
            middlewares.forEach(middleware => {
                comProps = middleware(comProps)
            })
        }

        // 组件多种样式功能
        comProps.stylePoly = comProps.stylePoly || {
            defaultIdx: 0,
            previewIdx: 0,
            polys: [{ condition: [], style: comProps.style }]
        }
        Object.defineProperty(comProps, 'style', {
            get() {
                return this.stylePoly.polys[this.stylePoly.previewIdx || 0].style
            }
        })

        return comProps
    }

    /**
     * 注册子元素内部拖动
     * 指的是当前元素与视图元素一一对应，拖拽相当于视图元素的拖拽，可以实现例如 treePlugin
     */
    registerInnerDrag(mapKey: string, dragParentElement: HTMLElement, groupName = 'nd-can-drag-in', sortableParam: any = {}) {
        const componentInfo = this.viewport.components.get(mapKey)

        return Sortable.create(dragParentElement, Object.assign({
            animation: 150,
            // 放在一个组里,可以跨组拖拽
            group: {
                name: groupName,
                pull: true,
                put: true
            },
            onMove: (event: any) => {
            },
            onStart: (event: any) => {
                this.startDrag({
                    type: 'viewport',
                    dragStartParentElement: dragParentElement,
                    dragStartIndex: event.oldIndex as number,
                    viewportInfo: {
                        mapKey: componentInfo.layoutChilds[event.oldIndex as number]
                    }
                })
            },
            onEnd: (event: any) => {
                this.endDrag()

                // 在 viewport 中元素拖拽完毕后, 为了防止 outer-move-box 在原来位置留下残影, 先隐藏掉
                this.setCurrentHoverCptKey(null)
            },
            onAdd: (event: any) => {
                switch (this.viewport.currDragComInfo.type) {
                    case 'new':
                        // 是新拖进来的, 不用管, 因为工具栏会把它收回去
                        // 为什么不删掉? 因为这个元素不论是不是 clone, 都被移过来了, 不还回去 react 在更新 dom 时会无法找到
                        this.addNewComponent(this.viewport.currDragComInfo.newInfo, mapKey, event.newIndex as number)
                        break
                    case 'viewport':
                        // 这里只还原 dom，和记录拖拽源信息，不会修改 components 数据，跨层级移动在 remove 回调中修改
                        // 是从视图区域另一个元素移过来，而且是新增的,而不是同一个父级改变排序
                        // 把这个元素还给之前拖拽的父级
                        if (this.viewport.currDragComInfo.dragStartParentElement.childNodes.length === 0) {
                            // 之前只有一个元素
                            this.viewport.currDragComInfo.dragStartParentElement.appendChild(event.item)
                        } else if (this.viewport.currDragComInfo.dragStartParentElement.childNodes.length === this.viewport.currDragComInfo.dragStartIndex) {
                            // 是上一次位置是最后一个, 而且父元素有多个元素
                            this.viewport.currDragComInfo.dragStartParentElement.appendChild(event.item)
                        } else {
                            // 不是最后一个, 而且有多个元素
                            // 插入到它下一个元素的前一个
                            this.viewport.currDragComInfo.dragStartParentElement.insertBefore(event.item, this.viewport.currDragComInfo.dragStartParentElement.childNodes[this.viewport.currDragComInfo.dragStartIndex])
                        }

                        // 设置新增时拖拽源信息
                        this.setDragTargetInfo(mapKey, event.newIndex as number)
                        break

                    case 'combo':
                        this.addComboComponentBySource(mapKey, this.viewport.currDragComInfo.comboInfo.source, event.newIndex as number)
                        break
                }
            },
            onUpdate: (event: any) => {
                // // 同一个父级下子元素交换父级
                // // 取消 srotable 对 dom 的修改, 让元素回到最初的位置即可复原
                const oldIndex = event.oldIndex as number
                const newIndex = event.newIndex as number
                if (this.viewport.currDragComInfo.dragStartParentElement.childNodes.length === oldIndex + 1) {
                    // 是从最后一个元素开始拖拽的
                    this.viewport.currDragComInfo.dragStartParentElement.appendChild(event.item)
                } else {
                    if (newIndex > oldIndex) {
                        // 如果移到了后面
                        this.viewport.currDragComInfo.dragStartParentElement.insertBefore(event.item, this.viewport.currDragComInfo.dragStartParentElement.childNodes[oldIndex])
                    } else {
                        // 如果移到了前面
                        this.viewport.currDragComInfo.dragStartParentElement.insertBefore(event.item, this.viewport.currDragComInfo.dragStartParentElement.childNodes[oldIndex + 1])
                    }
                }
                this.horizontalMoveComponent(mapKey, event.oldIndex as number, event.newIndex as number)
            },
            onRemove: (event: any) => {
                // onEnd 在其之后执行，会清除拖拽目标的信息
                // 减少了一个子元素，一定是发生在 viewport 区域元素发生跨父级拖拽时
                this.moveComponent(mapKey, this.viewport.currDragComInfo.dragStartIndex, this.viewport.currDragComInfo.viewportInfo.targetKey, this.viewport.currDragComInfo.viewportInfo.targetIndex)

                // 一个元素被跨父级移动，生命周期执行顺序是： 新位置的 didMount -> 原来位置的 willUnmount -> 执行这个方法
                // onEnd 是最后执行，所以不用担心拖拽中间数据被清除
                // 因此在这里修正位置最好
                // 触发一个事件
                this.eventAction.emit(`${this.event.viewportDomUpdate}.${this.viewport.currDragComInfo.viewportInfo.mapKey}`)
            }
        }, sortableParam))
    }

    /**
     * 子元素外部拖动
     * 拖动的元素会拷贝一份在视图中，自身不会减少，可以做拖拽菜单
     * 如果子元素有 data-unique-key 属性，则会创建一个新元素
     * 如果子元素有 data-source 属性，则会创建一个组合
     */
    registerOuterDrag(dragParentElement: HTMLElement, handle?, groupName = 'nd-can-drag-in') {
        // 上次拖拽的位置
        let lastDragStartIndex = -1

        Sortable.create(dragParentElement, {
            animation: 150,
            // 放在一个组里,可以跨组拖拽
            ...handle && { handle },
            group: {
                name: groupName,
                pull: 'clone',
                put: false
            },
            sort: false,
            delay: 0,
            onStart: (event: any) => {
                lastDragStartIndex = event.oldIndex as number

                if (event.item.dataset.source) {
                    this.startDrag({
                        type: 'combo',
                        dragStartParentElement: dragParentElement,
                        dragStartIndex: event.oldIndex as number,
                        comboInfo: {
                            source: event.item.dataset.source
                        }
                    })
                } else if (event.item.dataset.uniqueKey) {
                    this.startDrag({
                        type: 'new',
                        dragStartParentElement: dragParentElement,
                        dragStartIndex: event.oldIndex as number,
                        newInfo: {
                            key: event.item.dataset.uniqueKey,
                            defaultProps: JSON.parse(event.item.dataset.defaultProps || '{}')
                        }
                    })
                }
            },
            onEnd: (event: any) => {
                this.endDrag()
                // 因为是 clone 方式, 拖拽成功的话元素会重复, 没成功拖拽会被添加到末尾
                // 所以先移除 clone 的元素（吐槽下, 拖走的才是真的, 留下的才是 clone 的）
                // 有 parentNode, 说明拖拽完毕还是没有被清除, 说明被拖走了, 因为如果没真正拖动成功, clone 元素会被删除
                if (event.clone.parentNode) {
                    // 有 clone, 说明已经真正拖走了
                    dragParentElement.removeChild(event.clone)
                    // 再把真正移过去的弄回来
                    if (lastDragStartIndex === dragParentElement.childNodes.length) {
                        // 如果拖拽的是最后一个
                        dragParentElement.appendChild(event.item)
                    } else {
                        // 拖拽的不是最后一个
                        dragParentElement.insertBefore(event.item, dragParentElement.childNodes[lastDragStartIndex])
                    }
                } else {
                    // 没拖走, 只是晃了一下, 不用管了
                }
            }
        })
    }

    /**
     * 获取某个组件全部子元素 mapKey 数组
     */
    getAllChildsByKey(mapKey: string) {
        const componentInfo = this.viewport.components.get(mapKey)
        let childKeys = componentInfo.layoutChilds || []
        // 找到其子组件
        componentInfo.layoutChilds && componentInfo.layoutChilds.forEach(childKey => {
            const childNestKeys = this.getAllChildsByKey(childKey)
            if (childNestKeys.length > 0) {
                childKeys = childKeys.concat(...childNestKeys)
            }
        })
        return childKeys
    }

    /**
     * 获取当前编辑组件的属性值
     */
    getPropValueByEditInfo(editInfo: Ndesign.ComponentPropsEdit, defaultValue = '') {
        if (!editInfo || !this.viewport.currComKey) {
            return defaultValue
        }

        const value = _.get(this.viewport.currComInfo.props, editInfo.field)

        if (value === null || value === undefined || value === editInfo.emptyValue) {
            return defaultValue
        }
        return value
    }

    /**
     * 获取组件信息
     */
    getIncrementComsInfo() {
        // 获取 components 的 map, 但是要把 options 中除了 value 以外字段都干掉
        const cloneComs = JSON.parse(JSON.stringify(this.viewport.components))

        Object.keys(cloneComs).map(key => {
            cloneComs[key] = this.applicationAction.cleanComponent(cloneComs[key])
        })
        return cloneComs
    }

    /**
     * 获取压缩保存所需信息 组件增量，数据源信息
     */
    getZipContentInfo() {
        let components = this.getIncrementComsInfo();
        let dataConfs = this.dataAction.getDataConf()
        let assets = this.AssetAction.getAssetsStore()
        let comboList = this.ComponentsListAction.getComboStore()
        return {
            content: LZString.compressToBase64(JSON.stringify({ components, dataConfs: dataConfs.dataConfs })),
            extraInfo: LZString.compressToBase64(JSON.stringify({ extraDataConfs: dataConfs.extraDataConfs, assets, ...comboList && { comboList } })),
        }
    }

    /**
     * 获取一个已存在组件的完整信息, 返回的是一个新对象, 不用担心引用问题
     */
    getCptFullInfoByKey(mapKey: string): Ndesign.ViewportComponentFullInfo {
        const componentInfo = this.viewport.components.get(mapKey)

        // 子元素信息
        let childs: {
            [mapKey: string]: Ndesign.ViewportComponentInfo
        } = {}

        const mapChilds = (component: Ndesign.ViewportComponentInfo, childs: {
            [mapKey: string]: Ndesign.ViewportComponentInfo
        }) => {
            if (component.props.canDragIn && component.layoutChilds) {
                JSON.parse(JSON.stringify(component.layoutChilds)).forEach((cptKey: string) => {
                    const childInfo = this.viewport.components.get(cptKey)
                    childs[cptKey] = JSON.parse(JSON.stringify(childInfo))
                    mapChilds(childInfo, childs)
                })
            }
        }

        mapChilds(componentInfo, childs)

        return {
            mapKey: mapKey,
            componentInfo: JSON.parse(JSON.stringify(componentInfo)),
            childs: childs
        }
    }

    /**
     * 返回一个新的复制对象, 把所有 mapKey 都换成新的, 但引用关系保持不变
     */
    createCopyComponent(originComponent: Ndesign.ViewportComponentFullInfo, parentKey: string) {
        // 保持父子级引用关系不变, 重新生成 mapKey
        // [oldMapUniqueKey => newMapUniqueKey]
        const uniqueKeyMap = new Map()
        let regStr: any = []
        let originComponentStr = JSON.stringify(originComponent)

        uniqueKeyMap.set(originComponent.mapKey, this.createUniqueKey())
        regStr.push(originComponent.mapKey)
        originComponent.childs && Object.keys(originComponent.childs).forEach(childKey => {
            uniqueKeyMap.set(childKey, this.createUniqueKey())
            regStr.push(childKey)
        })

        // 替换所有涉及的uniqueKey
        originComponentStr = originComponentStr.replace(new RegExp(regStr.join('|'), 'g'), (oriKey) => {
            return uniqueKeyMap.get(oriKey)
        })
        let newCopyComponent = JSON.parse(originComponentStr);
        newCopyComponent.componentInfo.parentKey = parentKey;

        return newCopyComponent
    }

    /**
     * 注册函数处理中间件
     */
    middlewareRegister(viewportFunctionName: string, func: any) {
        if (!this.viewport.middleware.has(viewportFunctionName)) {
            this.viewport.middleware.set(viewportFunctionName, [func])
        } else {
            const funcs = this.viewport.middleware.get(viewportFunctionName)
            this.viewport.middleware.set(viewportFunctionName, funcs.concat(func))
        }
    }
}