import * as React from 'react'
import * as _ from 'lodash'
import { Form, Tree, Input, Button } from 'antd'
import * as typings from './type'
import './style.scss'

export default class JsonTreeSelect extends React.Component<typings.PropsDefine, typings.StateDefine> {
    public state: typings.StateDefine = new typings.State()
    private titleKeyMap: Array<{ key: string, title: string }> = []
    componentWillMount() {
        this.setState({
            selectedJsonValue: this.props.selectedField || ''
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedField === this.props.selectedField) {
            return;
        }
        this.setState({
            selectedJsonValue: nextProps.selectedField
        });
    }

    handleSelectJsonTree = (value) => {
        this.props.onSelectJsonTree(value[0])
        this.setState({
            selectedJsonValue: value[0]
        })
    }
    handleSearch = (e) => {
        const value = e.target.value;
        let expandedKeys = [];

        this.titleKeyMap.forEach((kmap) => {
            if (kmap.title.indexOf(value) > -1) {
                expandedKeys.push(kmap.key)
            }
        })

        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    warpSearchTextNode = (text: string) => {
        text = text || ''
        let { searchValue } = this.state;
        let index = text.indexOf(searchValue);
        if (index > -1) {
            return <span className="field-title">{text.substr(0, index)}<span className="sval">{searchValue}</span>{text.substr(index + searchValue.length)}</span>
        } else {
            return <span>{text}</span>
        }
    }
    loopData = (data: any, parentKeys: Array<string> = [], dataKey?: any) => {
        let result;
        let getDataType = (data: any) => Object.prototype.toString.call(data).replace(/\[object |\]/g, '');
        let dataType = getDataType(data);
        let children = [] as any;
        parentKeys = parentKeys.concat([])
        switch (dataType) {
            case 'Array':
                (getDataType(dataKey) !== 'Undefined') && parentKeys.push(`${dataKey}${!this.props.isStopArray ? '[]' : ''}`)
                if (data.length > 0 && !this.props.isStopArray) {
                    children = this.loopData(data[0], parentKeys)
                } else {
                    this.titleKeyMap.push({ title: dataKey, key: parentKeys.join('.') })
                    return (
                        <Tree.TreeNode
                            className={`${dataType}`}
                            title={<span className="json-field"><em className={`tag-span ${dataType}`}>{dataType}</em>{this.warpSearchTextNode(dataKey)}</span>}
                            key={parentKeys.join('.')} />
                    )
                }
                break;
            case 'Object':
                (getDataType(dataKey) !== 'Undefined') && parentKeys.push(dataKey)
                Object.keys(data).sort((a, b) => { return _.indexOf(['Array', 'Object'], getDataType(data[b])) !== -1 ? 1 : 0 }).forEach((key) => {
                    children.push(this.loopData(data[key], parentKeys, key))
                })
                break;
            default:
                (getDataType(dataKey) !== 'Undefined') && parentKeys.push(dataKey)
                this.titleKeyMap.push({ title: dataKey, key: parentKeys.join('.') })
                return (
                    <Tree.TreeNode
                        className={`${dataType}`}
                        title={<span className="json-field"><em className={`tag-span ${dataType}`}>{dataType}</em>{this.warpSearchTextNode(dataKey)}</span>}
                        key={parentKeys.join('.')} />
                )
            // break;
        }
        if (getDataType(dataKey) !== 'Undefined') {
            this.titleKeyMap.push({ title: dataKey, key: parentKeys.join('.') })
            return (
                <Tree.TreeNode
                    className={`${dataType}`}
                    title={
                        <span className="json-field"><em className={`tag-span ${dataType}`}>{dataType}</em>{this.warpSearchTextNode(dataKey)}</span>
                    }
                    key={parentKeys.join('.')}>
                    {children}
                </Tree.TreeNode>
            )
        } else {
            return children
        }
    }
    getTreeNode = () => {
        this.titleKeyMap = [];
        let treeNode = this.loopData(this.props.jsonTreeData);
        return treeNode
    }
    render() {
        if (!this.props.jsonTreeData) {
            return null
        }

        return (
            <div className="_namespace">
                <div className="search-box">
                    <div className="label">搜索字段:</div>
                    <div className="input-search">
                        <Input.Search style={{ width: "120px" }} onChange={this.handleSearch} />
                        <div className="selected-jsonvalue">
                            {
                                this.state.fieldEditing
                                    ? <Input value={this.state.selectedJsonValue}
                                        onBlur={() => { this.setState({ fieldEditing: false }) }}
                                        onChange={(e) => { this.handleSelectJsonTree([e.target.value]) }} />
                                    : this.state.selectedJsonValue
                            }
                        </div>
                        {!this.state.fieldEditing && <Button icon="edit" onClick={() => {
                            this.setState({
                                fieldEditing: true
                            })
                        }} />}
                    </div>
                </div>
                <Tree
                    className='treeJson'
                    showLine
                    onSelect={this.handleSelectJsonTree}
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}>
                    {this.getTreeNode()}
                </Tree>
            </div>
        )
    }
}
