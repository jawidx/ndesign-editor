import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classNames from 'classnames'
import { observer, inject } from 'mobx-react'
import * as LZString from 'lz-string'
import * as _ from 'lodash'
import { ApplicationStore, ViewportStore, EditorEventStore } from '../../store'
import { ApplicationAction, ViewportAction, EditorEventAction } from '../../action'
import EditHelper from './edit-helper'
import './style.scss'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ViewportStore?: ViewportStore
    EditorEventStore?: EditorEventStore
    ApplicationAction?: ApplicationAction
    ViewportAction?: ViewportAction
    EditorEventAction?: EditorEventAction,
}

@inject('ApplicationStore', 'ViewportStore', 'EditorEventStore', 'ApplicationAction', 'EditorEventAction', 'ViewportAction')
@observer
export default class Viewport extends React.Component<PropsDefine, any> {
    componentWillMount() {
        this.freshView()
    }

    /**
     * 刷新整个视图
     */
    freshView() {
        if (this.props.ApplicationStore.pageValue === 'empty') {
            // 还没有初始化
            return
        }

        let unCompressValue = {} as Ndesign.AppData
        let unComponents
        if (this.props.ApplicationStore.pageValue) {
            unCompressValue = JSON.parse(LZString.decompressFromBase64(this.props.ApplicationStore.pageValue)) || {} as Ndesign.AppData;
            unComponents = unCompressValue.components;
        }

        if (_.isEmpty(unComponents)) {  // 空白应用
            // 生成根节点唯一 id
            const rootKey = this.props.ViewportAction.createUniqueKey()
            this.props.ViewportAction.setRootKey(rootKey)
            // 获得根节点类
            const RootClass = this.props.ApplicationAction.getComponentClassByKey(this.props.ApplicationStore.editorProps.rootLayoutKey)
            // 设置根节点属性
            let rootProps = _.cloneDeep(RootClass.defaultProps) as Ndesign.ComponentProps
            // rootProps.style.backgroundColor = 'white'
            // rootProps.style.flexGrow = 1
            rootProps.style.width = '100%'
            rootProps.style.height = '100%'
            rootProps.style.fontSize = 14
            rootProps.style.overflow = null
            rootProps.style.overflowX = 'hidden'
            rootProps.style.overflowY = 'auto'

            this.props.ViewportAction.setComponent(this.props.ViewportStore.rootKey, {
                props: rootProps,
                layoutChilds: [],
                parentKey: null
            })
        } else { // 根据默认配置渲染
            Object.keys(unComponents).forEach(key => {
                const defaultInfo = unComponents[key]
                const ComponentClass = this.props.ApplicationAction.getComponentClassByKey(defaultInfo.props.key)

                // 如果是根节点, 设置根据点 id
                if (defaultInfo.parentKey === null) {
                    this.props.ViewportAction.setRootKey(key)
                }
                const props = _.merge(_.cloneDeep(ComponentClass.defaultProps), defaultInfo.props || {})
                // 恢复 stylepoly默认样式
                props.stylePoly && _.forEach(props.stylePoly.polys, (poly) => {
                    poly.style = _.merge({}, props.style, poly.style)
                })

                this.props.ViewportAction.setComponent(key, {
                    props: props,
                    layoutChilds: defaultInfo.layoutChilds || [],
                    parentKey: defaultInfo.parentKey
                })
            })
        }
    }

    /**
     * 获取自己的实例
     */
    getRootRef = (ref: React.ReactInstance) => {
        this.props.ViewportAction.setViewportDom(ReactDOM.findDOMNode(ref) as HTMLElement)
    }

    /**
     * 鼠标移开视图区域
     */
    handleMouseLeave = (event: React.MouseEvent) => {
        event.stopPropagation()

        // 触发事件
        this.props.EditorEventAction.emit(this.props.EditorEventStore.mouseLeaveViewport)

        // 设置当前 hover 的元素为 null
        this.props.ViewportAction.setCurrentHoverCptKey(null)
    }

    render() {
        if (this.props.ApplicationStore.pageValue === 'empty') {
            return null
        }

        const classes = classNames({
            '_namespace': true,
            'layout-active': this.props.ViewportStore.isLayoutComActive
        })

        return (
            <div className={classes}
                onMouseLeave={this.handleMouseLeave}
                ref={this.getRootRef}>
                <EditHelper mapKey={this.props.ViewportStore.rootKey} />
            </div>
        )
    }
}