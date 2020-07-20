import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Select } from 'antd'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeSelect extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeSelect

    handleChange = (value: string) => {
        this.props.ViewportAction.updateComponentProps(this.props.ViewportStore.currComKey, this.props.editInfo.field, value)
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        const propValue = this.props.ViewportAction.getPropValueByEditInfo(this.props.editInfo)

        return (
            <div className="_namespace">
                <div className="label">
                    {this.props.editInfo.label}
                </div>
                <div className="input-container">
                    <Select
                        disabled={this.props.editInfo.editable === false}
                        defaultValue={propValue}
                        options={this.props.editInfo.selector}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        )
    }
}