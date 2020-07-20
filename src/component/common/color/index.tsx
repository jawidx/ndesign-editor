import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { ChromePicker } from 'react-color'
import { Popover } from 'antd'
import './style.scss'

export interface PropsDefine {
    color?: string
    onChange?: (color?: any) => void
    onChangeComplete?: (color?: any) => void
}

@observer
export default class Color extends React.Component<PropsDefine, any> {
    handleColorChange(color: any) {
        this.props.onChange && this.props.onChange(color)
    }

    handleColorChangeComplete(color: any) {
        this.props.onChangeComplete && this.props.onChangeComplete(color)
    }

    titleRender = () => {
        return (
            <ChromePicker label="hex"
                onChange={this.handleColorChange.bind(this)}
                onChangeComplete={this.handleColorChangeComplete.bind(this)}
                color={this.props.color} />
        )
    }

    render() {
        return (
            <div className="_namespace">
                <Popover
                    trigger="click"
                    content={<ChromePicker label="hex"
                        onChange={this.handleColorChange.bind(this)}
                        onChangeComplete={this.handleColorChangeComplete.bind(this)}
                        color={this.props.color} />}
                >
                    <div className="color-picker-label-container">
                        <div className="color-picker-label"
                            style={{ backgroundColor: this.props.color }} />
                    </div>
                </Popover>
            </div>
        )
    }
}