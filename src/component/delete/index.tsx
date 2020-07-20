import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { ViewportAction } from '../../action'
import { ApplicationStore, ViewportStore } from '../../store'
import * as keymaster from 'keymaster'
import { Position } from '../../helper'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ViewportStore?: ViewportStore
    ViewportAction?: ViewportAction
}

@inject('ApplicationStore', 'ViewportStore', 'ViewportAction')
@observer
export default class Delete extends React.Component<PropsDefine, any> {
    static position = Position.navbarRight

    componentWillMount() {
        keymaster('delete, backspace', this.removeComponent)
    }

    componentWillUnmount() {
        keymaster.unbind('delete, backspace')
    }

    removeComponent = () => {
        let currHoverkey = this.props.ViewportStore.currHoverComKey,
            currentEditorKey = this.props.ViewportStore.currComKey;
        if (this.props.ApplicationStore.inPreview || !currHoverkey || !currentEditorKey || currHoverkey !== currentEditorKey) {
            return
        }

        // 不能删除根节点
        if (this.props.ViewportStore.currHoverComKey === this.props.ViewportStore.rootKey) {
            return
        }

        this.props.ViewportAction.removeComponent(this.props.ViewportStore.currHoverComKey)
    }

    render() {
        return null as any
    }
}