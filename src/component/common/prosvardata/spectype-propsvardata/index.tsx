/**
 * @desc 类型选择功能 变量输入框
 */
import * as React from 'react'
import { Select } from 'antd';
const Option = Select.Option
import ProsVarData from '../prosvardata'
import * as typing from '../type'
import './style.scss'

export default class extends React.Component<typing.PropsDefined, any>{
    private _value = {} as Ndesign.PropsVarData
    componentWillMount() {
        this._value = Object.assign({}, this.props.defaultValue || {}) as Ndesign.PropsVarData
    }
    changeData = (value: Ndesign.PropsVarData) => {
        value.colls && this.props.onChange(value)
        this._value = value
    }
    render() {
        let { defaultValue, value } = this.props
        let initialValue = value || defaultValue || {} as Ndesign.PropsVarData
        return <div className="_namespace specTypeProps">
            <Select
                className="specTypeProps__select"
                onSelect={(value) => {
                    this.changeData({
                        valueType: value as any,
                        colls: this._value.colls
                    })
                }}
                defaultValue={initialValue.valueType || ''}
                style={{ width: 70 }}>
                <Option value="">值类型</Option>
                <Option value="String">String</Option>
                <Option value="Number">Number</Option>
                <Option value="Boolean">Boolean</Option>
            </Select>
            <div className="specTypeProps__editorInput">
                <ProsVarData defaultValue={initialValue}
                    onChange={(value) => {
                        this.changeData({
                            valueType: this._value.valueType,
                            colls: value.colls
                        })
                    }}
                    isStopArray={this.props.isStopArray}
                    dataSourceType={this.props.dataSourceType} />
            </div>
        </div>
    }
}