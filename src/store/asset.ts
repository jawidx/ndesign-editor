import { observable } from 'mobx'

export default class AssetsStore {
    static classFnName = 'AssetStore'
    // 图片
    @observable imageList: Array<Ndesign.AssestImage> = [
        // {
        //     "id": "48214049671",
        //     "name": "c8ea15ce36d3d5393103f2ca3187e950352ab0f9",
        //     "url": "http://imgsrc.baidu.com/forum/pic/item/c8ea15ce36d3d5393103f2ca3187e950352ab0f9.jpg",
        //     "width": 60,
        //     "height": 60
        // }
    ]
}