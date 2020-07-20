import * as React from 'react'
import { observer, inject } from 'mobx-react'
import * as _ from 'lodash'
import { Button, Tooltip, Input } from 'antd'
const ButtonGroup = Button.Group
const InputGroup = Input.Group
import Icon from '../../common/icon'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributePosition extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributePosition

    handleUpdate(field: string, value: string) {
        if (this.props.ViewportStore.currComInfo.props.style.position === value) {
            value = null
        }
        if (value === 'relative' || !value) {
            this.props.ViewportAction.updateCurrComProps('style.left', null)
            this.props.ViewportAction.updateCurrComProps('style.top', null)
            this.props.ViewportAction.updateCurrComProps('style.right', null)
            this.props.ViewportAction.updateCurrComProps('style.bottom', null)
            this.props.ViewportAction.updateCurrComProps('style.zIndex', null)
        } else if (value === 'absolute' || value == 'fixed') {
            this.props.ViewportAction.updateCurrComProps('style.left', 0)
            this.props.ViewportAction.updateCurrComProps('style.top', 0)
            this.props.ViewportAction.updateCurrComProps('style.right', null)
            this.props.ViewportAction.updateCurrComProps('style.bottom', null)
            this.props.ViewportAction.updateCurrComProps('style.zIndex', 1)
        }
        this.props.ViewportAction.updateCurrComProps(field, value)
        setTimeout(() => {
            this.forceUpdate()
        })
    }

    stringifyNumber(count: any): any {
        let _value = parseInt(count);
        if (isNaN(_value)) {
            return '';
        }

        return _value;
    }

    parseToNumber(numberc: any) {
        if (numberc === '') {
            return null as number
        } else {
            return parseInt(numberc)
        }
    }

    getLeftOrRight() {
        if (this.props.ViewportStore.currComInfo.props.style.left === null) {
            return 'right'
        } else {
            return 'left'
        }
    }

    getTopOrBottom() {
        if (this.props.ViewportStore.currComInfo.props.style.top === null) {
            return 'bottom'
        } else {
            return 'top'
        }
    }

    handleChangePositionNumber(position: string, e: any) {
        this.props.ViewportAction.updateCurrComProps(`style.${position}`, this.parseToNumber(e.target.value))
        setTimeout(() => {
            this.forceUpdate()
        })
    }

    handleChangePosition(x: string, y: string) {
        if (x === 'left') {
            this.props.ViewportAction.updateCurrComProps('style.left', 0)
            this.props.ViewportAction.updateCurrComProps('style.right', null)
        } else {
            this.props.ViewportAction.updateCurrComProps('style.left', null)
            this.props.ViewportAction.updateCurrComProps('style.right', 0)
        }

        if (y === 'top') {
            this.props.ViewportAction.updateCurrComProps('style.top', 0)
            this.props.ViewportAction.updateCurrComProps('style.bottom', null)
        } else {
            this.props.ViewportAction.updateCurrComProps('style.top', null)
            this.props.ViewportAction.updateCurrComProps('style.bottom', 0)
        }
        setTimeout(() => {
            this.forceUpdate()
        })
    }

    handleChangeZindex(e: any) {
        this.props.ViewportAction.updateCurrComProps(`style.zIndex`, this.parseToNumber(e.target.value))
        setTimeout(() => {
            this.forceUpdate()
        })
    }

    getActulPosition() {
        let _dom = this.props.ViewportStore.currComDom;
        let { top, right, bottom, left } = this.props.ViewportStore.currComInfo.props.style
        let result
        let style = window.getComputedStyle(_dom, null)
        if (_dom) {
            result = _.mapValues({ top, right, bottom, left }, function (num, key) {
                let value = { v: Number(num) } as any
                if (isNaN(value.v) || num === null) {
                    value = { isAct: true, v: parseFloat(style[key]) }

                }
                return value;
            });
            return result;
        }
        return null
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }
        let offsetValue: {
            [key in 'top' | 'left' | 'bottom' | 'right']: { v: string, isAct: boolean }
        } = this.getActulPosition();
        const currentStyle = this.props.ViewportStore.currComInfo.props.style;
        return (
            <div className="_namespace">
                <ButtonGroup>
                    <Tooltip title="相对上一个元素位置布局">
                        <Button style={{ padding: '0 10px' }}
                            {...currentStyle.position === 'relative' && { type: 'primary' }}
                            onClick={this.handleUpdate.bind(this, 'style.position', 'relative')}>相对定位</Button>
                    </Tooltip>

                    <Tooltip title="悬浮在相对页面之上">
                        <Button style={{ padding: '0 10px' }}
                            {...currentStyle.position === 'absolute' && { type: 'primary' }}
                            onClick={this.handleUpdate.bind(this, 'style.position', 'absolute')}>绝对定位</Button>
                    </Tooltip>
                    <Tooltip title="悬浮在屏幕之上">
                        <Button style={{ padding: '0 10px' }}
                            {...currentStyle.position === 'fixed' && { type: 'primary' }}
                            onClick={this.handleUpdate.bind(this, 'style.position', 'fixed')}>Fixed定位</Button>
                    </Tooltip>
                </ButtonGroup>

                {(currentStyle.position === 'relative' || currentStyle.position === 'absolute' || currentStyle.position === 'fixed') &&
                    <div className="absolute-container">
                        {(currentStyle.position === 'absolute' || currentStyle.position === 'fixed') && <div>
                            <div className="row">
                                <div className="position-control-container">
                                    <Button className="left-top"
                                        {...this.getLeftOrRight() === 'left' && this.getTopOrBottom() === 'top' && { type: 'primary' }}
                                        onClick={this.handleChangePosition.bind(this, 'left', 'top')}>
                                        <Icon className="icon" type='ndssvg-corner-top-right' />
                                    </Button>
                                    <Button className="right-top"
                                        {...this.getLeftOrRight() === 'right' && this.getTopOrBottom() === 'top' && { type: 'primary' }}
                                        onClick={this.handleChangePosition.bind(this, 'right', 'top')}>
                                        <Icon className="icon" type='ndssvg-corner-top-right' />
                                    </Button>
                                    <Button className="left-bottom"
                                        {...this.getLeftOrRight() === 'left' && this.getTopOrBottom() === 'bottom' && { type: 'primary' }}
                                        onClick={this.handleChangePosition.bind(this, 'left', 'bottom')}>
                                        <Icon className="icon" type='ndssvg-corner-top-right' />
                                    </Button>
                                    <Button className="right-bottom"
                                        {...this.getLeftOrRight() === 'right' && this.getTopOrBottom() === 'bottom' && { type: 'primary' }}
                                        onClick={this.handleChangePosition.bind(this, 'right', 'bottom')}>
                                        <Icon className="icon" type='ndssvg-corner-top-right' />
                                    </Button>
                                </div>
                                <div className="position-number-container">
                                    <InputGroup>
                                        <Input addonBefore={<Icon type="ndssvg-position-left" className="positionLeft" />}
                                            style={{ width: '50%' }}
                                            type='number'
                                            onChange={this.handleChangePositionNumber.bind(this, 'left')}
                                            placeholder={offsetValue.left.v}
                                            value={!offsetValue.left.isAct ? offsetValue.left.v : ''}
                                        />
                                        <Input addonBefore={<Icon type="ndssvg-position-left" className="positionTop" />}
                                            type='number'
                                            style={{ width: '50%' }}
                                            /* style={{ marginLeft: 5 }} */
                                            onChange={this.handleChangePositionNumber.bind(this, 'top')}
                                            placeholder={offsetValue.top.v}
                                            value={!offsetValue.top.isAct ? offsetValue.top.v : ''}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <Input addonBefore={<Icon type="ndssvg-position-left" className="positionBottom" />}
                                            type='number'
                                            style={{ width: '50%' }}
                                            onChange={this.handleChangePositionNumber.bind(this, 'bottom')}
                                            placeholder={offsetValue.bottom.v}
                                            value={!offsetValue.bottom.isAct ? offsetValue.bottom.v : ''}
                                        />
                                        <Input addonBefore={<Icon type="ndssvg-position-left" className="positionRight" />}
                                            type='number'
                                            style={{ width: '50%' }}
                                            onChange={this.handleChangePositionNumber.bind(this, 'right')}
                                            placeholder={offsetValue.right.v}
                                            value={!offsetValue.right.isAct ? offsetValue.right.v : ''}
                                        />
                                    </InputGroup>
                                </div>
                            </div>
                        </div>}

                        <div className="row"
                            style={{ marginTop: 10 }}>
                            <Input addonBefore={'zIndex'}
                                type='number'
                                onChange={this.handleChangeZindex.bind(this)}
                                value={this.stringifyNumber(this.props.ViewportStore.currComInfo.props.style.zIndex)} />
                        </div>
                    </div>
                }
            </div>
        )
    }
}