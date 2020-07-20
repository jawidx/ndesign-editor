import { observable } from 'mobx'
import { PropsDefine } from '../type'
import * as _ from 'lodash'

export default class ApplicationStore {
    static classFnName = 'ApplicationStore'
    /**
     * 初始化数据
     */
    init(props: PropsDefine, plugins: Array<Ndesign.Plugin>) {
        this.editorProps = props
        // 拓展插件
        this.plugins = plugins.concat(props.plugins)
        // 设置页面初始信息
        this.pageValue = this.editorProps.defaultValue || null
    }
    // 编辑器外部传参
    editorProps?: PropsDefine

    // 插件列表
    plugins = [] as Array<Ndesign.Plugin>

    // 页面信息
    @observable pageValue: string = 'empty'
    // 视图区域样式
    @observable viewportStyle: React.CSSProperties = {
        backgroundColor: 'white',
        background: null,
        backgroundImage: null,
        width: null,
        height: null,
        flexGrow: 1
    }
    // 视图区域容器样式
    @observable viewportContainerStyle: React.CSSProperties = {
        backgroundColor: 'transparent'
    }

    // 是否在预览模式
    @observable inPreview = false

    // 当前左边栏显示类型（Position）
    @observable leftBarType: number = 0

    // 中间件处理函数
    middleware = new Map<string, Array<any>>()
}