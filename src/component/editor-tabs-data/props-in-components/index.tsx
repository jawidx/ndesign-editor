import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Icon, Tag } from 'antd'
import { SelectDataSource } from '../../left-bar-data'
import * as _ from 'lodash'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'EditorTabDataAction', 'DataStore')
@observer
export default class EditorTabsDataPropsIn extends React.Component<typings.PropsDefine, any> {
    handleSelect = (value: string) => {
        value = value && '${' + value + '}';
        this.props.EditorTabDataAction.updatePropsIn(this.props.ViewportStore.currComKey, value)
    }
    render() {
        let comProps = this.props.ViewportStore.currComInfo.props;
        let dataSourcesConfs = this.props.DataStore.dataConfs;

        return (
            <div className="_namespace">
                {
                    comProps._ndsPropsIn && comProps._ndsPropsIn.map((_props, index) => {
                        let dataSourceId = _props.split('.')[0]
                        let dataSource = dataSourcesConfs.find(ds => ds.dataSourceId === dataSourceId) || {} as any

                        return <div className="props-list" key={'inprop-' + index}>
                            <div className="title">
                                <Tag color={!dataSource.dataSourceType ? 'blue' : 'green'}>{_props}</Tag>
                            </div>
                            <div>
                                <Button icon="delete" size="small"
                                    onClick={() => {
                                        this.props.EditorTabDataAction.updatePropsIn(this.props.ViewportStore.currComKey, '', index)
                                    }} />
                            </div>
                        </div>
                    })
                }
                <SelectDataSource onSelect={(value) => this.handleSelect(value.key)}>
                    <Button type="dashed"> <Icon type="plus" /> 透传数据源字段 </Button>
                </SelectDataSource>
            </div>
        )
    }
}
