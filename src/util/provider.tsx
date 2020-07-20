import * as React from 'react'
import { Provider } from 'mobx-react'
import { PropsDefine as EditorPropsDefine } from '../type'
import * as _ from 'lodash'
import injectInstance from '../../../util/inject-instance'

import PluginGlobalSetting from '../component/setting'
import PluginViewportSize from '../component/viewport-size'
import PluginViewportGuideline from '../component/viewport-guideline'
import PluginViewportResizable from '../component/viewport-resizable'
import PluginEditorPreview from '../component/preview'
import PluginEditorSave from '../component/save'
import PluginEditorPublish from '../component/publish'
import PluginVersion from '../component/version'
import PluginCopyPaste from '../component/copy-paste'
import PluginDelete from '../component/delete'
import PluginShowLayout from '../component/show-layout'
import PluginCrumbs from '../component/crumbs'

import { LeftBarComponentsListButton, LeftBarComponentsList } from '../component/left-bar-component'
import { LeftBarAssetsEditorButton, leftBarAssetsEditor } from '../component/left-bar-asset'
import { EditorSourceLeftButton, DataSourceEditor } from '../component/left-bar-data'

import PluginEditorTabs from '../component/editor-tabs'
import PluginEditorTabsEvent from '../component/editor-tabs-event'
import PluginEditorTabsData from '../component/editor-tabs-data'
import PluginEditorTabsTree from '../component/editor-tabs-tree'

import PluginEditorTabsAttribute from '../component/editor-tabs-attribute'
import PluginEditorAttributeText from '../component/editor-attribute/editor-attribute-text'
import PluginEditorAttributeNumber from '../component/editor-attribute/editor-attribute-number'
import PluginEditorAttributeBackground from '../component/editor-attribute/editor-attribute-background'
import PluginEditorAttributeBorder from '../component/editor-attribute/editor-attribute-border'
import PluginEditorAttributeFont from '../component/editor-attribute/editor-attribute-font'
import PluginEditorAttributeInstance from '../component/editor-attribute/editor-attribute-instance'
import PluginEditorAttributeLayout from '../component/editor-attribute/editor-attribute-layout'
import PluginEditorAttributeMarginPadding from '../component/editor-attribute/editor-attribute-margin-padding'
import PluginEditorAttributeOverflow from '../component/editor-attribute/editor-attribute-overflow'
import PluginEditorAttributePosition from '../component/editor-attribute/editor-attribute-position'
import PluginEditorAttributeSelect from '../component/editor-attribute/editor-attribute-select'
import PluginEditorAttributeSwitch from '../component/editor-attribute/editor-attribute-switch'
import PluginEditorAttributeWidthHeight from '../component/editor-attribute/editor-attribute-width-height'
import PluginEditorAttributeEffects from '../component/editor-attribute/editor-attribute-effects'
import PluginEditorAttributeInput from '../component/editor-attribute/editor-attribute-input'

import { ApplicationAction, ViewportAction, EditorEventAction } from '../action'
import { ApplicationStore, ViewportStore, EditorEventStore } from '../store'

const pluginList: Array<Ndesign.Plugin> = [
    PluginGlobalSetting,
    PluginViewportSize,
    PluginEditorPreview,
    PluginEditorSave,
    PluginEditorPublish,
    PluginVersion,
    PluginCopyPaste,
    PluginDelete,
    PluginShowLayout,
    PluginViewportGuideline,
    PluginViewportResizable,
    PluginCrumbs,

    // 左部 组件列表区域
    LeftBarComponentsListButton,
    LeftBarComponentsList,
    // 左部 source 编辑区
    EditorSourceLeftButton,
    DataSourceEditor,
    // 左部 媒体资源管理区
    LeftBarAssetsEditorButton,
    leftBarAssetsEditor,

    // 右侧
    PluginEditorTabs,
    PluginEditorTabsEvent,
    PluginEditorTabsData,
    PluginEditorTabsTree,
    PluginEditorTabsAttribute,
    PluginEditorAttributeText,
    PluginEditorAttributeNumber,
    PluginEditorAttributeBackground,
    PluginEditorAttributeBorder,
    PluginEditorAttributeFont,
    PluginEditorAttributeInstance,
    PluginEditorAttributeLayout,
    PluginEditorAttributeMarginPadding,
    PluginEditorAttributeOverflow,
    PluginEditorAttributePosition,
    PluginEditorAttributeSelect,
    PluginEditorAttributeSwitch,
    PluginEditorAttributeWidthHeight,
    PluginEditorAttributeEffects,
    PluginEditorAttributeInput,
]

export interface ProviderContainerProps {
    /**
     * 编辑器外部传参
     */
    editorProps?: EditorPropsDefine
}

/**
 * 生成 Provider
 */
export default class ProviderContainer extends React.Component<ProviderContainerProps, any> {
    private providerActionAndStores: {
        [injectName: string]: any
    } = {}

    componentWillMount() {
        const pluginActionStores: Array<any> = []
        pluginList.forEach(plugin => {
            if (plugin.Action) {
                pluginActionStores.push(plugin.Action)
            }
            if (plugin.Store) {
                pluginActionStores.push(plugin.Store)
            }
        })

        let storeActions = {};
        [EditorEventAction, ApplicationAction, ViewportAction, EditorEventStore, ApplicationStore, ViewportStore, ...pluginActionStores].forEach((storeAction) => {
            storeActions[storeAction.classFnName] = storeAction;
        })
        /**
         * 注入核心框架的数据流
         */
        const instances = injectInstance(storeActions)
        // 先初始化 applicationStore
        instances.get('ApplicationStore').init(this.props.editorProps, pluginList)

        instances.forEach(instance => {
            if (_.endsWith(instance.constructor.name, 'Action')) {
                // 执行 onInit 生命周期
                instance.onInit && instance.onInit.call(instance)
            }
        })

        /**
         * mobx 注入核心框架的数据流
         */
        instances.forEach((value, key) => {
            this.providerActionAndStores[key] = value
        })
    }

    render() {
        return (
            <Provider {...this.providerActionAndStores}>
                {this.props.children}
            </Provider>
        )
    }
}