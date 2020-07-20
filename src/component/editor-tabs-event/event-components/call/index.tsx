import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Input, Button } from 'antd'
import { ViewportStore } from '../../../../store'
import './style.scss'

export interface PropsDefine {
    ViewportStore?: ViewportStore
    eventData?: Ndesign.EventActionCall
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}

@inject('ViewportStore') @observer
export default class Call extends React.Component<PropsDefine, any> {
    handleChange(value: string) {
        this.props.handleChange({ functionName: value })
    }

    render() {
        const customData = this.props.eventData

        let functionName = ''
        if (customData && customData.functionName) {
            functionName = customData.functionName
        }

        return (
            <div>
                <Input style={{ marginBottom: 8 }}
                    value={functionName}
                    onChange={this.handleChange.bind(this)}
                // label="自定义命令" 
                />

                <Button onClick={this.handleChange.bind(this, 'back')}
                    disabled={functionName != 'back'}>回退</Button>
                <Button style={{ marginLeft: 5 }}
                    onClick={this.handleChange.bind(this, 'close')}
                    disabled={functionName != 'close'}>关闭</Button>
            </div>
        )
    }
}