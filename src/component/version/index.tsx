import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Modal, Button } from 'antd'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import { ApplicationAction, EditorEventAction, VersionAction } from '../../action'
import { ApplicationStore, EditorEventStore, VersionStore } from '../../store'
import { Position } from '../../helper'
import './style.scss'

export interface PropsDefine {
    VersionStore?: VersionStore
    ApplicationStore?: ApplicationStore
    ApplicationAction?: ApplicationAction
    VersionAction?: VersionAction
    EditorEventStore?: EditorEventStore
    EditorEventAction?: EditorEventAction
}

@ModalHelp
@inject('VersionStore', 'ApplicationStore', 'ApplicationAction', 'VersionAction', 'EditorEventStore', 'EditorEventAction')
@observer
export default class Version extends React.Component<PropsDefine & ModalHelpProps, any> {
    static position = Position.navbarRight
    static Action = VersionAction
    static Store = VersionStore

    componentWillMount() {
        this.props.ApplicationStore.editorProps.onGetPublishList((result) => {
            this.props.VersionAction.initVersionList(result)
        })
    }

    /**
     * 预览某个版本
     */
    handlePreviewVersion(version: string) {
        this.props.ApplicationStore.editorProps.onPreviewVersion(version)
    }

    /**
     * 切换某个版本
     */
    handleActiveVersion(version: string) {
        this.props.ApplicationStore.editorProps.onSwitchVersion(version, result => {
            this.props.VersionAction.setCurrentVersion(version)
            this.props.closeModal()
        })
    }

    render() {
        if (this.props.VersionStore.versionList.length == 0) {
            return null;
        }

        const Versions = this.props.VersionStore.versionList.map((version, index) => {
            return (
                <div className="version-container" key={'ver-' + index}>
                    <div className="version-header-container">
                        <div className="version-title">
                            {version.version}
                        </div>
                        {this.props.VersionStore.currentVersion === version.version ?
                            <div className="current-version-tag">当前版本</div> :
                            <Button.Group>
                                <Button onClick={this.handlePreviewVersion.bind(this, version.version)}>预览</Button>
                                <Button onClick={this.handleActiveVersion.bind(this, version.version)}>切换</Button>
                            </Button.Group>
                        }
                    </div>
                    <div className="version-description">{version.description}</div>
                </div>
            )
        })

        return (
            <div className="_namespace" onClick={() => {
                !this.props.getModalVisible() && this.props.openModal()
            }}>
                回滚
                <Modal
                    title={'回滚线上版本'}
                    visible={this.props.getModalVisible()}
                    onCancel={() => this.props.closeModal()}
                    footer={null}
                    wrapClassName="_namespace"
                >
                    {Versions}
                </Modal>
            </div>
        )
    }
}