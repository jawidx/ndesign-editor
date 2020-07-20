import { TransparentlyPropsPropsDefine } from '../../transmit-transparently'
import { DOMAttributes } from 'react'

export interface PropsDefine extends TransparentlyPropsPropsDefine, DOMAttributes<any> {
    /**
     * 默认是否展开全部
     */
    defaultExpendAll?: boolean

    /**
     * 点击箭头才会展开
     */
    toggleByArrow?: boolean

    others?: any
}

export class PropsNds {
    name = '折叠树'
    icon = 'square-o'
    key = 'nd-web-tree'
}

export class Props extends PropsNds implements PropsDefine {
    defaultExpendAll = false
    toggleByArrow = false
}
