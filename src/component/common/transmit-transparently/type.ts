import * as React from 'react'
import { CSSProperties } from 'react'

export interface PropsDefine {
    /**
     * 样式
     */
    style?: CSSProperties
    /**
     * class
     */
    className?: string

    onFocus?: React.FocusEventHandler<any>
    onKeyDown?: React.KeyboardEventHandler<any>
    actionHandler?: (...numbers: any[]) => void
    others?: any
}

export class PropsNds {
    name = '透传属性定义'
    icon = 'square-o'
    key = 'nt-transparently-props'
}

export class Props extends PropsNds implements PropsDefine {
    others
}
