import * as React from 'react'
import { observer, inject } from 'mobx-react'
import * as _ from 'lodash'
import { InputUnit } from '../../common'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

/**
 * 处理一下输入框结果
 */
const parseInputValue = (value: string, unit: string): number | string => {
    if (value === '') {
        return null
    } else if (unit === '') {
        return parseInt(value)
    } else {
        return value + unit
    }
}

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeWidthHeight extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeWidthHeight

    renderInput(label: string, field: string, defaultValue: any = 'auto') {
        let curstyle = this.props.ViewportStore.currComInfo.props.style;

        const units = [{
            key: 'px',
            value: 'px'
        }, {
            key: '%',
            value: '%'
        }]

        const currentUnit = _.endsWith(curstyle[field], '%') ? '%' : ''

        return (
            <div className="input-container">
                <span className="input-container-label">{label}</span>
                {
                    <InputUnit
                        value={parseFloat(this.props.ViewportStore.currComInfo.props.style[field]) || ''}
                        units={units}
                        placeholder={defaultValue}
                        curUnit={currentUnit}
                        onChange={(value) => {
                            this.handleChangeValue(field, value.value, value.unit)
                        }} />
                }
            </div>
        )
    }

    /**
     * 修改了输入框的值
     */
    handleChangeValue(field: string, value: string, unit: string) {
        this.setState({
            [field]: value
        })

        this.props.ViewportAction.updateCurrComProps(`style.${field}`, parseInputValue(value, unit))
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        return (
            <div className="_namespace">
                <div className="line">
                    <div className="container-left">
                        {this.renderInput('宽度', 'width')}
                    </div>
                    <div className="container-right">
                        {this.renderInput('高度', 'height')}
                    </div>
                </div>
                <div className="line">
                    <div className="container-left">
                        {this.renderInput('max', 'maxWidth', 'none')}
                    </div>
                    <div className="container-right">
                        {this.renderInput('max', 'maxHeight', 'none')}
                    </div>
                </div>
                <div className="line">
                    <div className="container-left">
                        {this.renderInput('min', 'minWidth', 0)}
                    </div>
                    <div className="container-right">
                        {this.renderInput('min', 'minHeight', 0)}
                    </div>
                </div>
            </div>
        )
    }
}
