import * as React from 'react'
import * as classNames from 'classnames'
import TransmitTransparently from '../../transmit-transparently'
import * as typings from './type'
import './style.scss'

@TransmitTransparently()
export default class Tree extends React.Component<typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    componentWillMount() {
        this.setState({
            showChildren: this.props.defaultExpendAll || this.props.showChildren
        })
    }

    handleContainerClick(event: Event) {
        this.props.onClick(event)
        if (!this.props.toggleByArrow) {
            this.setState({
                showChildren: !this.state.showChildren
            })
            this.props.onToggleShow(event)
        }
    }

    handleArrowClick(event: Event) {
        this.setState({
            showChildren: !this.state.showChildren
        })
        this.props.onToggleShow(event)
    }

    render() {
        const classes = classNames({
            '_namespace': true,
            [this.props.className]: !!this.props.className
        })

        let childrenStyle = {
            'display': this.state.showChildren ? 'block' : null
        }

        let titleCaretClass = classNames({
            'fit-tree-right': true,
            'down': this.state.showChildren
        })


        let Children = React.Children.map(this.props.children, (item: any) => {
            if (item) {
                return React.cloneElement(item, {
                    defaultExpendAll: this.props.defaultExpendAll,
                    toggleByArrow: this.props.toggleByArrow
                })
            }
        })

        return (
            <div {...this.props.others} className={classes}>
                <div onClick={this.handleContainerClick.bind(this)} className="title">
                    {React.Children.count(this.props.children) > 0
                        ? <div className="title-caret"
                            onClick={this.handleArrowClick.bind(this)}>
                            <i className={titleCaretClass} />
                        </div>
                        : <div className="empty-caret" />
                    }
                    {this.props.title || this.props.render()}
                </div>
                <div style={childrenStyle} className="children">
                    {Children ? Children : null}
                </div>
            </div>
        )
    }
}
