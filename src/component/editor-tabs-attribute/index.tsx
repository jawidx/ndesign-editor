import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import * as _ from 'lodash'
import { Input, Button, Tooltip, Collapse, Tabs, message } from 'antd'
const Panel = Collapse.Panel
import ToTemplate from './to-template'
import { MuiltCondition, Icon } from '../common'
import { Position } from '../../helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction', 'ApplicationAction', 'CopyPasteAction', 'CopyPasteStore')
@observer
export default class EditorTabsAttribute extends React.Component<typings.PropsDefine, typings.StateDefine> {
    public state: typings.StateDefine = new typings.State()
    static position = Position.editorTabAttr;

    handleCptNameChange = (value: any) => {
        this.props.ViewportAction.updateCurrComProps('name', value.target.value)
    }

    handleDelete = () => {
        this.props.ViewportAction.removeComponent(this.props.ViewportStore.currComKey)
    }

    handleReset = () => {
        this.props.ViewportAction.resetProps(this.props.ViewportStore.currComKey)
    }

    renderHeaderContainer() {
        return (
            <div className="header-container">
                <div className="header-container__icon-container">
                    <Icon type={`${this.props.ViewportStore.currComInfo.props.icon}`}></Icon>
                </div>
                <div className="header-container__title-container">
                    <Input
                        onChange={this.handleCptNameChange}
                        value={this.props.ViewportStore.currComInfo.props.name} />
                </div>
                <div className="header-container__operate-container">
                    <Button.Group size='small'>
                        <ToTemplate />
                        {this.props.ViewportStore.currComInfo.parentKey !== null &&
                            <Tooltip title="重置属性">
                                <Button className="child-scale"
                                    onClick={this.handleReset}>
                                    <Icon type='reload' />
                                </Button>
                            </Tooltip>
                        }
                        {this.props.ViewportStore.currComInfo.parentKey !== null &&
                            <Tooltip title="移除此元素">
                                <Button className="child-scale"
                                    type='danger'
                                    onClick={this.handleDelete}>
                                    <Icon type="delete" />
                                </Button>
                            </Tooltip>
                        }
                    </Button.Group>
                </div>
            </div>
        )
    }

    addStylePoly = () => {
        const currentProps = this.props.ViewportStore.currComInfo.props;
        let resultPolys = [].concat(currentProps.stylePoly.polys.slice())
        resultPolys.push({
            condition: [],
            style: _.cloneDeep(toJS(currentProps.stylePoly.polys[currentProps.stylePoly.defaultIdx].style))
        })
        this.props.ViewportAction.updateCurrComProps('stylePoly.polys', resultPolys)
    }

    removeStylePoly = (idx) => {
        const currentProps = this.props.ViewportStore.currComInfo.props;
        let ComponentClass = this.props.ApplicationAction.getComponentClassByKey(currentProps.key)
        let stylePoly = currentProps.stylePoly;
        let resultPolys = [].concat(stylePoly.polys.slice())
        idx = +idx;
        if (resultPolys.length == (ComponentClass.defaultProps.stylePoly ? ComponentClass.defaultProps.stylePoly.polys.length : 1)) {
            message.error('不能删除固有样式！');
            return;
        }
        if ((stylePoly.defaultIdx || 0) === idx) {
            message.error('不能删除默认样式！');
            return;
        }

        if (stylePoly.defaultIdx > idx) {
            this.props.ViewportAction.updateCurrComProps('stylePoly.defaultIdx', stylePoly.defaultIdx - 1)
        }
        if (stylePoly.previewIdx > idx) {
            this.props.ViewportAction.updateCurrComProps('stylePoly.previewIdx', stylePoly.previewIdx - 1)
        }
        if ((stylePoly.previewIdx || 0) === idx) {
            this.props.ViewportAction.updateCurrComProps('stylePoly.previewIdx', stylePoly.defaultIdx)
        }
        resultPolys.splice(+idx, 1)
        this.props.ViewportAction.updateCurrComProps('stylePoly.polys', resultPolys)
    }

    changePreviewStyle = (activeKey) => {
        this.props.ViewportAction.updateCurrComProps('stylePoly.previewIdx', +activeKey)
    }

    setDefaultStyle = () => {
        this.props.ViewportAction.updateCurrComProps('stylePoly.defaultIdx', this.props.ViewportStore.currComInfo.props.stylePoly.previewIdx)
    }

    resetStyle = () => {
        const currentProps = this.props.ViewportStore.currComInfo.props;
        let previewIdx = currentProps.stylePoly.previewIdx
        let defaultProps = this.props.ApplicationAction.getComponentClassByKey(currentProps.key).defaultProps
        if (defaultProps.stylePoly) {
            let defaultIdx = defaultProps.stylePoly.polys.length > previewIdx ? previewIdx : 0
            currentProps.stylePoly.polys[previewIdx].style = defaultProps.stylePoly.polys[defaultIdx].style
        } else {
            currentProps.stylePoly.polys[previewIdx].style = defaultProps.style
        }
        // this.eventAction.emit(this.event.componentPropsUpdate, { uniqueKey: mapKey, field, value })
    }

