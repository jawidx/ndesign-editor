import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Tooltip, Checkbox, InputNumber } from 'antd'
const ButtonGroup = Button.Group
import Icon from '../../common/icon'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeLayout extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeLayout

    handleUpdateValue(field: string, value: Ndesign.ComponentPropsOptionValue) {
        this.props.ViewportAction.updateCurrComProps(field, value)
    }

    handleChangeReverse(checked: boolean) {
        switch (this.props.ViewportStore.currComInfo.props.style.flexDirection) {
            case 'row':
                this.handleUpdateValue('style.flexDirection', 'row-reverse')
                break
            case 'row-reverse':
                this.handleUpdateValue('style.flexDirection', 'row')
                break
            case 'column':
                this.handleUpdateValue('style.flexDirection', 'column-reverse')
                break
            case 'column-reverse':
                this.handleUpdateValue('style.flexDirection', 'column')
                break
        }
    }

    handleFlexGrowChange(value: any) {
        const intValue = value === '' ? null : parseInt(value)
        this.handleUpdateValue('style.flex', intValue)
    }

    /**
     * flex 选项
     */
    renderFlex() {
        // 判断是否逆序
        let isReverse = false
        switch (this.props.ViewportStore.currComInfo.props.style.flexDirection) {
            case 'row':
                isReverse = false
                break
            case 'row-reverse':
                isReverse = true
                break
            case 'column':
                isReverse = false
                break
            case 'column-reverse':
                isReverse = true
                break
        }
        let currComInfoStyle = this.props.ViewportStore.currComInfo.props.style;

        const isColumn = currComInfoStyle.flexDirection === 'column' || currComInfoStyle.flexDirection === 'column-reverse'

        // 获取 flex-grow 的输入框格式
        let flexGrowString = currComInfoStyle.flexGrow ? currComInfoStyle.flexGrow as number : 0

        const rowStart = !isReverse ? '左' : '右'
        const columnStart = !isReverse ? '上' : '下'
        const rowEnd = !isReverse ? '右' : '左'
        const columnEnd = !isReverse ? '下' : '上'
        const firstLineDirection = !isColumn ? '水平' : '竖直'
        const secondLineDirection = !isColumn ? '竖直' : '水平'

        const rowFlexStart = `${firstLineDirection}方向靠${!isColumn ? rowStart : columnStart}`
        const rowFlexCenter = `${firstLineDirection}方向居中`
        const rowFlexEnd = `${firstLineDirection}方向靠${!isColumn ? rowEnd : columnEnd}`
        const rowFlexSpaceBetween = `${firstLineDirection}方向等间距排列`
        const rowFlexSpaceAround = `${firstLineDirection}方向等间距排列, 两侧留一半空间`

        const columnFlexStart = `${secondLineDirection}方向靠${!isColumn ? '上' : '左'}`
        const columnFlexCenter = `${secondLineDirection}方向居中`
        const columnFlexEnd = `${secondLineDirection}方向靠${!isColumn ? '下' : '右'}`
        const columnFlexStrech = `${secondLineDirection}方向拉伸`
        const columnFlexBaseline = `${secondLineDirection}方向baseline`

        // let isDirRow = currComInfoStyle.flexDirection === 'row' || currComInfoStyle.flexDirection === 'row-reverse';
        let iconClass = !isColumn ? 'horiz-' : ''
        return (
            <div className='layout-top-container-box flex-container'>
                <div className="layout-top-container"
                    style={{ marginTop: 5 }}>
                    <ButtonGroup size='small' className="button-group-inlne">
                        <Tooltip mouseEnterDelay={1} title="Direction:Row">
                            <Button {...(!isColumn) && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.flexDirection', 'row')}>
                                {/* <svg className="svg-icon rotate-180">
                                <use xlinkHref="#flex-row" />
                            </svg> */}
                                水平排列（row）
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title="Direction:Column">
                            <Button {...(isColumn) && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.flexDirection', 'column')}>
                                竖直排列（Column）
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </div>

                <div className="layout-top-container">
                    <ButtonGroup size='small' className="button-group-inlne">
                        <Tooltip mouseEnterDelay={1} title={rowFlexStart}>
                            <Button {...(currComInfoStyle.justifyContent === 'flex-start') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'flex-start')}>
                                <Icon type={`ndssvg-flex-${iconClass}justify-start`} />
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title={rowFlexCenter}>
                            <Button {...(currComInfoStyle.justifyContent === 'center') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'center')}>
                                <Icon type={`ndssvg-flex-${iconClass}justify-center`} />
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title={rowFlexEnd}>
                            <Button {...(currComInfoStyle.justifyContent === 'flex-end') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'flex-end')}>
                                <Icon type={`ndssvg-flex-${iconClass}justify-end`} />
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title={rowFlexSpaceBetween}>
                            <Button {...(currComInfoStyle.justifyContent === 'space-between') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'space-between')}>
                                <Icon type={`ndssvg-flex-${iconClass}justify-space-between`} />
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title={rowFlexSpaceAround}>
                            <Button {...(currComInfoStyle.justifyContent === 'space-around') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.justifyContent', 'space-around')}>
                                <Icon type={`ndssvg-flex-${iconClass}justify-space-around`} />
                            </Button>
                        </Tooltip>
                    </ButtonGroup>

                </div>

                <div className="layout-top-container">
                    <ButtonGroup size='small' className="button-group-inlne">
                        <Tooltip mouseEnterDelay={1} title={columnFlexStart}>
                            <Button {...(this.props.ViewportStore.currComInfo.props.style.alignItems === 'flex-start') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'flex-start')}>
                                <Icon type={`ndssvg-flex-${iconClass}align-start`} />
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title={columnFlexCenter}>
                            <Button {...(this.props.ViewportStore.currComInfo.props.style.alignItems === 'center') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'center')}>
                                <Icon type={`ndssvg-flex-${iconClass}align-center`} />
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title={columnFlexEnd}>
                            <Button {...(this.props.ViewportStore.currComInfo.props.style.alignItems === 'flex-end') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'flex-end')}>
                                <Icon type={`ndssvg-flex-${iconClass}align-end`} />
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title={columnFlexStrech}>
                            <Button {...(this.props.ViewportStore.currComInfo.props.style.alignItems === 'stretch') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'stretch')}>
                                <Icon type={`ndssvg-flex-${iconClass}align-stretch`} />
                            </Button>
                        </Tooltip>
                        <Tooltip mouseEnterDelay={1} title={columnFlexBaseline}>
                            <Button {...(this.props.ViewportStore.currComInfo.props.style.alignItems === 'baseline') && { type: 'primary' }}
                                onClick={this.handleUpdateValue.bind(this, 'style.alignItems', 'baseline')}>
                                <Icon type={`ndssvg-flex-${iconClass}align-baseline`} />
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                </div>

                <div className="second-container">
                    <Checkbox checked={isReverse}
                        onChange={this.handleChangeReverse.bind(this)}
                        style={{ marginTop: 5, flexGrow: 1, width: 0 }}>逆序</Checkbox>
                    <div className="second-container-flex-grow-container">
                        <span>Grow： </span>
                        <InputNumber onChange={this.handleFlexGrowChange.bind(this)}
                            value={flexGrowString} />
                    </div>
                </div>
            </div>
        )
    }

    renderDisplay() {
        return (
            <div className="layout-top-container">
                <ButtonGroup size='small'>
                    <Tooltip mouseEnterDelay={1} title="Block">
                        <Button {...(this.props.ViewportStore.currComInfo.props.style.display === 'block') && { type: 'primary' }}
                            onClick={this.handleUpdateValue.bind(this, 'style.display', 'block')}>
                            <Icon type='ndssvg-display-block' />
                        </Button>
                    </Tooltip>
                    <Tooltip mouseEnterDelay={1} title="InlineBlock">
                        <Button {...(this.props.ViewportStore.currComInfo.props.style.display === 'inline-block') && { type: 'primary' }}
                            onClick={this.handleUpdateValue.bind(this, 'style.display', 'inline-block')}>
                            <Icon type="ndssvg-display-inline-block" />
                        </Button>
                    </Tooltip>
                    <Tooltip mouseEnterDelay={1} title="Inline">
                        <Button {...(this.props.ViewportStore.currComInfo.props.style.display === 'inline') && { type: 'primary' }}
                            onClick={this.handleUpdateValue.bind(this, 'style.display', 'inline')}>
                            <Icon type='ndssvg-display-inline' />
                        </Button>
                    </Tooltip>
                </ButtonGroup>

                <Tooltip mouseEnterDelay={1} title="Flex">
                    <Button size='small' {...(this.props.ViewportStore.currComInfo.props.style.display === 'flex') && { type: 'primary' }}
                        onClick={this.handleUpdateValue.bind(this, 'style.display', 'flex')}>
                        <Icon type='ndssvg-display-flex' />
                    </Button>
                </Tooltip>

                <Tooltip mouseEnterDelay={1} title="inline-flex">
                    <Button size='small' {...(this.props.ViewportStore.currComInfo.props.style.display === 'inline-flex') && { type: 'primary' }}
                        onClick={this.handleUpdateValue.bind(this, 'style.display', 'inline-flex')}>
                        <Icon type='ndssvg-display-flex' />
                    </Button>
                </Tooltip>

                <Tooltip mouseEnterDelay={1} title="None">
                    <Button size='small' {...(this.props.ViewportStore.currComInfo.props.style.display === 'none') && { type: 'primary' }}
                        onClick={this.handleUpdateValue.bind(this, 'style.display', 'none')}>
                        <Icon type='ndssvg-eye' />
                    </Button>
                </Tooltip>
            </div>
        )
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        return (
            <div className="_namespace">
                {this.renderDisplay()}
                {this.props.ViewportStore.currComInfo.props.style.display === 'flex' && this.renderFlex()}
            </div>
        )
    }
}