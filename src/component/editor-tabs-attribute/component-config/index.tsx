import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as _ from 'lodash'
import { Button, Modal } from 'antd'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import { ViewportStore } from '../../../store'
import { ApplicationAction } from '../../../action'

export interface PropsDefined {
    ViewportStore?: ViewportStore
    ApplicationAction?: ApplicationAction
}

@ModalHelp
@inject('ViewportStore', 'ApplicationAction')
@observer
export default class extends React.Component<ModalHelpProps & PropsDefined, any> {
    handleOk = () => {
        this.props.closeModal()
    }
    render() {
        const currentEditProps = this.props.ViewportStore.currComInfo.props;
        return <div>
            <div className="container__title">
                <span className="container__titleLeft">配置</span>
                <Button size='small' onClick={() => this.props.openModal()}>添加</Button>
            </div>
            {
                currentEditProps.ndsEdit && currentEditProps.ndsEdit.config.map((ndsConfig, index) => {
                    return <div key={this.props.ViewportStore.currComKey + '-conf-' + index}>{
                        this.props.ApplicationAction.loadingPluginByPosition(
                            ndsConfig.editor,
                            { index: index, editInfo: ndsConfig }
                        )
                    }</div>
                })
            }

            <Modal
                title='组件配置'
                visible={this.props.getModalVisible()}
                onCancel={() => this.props.closeModal()}
                onOk={() => this.handleOk()}>
            </Modal>
        </div>
    }
}