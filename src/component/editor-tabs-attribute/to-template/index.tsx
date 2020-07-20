import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Modal, Button, Input, Form, Tooltip } from 'antd'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import Icon from '../../common/icon'
import * as typings from './type'

@ModalHelp
@inject('ApplicationStore', 'ViewportStore', 'ViewportAction', 'ApplicationAction', 'ComponentsListAction')
@observer
export default class ToTemplate extends React.Component<typings.PropsDefine & ModalHelpProps, typings.StateDefine> {
    public state: typings.StateDefine = new typings.State()

    handleOk = (e) => {
        e.stopPropagation();
        this.props.closeModal()
        let { ApplicationAction, ViewportAction } = this.props;
        // 设置为模板
        let componentFullInfo = ViewportAction.getCptFullInfoByKey(this.props.ViewportStore.currComKey)

        // 瘦身
        componentFullInfo.componentInfo = ApplicationAction.cleanComponent(componentFullInfo.componentInfo)
        Object.keys(componentFullInfo.childs).forEach(childKey => {
            componentFullInfo.childs[childKey] = ApplicationAction.cleanComponent(componentFullInfo.childs[childKey])
        })

        this.props.ComponentsListAction.addCombo(this.state.templateName, componentFullInfo)
    }

    handleChangeTemplateName = (value: string) => {
        this.setState({
            templateName: value
        })
    }

    render() {
        return (
            <Tooltip title="设置为模板">
                <Button className="child-scale" onClick={() => { this.props.openModal() }}>
                    <Icon type='ndssvg-add-template' className="child-scale" />
                    <Modal title="设为模板"
                        visible={this.props.getModalVisible()}
                        onOk={this.handleOk.bind(this)}
                        onCancel={(e) => { this.props.closeModal(); e.stopPropagation(); }}>
                        <Form.Item label='模板名称'>
                            <Input defaultValue={this.state.templateName}
                                onChange={(e) => { this.handleChangeTemplateName(e.target.value) }} />
                        </Form.Item>
                    </Modal>
                </Button>
            </Tooltip>
        )
    }
}