/**
 * @desc 各种输入类型集合
 */
import * as React from 'react'
import { ProsVarData, SimpleProsVarData, SpecTypePropsVarData } from '../prosvardata'
import JsonEditor from '../json-editor'
import { Button } from 'antd'
import * as typing from './type'

const InputEditor: React.SFC<typing.PropsDefined> = (props) => {
    let { type, inputType, ...othersProps } = props || {} as typing.PropsDefined;
    let Editor: React.ComponentClass
    if (type === 'json') {
        return <JsonEditor {...othersProps} >
            <Button {...props.value && { type: 'primary' }}> {props.value ? '修改' : '添加'} </Button>
        </JsonEditor>
    }
    switch (inputType) {
        case 'simplePD':
            return (
                <SimpleProsVarData {...othersProps}>
                    <Button {...props.value && { type: 'primary' }}> {props.value ? '修改' : '添加'} </Button>
                </SimpleProsVarData>
            );
        case 'specPD':
            Editor = SpecTypePropsVarData;
            break;
        default:
            Editor = ProsVarData;
    }
    return <Editor {...othersProps} />
}

export default InputEditor
