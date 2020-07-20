import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Button, InputNumber } from 'antd'
import { Icon, Color } from '../../common'
const ButtonGroup = Button.Group
import * as _ from 'lodash'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

const ForWords = ['Top', 'Right', 'Bottom', 'Left'];
const ForWordsRadius = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'];

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeBorder extends React.Component<typings.PropsDefine, typings.StateDefine> {
    public state: typings.StateDefine = new typings.State()
    static position = AttrPosition.editorAttributeBorder

    /**
     * 获取统一的边框弧度
     */
    getCommonBorderRadius() {
        // 计算统一圆角弯度
        let borderRadius = null

        if (this.state.selectRadius) {
            borderRadius = this.props.ViewportStore.currComInfo.props.style[`border${this.state.selectRadius.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())}Radius`]
        } else {
            let isAllSome = !['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].some((item) => {
                let _radius = this.props.ViewportStore.currComInfo.props.style[`border${item}Radius`];
                if (borderRadius === null) {
                    borderRadius = _radius
                    return false
                }
                if (borderRadius !== _radius) {
                    return true
                }
                borderRadius = _radius
                return false
            })
            if (!isAllSome) {
                borderRadius = null
            }
        }
        return borderRadius
    }

    /**
     * 统一边框弧度变化
     */
    handleCommonBorderRadiusChange = (value: any) => {
        value = value === '' ? null : (parseFloat(value) || 0);

        ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].forEach((forword) => {
            if (!this.state.selectRadius || this.state.selectRadius.toLowerCase() === forword.toLowerCase()) {
                this.props.ViewportAction.updateCurrComProps(`style.border${forword}Radius`, value)
            }
        })
    }

    handleRadiusClick(position: any) {
        this.setState({
            selectRadius: position
        })
    }

    getCommonBorder() {
        let style: string
        let width: number
        let color: string

        ForWords.forEach((forword) => {
            if (this.state[`select${forword}`]) {
                width = this.props.ViewportStore.currComInfo.props.style[`border${forword}Width`]
                style = this.props.ViewportStore.currComInfo.props.style[`border${forword}Style`]
                color = this.props.ViewportStore.currComInfo.props.style[`border${forword}Color`]
            }
        })
        return { style, width, color }
    }

    handleBorderClick(position: string) {
        const commonBorder = this.getCommonBorder()
        ForWords.concat(['All']).forEach((posi) => {
            this.setState({
                [`select${posi}`]: position === _.toLower(posi)
            })
        })
    }

    handleBorderStyleChange(style: string) {
        ForWords.forEach((forword) => {
            if (this.state[`select${forword}`] || this.state.selectAll) {
                this.props.ViewportAction.updateCurrComProps(`style.border${forword}Style`, style)
            }
        })
    }

    handleBorderColorChange(color: any) {
        const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`

        if (this.state.selectLeft || this.state.selectTop || this.state.selectRight || this.state.selectBottom || this.state.selectAll) {
            ForWords.forEach((forword) => {
                if (this.state[`select${forword}`] || this.state.selectAll) {
                    this.props.ViewportAction.updateCurrComProps(`style.border${forword}Color`, rgba)
                }
            })
        }
    }

    handleBorderColorChangeComplete(color) {
        // TODO
        // this.setState({
        //     borderColor: color
        // })
    }

    handleBorderWidthChange(value: string) {
        if (this.state.selectLeft || this.state.selectTop || this.state.selectRight || this.state.selectBottom || this.state.selectAll) {
            ForWords.forEach((forword) => {
                if (this.state[`select${forword}`] || this.state.selectAll) {
                    this.props.ViewportAction.updateCurrComProps(`style.border${forword}Width`, parseFloat(value))
                }
            })
        }
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        const borderRadius = this.getCommonBorderRadius()
        const commonBorder = this.getCommonBorder()

        return (
            <div className="_namespace">
                <div className="border-container">
                    <div className="left-container">
                        <Button size='small' className="border-left"
                            {...this.state.selectLeft && { type: 'primary' }}
                            onClick={this.handleBorderClick.bind(this, 'left')}>
                            <Icon type='ndssvg-border-left' />
                        </Button>
                        <Button size='small' className="border-top"
                            {...this.state.selectTop && { type: 'primary' }}
                            onClick={this.handleBorderClick.bind(this, 'top')}>
                            <Icon type='ndssvg-border-left' className='rotate-90' />
                        </Button>
                        <Button size='small' className="border-right"
                            {...this.state.selectRight && { type: 'primary' }}
                            onClick={this.handleBorderClick.bind(this, 'right')}>
                            <Icon type='ndssvg-border-left' className='rotate-180' />
                        </Button>
                        <Button size='small' className="border-bottom"
                            {...this.state.selectBottom && { type: 'primary' }}
                            onClick={this.handleBorderClick.bind(this, 'bottom')}>
                            <Icon type='ndssvg-border-left' className='rotate-270' />
                        </Button>
                        <Button size='small' className="border-all"
                            {...this.state.selectAll && { type: 'primary' }}
                            onClick={this.handleBorderClick.bind(this, 'all')}>
                            <Icon type='ndssvg-border' className='rotate-270' />
                        </Button>
                    </div>

                    <div className="right-container">
                        <div className="row">
                            <div className="icon-title">Style</div>
                            <ButtonGroup size='small' >
                                <Button {...commonBorder.style === 'none' && { type: 'primary' }}
                                    onClick={this.handleBorderStyleChange.bind(this, 'none')}><Icon type='ndssvg-none' /></Button>
                                <Button {...commonBorder.style === 'solid' && { type: 'primary' }}
                                    onClick={this.handleBorderStyleChange.bind(this, 'solid')}>
                                    <Icon type='ndssvg-solid' />
                                </Button>
                                <Button {...commonBorder.style === 'dashed' && { type: 'primary' }}
                                    onClick={this.handleBorderStyleChange.bind(this, 'dashed')}>
                                    <Icon type='ndssvg-dashed' />
                                </Button>
                                <Button {...commonBorder.style === 'dotted' && { type: 'primary' }}
                                    onClick={this.handleBorderStyleChange.bind(this, 'dotted')}>
                                    <Icon type='ndssvg-dotted' />
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div className="row">
                            <div className="icon-title">Width</div>
                            <InputNumber
                                min={0}
                                defaultValue={commonBorder.width ? commonBorder.width : 0}
                                onChange={this.handleBorderWidthChange.bind(this)} />
                        </div>
                        <div className="row">
                            <div className="icon-title">Color</div>
                            <Color onChange={this.handleBorderColorChange.bind(this)}
                                onChangeComplete={this.handleBorderColorChangeComplete.bind(this)}
                                color={commonBorder.color || 'white'} />
                        </div>
                    </div>
                </div>

                <div className="radius-container">
                    <div className="left-container">
                        <div className="radius-content">
                            <Button size='small' className="radius-left"
                                {...this.state.selectRadius === 'topLeft' && { type: 'primary' }}
                                onClick={this.handleRadiusClick.bind(this, 'topLeft')}>
                                <Icon type='ndssvg-border-radius' className='rotate-270' />
                            </Button>
                            <Button size='small' className="radius-top"
                                {...this.state.selectRadius === 'topRight' && { type: 'primary' }}
                                onClick={this.handleRadiusClick.bind(this, 'topRight')}>
                                <Icon type='ndssvg-border-radius' />
                            </Button>
                            <Button size='small' className="radius-right"
                                {...this.state.selectRadius === 'bottomRight' && { type: 'primary' }}
                                onClick={this.handleRadiusClick.bind(this, 'bottomRight')}>
                                <Icon type='ndssvg-border-radius' className='rotate-90' />
                            </Button>
                            <Button size='small' className="radius-bottom"
                                {...this.state.selectRadius === 'bottomLeft' && { type: 'primary' }}
                                onClick={this.handleRadiusClick.bind(this, 'bottomLeft')}>
                                <Icon type='ndssvg-border-radius' className=' rotate-180' />
                            </Button>

                            <Button size='small' className="radius-all"
                                {...!this.state.selectRadius && { type: 'primary' }}
                                onClick={this.handleRadiusClick.bind(this, '')}>
                                <Icon type='ndssvg-border-radius-all' />
                            </Button>
                        </div>
                    </div>

                    <div className="right-container">
                        <div className="row">
                            <div className="icon-title">边距</div>
                            <InputNumber
                                min={0}
                                // {...borderRadius !== null && { defaultValue: borderRadius }}
                                onChange={this.handleCommonBorderRadiusChange}
                                value={borderRadius === null ? '' : borderRadius} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}