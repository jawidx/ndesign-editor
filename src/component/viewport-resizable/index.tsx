import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { ViewportAction, EditorEventAction } from '../../action'
import { ApplicationStore, ViewportStore, EditorEventStore } from '../../store'
import Resizable from 're-resizable';
import * as _ from 'lodash'
import { Position } from '../../helper'
import { AttrPosition } from '../../../ndesign-viewer/component-helper'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    EditorEventStore?: EditorEventStore
    ViewportAction?: ViewportAction
    EditorEventAction?: EditorEventAction
    ApplicationStore?: ApplicationStore
}


@inject('ViewportStore', 'ApplicationStore', 'EditorEventStore', 'ViewportAction', 'EditorEventAction')
@observer
export default class ViewportResizable extends React.Component<PropsDefine, any> {
    static position = Position.viewport

    componentDidMount() {
        this.props.EditorEventAction.on(this.props.EditorEventStore.viewportUpdated, this.handleViewportUpdated)
        this.props.EditorEventAction.on(this.props.EditorEventStore.componentPropsUpdate, this.handleComponentPropsUpdate)
        // let boundingRect = this.getStyleRect()
        // this.setState({
        //     width: boundingRect.width,
        //     height: boundingRect.width,
        // })
        // 监控

        // EditorManager.observe(this.props.ViewportStore.currComInfo.props.style)
    }

    componentWillUnmount() {
        this.props.EditorEventAction.off(this.props.EditorEventStore.viewportUpdated, this.handleViewportUpdated)
        this.props.EditorEventAction.off(this.props.EditorEventStore.componentPropsUpdate, this.handleComponentPropsUpdate)
    }

    handleComponentPropsUpdate = _.throttle((eventContext, context: { uniqueKey: string, field: string, value: any }) => {
        if (this.props.ViewportStore.currComKey === context.uniqueKey) {
            this.forceUpdate()
        }
    }, 200, { leading: false })

    /**
     * 视图区域更新时触发
     */
    handleViewportUpdated = () => {
        this.forceUpdate()
    }

    getStyleRect = (): { width: number, height: number, top: number, left: number } => {
        let currentDom = this.props.ViewportStore.currComDom
        const targetBoundingClientRect = currentDom.getBoundingClientRect()
        const viewportBoundingClientRect = this.props.ViewportStore.viewportDom.getBoundingClientRect()
        const styleCurrent = window.getComputedStyle(currentDom, null)
        return {
            width: targetBoundingClientRect.width,
            height: targetBoundingClientRect.height,
            top: targetBoundingClientRect.top - viewportBoundingClientRect.top,
            left: targetBoundingClientRect.left - viewportBoundingClientRect.left
        }
    }

    unselect = () => {
        return false
    }

    render() {
        let isResizable = true

        // 没有 hover 元素不显示
        if (this.props.ViewportStore.currComKey === null || this.props.ViewportStore.currComDom === undefined) {
            return null
        }

        // 正在拖拽中不显示
        if (this.props.ViewportStore.currDragComInfo !== null || this.props.ApplicationStore.leftBarType !== 0) {
            return null
        }
        if (this.props.ViewportStore.currComInfo) {
            let ndsEdit = this.props.ViewportStore.currComInfo.props.ndsEdit
            let editorType = _.find(ndsEdit && ndsEdit.style, (editor) => {
                return editor.editor === AttrPosition.editorAttributeWidthHeight
            })
            if (!editorType) {
                isResizable = false
            }
        }

        let boundingRect = this.getStyleRect()
        const style = {
            // width: targetBoundingClientRect.width,
            // height: targetBoundingClientRect.height,
            top: boundingRect.top,
            left: boundingRect.left
        }
        const size = {
            width: boundingRect.width,
            height: boundingRect.height
        }

        let pointStyle = {
            pointerEvents: 'auto',
            width: '7px',
            height: '7px',
            background: '#fff',
            border: ' 1px solid #000'
        }
        const handleStyles = {
            top: _.assign({ top: '-3px', left: '50%', marginLeft: '-3px' }, pointStyle),
            right: _.assign({ top: '50%', right: '-3px', marginTop: '-3px' }, pointStyle),
            bottom: _.assign({ bottom: '-3px', left: '50%', marginLeft: '-3px' }, pointStyle),
            left: _.assign({ top: '50%', left: '-3px', marginTop: '-3px' }, pointStyle),

            topRight: _.assign({ top: '-3px', right: '-3px' }, pointStyle),
            bottomRight: _.assign({ bottom: '-3px', right: '-3px' }, pointStyle),
            bottomLeft: _.assign({ bottom: '-3px', left: '-3px' }, pointStyle),
            topLeft: _.assign({ top: '-3px', left: '-3px' }, pointStyle),
        }

        return (
            <div className="_namespace" style={Object.assign({}, style, size)}>
                {
                    isResizable && <Resizable
                        style={{}}
                        size={{ width: size.width, height: size.height }}
                        handleStyles={handleStyles}
                        onResizeStart={() => {
                            document.body.addEventListener('selectstart', this.unselect)
                        }}
                        onResize={(e, direction, ref, d) => {
                            if (['top', 'bottom'].indexOf(direction) === -1) {
                                this.props.ViewportAction.updateCurrComProps(`style.width`, ref.offsetWidth)
                            }
                            if (['left', 'right'].indexOf(direction) === -1) {
                                this.props.ViewportAction.updateCurrComProps(`style.height`, ref.offsetHeight)
                            }
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            // this.handleViewportUpdated()
                            document.body.removeEventListener('selectstart', this.unselect)
                        }}>
                    </Resizable>
                }
            </div>
        )
    }
}