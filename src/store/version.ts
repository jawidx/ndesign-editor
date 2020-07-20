import { observable } from 'mobx'

export default class VersionStore {
    static classFnName = 'VersionStore'

    // 当前版本号
    @observable currentVersion = '0.0.0'

    /**
     * 版本列表数组(最近几个版本))
     */
    @observable versionList: Array<Ndesign.GetPublishListResult> = []

}