import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import * as _ from 'lodash'
import { hasClass, removeClass, addClass } from '../../../util/dom'
import * as libs from '../../../../ndesign-viewer/util/lib'
import * as typings from './type'
import './style.scss'

@inject('ApplicationStore', 'ViewportStore', 'EditorEventStore', 'ApplicationAction', 'EditorEventAction', 'ViewportAction', 'DataStore')
@observer
export default class EditHelper extends React.Component<typings.PropsDefine, any> {
    // 暴露内层组件
    public wrappedInstance: React.ReactInstance

    // 绑定注入数据的自身 class, 递归渲染使用
    static ObserveEditHelper = inject('ApplicationStore', 'ViewportStore', 'EditorEventStore', 'ApplicationAction', 'EditorEventAction', 'ViewportAction', 'DataStore')(observer(EditHelper))

    // 当前组件的 class
    private ComponentClass: React.ComponentClass<Ndesign.ComponentProps>
    // 当前组件信息
    private componentInfo: Ndesign.ViewportComponentInfo
    // 当前组件 dom 对象
    private domInstance: HTMLElement

    // 是否开始拖动
    private startDrag = false
    // 上一次拖动的 clientX clientY
    private lastClientX = null as number
    private lastClientY = null as number

    private sortInstance = null
    private componentCollectInfo: null | 'collectFirstEle' | 'collectLoopEle' | 'collectLoopInEle'

    componentWillMount() {
        this.componentInfo = this.props.ViewportStore.components.get(this.props.mapKey)
        this.ComponentClass = this.props.ApplicationAction.getComponentClassByKey(this.componentInfo.props.key)
    }

    componentDidMount() {
        this.domInstance = ReactDOM.findDOMNode(this.wrappedInstance) as HTMLElement

        // 绑定监听
        this.domInstance.addEventListener('mouseover', this.handleMouseOver)
        this.domInstance.addEventListener('click', this.handleClick)
        // this.domInstance.addEventListener('dblclick', this.doubleclick)

        // 增加统一 class
        this.domInstance.className += ' _namespace'

        this.componentCollectInfo = this.processCollect()

        this.setLayoutClassIfCanDragIn()
        this.setDragableClassIfNeed()

        if (this.componentCollectInfo !== 'collectLoopEle' && this.componentCollectInfo !== 'collectLoopInEle') {
            this.props.EditorEventAction.on(`${this.props.EditorEventStore.viewportDomUpdate}.${this.props.mapKey}`, this.updateDom)
            // 更新 dom 信息 
            this.props.ViewportAction.setDomInstance(this.props.mapKey, this.domInstance)
        }

        // 如果自己是布局元素, 给子元素绑定 sortable
        if (this.componentInfo.props.canDragIn) {
            // 添加可排序拖拽
            this.sortInstance = this.props.ViewportAction.registerInnerDrag(this.props.mapKey, this.domInstance, 'nd-can-drag-in', {
                draggable: '.nd-draggable'
            })
        }

        this.processDisable()
    }

    componentWillUpdate(nextProps: typings.PropsDefine, nextState: any) {
        this.setLayoutClassIfCanDragIn()
        this.setDragableClassIfNeed();
        this.processDisable()
    }

    componentWillUnmount() {
        // 移除事件绑定
        this.domInstance.removeEventListener('mouseover', this.handleMouseOver)
        this.domInstance.removeEventListener('click', this.handleClick)

        this.props.EditorEventAction.off(`${this.props.EditorEventStore.viewportDomUpdate}.${this.props.mapKey}`, this.updateDom)

        // 在 dom 列表中移除
        this.props.ViewportAction.removeDomInstance(this.props.mapKey)
    }

    /**
     * 判断是否是绝对定位
     */
    isAbsolute() {
        return this.componentInfo.props.style && this.componentInfo.props.style.position === 'absolute'
    }

    /**
     * 更新此元素的 dom 信息
     */
    updateDom = () => {
        this.props.ViewportAction.setDomInstance(this.props.mapKey, this.domInstance)
    }

    /**
     * 如果是 absolute 布局，加上 absolute class
     */
    setDragableClassIfNeed = () => {
        if (!this.componentInfo.props.style) { // 没有 style 属性，可以拖拽
            addClass(this.domInstance, 'nd-draggable')
        } else { // 有 style 属性
            if (!this.componentInfo.props.style.position) { // 没有 position 属性，可以拖拽
                addClass(this.domInstance, 'nd-draggable')
            } else if (this.componentInfo.props.style.position === 'absolute' || this.componentInfo.props.style.position === 'fixed') { // absolute 没有拖拽
                removeClass(this.domInstance, 'nd-draggable')
            } else { // 其它 position 可以拖拽
                addClass(this.domInstance, 'nd-draggable')
            }
        }

        if (this.componentCollectInfo === 'collectLoopEle') {
            removeClass(this.domInstance, 'nd-draggable')
            this.domInstance.style.pointerEvents = 'none'
        }
    }

    /**
     * 如果是布局容器，且不是最外层元素，添加 nd-layout class，用于添加布局样式
     */
    setLayoutClassIfCanDragIn = () => {
        if (this.componentInfo.props.canDragIn && this.componentInfo.parentKey !== null) {
            if (!hasClass(this.domInstance, 'nd-layout')) {
                this.domInstance.className += ' nd-layout'
            }
            // 未设高度以及未有子元素，则设置默认高宽
            if (this.componentInfo.props.style.width === null && !this.componentInfo.layoutChilds.length) {
                addClass(this.domInstance, 'nd-layout-min-width')
            } else {
                removeClass(this.domInstance, 'nd-layout-min-width')
            }
            if (this.componentInfo.props.style.height === null && !this.componentInfo.layoutChilds.length) {
                addClass(this.domInstance, 'nd-layout-min-height')
            } else {
                removeClass(this.domInstance, 'nd-layout-min-height')
            }
        }
    }

