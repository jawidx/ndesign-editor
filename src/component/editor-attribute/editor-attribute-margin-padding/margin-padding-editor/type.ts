export type MarginPaddingField = 'paddingLeft' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'marginLeft' | 'marginTop' | 'marginRight' | 'marginBottom' | ''

export interface PropsDefine {
    /**
     * 当鼠标按下的时候
     */
    onStart?: ()=>void

    /**
     * 当值修改的时候
     */
    onChange?: (type: MarginPaddingField, value: number)=>void

    /**
     * 忽略拖动的改动，这个方法会在修改完最终调用一次
     * 在记录历史记录时，用这个会保证低频，而且不会遗漏每次修改，只会忽略拖动的中间过程
     */
    onFinalChange?: (type?: MarginPaddingField, value?: number)=>void

    /**
     * 大小
     */
    size?: number

    // paddingLeft 初始值
    paddingLeft?: number
    // paddingTop 初始值
    paddingTop?: number
    // paddingRight 初始值
    paddingRight?: number
    // paddingBottom 初始值
    paddingBottom?: number
    // marginLeft 初始值
    marginLeft?: number
    // marginTop 初始值
    marginTop?: number
    // marginRight 初始值
    marginRight?: number
    // marginBottom 初始值
    marginBottom?: number

    others?: any
    classNames?: string
}

export class Props implements PropsDefine {
    size = 200
    onChange = ()=> {
    }
    onFinalChange = ()=> {
    }
    paddingLeft = 0
    paddingTop = 0
    paddingRight = 0
    paddingBottom = 0
    marginLeft = 0
    marginTop = 0
    marginRight = 0
    marginBottom = 0
    onStart = ()=> {
    }
}

export interface StateDefine {
    paddingLeft?: number
    paddingTop?: number
    paddingRight?: number
    paddingBottom?: number
    marginLeft?: number
    marginTop?: number
    marginRight?: number
    marginBottom?: number
    [x: string]: any
}
         