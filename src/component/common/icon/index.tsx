import * as React from 'react'
import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';

export default function (props: React.SVGProps<SVGSVGElement> & IconProps) {
    if (props.type.indexOf('ndssvg') > -1) {
        let { className, ...otherProps } = props;
        className = (className || '') + ' svg-icon'
        return <svg className={className} {...otherProps}>
            <use xlinkHref={`#${props.type}`} />
        </svg>
    } else {
        return <Icon {...props} />
    }
}
