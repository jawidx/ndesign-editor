
import { observe } from 'mobx'
import { inject } from '../../../util/inject-instance'
import { action } from '../../../util/trans-mobx';
import * as _ from 'lodash'
import * as LZString from 'lz-string'
import ApplicationStore from '../store/application'
import DataStore from '../store/data'

export default class DataAction {
    static classFnName = 'DataAction'
    @inject('DataStore') private dataStore: DataStore
    @inject('ApplicationStore') private applicationStore: ApplicationStore

    onInit() {
        this.setDefaultDataConfs()
        this.dataStore.updateMockSource(this.dataStore.dataConfs)
        observe(this.dataStore.dataConfs, ({ object }) => {
            this.dataStore.updateMockSource(object)
        })
    }

    @action('设置默认数据源')
    setDefaultDataConfs() {
        let defaultValue = this.applicationStore.editorProps.defaultValue;
        let unDataSources = ((JSON.parse(LZString.decompressFromBase64(defaultValue)) || {}) as Ndesign.AppData).dataConfs || [];
        let extraInfo = this.applicationStore.editorProps.extraInfo;
        if (unDataSources && extraInfo) {
            // 还原接口数据源datajson数据
            let extraDataConfs = ((JSON.parse(LZString.decompressFromBase64(extraInfo) || {}) as Ndesign.AppDataExtraInfo)).extraDataConfs
            if (extraDataConfs) {
                unDataSources.forEach((source) => {
                    if (extraDataConfs[source.dataSourceId]) {
                        _.assign(source, extraDataConfs[source.dataSourceId])
                    }
                })
            }
        }
        // initData
        let initDataConf = this.applicationStore.editorProps.initDataConf
        initDataConf && initDataConf.forEach((dataConf) => {
            unDataSources.unshift(dataConf)
        })
        this.dataStore.dataConfs = unDataSources
    }

    @action('添加数据源')
    addDataConf(dataConf: Ndesign.DataConf) {
        this.dataStore.dataConfs.push(dataConf)
    }

    @action('更新数据源')
    updateDataConf(index: number, dataConf: Ndesign.DataConf) {
        this.dataStore.dataConfs.splice(index, 1, dataConf)
    }

    @action('删除数据源')
    removeDataConf(index: number) {
        this.dataStore.dataConfs.splice(index, 1)
    }

    @action('获取数据源信息')
    getDataConf(): {
        dataConfs?: Ndesign.DataConf[]
        extraDataConfs?: any
    } {
        let dataConfs = JSON.parse(JSON.stringify(this.dataStore.dataConfs)) as Ndesign.DataConf[]
        let extraDataConfs = {}
        // 去除接口数据源 json
        dataConfs.forEach((dataConf) => {
            if (!dataConf.dataSourceType) {
                extraDataConfs[dataConf.dataSourceId] = { dataSourceJson: dataConf.dataSourceJson };
                delete dataConf.dataSourceJson;
            }
        })
        // 去除内部数据源
        dataConfs = dataConfs.filter((dconf) => { return dconf.dataSourceType !== 3 })
        return {
            dataConfs: dataConfs,
            extraDataConfs: extraDataConfs
        }
    }

    @action('切换模拟数据能力')
    switchMockPreviewAble() {
        this.dataStore.mockPreviewAble = !this.dataStore.mockPreviewAble;
        if (this.dataStore.mockPreviewAble) {
            this.dataStore.updateMockSource()
        }
    }
}