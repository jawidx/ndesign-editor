import * as React from 'react'
import * as classNames from 'classnames'
import TransmitTransparently from '../../transmit-transparently'
import * as typings from './type'
import './style.scss'

@TransmitTransparently()
export default class Tree extends React.Component <typings.PropsDefine, any> {
    static defaultProps: typings.PropsDefine = new typings.Props()

    render() {
        const classes = classNames({
            '_namespace': true,
            [this.props.className]: !!this.props.className
        })

        let Children = React.Children.map(this.props.children, (item: any) => {
            return React.cloneElement(item, {
                defaultExpendAll: this.props.defaultExpendAll,
                toggleByArrow: this.props.toggleByArrow
            })
        })

        return (
            <div {...this.props.others} className={classes}>
                {Children}
            </div>
        )
    }
}
                