import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Input } from 'antd'
import { InputEditor } from '../../common'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction', 'ApplicationAction')
@observer
export default class EditorAttributeInput extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeInput

    handleChange = (value: Ndesign.PropsVarData | string) => {
        this.props.ViewportAction.updateComponentProps(this.props.ViewportStore.currComKey, this.props.editInfo.field, value)
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }
        let isNdsVariable = this.props.editInfo.field.startsWith('_nds')
        let defaultValue = this.props.ViewportAction.getPropValueByEditInfo(this.props.editInfo, null) as any;
        if (isNdsVariable && defaultValue && !defaultValue.colls) {
            defaultValue = {
                colls: [{ value: defaultValue.toString() }]
            }
        };

        let inputType = this.props.editInfo.extras;
        return (
            <div className="_namespace">
                <div className="label">
                    {this.props.editInfo.label}
                </div>
                <div className="input-container">
                    {!this.props.editInfo.hideTool &&
                        isNdsVariable ? <InputEditor
                            inputType={inputType}
                            /* disabled={this.props.editInfo.editable === false} */
                            onChange={(value) => { this.handleChange(value) }}
                            value={defaultValue} /> :
                        <Input
                            onBlur={(value) => { this.handleChange(value.target.value) }}
                            defaultValue={defaultValue} />
                    }
                </div>
            </div>
        )
    }
}
