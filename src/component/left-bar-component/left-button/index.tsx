import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { ApplicationAction } from '../../../action'
import { ApplicationStore } from '../../../store'
import * as classNames from 'classnames'
import { Icon, Tooltip } from 'antd'
import { Position } from '../../../helper'
import './style.scss'

export interface PropsDefine {
    ApplicationAction?: ApplicationAction
    ApplicationStore?: ApplicationStore
}

@inject('ApplicationAction', 'ApplicationStore')
@observer
export default class extends React.Component<PropsDefine, any> {
    static position = Position.leftBarTop

    handleClick = () => {
        this.props.ApplicationAction.toggleLeftBar(Position.leftBarComponentsList)
    }

    render() {
        const classes = classNames({
            '_namespace': true,
            'active': this.props.ApplicationStore.leftBarType === Position.leftBarComponentsList
        })

        return (
            <Tooltip title="组件列表" placement="right">
                <div className={classes}
                    onClick={this.handleClick}>
                    <Icon type="plus-square" />
                </div>
            </Tooltip>
        )
    }
}