import * as React from 'react'
import * as keymaster from 'keymaster'
import { inject, observer } from 'mobx-react'
import { message } from 'antd'
import { CopyPasteAction } from '../../action'
import { ApplicationStore, ViewportStore, CopyPasteStore } from '../../store'
import { Position } from '../../helper'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ViewportStore?: ViewportStore
    CopyPasteStore?: CopyPasteStore
    CopyPasteAction?: CopyPasteAction
}

@inject('ApplicationStore', 'ViewportStore', 'CopyPasteStore', 'CopyPasteAction')
@observer
export default class CopyPaste extends React.Component<PropsDefine, any> {
    static position = Position.navbarRight
    static Action = CopyPasteAction
    static Store = CopyPasteStore

    componentWillMount() {
        keymaster('command+c, ctrl+c', this.copy)
        keymaster('command+v, ctrl+v', this.paste)
    }

    componentWillUnmount() {
        keymaster.unbind('command+c, ctrl+c')
        keymaster.unbind('command+v, ctrl+v')
    }

    copy = () => {
        if (this.props.ApplicationStore.inPreview || !this.props.ViewportStore.currHoverComKey) {
            return
        }
        this.props.CopyPasteAction.copy(this.props.ViewportStore.currHoverComKey)
    }

    paste = () => {
        if (this.props.ApplicationStore.inPreview || !this.props.ViewportStore.currHoverComKey) {
            return
        }
        if (!this.props.CopyPasteAction.paste(this.props.ViewportStore.currHoverComKey)) {
            message.warning('此处无法粘贴')
        }
    }

    render() {
        return null as any
    }
}