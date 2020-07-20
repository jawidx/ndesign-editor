import * as React from 'react'
import * as _ from 'lodash'
import { inject, observer } from 'mobx-react'
import { Button, Icon } from 'antd'
import { SimpleProsVarData } from '../../common'
import * as typings from './type'

@inject('ViewportStore', 'EditorTabDataAction')
@observer
export default class EditorTabsDataVisible extends React.Component<typings.PropsDefine, any> {

    handleCollectSelect = (value?) => {
        // value = value.slice(-2) === '[]' ? value.slice(0, -2) : value
        // value = value && `\$\{${value}\}`
        this.props.EditorTabDataAction.updateCollection(this.props.ViewportStore.currComKey, value)
    }

    render() {
        let props = this.props.ViewportStore.currComInfo.props;
        return (
            <div style={{ flexDirection: 'row', display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <SimpleProsVarData onChange={(value) => { this.handleCollectSelect(value) }} isStopArray>
                        {props._ndsCollectDatas ?
                            <Button type="primary">
                                <Icon type="edit" /> {props._ndsCollectDatas.colls[0].value.key} </Button>
                            : <Button type="dashed"> <Icon type="plus" /> 循环数据数据源 </Button>}
                    </SimpleProsVarData>
                </div>
                <div>
                    {
                        props._ndsCollectDatas &&
                        <Button onClick={() => { this.handleCollectSelect() }}> 删除 </Button>
                    }
                </div>
            </div>
        )
    }
}
