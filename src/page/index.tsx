import * as React from 'react'
import { observer, inject } from 'mobx-react'
import * as classNames from 'classnames'
import { ApplicationStore, ViewportStore, EditorEventStore } from '../store'
import { ApplicationAction, ViewportAction, DataAction, EditorEventAction } from '../action'
import Viewport from './viewport'
import { NdesignViewer } from '../../ndesign-viewer'
import LeftBar from './left-bar'
import Svg from './svg'
import { Position } from '../helper'
import { tryLaunch, forceLaunch, hotLaunch, invoke } from '@baidu/launch-hk'
import { sendLog } from '@baidu/haokan-util/thunder';
import './style.scss'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ViewportStore?: ViewportStore
    EditorEventStore?: EditorEventStore
    ApplicationAction?: ApplicationAction
    ViewportAction?: ViewportAction
    EditorEventAction?: EditorEventAction
    DataAction?: DataAction
}

@inject('ApplicationStore', 'ViewportStore', 'DataAction', 'EditorEventStore', 'ApplicationAction', 'EditorEventAction', 'ViewportAction')
@observer
export default class Page extends React.Component<PropsDefine, any> {
    /**
     * 关闭编辑框
     */
    // handleCloseEditor = () => {
    //     this.props.ViewportAction.setCurrentEditCptKey(null)
    // }

    render() {
        let { viewportContainerStyle, viewportStyle, leftBarType, inPreview } = this.props.ApplicationStore;

        const navbarBottomRightContainerClasses = classNames({
            'left-center__right-container': true,
            'show-editor-container': this.props.ViewportStore.currComKey !== null,
            'transparent-background': viewportContainerStyle.backgroundColor === 'transparent',
            'show-left-bar': leftBarType !== 0
        })

        // .15s 后触发视图区域刷新事件
        setTimeout(() => {
            this.props.EditorEventAction.emit(this.props.EditorEventStore.viewportUpdated)
        }, 200)

        const viewportToolSwitchContainerClasses = classNames({
            'outer-right-container': true,
            'preview': inPreview
        });

        return (
            <div className="_namespace">
                <Svg />
                <div className="outer-left-container">
                    <div className="left-top-container">
                        <div className="top-bar-left">
                            {this.props.ApplicationAction.loadingPluginByPosition(Position.navbarLeft)}
                        </div>
                        <div className="top-bar-right">
                            {this.props.ApplicationAction.loadingPluginByPosition(Position.navbarRight)}
                        </div>
                    </div>
                    <div className="left-center-container">
                        <div className="left-bar-container">
                            <div className="left-bar">
                                <div>
                                    {this.props.ApplicationAction.loadingPluginByPosition(Position.leftBarTop)}
                                </div>
                                <div>
                                    {this.props.ApplicationAction.loadingPluginByPosition(Position.leftBarBottom)}
                                </div>
                            </div>
                            <LeftBar />
                        </div>
                        <div className={navbarBottomRightContainerClasses}
                            style={Object.assign({}, viewportContainerStyle)}>
                            {/* 编辑 */}
                            <div className="viewport-container"
                                style={Object.assign({}, viewportStyle, {
                                    display: inPreview ? 'none' : null
                                })}>
                                <Viewport />
                                {this.props.ApplicationAction.loadingPluginByPosition(Position.viewport)}
                            </div>
                            {/* 预览 */}
                            {inPreview &&
                                <div className="preview-container" style={Object.assign({}, viewportStyle)}>
                                    <NdesignViewer
                                        value={this.props.ViewportAction.getZipContentInfo().content}
                                        // settings={}
                                        initData={{
                                            "__auth__": (window as any).__PRELOADED_STATE__.auth,
                                            "__client__": (window as any).__PRELOADED_STATE__.client,
                                            "__query__": (window as any).__PRELOADED_STATE__.query,
                                        }}
                                        nativeConfig={{
                                            tryLaunch, forceLaunch, hotLaunch, invoke
                                        }}
                                        trackFunc={
                                            sendLog
                                        }
                                        namespacePrefix='/n/ndesign'
                                    />
                                    {this.props.ApplicationAction.loadingPluginByPosition(Position.preview)}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="left-bottom-container">
                        {this.props.ApplicationAction.loadingPluginByPosition(Position.bottomBar)}
                    </div>
                </div>
                <div className={viewportToolSwitchContainerClasses}>
                    {this.props.ApplicationAction.loadingPluginByPosition(Position.editorTab)}
                    <div className="preview-tool-container">
                        您处于预览状态
                    </div>
                </div>
            </div>
        )
    }
}