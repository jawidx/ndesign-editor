import { observable, runInAction } from 'mobx'
import { inject } from '../../../util/inject-instance'
import { action } from '../../../util/trans-mobx';
import { ApplicationStore, VersionStore } from '../store'

export default class VersionAction {
    static classFnName = 'VersionAction'
    @inject('VersionStore') private versionStore: VersionStore
    @inject('ApplicationStore') private applicationStore: ApplicationStore

    @observable observeClass = true

    onInit() {
        this.versionStore.currentVersion = this.applicationStore.editorProps && this.applicationStore.editorProps.currentVersion
    }

    @action('获取版本') initVersionList(versions: Array<Ndesign.GetPublishListResult>) {
        runInAction(() => {
            versions && versions.forEach(version => {
                this.versionStore.versionList.push(version)
            })
        })
    }

    @action('设置当前最新版本号') setCurrentVersion(version: string, desc?: string) {
        this.versionStore.currentVersion = version
        // 新发布版本
        if (desc) {
            this.publishToVersionList({
                version: version,
                description: desc
            })
        }
    }

    @action('增加刚刚发布的版本到版本列表中') publishToVersionList(versionInfo: Ndesign.GetPublishListResult) {
        // TODO
        // 如果还没有获取过版本信息，不需要添加，添加再获取最新的内容就重复了
        if (this.versionStore.versionList.length > 0) {
            this.versionStore.versionList.unshift(versionInfo)
        }
    }
}