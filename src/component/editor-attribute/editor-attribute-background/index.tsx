import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Button } from 'antd'
const ButtonGroup = Button.Group
import { ProsVarData, InputUnit, Icon, Color } from '../../common'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeBackground extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeBackground

    handleBackgroundColorChange = (color: any) => {
        this.props.ViewportAction.updateCurrComProps('style.backgroundColor', `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`)
    }

    handleBackgroundImage = (src: any) => {
        this.props.ViewportAction.updateCurrComProps('style.backgroundImage', src)
    }

    handleBackgroundSizeChange = (value) => {
        this.props.ViewportAction.updateCurrComProps('style.backgroundSize', value)
    }

    handleBackgroundPositionChange = (value) => {
        this.props.ViewportAction.updateCurrComProps('style.backgroundPosition', value)
    }

    handleBackgroundRepeatChange = (value) => {
        this.props.ViewportAction.updateCurrComProps('style.backgroundRepeat', value)
    }

    renderSizeInput(label: string, field: string, defaultValue: any = 'auto') {
        let curBackgroundSize: string = this.props.ViewportStore.currComInfo.props.style.backgroundSize || ''
        let sizeMap = curBackgroundSize.split(' ');
        let currentUnit = 'px';
        let value = '';
        if (sizeMap[0] !== '' && sizeMap[0] !== 'cover' && sizeMap[0] !== 'contain') {
            sizeMap.length == 1 && sizeMap.push(sizeMap[0]);
            let sizeMatch = field === 'width' ? sizeMap[0] : sizeMap[1]

            let match = sizeMatch.match(/^(\d+)(px|%)$/);
            if (match) {
                currentUnit = match[2];
                value = match[1];
            }
        }
        const units = [{
            key: 'px',
            value: 'px'
        }, {
            key: '%',
            value: '%'
        }]

        return (
            <div className="input-container">
                <span className="input-container-label">{label}</span>
                {
                    <InputUnit
                        value={value}
                        units={units}
                        placeholder={defaultValue}
                        curUnit={currentUnit}
                        onChange={(value) => {
                            // if(  )
                            let sizeValue = []
                            sizeValue = sizeMap.length < 2 ? ['auto', 'auto'] : sizeMap
                            if (field === 'width') {
                                sizeValue[0] = value.value === '' ? 'auto' : value.value + value.unit;
                            } else {
                                sizeValue[1] = value.value === '' ? 'auto' : value.value + value.unit;
                            }

                            this.handleBackgroundSizeChange(sizeValue.join(' '))
                            // this.handleChangeSizeInput(field, value.value, value.unit)
                        }} />
                }
            </div>
        )
    }

    renderPositionInput = (label: string, field: string, defaultValue: any = '0%') => {
        let curBackgroundSize: string = this.props.ViewportStore.currComInfo.props.style.backgroundPosition || ''
        let sizeMap = curBackgroundSize.split(' ');
        let currentUnit = 'px';
        let value = '';
        if (sizeMap.length > 0) {
            sizeMap.length == 1 && sizeMap.push(sizeMap[0]);
            let sizeMatch = field === 'x' ? sizeMap[0] : sizeMap[1]

            let match = sizeMatch.match(/^(\d+)(px|%)$/);
            if (match) {
                currentUnit = match[2];
                value = match[1];
            }
        }
        const units = [{
            key: 'px',
            value: 'px'
        }, {
            key: '%',
            value: '%'
        }]

        return (
            <div className="input-container">
                <span className="input-container-label">{label}</span>
                {
                    <InputUnit
                        value={value}
                        units={units}
                        placeholder={defaultValue}
                        curUnit={currentUnit}
                        onChange={(value) => {
                            // if(  )
                            let sizeValue = []
                            sizeValue = sizeMap.length < 2 ? ['0%', '0%'] : sizeMap
                            if (field === 'x') {
                                sizeValue[0] = value.value === '' ? '0%' : value.value + value.unit;
                            } else {
                                sizeValue[1] = value.value === '' ? '0%' : value.value + value.unit;
                            }

                            this.handleBackgroundPositionChange(sizeValue.join(' '))
                        }} />
                }
            </div>
        )
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }
        let currendEditStyle = this.props.ViewportStore.currComInfo.props.style;
        let bgImage = currendEditStyle.backgroundImage

        return (
            <div className="_namespace">
                <div className="container">
                    <div className="container__label">Color</div>
                    <div className="container__input">
                        <Color color={currendEditStyle.backgroundColor || 'transparent'}
                            onChange={this.handleBackgroundColorChange} />
                    </div>
                </div>
                <div className="container">
                    <div className="container__label">Image</div>
                    <div className="container__input">
                        <ProsVarData
                            /* disabled={this.props.editInfo.editable === false} */
                            onChange={(value) => {
                                this.handleBackgroundImage(value)
                            }}
                            defaultValue={bgImage} />
                    </div>
                </div>
                <div className="container">
                    <div className="container__label">Size</div>
                    <div className="container__input">
                        <div className="container__second">
                            {this.renderSizeInput('宽(x)', 'width')}
                            {this.renderSizeInput('高(y)', 'height')}
                        </div>
                        <div className="container__second buttonGroup">
                            <ButtonGroup >
                                <Button  {...(currendEditStyle.backgroundSize === 'cover') && { type: 'primary' }}
                                    onClick={() => {
                                        this.handleBackgroundSizeChange('cover')
                                    }}>Cover</Button>
                                <Button {...(currendEditStyle.backgroundSize === 'contain') && { type: 'primary' }}
                                    onClick={() => {
                                        this.handleBackgroundSizeChange('contain')
                                    }}>Contain</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="container__label">Position</div>
                    <div className="container__input">
                        <div className="container__second">
                            {this.renderPositionInput('left(x)', 'x')}
                            {this.renderPositionInput('top(y)', 'y')}
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="container__label">Repeat</div>
                    <div className="container__input">
                        <ButtonGroup size='small'>
                            <Button  {...(currendEditStyle.backgroundRepeat === 'repeat' || !currendEditStyle.backgroundRepeat) && { type: 'primary' }}
                                onClick={() => {
                                    this.handleBackgroundRepeatChange('repeat')
                                }}><Icon type='ndssvg-dots-nine' /></Button>
                            <Button {...(currendEditStyle.backgroundRepeat === 'repeat-x') && { type: 'primary' }}
                                onClick={() => {
                                    this.handleBackgroundRepeatChange('repeat-x')
                                }}><Icon type='ndssvg-dots-three' /></Button>
                            <Button {...(currendEditStyle.backgroundRepeat === 'repeat-y') && { type: 'primary' }}
                                onClick={() => {
                                    this.handleBackgroundRepeatChange('repeat-y')
                                }}><Icon type='ndssvg-dots-three' className='rotate-90' /></Button>
                            <Button {...(currendEditStyle.backgroundRepeat === 'no-repeat') && { type: 'primary' }}
                                onClick={() => {
                                    this.handleBackgroundRepeatChange('no-repeat')
                                }}><Icon type='ndssvg-none' /></Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        )
    }
}