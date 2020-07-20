import { observable, extendObservable } from 'mobx'
import { inject } from '../../../util/inject-instance'
import { action } from '../../../util/trans-mobx';
import * as LZString from 'lz-string'
import ApplicationAction from './application'
import { SettingStore } from '../store'

export default class SettingAction {
    static classFnName = 'SettingAction'
    @inject('SettingStore') private setting: SettingStore
    @inject('ApplicationAction') private applicationAction: ApplicationAction

    @observable observableClass = true
    
    @action('覆盖默认配置信息')
    setDefaultSetting(setting: string) {
        if (setting) {
            this.setting = extendObservable(this.setting || {}, JSON.parse(LZString.decompressFromBase64(setting)))
        }
    }

    @action('修改任意配置信息')
    changeCustomSetting(key: string, value: string) {
        this.setting[key] = value
    }

    @action('设置视图区域宽度')
    setViewportSize(width: number, height: number) {
        this.setting.vWidth = width
        this.setting.vHeight = height
        if (this.setting.fitInWeb === 'mobile') {
            this.applicationAction.setViewportStyle({
                width: width,
                height: height
            })
        }
    }

    @action('修改网页适配')
    changeFitInWeb(type: string) {
        this.setting.fitInWeb = type
        if (type === 'pc') {
            // 适配网页
            this.applicationAction.setViewportStyle({
                width: null,
                height: null,
                flexGrow: 1
            })
        } else {
            // 适配手机
            this.applicationAction.setViewportStyle({
                flexGrow: null,
                width: this.setting.vWidth,
                height: this.setting.vHeight
            })
        }
    }

    @action('获取压缩的配置信息')
    getZipSettingData() {
        return LZString.compressToBase64(JSON.stringify(this.setting))
    }
}