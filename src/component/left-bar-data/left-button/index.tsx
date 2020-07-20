import * as React from 'react'
import { ApplicationAction } from '../../../action'
import { ApplicationStore } from '../../../store'
import * as classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import { Icon, Tooltip } from 'antd'
import { Position } from '../../../helper'
import './style.scss'

export interface PropsDefine {
    ApplicationAction?: ApplicationAction
    ApplicationStore?: ApplicationStore
}

@inject('ApplicationAction', 'ApplicationStore')
@observer
export default class EditorSourceLeftButton extends React.Component<PropsDefine, any> {
    static position = Position.leftBarTop

    handleClick = () => {
        this.props.ApplicationAction.toggleLeftBar(Position.leftBarEditorDataSource)
    }

    render() {
        const classes = classNames({
            '_namespace': true,
            'active': this.props.ApplicationStore.leftBarType === Position.leftBarEditorDataSource
        })

        return (
            <Tooltip title="数据源设置" placement="right">
                <div className={classes}
                    onClick={this.handleClick}>
                    <Icon type="database" />
                </div>
            </Tooltip>
        )
    }
}