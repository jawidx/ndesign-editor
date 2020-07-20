import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Select, Form, Button } from 'antd';
import { DataStore } from '../../../../store'
import './style.scss'

export interface PropsDefine {
    DataStore?: DataStore
    eventData?: Ndesign.EventActionDataStore
    handleChange: (eventData: Ndesign.eventDataAtom) => void
}

@inject('DataStore') @observer
export default class DataSource extends React.Component<PropsDefine, any> {
    handleChange = (value: string) => {
        this.props.handleChange({ dataSourceId: value })
    }

    render() {
        const eventData = this.props.eventData || {};
        let dataSourcesConfs = this.props.DataStore.dataConfs
        return (
            <div className="_namespace">
                {
                    dataSourcesConfs.length > 0 ?
                        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} label="数据源">
                            <Select
                                showSearch
                                size='large'
                                style={{ width: 200 }}
                                placeholder="选择数据源"
                                defaultValue={eventData && eventData.dataSourceId}
                                optionFilterProp="children"
                                onChange={this.handleChange.bind(this)}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    dataSourcesConfs.map((item) => {
                                        return <Select.Option value={item.dataSourceId}>{`${item.dataSourceName}(${item.dataSourceId})`}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item> :
                        <Button icon="file-add">添加数据源</Button>
                }
            </div>
        )
    }
}