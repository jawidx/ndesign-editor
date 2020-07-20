import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Tooltip } from 'antd'
const ButtonGroup = Button.Group
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeOverflow extends React.Component<typings.PropsDefine, typings.StateDefine> {
    static position = AttrPosition.editorAttributeOverflow
    constructor(props) {
        super(props);
        this.state = {
            expand: false
        }
    }

    // 判断 overflowX 和 overflowY 是否相同
    isOverflowXYEqual() {
        return this.props.ViewportStore.currComInfo.props.style.overflowX === this.props.ViewportStore.currComInfo.props.style.overflowY || (this.props.ViewportStore.currComInfo.props.style.overflowX === null || this.props.ViewportStore.currComInfo.props.style.overflowX === 'auto') && (this.props.ViewportStore.currComInfo.props.style.overflowY === null || this.props.ViewportStore.currComInfo.props.style.overflowY === 'auto')
    }

    init(props: typings.PropsDefine) {
        if (this.isOverflowXYEqual()) {
            this.setState({
                expand: false
            })
        } else {
            this.setState({
                expand: true
            })
        }
    }

    // 判断是否是一种状态
    isStatu(statu: string) {
        const style = this.props.ViewportStore.currComInfo.props.style

        if ((style.overflow === null || style.overflow === 'visible') && (style.overflowX === null || style.overflowX === 'visible') && (style.overflowY === null || style.overflowY === 'visible')) {
            return statu === 'visible'
        }

        return (style.overflow === statu && style.overflowX === null && style.overflowY === null) || style.overflow === null && style.overflowX === statu && style.overflowY === statu
    }

    handleUpdateCompressValue(field: string, value: Ndesign.ComponentPropsOptionValue) {
        this.props.ViewportAction.updateCurrComProps(field, value)
        this.props.ViewportAction.updateCurrComProps('style.overflowX', null)
        this.props.ViewportAction.updateCurrComProps('style.overflowY', null)
    }

    handleUpdateExpandValue(field: string, value: Ndesign.ComponentPropsOptionValue) {
        this.props.ViewportAction.updateCurrComProps(field, value)
        this.props.ViewportAction.updateCurrComProps('style.overflow', null)
    }

    handleExpand() {
        this.setState({
            expand: true
        })
    }

    handleCompress() {
        this.setState({
            expand: false
        })
    }

    renderOverflow() {
        return (
            <ButtonGroup size='small'>
                <Tooltip title="Visible">
                    <Button {...this.isStatu('visible') && { type: 'primary' }}
                        onClick={this.handleUpdateCompressValue.bind(this, 'style.overflow', 'visible')}>1</Button>
                </Tooltip>
                <Tooltip title="Auto">
                    <Button {...this.isStatu('auto') && { type: 'primary' }}
                        onClick={this.handleUpdateCompressValue.bind(this, 'style.overflow', 'auto')}>2</Button>
                </Tooltip>

                <Tooltip title="Scroll">
                    <Button {...this.isStatu('scroll') && { type: 'primary' }}
                        onClick={this.handleUpdateCompressValue.bind(this, 'style.overflow', 'scroll')}>3</Button>
                </Tooltip>
                <Tooltip title="Hidden">
                    <Button {...this.isStatu('hidden') && { type: 'primary' }}
                        onClick={this.handleUpdateCompressValue.bind(this, 'style.overflow', 'hidden')}>4</Button>
                </Tooltip>
            </ButtonGroup>
        )
    }

    isExpandStatu(field: string, statu: string) {
        const style = this.props.ViewportStore.currComInfo.props.style

        // 如果值是 null，但 overflow 是对应的值，也没问题
        if (style[field] === null && style['overflow'] === statu) {
            return true
        }

        // 如果都是 null，那就是 auto
        if (style[field] === null && style['overflow'] === null) {
            return statu === 'auto'
        }

        return style[field] === statu
    }

    renderOverflowExpand() {
        return (
            <div className="expand-container">
                <ButtonGroup size='small'>
                    <Tooltip title="Visible">
                        <Button {...this.isExpandStatu('overflowX', 'visible') && { type: 'primary' }}
                            onClick={this.handleUpdateExpandValue.bind(this, 'style.overflowX', 'visible')}>1</Button>
                    </Tooltip>
                    <Tooltip title="Auto">
                        <Button {...this.isExpandStatu('overflowX', 'auto') && { type: 'primary' }}
                            onClick={this.handleUpdateExpandValue.bind(this, 'style.overflowX', 'auto')}>2</Button>
                    </Tooltip>
                    <Tooltip title="Scroll">
                        <Button {...this.isExpandStatu('overflowX', 'scroll') && { type: 'primary' }}
                            onClick={this.handleUpdateExpandValue.bind(this, 'style.overflowX', 'scroll')}>3</Button>
                    </Tooltip>
                    <Tooltip title="Hidden">
                        <Button {...this.isExpandStatu('overflowX', 'hidden') && { type: 'primary' }}
                            onClick={this.handleUpdateExpandValue.bind(this, 'style.overflowX', 'hidden')}>4</Button>
                    </Tooltip>
                </ButtonGroup>

                <ButtonGroup size='small'>
                    <Tooltip title="Visible">
                        <Button {...this.isExpandStatu('overflowY', 'visible') && { type: 'primary' }}
                            onClick={this.handleUpdateExpandValue.bind(this, 'style.overflowY', 'visible')}>1</Button>
                    </Tooltip>
                    <Tooltip title="Auto">
                        <Button {...this.isExpandStatu('overflowY', 'auto') && { type: 'primary' }}
                            onClick={this.handleUpdateExpandValue.bind(this, 'style.overflowY', 'auto')}>2</Button>
                    </Tooltip>
                    <Tooltip title="Scroll">
                        <Button {...this.isExpandStatu('overflowY', 'scroll') && { type: 'primary' }}
                            onClick={this.handleUpdateExpandValue.bind(this, 'style.overflowY', 'scroll')}>3</Button>
                    </Tooltip>
                    <Tooltip title="Hidden">
                        <Button {...this.isExpandStatu('overflowY', 'hidden') && { type: 'primary' }}
                            onClick={this.handleUpdateExpandValue.bind(this, 'style.overflowY', 'hidden')}>4</Button>
                    </Tooltip>
                </ButtonGroup>
            </div>
        )
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        const canExpand = !this.state.expand
        const canCompress = this.state.expand && this.isOverflowXYEqual()

        return (
            <div className="_namespace">
                {this.state.expand ?
                    <div className="overflow-expend-label-container">
                        <div className="label-item">OverflowX</div>
                        <div className="label-item">OverflowY</div>
                    </div> :
                    <div>Overflow</div>
                }

                <div className="overflow-expend-button-container">
                    {canExpand &&
                        <Button onClick={this.handleExpand.bind(this)} size='small'><i className="fa fa-expand" /></Button>
                    }
                    {canCompress &&
                        <Button onClick={this.handleCompress.bind(this)} size='small'><i className="fa fa-compress" /></Button>
                    }
                </div>

                <div className="operate-container">
                    {this.state.expand ? this.renderOverflowExpand() : this.renderOverflow()}
                </div>
            </div>
        )
    }
}