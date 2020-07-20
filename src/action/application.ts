import * as React from 'react'
import { inject } from '../../../util/inject-instance'
import { action } from '../../../util/trans-mobx';
import { extendObservable, observable } from 'mobx'
import ApplicationStore from '../store/application'
import deepDiff from '../util/deep-diff'
import * as _ from 'lodash'

export default class ApplicationAction {
    static classFnName = 'ApplicationAction'
    @inject('ApplicationStore') private application: ApplicationStore
    @observable observableClass = true

    @action('加载位置插件')
    loadingPluginByPosition(position, props: any = {}): Array<React.ReactElement<any>> {
        return this.application.plugins.map((plugin, index) => {
            if (plugin.position === position) {
                props.key = index
                return React.createElement(plugin, props)
            }
        })
    }

    @action('设置视图区块样式')
    setViewportStyle(style: React.CSSProperties) {
        this.application.viewportStyle = extendObservable(this.application.viewportStyle, style)
    }

    @action('设置视图区块父级样式')
    setViewportContainerStyle(style: React.CSSProperties) {
        this.application.viewportContainerStyle = extendObservable(this.application.viewportContainerStyle, style)
    }

    @action('重置视图区块样式')
    resetViewportStyle() {
        this.application.viewportStyle = {}
    }

    @action('根据 key 获取组件类')
    getComponentClassByKey(key: string) {
        // 从通用、定制组件中查找
        const allComponents = this.application.editorProps.baseComponents;
        return allComponents.find(component => component.defaultProps.key === key)
    }

    @action('设置预览状态')
    setPreview(inPreview: boolean) {
        this.application.inPreview = inPreview
    }

    @action('触发左边栏')
    toggleLeftBar(type: number) {
        this.application.leftBarType = this.application.leftBarType === type ? 0 : type;
    }

    /**
     * 将 componentInfo 不需要保存的信息都移除
     */
    cleanComponent(componentInfo: Ndesign.ViewportComponentInfo) {
        // 转成标准格式
        const planComponentInfo: Ndesign.ViewportComponentInfo = JSON.parse(JSON.stringify(componentInfo))

        // layoutChilds 长度为 0 就干掉
        if (planComponentInfo.layoutChilds && planComponentInfo.layoutChilds.length === 0) {
            delete planComponentInfo.layoutChilds
        }

        planComponentInfo.props = this.cleanComponentProps(planComponentInfo.props)
        if (planComponentInfo.props === null) {
            delete planComponentInfo.props
        }

        return JSON.parse(JSON.stringify(planComponentInfo))
    }

    /**
     * 将 props 中不需要保存的数据都清除
     */
    cleanComponentProps(componentProps: Ndesign.ComponentProps) {
        // 获取这个组件的 defaultProps
        const defaultProps = _.cloneDeep(this.getComponentClassByKey(componentProps.key).defaultProps)
        let planComponentProps = JSON.parse(JSON.stringify(componentProps)) as Ndesign.ComponentProps

        // 把 defaultProps 中相同的内容从 props 中剥离掉
        const deepDiffProps = deepDiff(planComponentProps, defaultProps) as Ndesign.ComponentProps
        deepDiffProps.stylePoly.polys.forEach((poly) => {
            poly.style = deepDiff(poly.style, defaultProps.style)
        })

        // 一定要留着 key
        deepDiffProps.key = planComponentProps.key

        planComponentProps = deepDiffProps
        delete planComponentProps.icon
        delete planComponentProps.event
        delete planComponentProps.ndsEdit

        if (planComponentProps.eventData && planComponentProps.eventData.length === 0) {
            delete planComponentProps.eventData
        }

        if (_.isEmpty(planComponentProps.style)) {
            delete planComponentProps.style
        }

        const middlewares = this.application.middleware.get('cleanComponentProps')
        if (middlewares) {
            middlewares.forEach(middleware => {
                planComponentProps = middleware(planComponentProps)
            })
        }

        // 如果 props 已经被删完了, 直接删掉 props
        if (!planComponentProps || Object.keys(planComponentProps).length === 0) {
            return null
        }

        return planComponentProps
    }

    /**
     * 把组件完整信息补回来，根据 defaultProps
     */
    expendComponent(componentInfo: Ndesign.ViewportComponentInfo) {
        // 转成标准格式
        const planComponentInfo = _.toPlainObject<Ndesign.ViewportComponentInfo>(componentInfo)

        planComponentInfo.props = this.expendComponentProps(planComponentInfo.props)

        return planComponentInfo
    }

    /**
     * 补全组件 props
     */
    expendComponentProps(componentProps: Ndesign.ComponentProps) {
        // 转成标准格式
        let planComponentProps = _.toPlainObject<Ndesign.ComponentProps>(componentProps)

        // 获取这个组件的 defaultProps
        const defaultProps = _.cloneDeep(this.getComponentClassByKey(planComponentProps.key).defaultProps)

        planComponentProps = _.merge(defaultProps, planComponentProps)

        // 恢复 stylepoly默认样式
        planComponentProps.stylePoly && _.forEach(planComponentProps.stylePoly.polys, (poly) => {
            poly.style = _.merge({}, planComponentProps.style, poly.style)
        })

        return planComponentProps
    }

    /**
    * 注册函数处理中间件
    */
    middlewareRegister(viewportFunctionName: string, func: any) {
        if (!this.application.middleware.has(viewportFunctionName)) {
            this.application.middleware.set(viewportFunctionName, [func])
        } else {
            const funcs = this.application.middleware.get(viewportFunctionName)
            this.application.middleware.set(viewportFunctionName, funcs.concat(func))
        }
    }
}