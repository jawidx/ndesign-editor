import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Select, Button, InputNumber, Row, Col, Checkbox } from 'antd'
import { Color } from '../../common'
import * as _ from 'lodash'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ApplicationStore', 'ViewportAction')
@observer
export default class EditorAttributeEffects extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeEffects
    handleChange(field: string, value: any) {
        this.props.ViewportAction.updateCurrComProps(field, value)
    }

    handleChangeShadow(shadowField, value: any) {
        let boxShowValues = this.getBackgroundValue(this.props.ViewportStore.currComInfo.props.style.boxShadow);
        let reValue = [];
        if (shadowField === 'color') {
            value = `rgba(${value.rgb.r}, ${value.rgb.g}, ${value.rgb.b}, ${value.rgb.a})`
        }

        ['hShadow', 'vShadow', 'blur', 'spread', 'color', 'inset'].map((bgField) => {
            if (bgField === shadowField) {
                boxShowValues[bgField] = value
            }

            if (boxShowValues[bgField] || bgField === 'hShadow' || bgField === 'vShadow') {
                if (bgField === 'inset' && boxShowValues[bgField] !== 'inset') {
                    return;
                }
                reValue.push(boxShowValues[bgField])
            }
        })
        this.handleChange('style.boxShadow', reValue.join(' '))
    }

    getBackgroundValue = (value): { hShadow: string, vShadow: string, blur?: string, spread?: string, color?: string, inset?: string } => {
        let valusArr = value && value.match(/([\d]+px+)|(\s0)|(0\s)|((rgba|rgb)\(.*\))|(\#[\w]+)|(inset)/g) || [];
        let result = {
            'hShadow': 0 + 'px',
            'vShadow': 0 + 'px'
        }
        let pxUnit = ['hShadow', 'vShadow', 'blur', 'spread'];
        let _rest = 0;
        for (var i = 0; i < pxUnit.length; i++) {
            _rest = i
            if (_.isUndefined(valusArr[i])) {
                return result;
            }
            let pxRes = parseInt(valusArr[i]);
            if (!_.isNaN(pxRes)) {
                result[pxUnit[i]] = parseInt(valusArr[i]) + 'px'
            } else {
                break;
            }
        }

        if (!_.isUndefined(valusArr[_rest])) {
            if (valusArr[_rest] === 'inset') {
                result['inset'] = valusArr[_rest]
                return result
            }
            result['color'] = valusArr[_rest]
        }

        if (!_.isUndefined(valusArr[_rest + 1])) {
            result['inset'] = valusArr[_rest + 1]
            return result
        }

        return result;
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }
        let currendEditComInfoStyle = this.props.ViewportStore.currComInfo.props.style
        let boxShaowValues = this.getBackgroundValue(currendEditComInfoStyle.boxShadow)
        return (
            <div className="_namespace">
                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">pointerEvents</div>
                        <Select
                            style={{ width: 100 }}
                            defaultValue={currendEditComInfoStyle.pointerEvents || 'auto'}
                            onSelect={(value) => this.handleChange('style.pointerEvents', value)}>
                            {
                                ['auto', 'none', 'visiblepainted', 'visiblefill', 'visiblestroke', 'visible', 'painted', 'fill', 'stroke', 'all'].map((value, idx) => {
                                    return <Select.Option value={value} key={idx}>{value}</Select.Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="row-container">
                    <div className="left-container">
                        <div className="icon-container">Cursor</div>
                        <Select
                            style={{ width: 100 }}
                            defaultValue={currendEditComInfoStyle.cursor || 'auto'}
                            onSelect={(value) => this.handleChange('style.cursor', value)}>
                            {
                                ["auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait", "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "e-resize", "n-resize", "ne-resize", "nw-resize", "s-resize", "se-resize", "sw-resize", "w-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "col-resize", "row-resize", "all-scroll", "zoom-in", "zoom-out", "grab", "grabbing"]
                                    .map((value, idx) => {
                                        return <Select.Option value={value} key={idx}>{value}</Select.Option>
                                    })
                            }
                        </Select>
                    </div>
                </div>
                <div className="row-container">
                    <div className="left-container">
                        <Row style={{ flexGrow: 1 }} className='left-container-boxShadow'>
                            <Col span={8}>boxShadow:</Col>
                            <Col span={16}>
                                {
                                    ['hShadow', 'vShadow', 'blur', 'spread'].map((bfield) => {
                                        let value = parseInt(boxShaowValues[bfield]) || 0;

                                        return <Row key={bfield}>
                                            <Col span={10}>{bfield}</Col>
                                            <Col span={14}>
                                                <Row>
                                                    <InputNumber value={value} size='small' onChange={(value) => this.handleChangeShadow(bfield, value + 'px')} />
                                                </Row>
                                            </Col>
                                        </Row>
                                    })
                                }
                                <Row>
                                    <Col span={10}>inset</Col>
                                    <Col span={14}>
                                        <Row>
                                            <Color onChange={(value) => {
                                                this.handleChangeShadow('color', value)
                                            }}
                                                onChangeComplete={(value) => {
                                                    this.handleChangeShadow('color', value)
                                                }}
                                                color={boxShaowValues.color || 'white'} />
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10}>inset</Col>
                                    <Col span={14}>
                                        <Row>
                                            <Checkbox checked={!!boxShaowValues.inset} onChange={(e) => {
                                                this.handleChangeShadow('inset',
                                                    e.target.checked ? 'inset' : undefined)
                                            }} />
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </div>
                </div>
            </div>
        )
    }
}