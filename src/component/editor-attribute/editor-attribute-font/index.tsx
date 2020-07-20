import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Select, Button, Tooltip, InputNumber } from 'antd'
const ButtonGroup = Button.Group
import { Color } from '../../common'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

const fontWeightOpts = [{
    key: '100',
    value: '100 - Thin'
}, {
    key: '200',
    value: '200 - Extra Light'
}, {
    key: '300',
    value: '300 - Light'
}, {
    key: '400',
    value: '400 - Normal'
}, {
    key: '500',
    value: '500 - Medium'
}, {
    key: '600',
    value: '600 - Semi Bold'
}, {
    key: '700',
    value: '700 - Bold'
}, {
    key: '800',
    value: '800 - Extra Bold'
}, {
    key: '900',
    value: '900 - Black'
}]

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeFont extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeFont
    handleChangeFontWeight(value: string) {
        this.props.ViewportAction.updateCurrComProps('style.fontWeight', value)
    }

    handleChangeFontSize(value: string) {
        if (value === '') {
            this.props.ViewportAction.updateCurrComProps('style.fontSize', null)
        } else {
            this.props.ViewportAction.updateCurrComProps('style.fontSize', parseInt(value))
        }
    }

    handleChangeLineHeight(value: string) {
        if (value === '') {
            this.props.ViewportAction.updateCurrComProps('style.lineHeight', null)
        } else {
            this.props.ViewportAction.updateCurrComProps('style.lineHeight', parseFloat(value))
        }
    }

    handleChange(field: string, value: string) {
        this.props.ViewportAction.updateCurrComProps(field, value)
    }

    handleColorChange(color: any) {
        this.props.ViewportAction.updateCurrComProps('style.color', `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
    }

    /**
     * 修改换行属性
     */
    handleChangeWrap(type: number) {
        switch (type) {
            case 1:
                this.props.ViewportAction.updateCurrComProps('style.whiteSpace', null)
                this.props.ViewportAction.updateCurrComProps('style.wordBreak', 'normal')
                break
            case 2:
                this.props.ViewportAction.updateCurrComProps('style.whiteSpace', 'nowrap')
                this.props.ViewportAction.updateCurrComProps('style.wordBreak', 'normal')
                break
            case 3:
                this.props.ViewportAction.updateCurrComProps('style.whiteSpace', null)
                this.props.ViewportAction.updateCurrComProps('style.wordBreak', 'break-all')
                break
        }
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }
        let currendEditComInfoStyle = this.props.ViewportStore.currComInfo.props.style

        return (
            <div className="_namespace">
                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">FW</div>
                        <Select size='small' style={{ width: '100%' }} defaultValue={currendEditComInfoStyle.fontWeight ? currendEditComInfoStyle.fontWeight.toString() : '400'}
                            onChange={this.handleChangeFontWeight.bind(this)} >
                            {
                                fontWeightOpts.map((opt, idx) => {
                                    return <Select.Option value={opt.key} key={idx}>{opt.value}</Select.Option>
                                })
                            }
                        </Select>
                    </div>
                    <div className="right-container">
                        <div className="icon-container">QX</div>
                        <ButtonGroup size='small'>
                            <Tooltip title="普通">
                                <Button {...currendEditComInfoStyle.fontStyle === 'normal' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.fontStyle', 'normal')}>1</Button>
                            </Tooltip>
                            <Tooltip title="倾斜">
                                <Button {...currendEditComInfoStyle.fontStyle === 'italic' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.fontStyle', 'italic')}>2</Button>
                            </Tooltip>
                        </ButtonGroup>
                    </div>
                </div>

                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">Color</div>
                        <Color onChange={this.handleColorChange.bind(this)}
                            color={currendEditComInfoStyle.color || 'rgba(1,1,1,1)'} />
                    </div>
                    <div className="right-container-2">
                        <div className="icon-container">Size</div>
                        <InputNumber size='small'
                            placeholder="Null"
                            {...Number(currendEditComInfoStyle.fontSize) && { defaultValue: Number(currendEditComInfoStyle.fontSize) }}
                            onChange={this.handleChangeFontSize.bind(this)} />
                    </div>
                </div>

                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">行高</div>
                        <InputNumber size='small'
                            step={0.1}
                            placeholder="Null"
                            {...Number(currendEditComInfoStyle.lineHeight) && { defaultValue: Number(currendEditComInfoStyle.lineHeight) }}
                            onChange={this.handleChangeLineHeight.bind(this)} />
                    </div>
                </div>

                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">对齐</div>
                        <ButtonGroup size='small'>
                            <Tooltip title="左对齐">
                                <Button {...currendEditComInfoStyle.textAlign === 'left' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textAlign', 'left')}>1</Button>
                            </Tooltip>
                            <Tooltip title="居中">
                                <Button {...currendEditComInfoStyle.textAlign === 'center' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textAlign', 'center')}>2</Button>
                            </Tooltip>
                            <Tooltip title="右对齐">
                                <Button {...currendEditComInfoStyle.textAlign === 'right' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textAlign', 'right')}>3</Button>
                            </Tooltip>
                            <Tooltip title="左右对齐">
                                <Button {...currendEditComInfoStyle.textAlign === 'justify' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textAlign', 'justify')}>4</Button>
                            </Tooltip>
                        </ButtonGroup>
                    </div>
                </div>

                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">划线</div>
                        <ButtonGroup size='small'>
                            <Tooltip title="无">
                                <Button {...currendEditComInfoStyle.textDecoration === 'none' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textDecoration', 'none')}>1</Button>
                            </Tooltip>
                            <Tooltip title="下划线">
                                <Button {...currendEditComInfoStyle.textDecoration === 'underline' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textDecoration', 'underline')}>2</Button>
                            </Tooltip>
                            <Tooltip title="上划线">
                                <Button {...currendEditComInfoStyle.textDecoration === 'overline' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textDecoration', 'overline')}>3</Button>
                            </Tooltip>
                            <Tooltip title="中划线">
                                <Button {...currendEditComInfoStyle.textDecoration === 'line-through' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textDecoration', 'line-through')}>4</Button>
                            </Tooltip>
                            <Tooltip title="中下划线">
                                <Button {...currendEditComInfoStyle.textDecoration === 'underline line-through' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textDecoration', 'underline line-through')}>5</Button>
                            </Tooltip>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">换行</div>
                        <ButtonGroup size='small'>
                            <Tooltip title="自动">
                                <Button {...currendEditComInfoStyle.wordBreak === 'normal' && currendEditComInfoStyle.whiteSpace === null && { type: 'primary' }}
                                    onClick={this.handleChangeWrap.bind(this, 1)}>1</Button>
                            </Tooltip>
                            <Tooltip title="不换行">
                                <Button {...currendEditComInfoStyle.whiteSpace === 'nowrap' && { type: 'primary' }}
                                    onClick={this.handleChangeWrap.bind(this, 2)}>2</Button>
                            </Tooltip>
                            <Tooltip title="强制换行">
                                <Button {...currendEditComInfoStyle.wordBreak === 'break-all' && { type: 'primary' }}
                                    onClick={this.handleChangeWrap.bind(this, 3)}>3</Button>
                            </Tooltip>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">text-overflow</div>
                        <ButtonGroup size='small'>
                            <Tooltip title="裁剪">
                                <Button {...!currendEditComInfoStyle.textOverflow || currendEditComInfoStyle.textOverflow === 'clip' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textOverflow', 'clip')}>clip</Button>
                            </Tooltip>
                            <Tooltip title="省略符">
                                <Button {...currendEditComInfoStyle.textOverflow === 'ellipsis' && { type: 'primary' }}
                                    onClick={this.handleChange.bind(this, 'style.textOverflow', 'ellipsis')}>ellipsis</Button>
                            </Tooltip>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        )
    }
}