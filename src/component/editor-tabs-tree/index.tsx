import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { Tree } from '../common/tree'
import TreeNode from './tree-node'
import Guideline from './guideline'
import TreeAction from './action'
import TreeStore from './store'
import { Position } from '../../helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ApplicationStore', 'ViewportAction', 'TreeAction')
@observer
export default class TreePlugin extends React.Component<typings.PropsDefine, any> {
    static position = Position.editorTabTree
    static Action = TreeAction
    static Store = TreeStore

    componentDidMount() {
        const treeContainerDom = ReactDOM.findDOMNode(this.refs['treeContainer']) as HTMLElement
        this.props.TreeAction.setTreeRootDom(treeContainerDom)
    }

    handleMouseLeave = () => {
        this.props.ViewportAction.setCurrentHoverCptKey(null)
    }

    render() {
        if (this.props.ApplicationStore.pageValue === 'empty') {
            return null
        }

        return (
            <div className="_namespace">
                <div className="tree-container"
                    ref="treeContainer">
                    <Tree defaultExpendAll={true}
                        toggleByArrow={true}
                        // onMouseLeave={this.handleMouseLeave}
                        style={{ width: '100%' }}>
                        <TreeNode mapKey={this.props.ViewportStore.rootKey} />
                    </Tree>
                    <Guideline />
                </div>

                <div className="absolute-container">
                    实例数:{this.props.ViewportStore.components.size}
                </div>
            </div>
        )
    }
}