import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { AttrPosition } from 'ND-Component/ndesign-viewer/component-helper'
import * as typings from './type'
import './style.scss'

@inject('ViewportStore', 'ViewportAction', 'ApplicationAction')
@observer
export default class EditorAttributeInstance extends React.Component<typings.PropsDefine, any> {
    static position = AttrPosition.editorAttributeInstance
    // 当前编辑组件的 class
    private ComponentClass: React.ComponentClass<Ndesign.ComponentProps>

    componentWillMount() {
        // 获取当前要渲染的组件 class
        this.ComponentClass = this.props.ApplicationAction.getComponentClassByKey(this.props.ViewportStore.currComInfo.props.key)
    }

    handleApplyProps(props: any) {
        Object.keys(props).forEach(key => {
            this.props.ViewportAction.updateCurrComProps(key, props[key])
        })
    }

    render() {
        if (this.props.ViewportStore.currComKey === null) {
            return null
        }

        // this.props.ViewportStore.currComInfo.props.ndsEdit.config[]
        const componentInstances = this.props.ViewportStore.currComInfo.props.ndsEdit.config[this.props.index].instance.map((props, index) => {
            const instanceElement = React.createElement(this.ComponentClass, props)
            return (
                <div key={index}
                    onClick={this.handleApplyProps.bind(this, props)}
                    className="instance-item">{instanceElement}</div>
            )
        })

        return (
            <div className="_namespace">
                {componentInstances}
            </div>
        )
    }
}