import * as React from 'react'
import { Modal, Select, Form, Input, message } from 'antd'
import { inject, observer } from 'mobx-react'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import { VersionAction } from '../../action'
import { VersionStore } from '../../store'
import { Position } from '../../helper'
import * as typings from './type'

@ModalHelp
@inject('ApplicationStore', 'VersionStore', 'VersionAction')
@observer
export default class Publish extends React.Component<typings.PropsDefine & ModalHelpProps & { form: any }, typings.StateDefine> {
    static position = Position.navbarRight
    static Action = VersionAction
    static Store = VersionStore

    componentWillMount() {
        this.initVersion()
    }

    initVersion() {
        const { nextPatch } = this.getNextVersion()
        this.setState({
            selectedVersion: nextPatch
        })
    }

    /**
     * 获取下次可以升级的版本号
     */
    getNextVersion() {
        let nextPatch = ''
        let nextMinor = ''
        let nextMajor = ''
        // TODO 回滚后当前版本不是最大版本
        if (!this.props.VersionStore.currentVersion) {
            nextPatch = '0.0.1'
            nextMinor = '0.1.0'
            nextMajor = '1.0.0'
        } else {
            const versionSplit = this.props.VersionStore.currentVersion.split('.')
            if (versionSplit.length !== 3) {
                return null
            }
            nextPatch = `${versionSplit[0]}.${versionSplit[1]}.${parseInt(versionSplit[2]) + 1}`
            nextMinor = `${versionSplit[0]}.${parseInt(versionSplit[1]) + 1}.0`
            nextMajor = `${parseInt(versionSplit[0]) + 1}.0.0`
        }
        return { nextPatch, nextMinor, nextMajor }
    }

    handlePublish = () => {
        if (!this.state.desc) {
            message.error('描述不能为空！')
        } else {
            this.props.ApplicationStore.editorProps.onPublish(this.state.selectedVersion, this.state.desc, () => {
                this.props.VersionAction.setCurrentVersion(this.state.selectedVersion, this.state.desc)
                this.props.closeModal()
            })
        }
    }

    handleSelectChange = (version: string) => {
        this.setState({
            selectedVersion: version
        })
    }

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            desc: e.target.value
        })
    }

    render() {
        const { nextPatch, nextMinor, nextMajor } = this.getNextVersion()

        const selectOption = {
            value: nextPatch,
            options: [{
                key: nextPatch,
                value: nextPatch + ' 补丁'
            }, {
                key: nextMinor,
                value: nextMinor + ' 小版本更新'
            }, {
                key: nextMajor,
                value: nextMajor + ' 全新版本'
            }]
        }

        return (
            <div className="_namespace" onClick={() => {
                !this.props.getModalVisible() && this.props.openModal()
            }}>
                发布
                <Modal
                    title={'发布新版本'}
                    visible={this.props.getModalVisible()}
                    onOk={this.handlePublish}
                    onCancel={() => this.props.closeModal()}
                    wrapClassName="_namespace"
                >
                    <Form.Item label="版本号" >
                        <Select defaultValue={selectOption.value}
                            style={{ width: '100%' }}
                            onChange={this.handleSelectChange}>
                            {
                                selectOption.options.map((value, key) =>
                                    <Select.Option value={value.key} key={'p-v-' + key}>
                                        {value.value}
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="描述">
                        <Input placeholder="发布描述"
                            maxLength={20}
                            onChange={this.handleInputChange}
                            required
                            value={this.state.desc} />
                    </Form.Item>
                </Modal>
            </div>
        )
    }
}