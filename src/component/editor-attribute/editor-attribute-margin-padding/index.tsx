import * as React from 'react'
import { observer, inject } from 'mobx-react'
import MarginPaddingEditor from './margin-padding-editor'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction')
@observer
export default class EditorAttributeMarginPadding extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeMarginPadding

    handleStart() {
    }

    handleChange(name: string, value: number) {
        // 直接改值
        this.props.ViewportAction.updateCurrComProps(`style.${name}`, value)
    }

    handleFinalChange(name: string, value: number) {
        this.props.ViewportAction.updateCurrComProps(`style.${name}`, value)
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        return (
            <div className="_namespace">
                <MarginPaddingEditor size={220}
                    onStart={this.handleStart.bind(this)}
                    marginLeft={this.props.ViewportStore.currComInfo.props.style.marginLeft}
                    marginTop={this.props.ViewportStore.currComInfo.props.style.marginTop}
                    marginRight={this.props.ViewportStore.currComInfo.props.style.marginRight}
                    marginBottom={this.props.ViewportStore.currComInfo.props.style.marginBottom}
                    paddingLeft={this.props.ViewportStore.currComInfo.props.style.paddingLeft}
                    paddingTop={this.props.ViewportStore.currComInfo.props.style.paddingTop}
                    paddingRight={this.props.ViewportStore.currComInfo.props.style.paddingRight}
                    paddingBottom={this.props.ViewportStore.currComInfo.props.style.paddingBottom}
                    onChange={this.handleChange.bind(this)}
                    onFinalChange={this.handleFinalChange.bind(this)} />
            </div>
        )
    }
}