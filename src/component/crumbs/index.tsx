import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { ViewportStore } from '../../store'
import { ViewportAction } from '../../action'
import { Position } from '../../helper'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ViewportAction?: ViewportAction
}

@inject('ViewportStore', 'ViewportAction')
@observer
export default class Crumbs extends React.Component<PropsDefine, any> {
    static position = Position.bottomBar

    handleClick = (key: string) => {
        this.props.ViewportAction.setCurrentEditCptKey(key)
    }

    handleHover = (key: string) => {
        this.props.ViewportAction.setCurrentHoverCptKey(key)
    }

    handleMouseLeave = () => {
        this.props.ViewportAction.setCurrentHoverCptKey(null)
    }

    render() {
        let childs: Array<React.ReactElement<any>>
        if (this.props.ViewportStore.currComKey) {
            // 递归寻找这个组件父元素
            childs = this.props.ViewportStore.currComPath.map((key, index) => {
                const componentInfo = this.props.ViewportStore.components.get(key)
                return (
                    <div key={index} className="footer-item"
                        onClick={this.handleClick.bind(this, key)}
                        onMouseOver={this.handleHover.bind(this, key)}>
                        {componentInfo.props.name}
                        <div className="right-icon-container">
                            <div className="right-icon"></div>
                        </div>
                    </div>
                )
            })
        }

        return (
            <div className="_namespace">
                <div className="auto-width-container"
                    onMouseLeave={this.handleMouseLeave}>
                    {childs}
                </div>
            </div>
        )
    }
}