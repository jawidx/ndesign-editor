import * as React from 'react'
import others from './others'

export default (...ignore: string[]) => (Target: any) => {
    class Transmit extends React.Component<any, any> {
        private displayName = 'TransmitTransparently'
        private wrappedInstance: React.ReactInstance

        public render(): React.ReactElement<any> {
            const newProps: any = Object.assign({}, this.props)
            newProps.others = others(Target.defaultProps, newProps, ignore)
            newProps.ref = ((ref: React.ReactInstance) => {
                this.wrappedInstance = ref
            })
            return React.createElement(Target, newProps, this.props.children)
        }
    }

    const func: any = () => {
        return Transmit
    }

    return func()
}

export { others }
import { PropsDefine as TransparentlyPropsDefine } from './type'
export { TransparentlyPropsDefine as TransparentlyPropsPropsDefine }
