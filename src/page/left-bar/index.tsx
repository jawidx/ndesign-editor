import * as React from 'react'
import { observer, inject } from 'mobx-react'
import * as _ from 'lodash'
import { ApplicationStore } from '../../store'
import { ApplicationAction } from '../../action'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ApplicationAction?: ApplicationAction
}

@inject('ApplicationStore', 'ApplicationAction')
@observer
export default class LeftBar extends React.Component<PropsDefine, any> {
    /**
     * 关闭左边工具栏
     */
    handleCloseLeftBar = () => {
        this.props.ApplicationAction.toggleLeftBar(0)
    }

    render() {
        if (this.props.ApplicationStore.leftBarType === 0) {
            return null
        }

        return (
            <div className="left-bar-panel">
                {this.props.ApplicationAction.loadingPluginByPosition(this.props.ApplicationStore.leftBarType)}
                <div onClick={this.handleCloseLeftBar} className="left-bar-close">
                    <i className="fa fa-close close-button" />
                </div>
            </div>
        )
    }
}