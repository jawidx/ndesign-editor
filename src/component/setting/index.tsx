import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Modal, Input, message, Row, Col } from 'antd'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import { Position } from '../../helper'
import { SettingAction } from '../../action'
import { ApplicationStore, SettingStore } from '../../store'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    SettingAction?: SettingAction
    SettingStore?: SettingStore
}

@ModalHelp
@inject('ApplicationStore', 'SettingAction', 'SettingStore')
@observer
export default class GlobalSetting extends React.Component<ModalHelpProps & PropsDefine, any> {
    static position = Position.navbarLeft
    static Action = SettingAction
    static Store = SettingStore

    constructor(props) {
        super(props)
        this.state = {
            inputValue: this.props.ApplicationStore.editorProps.defaultSetting
        };
    }

    componentWillMount() {
        // 覆盖默认配置
        this.props.SettingAction.setDefaultSetting(this.props.ApplicationStore.editorProps.defaultSetting)
    }
    handleChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    }
    formatJson = (isSave?) => {
        if (!this.state.inputValue) {
            return false;
        } else {
            try {
                this.setState({
                    inputValue: JSON.stringify(JSON.parse(this.state.inputValue), null, isSave ? 0 : 4)
                })
                return true;
            } catch (e) {
                message.error(e.message)
            }
        }
    }
    handleSubmit = () => {
        if (this.formatJson(true)) {
            this.props.SettingAction.changeCustomSetting('other', this.state.inputValue)
            this.props.closeModal()
        }
    }
    render() {
        return (
            <div onClick={() => {
                !this.props.getModalVisible() && this.props.openModal()
            }}>
                应用设置
                <Modal title="应用设置"
                    wrapClassName="_namespace"
                    className="_namespace modal"
                    visible={this.props.getModalVisible()}
                    onOk={this.handleSubmit}
                    onCancel={() => this.props.closeModal()}
                >
                    <Row>
                        <Col span={24}>
                            <Input.TextArea
                                rows={6}
                                placeholder={'JSON格式数据'}
                                value={this.state.inputValue}
                                onChange={this.handleChange}
                                onBlur={()=>this.formatJson()}
                            />
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}