    updateStyleCondition = (conditions: Ndesign.ConditionAtom[]) => {
        this.props.ViewportAction.updateCurrComProps(`stylePoly.polys.${this.props.ViewportStore.currComInfo.props.stylePoly.previewIdx}.condition`, conditions)
    }

    render() {
        let currComKey = this.props.ViewportStore.currComKey;
        if (currComKey === null || !this.props.ViewportStore.currComInfo) {
            return null
        }

        let copyStyle = this.props.CopyPasteStore.copyStyle;
        let copyComponent = copyStyle && this.props.ViewportStore.components.get(copyStyle.comKey);
        let isPasterStyleAble
        if (copyStyle && copyStyle.comKey !== currComKey && copyComponent && copyComponent.props.key === this.props.ViewportStore.currComInfo.props.key) {
            isPasterStyleAble = true
        }
        // 组件样式
        const editCollapse: { title?: string, key?: string, plug?: any }[] = [{ title: '' }];
        const currComProps = this.props.ViewportStore.currComInfo.props;
        currComProps.ndsEdit && currComProps.ndsEdit.style && currComProps.ndsEdit.style.map((editInfo, index) => {
            const key = currComKey + '_style' + index
            // 如果是字符串类型，直接生成标题
            if (editInfo.constructor.name === 'String') {
                let _con = {
                    key,
                    title: editInfo.toString(),
                    plug: []
                }
                if (index === 0) {
                    editCollapse[editCollapse.length - 1] = _con
                } else {
                    editCollapse.push(_con)
                }
            } else {
                editCollapse[editCollapse.length - 1].plug.push({
                    position: editInfo.editor,
                    data: { index, editInfo }
                })
            }
        })
        // 是否支持动态样式
        const tabEditable = !currComProps.stylePoly.frozen

        return (
            <div className="_namespace">
                {this.renderHeaderContainer()}
                <div className="body-container">
                    <div className="container__title">配置</div>
                    {
                        currComProps.ndsEdit && currComProps.ndsEdit.config.map((ndsConfig, index) => {
                            return <div key={currComKey + '-conf-' + index}>
                                {
                                    this.props.ApplicationAction.loadingPluginByPosition(
                                        ndsConfig.editor,
                                        { index: index, editInfo: ndsConfig }
                                    )
                                }
                            </div>
                        })
                    }
                    <div className="container__title">
                        <span className="ti">样式</span>
                        <div className="styleCopy">
                            <Button.Group size="small">
                                <Button onClick={() => this.props.CopyPasteAction.copyStyle()}>复制</Button>
                                {isPasterStyleAble &&
                                    <Button onClick={() => this.props.CopyPasteAction.pasteStyle()}>粘贴</Button>}
                            </Button.Group>
                        </div>
                    </div>
                    <Tabs
                        activeKey={currComProps.stylePoly.previewIdx + ''}
                        animated={false}
                        type={tabEditable ? "editable-card" : "card"}
                        onChange={this.changePreviewStyle}
                        onEdit={(targetKey, action) => {
                            this[`${action}StylePoly`](targetKey)
                        }}
                        tabBarExtraContent={
                            <>
                                {currComProps.stylePoly.previewIdx !== currComProps.stylePoly.defaultIdx && tabEditable &&
                                    <Tooltip title='设置为默认样式'>
                                        <Icon type="check-circle-o" className="ant-tabs-new-tab" onClick={this.setDefaultStyle} />
                                    </Tooltip>
                                }
                                <Tooltip title='重置当前tab样式'>
                                    <Icon type="clear" className="ant-tabs-new-tab" onClick={this.resetStyle} />
                                </Tooltip>
                            </>
                        }>
                        {
                            currComProps.stylePoly.polys.map((stylePoly, idx) => {
                                let isDefault = currComProps.stylePoly.defaultIdx === idx;
                                return <Tabs.TabPane
                                    forceRender
                                    key={idx + ''} className="tab-panel"
                                    tab={
                                        (tabTitle => {
                                            return isDefault ? <Tooltip title='默认样式'>{tabTitle}</Tooltip> : tabTitle
                                        })(<span className={isDefault ? 'defaultStyle' : undefined}>
                                            <Icon type="check-circle-o" className="defaultStyleIcon" />
                                            {stylePoly.name || `样式${idx + 1}`}
                                        </span>)
                                    }>
                                    {!isDefault && <MuiltCondition onChange={this.updateStyleCondition} value={stylePoly.condition} />}
                                </Tabs.TabPane>
                            })
                        }
                    </Tabs>
                    <Collapse bordered={false} activeKey={this.state.activeCollapseKey}
                        onChange={(activeCollapseKey: string[]) => {
                            this.setState({ activeCollapseKey })
                        }}>
                        {editCollapse.map(editInfo =>
                            <Panel header={editInfo.title} key={editInfo.key} >
                                {
                                    editInfo.plug.map((plug) => {
                                        return this.props.ApplicationAction.loadingPluginByPosition(plug.position, plug.data)
                                    })
                                }
                            </Panel>
                        )}
                    </Collapse>
                </div>
            </div>
        )
    }
}