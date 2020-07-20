import { observable, toJS } from 'mobx'
import { inject } from '../../../util/inject-instance'
import { action } from '../../../util/trans-mobx';
import { message } from 'antd'
import { ViewportStore, CopyPasteStore } from '../store'
import ViewportAction from './viewport'
import * as _ from 'lodash'

export default class CopyPasteAction {
    static classFnName = 'CopyPasteAction'
    @inject('CopyPasteStore') private copyPaste: CopyPasteStore
    @inject('ViewportAction') private viewportAction: ViewportAction
    @inject('ViewportStore') private viewport: ViewportStore

    @observable observeClass = true

    @action('复制') copy(key: string) {
        if (!key) {
            return
        }
        let copyData = this.viewportAction.getCptFullInfoByKey(key);
        this.copyPaste.copyComponent = copyData;
        window.localStorage.setItem('ndesign-copy-component', JSON.stringify(copyData))

    }

    @action('粘贴') paste(parentKey: string) {
        if (!parentKey) {
            return false
        }
        let copyData = this.copyPaste.copyComponent;
        // 粘贴板没有内容，不会拷贝
        if (!copyData) {
            let cookieData = window.localStorage.getItem('ndesign-copy-component')
            copyData = cookieData && JSON.parse(cookieData)
            if (!copyData) {
                return false
            }
        }
        window.localStorage.removeItem('ndesign-copy-component')

        const parentComponent = this.viewport.components.get(parentKey)
        if (!parentComponent.props.canDragIn) {
            return false
        }

        // 返回一个新 mapKey 的 copy 对象
        const newCopyComponent = this.viewportAction.createCopyComponent(copyData, parentKey)
        // 增长组件
        this.viewportAction.addComboComponent(parentKey, newCopyComponent, parentComponent.layoutChilds.length)

        return true
    }

    @action('复制样式') copyStyle() {
        if (!this.viewport.currComInfo) {
            return
        }
        this.copyPaste.copyStyle = {
            comKey: this.viewport.currComKey,
            stylePoly: _.cloneDeep(toJS(this.viewport.currComInfo.props.stylePoly))
        };
        message.success('已复制')
    }

    @action('粘贴') pasteStyle() {
        const pasteComponent = this.viewport.currComInfo

        if (!this.viewport.currComInfo) {
            message.error('请选择粘贴对象')
            return false
        }

        const copyComponent = this.viewport.components.get(this.copyPaste.copyStyle.comKey)

        if (!copyComponent) {
            message.error('请复制样式')
            return false
        }
        if (pasteComponent.props.key !== copyComponent.props.key) {
            return MSFIDOCredentialAssertion
        }

        this.viewportAction.updateCurrComProps('stylePoly', _.cloneDeep(toJS(this.copyPaste.copyStyle.stylePoly)))
        message.success('粘贴成功')
        return true
    }
}