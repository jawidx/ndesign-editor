import * as React from 'react'
import * as _ from 'lodash'
import { Button, Icon } from 'antd'
import { inject, observer } from 'mobx-react'
import { SingleCondition } from '../../common'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'EditorTabDataAction')
@observer
export default class EditorTabsDataVisible extends React.Component<typings.PropsDefine, typings.StateDefine> {
    public state: typings.StateDefine = new typings.State()

    handleAddDisplayCondition = (index: number = -1) => {
        this.setState({
            currentUpdateIndex: index
        }, () => {
            this.setState({
                visible: true
            })
        })
    }
    handleOk = (visibleCondition) => {
        this.props.EditorTabDataAction.updateCondition(this.props.ViewportStore.currComKey, visibleCondition, this.state.currentUpdateIndex)
        this.setState({
            visible: false,
            currentUpdateIndex: -1
        })
    }
    handleDelete = (index) => {
        this.props.EditorTabDataAction.updateCondition(this.props.ViewportStore.currComKey, null, index)
    }
    handleCancel = () => {
        this.setState({
            visible: false,
            currentUpdateIndex: -1
        })
    }
    renderDisplayCondition = () => {
        let { _ndsVisible = [] } = this.props.ViewportStore.currComInfo.props
        return (
            <div className="item-list-contain">
                {
                    _ndsVisible.map((item, key) => {
                        return (<div key={key} className="item-list">
                            <div className="desc">{item.desc}</div>
                            <div className="opreate-icon">
                                <div className="update icon"
                                    onClick={this.handleAddDisplayCondition.bind(this, key)}>
                                    <Icon type="edit" style={{ fontSize: 13 }} />
                                </div>
                                <div className="delete icon"
                                    onClick={this.handleDelete.bind(this, key)}>
                                    <Icon type="delete" style={{ fontSize: 13 }} />
                                </div>
                            </div>
                        </div>)
                    })
                }
            </div>
        )
    }
    render() {
        let { _ndsVisible = [] } = this.props.ViewportStore.currComInfo.props
        return (
            <div className="_namespace">
                {this.renderDisplayCondition()}
                <Button onClick={() => { this.handleAddDisplayCondition() }}>添加条件</Button>
                <SingleCondition
                    title='添加显示条件'
                    onHandleCancel={this.handleCancel}
                    onHandleOk={this.handleOk}
                    visible={this.state.visible}
                    conditionData={_ndsVisible[this.state.currentUpdateIndex]}
                    conditionLen={_ndsVisible.length} />
            </div>
        )
    }
}
