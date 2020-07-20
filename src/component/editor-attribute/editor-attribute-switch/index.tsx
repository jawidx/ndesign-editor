import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Switch } from 'antd'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeSwitch extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeSwitch

    handleChange = (checked: boolean) => {
        this.props.ViewportAction.updateComponentProps(this.props.ViewportStore.currComKey, this.props.editInfo.field, checked)
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        return (
            <div className="_namespace">
                <div className="label">
                    {this.props.editInfo.label}
                </div>
                <Switch
                    disabled={this.props.editInfo.editable === false}
                    defaultChecked={this.props.ViewportStore.currComInfo.props[this.props.editInfo.field] || false}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}