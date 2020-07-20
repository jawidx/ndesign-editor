import * as React from 'react'
import { observer } from 'mobx-react'
import Provider from './util/provider'
import Page from './page'
// import {autoBindMethod} from 'nt-auto-bind'
import * as typings from './type'

@observer
export class NdesignEditor extends React.Component<typings.PropsDefine, any> {
    static defaultProps: typings.PropsDefine = new typings.Props()

    render() {
        return (
            <Provider editorProps={this.props}>
                <Page />
            </Provider>
        )
    }
}

import { PropsDefine as EditorPropsDefine } from './type'
export { EditorPropsDefine }
