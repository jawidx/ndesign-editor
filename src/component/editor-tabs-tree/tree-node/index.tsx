import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import * as classNames from 'classnames'
import { TreeNode } from '../../common/tree'
import { Icon, Tooltip } from 'antd'
import * as typings from './type'
import './style.scss'

@inject('EditorEventStore', 'ViewportStore', 'ViewportAction', 'EditorEventAction', 'TreeAction')
@observer
export default class TreeNodeComponent extends React.Component<typings.PropsDefine, any> {
    static ObserveTreeElement = inject('EditorEventStore', 'ViewportStore', 'ViewportAction', 'EditorEventAction', 'TreeAction')(observer(TreeNodeComponent))
    // 当前绑定节点信息
    private componentInfo: Ndesign.ViewportComponentInfo = null
    private keyIndex = 0
    componentWillMount() {
        this.componentInfo = this.props.ViewportStore.components.get(this.props.mapKey)
    }

    componentDidMount() {
        let _dom = ReactDOM.findDOMNode(this);
        let { mapKey } = this.props;
        this.props.TreeAction.addTreeDom(mapKey, _dom as HTMLElement)
        this.props.EditorEventAction.on(`${this.props.EditorEventStore.viewportDomUpdate}.${mapKey}`, this.updateDom)

        // 如果自己是布局元素, 给子元素绑定 sortable
        if (this.componentInfo.props.canDragIn) {
            // 添加可排序拖拽
            this.props.ViewportAction.registerInnerDrag(mapKey, _dom.querySelector('.children') as HTMLElement, 'nd-tree-can-drag-in')
        }

        if (this.props.ViewportStore.currComKey === mapKey) {
            this.props.TreeAction.setSelectedStyle({ newValue: mapKey })
        }
    }

    componentWillUnmount() {
        // 在 dom 列表中移除
        this.props.TreeAction.removeTreeDom(this.props.mapKey)
        this.props.EditorEventAction.off(`${this.props.EditorEventStore.viewportDomUpdate}.${this.props.mapKey}`, this.updateDom)
    }

    /**
     * 更新此元素的 dom 信息
     */
    updateDom = () => {
        this.props.TreeAction.addTreeDom(this.props.mapKey, ReactDOM.findDOMNode(this) as HTMLElement)
    }

    handleRenderTitle = () => {
        // 显示数据、事件标识
        let eventTag: Array<React.ReactElement<any>> = []
        let { icon, name, _ndsCollectDatas, dataConfs, eventData } = this.componentInfo.props;

        if (eventData && eventData.length) {
            // TODO 事件列表
            let handlerName = eventData[0].handlers.name
            eventTag.push(
                <Tooltip key={'tree-n-t-' + this.keyIndex++} title={`事件 ${handlerName}`}>
                    <i className="fa fa-bolt tag-icon event" />
                </Tooltip >
            )
        }

        if (_ndsCollectDatas && _ndsCollectDatas.colls) {
            eventTag.push(
                <Tooltip key={'tree-n-t-' + this.keyIndex++} title={`循环数据 ${_ndsCollectDatas.colls[0].value.key}`}>
                    <Icon type="sync" className="tag-icon sync" />
                </Tooltip>
            )
        }

        if (dataConfs && dataConfs.length) {
            eventTag.push(
                <Tooltip key={'tree-n-t-' + this.keyIndex++} title={`数据组件`}>
                    <Icon type="database" className="tag-icon database" />
                </Tooltip>
            )
        }

        return (
            <div className="item-container">
                <div className="icon-container">
                    <Icon type={icon} />
                </div>
                <div className="title">
                    {name}
                    {eventTag}
                </div>
            </div>
        )
    }

    handleMouseOver = (event: MouseEvent) => {
        event.stopPropagation()
        this.props.ViewportAction.setCurrentHoverCptKey(this.props.mapKey)
    }

    handleClick = (event: MouseEvent) => {
        event.stopPropagation()
        this.props.ViewportAction.setCurrentEditCptKey(this.props.mapKey)
    }

    render() {
        // 渲染后的结果
        let resultElement: React.ReactElement<any>
        // 子元素
        let childs: Array<React.ReactElement<any>> = null

        if (this.componentInfo.props.canDragIn && this.componentInfo.layoutChilds) {
            childs = this.componentInfo.layoutChilds.map(layoutChildUniqueMapKey => {
                return (
                    <TreeNodeComponent.ObserveTreeElement key={layoutChildUniqueMapKey}
                        mapKey={layoutChildUniqueMapKey}
                        ref={`tree-${layoutChildUniqueMapKey}`} />
                )
            })
        }

        let childProps = {
            render: this.handleRenderTitle,
            defaultExpendAll: true,
            toggleByArrow: true,
            onMouseOver: this.handleMouseOver,
            onClick: this.handleClick,
            className: classNames({
                '_namespace': true
            })
        }

        // 执行 render 以绑定数据
        this.handleRenderTitle()

        resultElement = React.createElement(TreeNode, childProps, childs)
        return resultElement
    }
}