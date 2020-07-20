import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as classNames from 'classnames'
import { Tooltip } from 'antd'
import { ViewportAction } from '../../action'
import { ViewportStore } from '../../store'
import { Position } from '../../helper'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ViewportAction?: ViewportAction
}

@inject('ViewportStore', 'ViewportAction')
@observer
export default class ShowLayout extends React.Component<PropsDefine, any> {
    static position = Position.leftBarBottom

    handleClick = () => {
        this.props.ViewportAction.setLayoutComponentActive(!this.props.ViewportStore.isLayoutComActive)
    }

    render() {
        const classes = classNames({
            '_namespace': true,
            'active': this.props.ViewportStore.isLayoutComActive
        })

        return (
            <Tooltip title="显示组件边框">
                <div className={classes}
                    onClick={this.handleClick}>
                    <i className="fa fa-eye" />
                </div>
            </Tooltip>
        )
    }
}