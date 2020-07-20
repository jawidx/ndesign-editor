import * as React from 'react'

export interface PropsDefine {
    /**
     * 插件列表
     */
    plugins?: Array<Ndesign.Plugin>
    /**
     * 通用组件
     */
    baseComponents?: Array<React.ComponentClass<Ndesign.ComponentProps>>

    /**
     * 根布局元素的 key
     */
    rootLayoutKey?: string

    /**
     * 页面初始化信息
     */
    defaultValue?: string
    /**
     * 默认配置信息
     */
    defaultSetting?: string
    /**
     * 扩展信息
     */
    extraInfo?: string

    /**
     * 保存的回调
     */
    onSave?: (saveInfo: Ndesign.saveInfo) => void
    /**
     * 发布的回调
     */
    onPublish?: (version: string, desc: string, callback?: () => void) => void
    /**
     * 当前版本号
     */
    currentVersion?: string
    /**
     * 获取发布列表
     */
    onGetPublishList?: (callback?: (result: Array<Ndesign.GetPublishListResult>) => void) => void
    /**
     * 预览版本内容(内容是根版本走的，但配置一个编辑器只有一份)
     */
    onPreviewVersion?: (version?: string) => void
    /**
     * 切换版本号
     */
    onSwitchVersion?: (version?: string, callback?: (result: string) => void) => void

    /**
     * 自定义组件的配置文件，当然还是优先使用组件 props 中的配置
     */
    customOptions?: {
        [className: string]: Ndesign.ComponentProps
    }

    // onLocalStore 临时存储接口，外部实现
    onLocalStore?: (saveInfo: { content: any, setting: any, extraInfo: any }) => void
    // localStoreTime 临时存储时间间隔
    localStoreTime?: number

    initDataConf?: Ndesign.DataConf_in[]
    nativeConfig?: {
        type: string
        name: string
        // bridge?:any
        projects?: { pid: string, name: string }[]
    }[]
    [x: string]: any
}

export class Props implements PropsDefine {
    plugins = [] as Array<Ndesign.Plugin>
    baseComponents = [] as Array<React.ComponentClass<Ndesign.ComponentProps>>
    rootLayoutKey = 'nd-layout'
    defaultValue = null as string
    defaultSetting = null as string
    onSave = () => {
    }
    onPublish = () => {
    }
    onGetPublishList = () => {
    }
    onSwitchVersion = () => {
    }
    onPreviewVersion = () => {
    }
    currentVersion = '0.0.0'
    customOptions = null as any
    onLocalStore = () => { }
    localStoreTime = 10000
}
