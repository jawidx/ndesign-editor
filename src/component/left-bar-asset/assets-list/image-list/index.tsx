import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import { Spin, Icon, Button } from 'antd'
import * as RcUpload from 'rc-upload'
import * as axios from 'axios'
import * as _ from 'lodash'
import './styles.scss'

interface StateDefine {
    fileList?: UploadImage[]
}
// 上传图片
export enum UploadFileStatus {
    'error',
    'success',
    'done',
    'uploading',
    'removed'
}
export type UploadImage = Ndesign.AssestImage & {
    status?: UploadFileStatus;
    percent?: number;
    error?: any;
}


// return {
//     lastModified: file.lastModified,
//     lastModifiedDate: file.lastModifiedDate,
//     name: file.filename || file.name,
//     size: file.size,
//     type: file.type,
//     uid: file.uid,
//     response: file.response,
//     error: file.error,
//     percent: 0,
//     originFileObj: file,
//     status: null
// };
function fileToObject(file, response?): UploadImage {
    return {
        id: file.uid,
        name: file.filename || file.name,
        url: response && `https://imgsrc.baidu.com/forum/pic/item/${response.info.pic_id_encode}.jpg` || '',
        width: response && response.info.fullpic_width as number || 0,
        height: response && response.info.fullpic_height as number || 0,
        percent: 0,
        status: null
    }
}

@inject('ViewportAction', 'AssetStore', 'AssetAction')
@observer
export default class extends React.Component<any, StateDefine> {
    // public state: StateDefine = {}
    fileSelectorInput: HTMLInputElement
    listEle: any
    constructor(props) {
        super(props)
        let { imageList = [] } = this.props.AssetStore
        this.state = {
            fileList: imageList.slice()
        }
    }
    componentDidMount() {
        this.listEle && this.props.ViewportAction.registerOuterDrag(ReactDOM.findDOMNode(this.listEle) as HTMLElement)
    }

    render() {
        let tbs = _.get(window, '__PRELOADED_STATE__.auth.tbs', '')
        return (
            <div className="_namespace">
                <RcUpload
                    action={`//up.photo.baidu.com/upload/pic?tbs=${tbs}&save_yun_album=1`}
                    withCredentials
                    multiple
                    headers={
                        {
                            'X-Requested-With': null
                        }
                    }
                    onStart={(file) => {
                        this.setState({
                            fileList: [].concat(this.state.fileList)
                                .concat(_.assign(fileToObject(file), { status: UploadFileStatus.uploading }))
                        })
                    }}
                    onProgress={(e, file) => {
                        let fileList = [].concat(this.state.fileList)
                        let fileIdx = fileList.findIndex((fileitem) => { return fileitem.id === file.uid })
                        if (fileIdx > -1) {
                            let fileData = _.assign({}, fileList[fileIdx], { status: UploadFileStatus.uploading, percent: e.percent })
                            fileList.splice(fileIdx, 1, fileData)
                            this.setState({ fileList })
                        }
                    }}
                    onSuccess={(response, file) => {
                        let fileList = [].concat(this.state.fileList)
                        let fileIdx = fileList.findIndex((fileitem) => { return fileitem.id === file.uid })
                        if (fileIdx > -1) {
                            let fileData = _.assign(fileToObject(file, response), { status: UploadFileStatus.success, percent: 100 })
                            fileList.splice(fileIdx, 1, fileData)
                            this.setState({ fileList })
                            this.props.AssetAction.updateImage([fileData])
                        }
                    }}
                    onError={(error, response, file) => {
                        console.log('upload error,', error)
                    }} >
                    <Button>
                        <Icon type="upload" /> 上传
                    </Button>
                </RcUpload>
                <div className="imageList" ref={(item) => { this.listEle = item }}>
                    {
                        this.state.fileList && this.state.fileList.map((fileData, idx) => {
                            return (
                                <div className="imageItem" key={idx}
                                    data-unique-key='nd-image'
                                    data-default-props={JSON.stringify({ _ndsSource: fileData.url })}>
                                    <div className="imageItem__inner">
                                        <div className="imageItem__imageBox">
                                            {fileData.url
                                                ? <img src={fileData.url} className="imageItem__image" />
                                                : <Spin />}
                                        </div>
                                        <div className="imageItem__name">{fileData.name}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div >
        )
    }
}