import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Input } from 'antd'
import { ProsVarData } from '../../common'
import { ApplicationAction, ViewportAction } from '../../../action'
import { ViewportStore } from '../../../store'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    ViewportAction?: ViewportAction
    ApplicationAction?: ApplicationAction

    index?: number
    editInfo?: Ndesign.ComponentPropsEdit
}

@inject('ViewportStore', 'ViewportAction', 'ApplicationAction')
@observer
export default class EditorAttributeText extends React.Component<PropsDefine, any> {
    static position = AttrPosition.editorAttributeText

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
        }
        return (
            <div className="_namespace">
                <div className="label">
                    {this.props.editInfo.label}
                </div>
                <div className="input-container">
                    {!this.props.editInfo.hideTool && isNdsVariable
                        ? <ProsVarData
                            /* disabled={this.props.editInfo.editable === false} */
                            onChange={(value) => { this.handleChange(value) }}
                            defaultValue={defaultValue} />
                        : <Input
                            onChange={(value) => { this.handleChange(value.target.value) }}
                            defaultValue={defaultValue} />
                    }
                </div>
            </div>
        )
    }
}
