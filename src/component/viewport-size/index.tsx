import * as React from 'react'
import * as classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import { ViewportAction, SettingAction } from '../../action'
import { ApplicationStore, SettingStore } from '../../store'
import { Position } from '../../helper'
import './style.scss'

export interface PropsDefine {
    ApplicationStore?: ApplicationStore
    SettingStore?: SettingStore
    SettingAction?: SettingAction
    ViewportAction?: ViewportAction
}

@inject('ApplicationStore', 'SettingStore', 'ViewportAction', 'SettingAction')
@observer
export default class ViewportSize extends React.Component<PropsDefine, any> {
    static position = Position.navbarRight

    componentWillMount() {
        let { fitInWeb, vWidth, vHeight } = this.props.SettingStore;
        this.props.SettingAction.changeFitInWeb(fitInWeb)
        this.props.SettingAction.setViewportSize(vWidth, vHeight)
    }

    changeFitInWeb = (type: string) => {
        this.props.SettingAction.changeFitInWeb(type)
    }

    changeMobileSize = (width: number, height: number) => {
        this.props.SettingAction.changeFitInWeb('mobile')
        this.props.SettingAction.setViewportSize(width, height)
    }

    render() {
        const mobileClasses = classNames({
            'menu-item': true,
            'mobile-root': true,
            'viewport-size-active': this.props.SettingStore.fitInWeb === 'mobile'
        })
        const desktopClasses = classNames({
            'menu-item': true,
            'viewport-size-active': this.props.SettingStore.fitInWeb === 'pc'
        })
        let { fitInWeb, vWidth, vHeight } = this.props.SettingStore;
        const isMobile = fitInWeb === 'mobile';
        return (
            <div className="_namespace no-style">
                <div className={mobileClasses}>
                    <i className="fa fa-mobile" />
                    <div className="mobile-container">
                        <div className={classNames({
                            'phone': true,
                            'active': isMobile && vWidth === 720 / 2 && vHeight === 1280 / 2
                        })}
                            onClick={this.changeMobileSize.bind(this, 720 / 2, 1280 / 2)}>
                            <i className="fa fa-mobile" />
                            <div>Android</div>
                        </div>
                        <div className={classNames({
                            'phone': true,
                            'active': isMobile && vWidth === 750 / 2 && vHeight === 1334 / 2
                        })}
                            onClick={this.changeMobileSize.bind(this, 750 / 2, 1334 / 2)}>
                            <i className="fa fa-mobile" />
                            <div>iPhone6s/8</div>
                        </div>
                        <div className={classNames({
                            'phone': true,
                            'active': isMobile && vWidth === 1242 / 3 && vHeight === 2208 / 3
                        })}
                            onClick={this.changeMobileSize.bind(this, 1242 / 3, 2208 / 3)}>
                            <i className="fa fa-mobile" />
                            <div>iPhone8P</div>
                        </div>
                        <div className={classNames({
                            'phone': true,
                            'active': isMobile && vWidth === 1125 / 3 && vHeight === 2436 / 3
                        })}
                            onClick={this.changeMobileSize.bind(this, 1125 / 3, 2436 / 3)}>
                            <i className="fa fa-mobile" />
                            <div>iPhoneX</div>
                        </div>
                    </div>
                </div>
                <div className={desktopClasses} onClick={this.changeFitInWeb.bind(this, 'pc')}>
                    <i className="fa fa-desktop" />
                </div>
            </div>
        )
    }
}