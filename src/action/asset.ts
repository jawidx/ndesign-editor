import { observable, toJS } from 'mobx'
import * as LZString from 'lz-string'
import { inject, action } from '../../../util/'
import { ApplicationStore, AssetStore } from '../store'

export default class AssetAction {
    static classFnName = 'AssetAction'
    @inject('AssetStore') private assetStore: AssetStore
    @inject('ApplicationStore') private applicationStore: ApplicationStore

    @observable observeClass = true

    onInit() {
        this.setDefault()
    }

    @action('设置默认数据源')
    setDefault() {
        let extraInfo = this.applicationStore.editorProps.extraInfo;
        if (extraInfo) {
            let extraInfoAssets = ((JSON.parse(LZString.decompressFromBase64(extraInfo) || {}) as Ndesign.AppDataExtraInfo)).assets
            if (extraInfoAssets && extraInfoAssets.imageList) {
                this.assetStore.imageList = extraInfoAssets.imageList
            }
        }
    }

    /**
     * 
     * @param sources 图片url数组，空数据则表示删除index位置的图片
     * @param index 更新位置 不传则为新添加，
     */
    @action('更新图片')
    updateImage(sources: Ndesign.AssestImage[] = [], index: number = -1) {
        if (sources.length > 0) {
            index = index > -1 ? index : this.assetStore.imageList.length;
            this.assetStore.imageList.splice(index, 0, ...sources);
        } else {
            //todo delete
            let _index = index > -1 ? index : 0;
            this.assetStore.imageList.splice((index > -1 ? index : 0), (index > -1 ? 1 : this.assetStore.imageList.length));
        }
    }

    @action('获取store')
    getAssetsStore() {
        return {
            imageList: this.assetStore.imageList
        }
    }
}