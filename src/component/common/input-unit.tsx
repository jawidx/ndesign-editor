
import * as React from 'react'
import { Input, Select } from 'antd'
const Option = Select.Option
import * as _ from 'lodash'

export class InputUnit extends React.Component<{
    value?: any,
    units: { key?: string, value: string }[] | null
    placeholder?: string
    curUnit?: any
    onChange: (value: { value?: any, unit?: any }) => void
}, any>{
    constructor(props) {
        super(props);
        this.state = {
            valueUnit: {
                value: this.props.value || '',
                unit: this.props.curUnit || ''
            }
        }
    }
    handChange = (valueUnit: { value?: any, unit?: any }) => {
        this.setState({
            valueUnit: _.assign({}, this.state.valueUnit, valueUnit)
        }, () => {
            this.props.onChange(this.state.valueUnit)
        })
    }
    render() {
        let units = this.props.units || [];

        return <Input type="number"
            onChange={(e) => {
                this.handChange({ value: e.target.value })
            }}
            placeholder={this.props.placeholder}
            addonAfter={
                units.length > 0 && <Select defaultValue={this.props.curUnit || units[0].value} onSelect={(value) => {
                    this.handChange({ unit: value })
                }}>
                    {
                        units.map((item, idx) => {
                            return <Option value={item.value} key={idx}>{item.key}</Option>
                        })
                    }
                </Select>
            } value={this.props.value || ''} />
    }
}