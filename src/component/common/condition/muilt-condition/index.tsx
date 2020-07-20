/**
 * @desc   多种条件编辑器 (多种条件)
 * @prop   ModelFormType
 *              1.  conditionDatas  条件列表
 *              2.  onChange        条件列表变化
 * @return  Ndesign.ConditionAtom
 */

import * as React from 'react'
import * as _ from 'lodash'
import { ModalHelp, ModalHelpProps } from 'ND-Util'
import { Popconfirm, Tag, Button } from 'antd'
import ConditionComponent from '../single-condition'

interface PropsDefined {
    value?: Ndesign.ConditionAtom[]
    onChange?: (conditionDatas: Ndesign.ConditionAtom[]) => void
}

@ModalHelp
export default class extends React.Component<ModalHelpProps & PropsDefined, any>{
    componentWillMount() {
        this.props.observeModalClose(() => {
            this.props.removeModalStateData()
        })
    }
    updateCondition = (conditionData: Ndesign.ConditionAtom, idx: number = -1) => {
        let resultCondition = [].concat((this.props.value || []).slice())
        idx = _.isNaN(Number(idx)) ? -1 : Number(idx);
        if (conditionData) {
            idx > -1 ? resultCondition.splice(idx, 1, conditionData) : resultCondition.push(conditionData)
        } else if (idx > -1) {
            resultCondition.splice(idx, 1)
        }
        this.props.onChange(resultCondition)
    }

    render() {
        let modalData = this.props.getModalStateData<{ curIdx: number }>();
        return <div>
            {
                (this.props.value || []).map((condition: Ndesign.ConditionAtom, index) => {
                    return (
                        <Popconfirm trigger='hover' title={condition.desc} okText='编辑' cancelText='删除'
                            onConfirm={() => {
                                this.props.storeModalStateData({ curIdx: index })
                                this.props.openModal()
                            }}
                            onCancel={() => {
                                this.updateCondition(null, index)
                            }}>
                            <Tag key={index} className='condition__itemTag' > 条件{index + 1} </Tag>
                        </Popconfirm>
                    )
                })
            }
            <Button onClick={() => { this.props.openModal() }}>添加条件</Button>
            <ConditionComponent
                title='添加条件'
                onHandleCancel={() => { this.props.closeModal() }}
                onHandleOk={(value) => {
                    this.updateCondition(value, modalData && modalData.curIdx)
                    this.props.closeModal()
                }}
                visible={this.props.getModalVisible()}
                conditionLen={(this.props.value || []).length}
                {...modalData && { conditionData: this.props.value[modalData.curIdx] }} />
        </div>
    }
}