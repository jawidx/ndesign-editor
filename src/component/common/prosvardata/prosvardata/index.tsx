/**
 * @desc 数据选择以及 数据输入框功能
 */
import * as React from 'react'
import * as _ from 'lodash'
import { Popover, Button } from 'antd';
import { SelectDataSource } from '../../../left-bar-data'
import * as typing from '../type'
import './style.scss'

export default class extends React.Component<typing.PropsDefined, typing.StateDefined>{
    private preInnerHtml: string
    private editorInputEle: HTMLElement
    private forcusEle: Element
    private cpLock: boolean
    private varDatas: Ndesign.PropsVarDataType_coll
    private _contentEditableKey = 0

    private _range: any
    private _dragging: boolean = false
    constructor(props) {
        super(props);
        let initialValue = this.props.value || this.props.defaultValue
        this.varDatas = initialValue && initialValue.colls && this.fixRenderValue(initialValue.colls) || []
        // this.state = {
        //     varDatas: 
        // }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state
    }
    handleEditorBlur = (e) => {
        let range = null;
        if (window.getSelection) {
            range = window.getSelection().getRangeAt(0)
        } else if (document.selection) {
            range = document.selection.createRange();
        }

        this._range = range;
    }
    handleDrag = (e) => {
    }
    handDragStart = (e) => {
        var dt = e.dataTransfer,
            content = e.target.outerHTML;
        dt.effectAllowed = 'copy';
        content = e.target.outerHTML;
        dt.setData('text/plain', e.target.dataset.collidx);
        this._dragging = true;
    }
    handDragEnd = (e) => {
        this._dragging = false;
    }
    handleDrop = (e) => {
        this._dragging = false;

        let dragCollidx = parseInt(e.dataTransfer.getData('text/plain'), 10)
        if (isNaN(dragCollidx) || dragCollidx.constructor.name !== 'Number') {
            return;
        }

        let varDatas = [].concat(this.varDatas)

        let range = null;
        if (document.caretRangeFromPoint) { // Chrome
            range = document.caretRangeFromPoint(e.clientX, e.clientY);
        }
        else if (e.rangeParent) { // Firefox
            range = document.createRange(); range.setStart(e.rangeParent, e.rangeOffset);
        }
        let anchorOffset = range.startOffset;

        let dropCollidx = parseInt(e.target.dataset.collidx, 10);
        if (isNaN(dropCollidx)) {
            dropCollidx = anchorOffset > 0 ? varDatas.length - 1 : 0
        }
        let dropValue = this.varDatas[dropCollidx].value as string

        varDatas.splice(dropCollidx, 1, { value: dropValue.substr(0, anchorOffset) }, { value: dropValue.substr(anchorOffset) })
        if (dragCollidx > dropCollidx) {
            varDatas.splice(dropCollidx + 1, 0, ...varDatas.splice(dragCollidx + 1, 1))
        } else {
            varDatas.splice(dropCollidx, 0, ...varDatas.splice(dragCollidx, 1))
        }

        let resultVarDatas = [];
        varDatas.forEach((data) => {
            let _last = resultVarDatas[resultVarDatas.length - 1];

            //合并字符串数据
            if (!data.type && _last && !_last.type) {
                _last.value += data.value;
                return;
            }
            // 过滤空字符串数据          
            if (!data.type && !data.value) {
                return;
            }
            resultVarDatas.push(data)
        })
        setTimeout(() => {
            this.changeValue(resultVarDatas, () => {
                this._contentEditableKey++
                this.forceUpdate()
            })
        }, 10)
    }
    addVariable = (value: { key: string, dataConf: Ndesign.DataConf }) => {
        let varDatas = [].concat(this.varDatas) as Ndesign.PropsVarDataType_coll;
        let spliceIdx = varDatas.length;
        let startContainer = this._range && this._range.startContainer;
        if (startContainer && startContainer.nodeType === 3) {
            let collidx = parseInt(startContainer.parentElement.dataset.collidx, 10)
            if (!_.isNaN(collidx)) {
                let startOffset = this._range.startOffset;
                let dropValue = varDatas[collidx].value as string
                varDatas.splice(collidx, 1, { value: dropValue.substr(0, this._range.startOffset) }, { value: '' }, { value: dropValue.substr(startOffset) })
                spliceIdx = collidx + 1;
            }
        }

        varDatas.splice(spliceIdx, 1, {
            type: 1,
            value: {
                key: value.key,
                conf: {
                    dataSourceId: value.dataConf.dataSourceId,
                    dataSourceType: value.dataConf.dataSourceType,
                    comKey: value.dataConf.comKey
                }
            }
        })
        // varDatas.push()
        this.changeValue(varDatas, () => {
            this._contentEditableKey++
            this.forceUpdate()
        });
    }
    removeVariable = (idx) => {
        let varDatas = [].concat(this.varDatas) as Ndesign.PropsVarDataType_coll;
        varDatas.splice(idx, 1);
        this.changeValue(varDatas, () => {
            this._contentEditableKey++
            this.forceUpdate()
        });
    }
    handleInputChange = (e) => {
        var htmlEle = e.target as Element,
            innerHtml = '';
        let varDatas = [] as Ndesign.PropsVarDataType_coll;

        if (this.cpLock || this._dragging) {
            return
        }

        htmlEle.childNodes.forEach((node: Element) => {
            if (node.nodeType === 1
                // && node.classList
                // && node.className.indexOf('editorInput__item') > -1
            ) {
                let collIdx = Number((node as any).dataset.collidx);
                if (isNaN(collIdx)) {
                    return;
                }
                innerHtml += node.outerHTML;
                switch ((node as any).dataset.editorInputType) {
                    case '1':
                        varDatas.push(this.varDatas[collIdx])
                        break;
                    default:
                        varDatas.push({ value: this.getInnerText(node) })
                        break;
                }
            }
            if (node.nodeType === 3) {
                varDatas.push({ value: node.textContent })
            }
        })
        this._range = window.getSelection().getRangeAt(0)
        this.changeValue(varDatas, () => {
            // todo
            // setTimeout(() => {
            //     let range = null
            //     let editor = this.editorInputEle;
            //     let sel
            //     if (window.getSelection && document.createRange) {
            //         range = document.createRange();
            //         range.selectNodeContents(editor);
            //         range.collapse(true);
            //         range.setEnd(editor, editor.childNodes.length);
            //         range.setStart(editor, editor.childNodes.length);
            //         sel = window.getSelection();
            //         sel.removeAllRanges();
            //         sel.addRange(range);
            //     } else if (document.body.createTextRange) {
            //         range = document.body.createTextRange();
            //         range.moveToElementText(editor);
            //         range.collapse(true);
            //         range.select();
            //     }
            //     // var sel = window.getSelection();
            //     // sel.removeAllRanges(); sel.addRange(this._range);
            //     // this.editorInputEle.click()

            //     // this.editorInputEle.click()
            // }, 1)

        })
        // if (htmlEle.innerHTML !== innerHtml) {
        //     // // htmlEle.innerHTML = innerHtml
        //     // setTimeout(()=>{
        //     //     this.forceUpdate()
        //     // },100)
        // }
        // if (this.preInnerHtml != innerHtml) {
        //     this.preInnerHtml = innerHtml;
        // }
    }
    getInnerText = (node) => {
        var t = "";
        //如果传入的是元素，则继续遍历其子元素
        //否则假定它是一个数组
        node = node.childNodes || node;

        //遍历所有子节点
        for (var j = 0; j < node.length; j++) {
            //如果不是元素，追加其文本值
            //否则，递归遍历所有元素的子节点
            t += node[j].nodeType != 1 ?
                node[j].nodeValue : this.getInnerText(node[j].childNodes);
        }
        //返回区配的文本
        return t;
    }
    changeValue = (value: Ndesign.PropsVarDataType_coll, callback?) => {
        let result: Ndesign.PropsVarDataType_coll = []
        // 合并字符串数据
        value.forEach((varData) => {
            let _lastResult = result[result.length - 1];
            if (_lastResult && !_lastResult.type && !varData.type) {
                (_lastResult.value as string) += (varData.value as string);
                return;
            }
            result.push(varData)
        })
        this.varDatas = this.fixRenderValue(result);

        this.props.onChange({ colls: result })
        callback && callback()
    }
    fixRenderValue = (value: Ndesign.PropsVarDataType_coll): Ndesign.PropsVarDataType_coll => {
        value = [].concat(value.slice())
        if (!value.length) {
            return value;
        }
        // 前添加一个空元素
        if (!value[0] || value[0].type) {
            value.unshift({ value: '' })
        }
        // last添加一个空元素
        if (!value[value.length - 1] || value[value.length - 1].type) {
            value.push({ value: '' })
        }
        return value
    }
    getValueList = () => {
        let listEle = [];
        let dataLen = this.varDatas.length;
        this.varDatas.forEach((coll, collIdx) => {
            let isSpaceEle = (!collIdx && !coll.type && !coll.value) || (collIdx === dataLen - 1 && !coll.type && !coll.value)
            switch (coll.type) {
                case 1:
                    let cls = ['editorInput__api', 'editorInput__gbData', 'editorInput__comSource', 'editorInput__inSource'][coll.value.conf.dataSourceType || 0]
                    listEle.push(
                        <div
                            tabIndex={collIdx}
                            key={collIdx}
                            data-collidx={collIdx}
                            draggable
                            contentEditable={false}
                            data-editor-input-type={coll.type}
                            className={`editorInput__item editorInput__variable ${cls}`}
                            onDrag={(e) => { this.handleDrag(e) }}
                            onDragStart={this.handDragStart}
                            onDragEnd={this.handDragEnd}
                            onKeyDown={(e) => {
                                e.keyCode === 8 && this.removeVariable(collIdx)
                            }}>
                            {"${" + coll.value.key + "}"}
                        </div>
                    )
                    break;
                case 0:
                default:
                    listEle.push(
                        <div
                            suppressContentEditableWarning
                            contentEditable
                            key={collIdx}
                            data-collidx={collIdx}
                            data-editor-input-type={coll.type}
                            className={`editorInput__item editorInput__text ${isSpaceEle && 'editorInput__space'}`}>
                            {coll.value}
                        </div>
                    )
                    break;
            }
        })
        return listEle
    }
    render() {
        return (
            <div className="_namespace">
                <Popover placement='topRight' content={
                    <SelectDataSource onSelect={this.addVariable}
                        isStopArray={this.props.isStopArray}
                        dataSourceType={this.props.dataSourceType}>
                        <Button>添加变量</Button>
                    </SelectDataSource>
                } trigger="focus">
                    <div className="editorInput"
                        suppressContentEditableWarning={true}
                        contentEditable
                        onCompositionStart={() => {
                            this.cpLock = true;
                        }}
                        onCompositionEnd={(e) => {
                            this.cpLock = false;
                            this.handleInputChange(e);
                        }}
                        ref={(item) => { this.editorInputEle = item }}
                        key={this._contentEditableKey}
                        tabIndex={0}
                        // onInput={(e) => {
                        //     this.handleInputChange(e)
                        // }}
                        // onBlur={this.handleEditorBlur}
                        onBlur={(e) => {
                            this.handleEditorBlur(e)
                            this.handleInputChange(e)
                        }}
                        onDrop={this.handleDrop}>
                        {this.getValueList()}
                    </div>
                </Popover>
            </div>
        )
    }
}
