/**
 * @desc 数据选择框，不含有输入功能
 */
import * as React from 'react'
import { SelectDataSource } from '../../../left-bar-data'
import * as typing from '../type'
import './style.scss'

export default class extends React.Component<typing.PropsDefined, any>{
    render() {
        return <SelectDataSource
            value={this.props.value}
            onSelect={(value) => {
                this.props.onChange({
                    colls: [{
                        type: 1,
                        value: {
                            key: value.key,
                            conf: {
                                dataSourceId: value.dataConf.dataSourceId,
                                dataSourceType: value.dataConf.dataSourceType,
                                comKey: value.dataConf.comKey,
                            }
                        }
                    }]
                })
            }}
            isStopArray={this.props.isStopArray}
            dataSourceType={this.props.dataSourceType}>
            {this.props.children}
        </SelectDataSource>
    }
}