    /**
     * 循环元素处理，并且此元素非为第一个情况下，设置特殊样式
     */
    processCollect = (): 'collectFirstEle' | 'collectLoopEle' | 'collectLoopInEle' => {
        // 循环元素，并且此元素非为第一个
        let ndsCollIdxs = _.get(this.props.flowComData, 'ndsCollIdxs', []);
        if (ndsCollIdxs && ndsCollIdxs.length > 0) {
            if (ndsCollIdxs[0] !== 0 || ndsCollIdxs[ndsCollIdxs.length - 1] !== 0) {
                let parentComponPropsInfo = this.props.ViewportStore.components.get(this.componentInfo.parentKey)
                if (parentComponPropsInfo && parentComponPropsInfo.props._ndsCollectDatas) {
                    addClass(this.domInstance, 'nds-collection-layout');
                    removeClass(this.domInstance, 'nd-draggable');
                    return 'collectLoopEle'
                }
                return 'collectLoopInEle'
            }
        }
        // return 0
    }

    processDisable = () => {
        if (this.componentCollectInfo !== 'collectLoopEle' && this.sortInstance) {
            if (this.componentInfo.props.isDisable) {
                addClass(this.domInstance, 'nd-disabled');
                this.sortInstance.option('disabled', true)
            } else {
                removeClass(this.domInstance, 'nd-disabled');
                this.sortInstance.option('disabled', false)
            }
        }
    }

    /**
     * 鼠标移上去
     */
    handleMouseOver = (event: MouseEvent) => {
        event.stopPropagation()

        // 触发事件
        this.props.EditorEventAction.emit(this.props.EditorEventStore.mouseHoveringComponent, {
            mapKey: this.props.mapKey,
            type: 'component'
        } as Ndesign.MouseHoverComponentEvent)

        this.props.ViewportAction.setCurrentHoverCptKey(this.props.mapKey)
    }

    handleClick = (event: MouseEvent) => {
        event.stopPropagation()

        // 将当前组件设置为正在编辑状态
        this.props.ViewportAction.setCurrentEditCptKey(this.props.mapKey)
    }

    // doubleclick = (event: MouseEvent)=>{
    //     event.stopPropagation()
    //     this.sortInstance.option('disabled', true)
    // }

    analyseFlowComData = () => {
        let props = this.componentInfo.props
        let flowComData = this.props.flowComData && _.cloneDeep(toJS(this.props.flowComData))
        if (props.dataConfs) {
            flowComData = flowComData || {}
            flowComData.comDataSources = flowComData.comDataSources || {}
            props.dataConfs.forEach((dataSource) => {
                flowComData.comDataSources[this.props.mapKey] = { [dataSource.dataSourceId]: toJS(dataSource.dataSourceJson) }
            })
        }
        return flowComData;
    }

    render() {
        // 子元素
        let childs: Array<React.ReactElement<any>> = null
        /** 
         * //todo 根据_ndsDataSourceConf初使化 flowComData 组件数据源
         */
        let flowComData = this.analyseFlowComData();

        // 布局元素可以有子元素
        if (this.componentInfo.props.canDragIn && this.componentInfo.layoutChilds) {
            childs = this.componentInfo.layoutChilds.map(uniqueMapKey => {
                return (
                    <EditHelper.ObserveEditHelper key={uniqueMapKey}
                        flowComData={flowComData}
                        mapKey={uniqueMapKey}
                        ref={`edit-${uniqueMapKey}`} />
                )
            })
        }

        // props
        let comProps: Ndesign.ComponentProps = _.cloneDeep(toJS(this.componentInfo.props))
        // props.style
        comProps.style = comProps.stylePoly.polys[comProps.stylePoly.previewIdx || 0].style
        Object.keys(comProps.style).forEach((key) => {
            comProps.style[key] === null && delete comProps.style[key]
        })
        // 移除 nd 自用的属性
        delete comProps.canDragIn
        delete comProps.ndsEdit
        delete comProps.event
        delete comProps.eventData
        delete comProps.key
        delete comProps.variables
        comProps.ref = (ref: React.ReactInstance) => {
            this.wrappedInstance = ref
        }

        if (this.props.DataStore.mockPreviewAble) {
            // 模拟数据实时预览
            libs.propsToData(
                comProps,
                [toJS(this.props.DataStore.mockDataSource), toJS(flowComData) || {}],
                _.get(flowComData, 'ndsCollIdxs', []),
                toJS,
                '{变量}'
            )
        } else {
            Object.keys(comProps).forEach((propsField) => {
                let fieldValue = comProps[propsField];
                if (propsField.startsWith('_nds') && fieldValue && fieldValue.colls) {
                    comProps[propsField] = fieldValue.colls.map((coll) => {
                        if (coll.type) {
                            return '{变量}'
                        } else {
                            return coll.value.toString()
                        }
                    }).join('')
                }
            })
        }

        // flowComData 注入
        comProps.flowComData = flowComData
        comProps.isPreview = false

        return React.createElement(this.ComponentClass, comProps, childs)
    }
}