import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { ViewportAction, SettingAction } from '../../action'
import { ApplicationStore } from '../../store'
import * as keymaster from 'keymaster'
import { Position } from '../../helper'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    ViewportAction?: ViewportAction
    SettingAction?: SettingAction
}

@inject('ApplicationStore', 'ViewportAction', 'SettingAction')
@observer
export default class Save extends React.Component<PropsDefine, any> {
    static position = Position.navbarRight
    saveTimer: any
    componentWillMount() {
        keymaster('command+s, ctrl+s', this.handleClick)
        let editorProps = this.props.ApplicationStore.editorProps;
        this.saveTimer = setInterval(() => {
            let componentsInfo = this.getSaveInfo();
            editorProps.onLocalStore && editorProps.onLocalStore(componentsInfo)
        }, editorProps.localStoreTime)
    }

    componentWillUnmount() {
        clearInterval(this.saveTimer)
        keymaster.unbind('command+s, ctrl+s')
    }

    getSaveInfo = () => {
        const componentsInfo = this.props.ViewportAction.getZipContentInfo()
        return {
            content: componentsInfo.content,
            setting: this.props.SettingAction.getZipSettingData(),
            extraInfo: componentsInfo.extraInfo
        }
    }

    handleClick = () => {
        let saveInfo = this.getSaveInfo()
        this.props.ApplicationStore.editorProps.onSave(saveInfo)
        return false
    }

    render() {
        return (
            <div onClick={this.handleClick}>
                保存
            </div>
        )
    }
}