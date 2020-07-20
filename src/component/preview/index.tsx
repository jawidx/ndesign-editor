import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { ApplicationAction, ViewportAction } from '../../action'
import { ApplicationStore } from '../../store'
import { Position } from '../../helper'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ApplicationAction?: ApplicationAction
    ViewportAction?: ViewportAction
}

@inject('ApplicationStore', 'ApplicationAction', 'ViewportAction')
@observer
export default class Preview extends React.Component<PropsDefine, any> {
    static position = Position.navbarRight

    handlePreview = () => {
        if (!this.props.ApplicationStore.inPreview) {
            // 设置为预览状态，清空当前状态
            this.props.ViewportAction.clean()
        }
        this.props.ApplicationAction.setPreview(!this.props.ApplicationStore.inPreview)
    }

    render() {
        return (
            <div onClick={this.handlePreview}>
                {this.props.ApplicationStore.inPreview ? '取消预览' : '预览'}
            </div>
        )
    }
}