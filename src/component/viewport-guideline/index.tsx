import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { EditorEventAction } from '../../action'
import { ViewportStore, EditorEventStore } from '../../store'
import { Position } from '../../helper'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EditorEventStore?: EditorEventStore
    EditorEventAction?: EditorEventAction
}

@inject('ViewportStore', 'EditorEventStore', 'EditorEventAction')
@observer
export default class ViewportGuideline extends React.Component<PropsDefine, any> {
    static position = Position.viewport

    componentDidMount() {
        this.props.EditorEventAction.on(this.props.EditorEventStore.viewportUpdated, this.handleViewportUpdated)
    }

    componentWillUnmount() {
        this.props.EditorEventAction.off(this.props.EditorEventStore.viewportUpdated, this.handleViewportUpdated)
    }

    /**
     * 视图区域更新时触发
     */
    handleViewportUpdated = () => {
        this.forceUpdate()
    }

    render() {
        // 没有 hover 元素不显示
        if (this.props.ViewportStore.currHoverComKey === null || this.props.ViewportStore.currHoverComDom === undefined) {
            return null
        }

        // 正在拖拽中不显示
        if (this.props.ViewportStore.currDragComInfo !== null) {
            return null
        }

        const targetBoundingClientRect = this.props.ViewportStore.currHoverComDom.getBoundingClientRect()
        const viewportBoundingClientRect = this.props.ViewportStore.viewportDom.getBoundingClientRect()

        const style = {
            width: targetBoundingClientRect.width,
            height: targetBoundingClientRect.height,
            top: targetBoundingClientRect.top - viewportBoundingClientRect.top,
            left: targetBoundingClientRect.left - viewportBoundingClientRect.left
        }

        return (
            <div className="_namespace" style={style} ></div>
        )
    }
}