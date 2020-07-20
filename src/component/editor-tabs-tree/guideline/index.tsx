import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import * as $ from 'jquery'
import { ViewportStore } from '../../../store'
import TreeStore from '../store'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    TreeStore?: TreeStore
}

@inject('ViewportStore', 'TreeStore')
@observer
export default class Guideline extends React.Component<PropsDefine, any> {
    componentWillReact() {
        if (this.props.ViewportStore.currHoverComKey === null || this.props.TreeStore.currentHoverTreeDom === undefined) {
            return
        }

        // 正在拖拽中不显示
        if (this.props.ViewportStore.currDragComInfo !== null) {
            return
        }

        // 让 dom 树外层滚动到这个元素上
        const $nodeDom = $(ReactDOM.findDOMNode(this.props.TreeStore.currentHoverTreeDom))
        const $containerDom = $(this.props.TreeStore.treeRootDom)

        // 如果超过一定范围，就移动
        if ($nodeDom.offset().top - $containerDom.offset().top < 20 || $nodeDom.offset().top - $containerDom.offset().top > $containerDom.height() - 50) {
            
            $containerDom.stop().animate({
                scrollTop: $nodeDom.offset().top - $containerDom.offset().top + $containerDom.scrollTop() - 50
            }, 50)
            // setTimeout(()=>{
            //     debugger
            // },200)
        }
    }

    render() {
        if (this.props.ViewportStore.currHoverComKey === null || this.props.TreeStore.currentHoverTreeDom === undefined) {
            return null
        }

        // 正在拖拽中不显示
        if (this.props.ViewportStore.currDragComInfo !== null) {
            return null
        }

        const hoverBoundingClientRect = this.props.TreeStore.currentHoverTreeDom.getBoundingClientRect()
        const rootBoundingClientRect = this.props.TreeStore.treeRootDom.getBoundingClientRect()
        const style = {
            width: hoverBoundingClientRect.width,
            height: hoverBoundingClientRect.height,
            left: hoverBoundingClientRect.left - rootBoundingClientRect.left,
            top: hoverBoundingClientRect.top - rootBoundingClientRect.top + this.props.TreeStore.treeRootDom.scrollTop
        }
        
        return (
            <div className="_namespace" style={style} />
        )
    }
}