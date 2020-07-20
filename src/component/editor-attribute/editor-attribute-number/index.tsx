import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Input, Select } from 'antd'
let { Option } = Select
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

// 根据 inputRange outputRange 转换值
const parseInputToOutRange = (value: number, inputRange: Array<number>, outputRange: Array<number>) => {
    if (value >= inputRange[0] && value <= inputRange[1]) {
        // 给的值必须在 input 范围内
        // 转换成 0~1 的小数
        const percentage = (value - inputRange[0]) / (inputRange[1] - inputRange[0])
        // 转换成 output 的长度
        const outputLength = (outputRange[1] - outputRange[0]) * percentage
        // 数值是加上最小值
        value = outputLength + outputRange[0]
    }
    return value
}

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeNumber extends React.Component<typings.PropsDefine, typings.StateDefine> {
    static position = AttrPosition.editorAttributeNumber

    constructor(props) {
        super(props);

        let { number } = this.props.editInfo;
        let inputValue = this.props.ViewportAction.getPropValueByEditInfo(this.props.editInfo)
        let v = inputValue && (+parseFloat(inputValue).toFixed(2));
        let u = number.currentUnit;
        if (inputValue && (inputValue != v)) {
            u = inputValue.replace(v, '');
        }
        // 输入转换
        if (v && number && number.outputRange) {
            v = parseInputToOutRange(v, number.outputRange, number.inputRange)
        }
        this.state = {
            unit: u,
            value: v
        }
    }

    handleChangeValue = (value: number, unit?: string) => {
        let outputValue = parseFloat(value + '')

        // 如果有输入输出转换，进行变换
        if (this.props.editInfo.number && this.props.editInfo.number.inputRange && this.props.editInfo.number.outputRange) {
            outputValue = parseInputToOutRange(outputValue, this.props.editInfo.number.inputRange, this.props.editInfo.number.outputRange)
        }

        // 如果有后缀，加上后缀
        if (unit) {
            this.props.ViewportAction.updateCurrComProps(this.props.editInfo.field, outputValue.toString() + unit)
        } else {
            this.props.ViewportAction.updateCurrComProps(this.props.editInfo.field, outputValue)
        }
    }

    handleInputChange = (event: any) => {
        this.setState({
            value: event.target.value
        })
        this.handleChangeValue(event.target.value, this.state.unit)
    }

    handleUnitChange = (value: string, option) => {
        this.setState({
            unit: value
        })
        this.handleChangeValue(+this.state.value, value)
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        let { value, unit } = this.state;
        let { editable, number } = this.props.editInfo;
        let InputElement: React.ReactElement<any> = null
        let options = []
        number.units.forEach(e => {
            options.push(<Option key={'unit-' + e.key} value={e.value}>{e.value}</Option>)
        })
        if (number && number.slider) {
            InputElement = (
                <>
                    <input className="range"
                        max={number.max}
                        min={number.min}
                        step={number.step}
                        value={value}
                        disabled={editable === false}
                        onChange={this.handleInputChange.bind(this)}
                        type="range" />
                    <Input
                        type={"number"}
                        max={number.max}
                        min={number.min}
                        step={number.step}
                        disabled={editable === false}
                        addonAfter={
                            <Select
                                style={{ width: 30 }}
                                showArrow={false}
                                defaultValue={unit}
                                onChange={this.handleUnitChange}
                            >
                                {options}
                            </Select>
                        }
                        onChange={this.handleInputChange}
                        value={value}
                    />
                </>
            )
        } else {
            InputElement = (
                <Input
                    type={"number"}
                    max={number.max}
                    min={number.min}
                    step={number.step}
                    disabled={editable === false}
                    addonAfter={
                        <Select
                            style={{ width: 30 }}
                            showArrow={false}
                            defaultValue={unit}
                            onChange={this.handleUnitChange}
                        >
                            {options}
                        </Select>
                    }
                    onChange={this.handleInputChange}
                    value={value}
                />
            )
        }

        return (
            <div className="_namespace">
                <div className="label">
                    {this.props.editInfo.label}
                </div>
                <div className="input-container">
                    {InputElement}
                </div>
            </div>
        )
    }
}