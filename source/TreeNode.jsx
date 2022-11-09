/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';

const map = (count, callback) => {
    const out = [];
    for (let i = 0; i < count; i++) out.push(callback(i));
    return out;
};

// eslint-disable-next-line func-names
export default function ({
    item = {},
    level = 0,
    caption = '',
    onClick = undefined,
    onDoubleClick = undefined,
    select = false,
    IconComponent = undefined,
    icon = undefined,
    className = '',
    style = {},
    iconStyle = {},
    captionStyle = {},
}) {
    const click = () => {
        if (onClick) onClick({ item, isIcon: false });
    };
    const dblClick = () => {
        if (onDoubleClick) onDoubleClick({ item, isIcon: false });
    };
    const clickIcon = () => {
        if (onClick) onClick({ item, isIcon: true });
    };
    const dblClickIcon = () => {
        if (onDoubleClick) onDoubleClick({ item, isIcon: true });
    };
    const cLevel = IconComponent ? level - 1 : level;
    return (
        <div
            className={`tree-item${select ? ' tree-item-select' : ''} ${className}`}
            style={style}
        >
            {map(cLevel, (i) => <div key={i} className="tree-level" />)}
            {IconComponent && (
                <div
                    className="tree-icon"
                    style={iconStyle}
                    onClick={clickIcon}
                    onDoubleClick={dblClickIcon}

                >
                    {icon && <IconComponent icon={icon} />}
                </div>
            )}
            <div
                className="tree-caption"
                style={captionStyle}
                onClick={click}
                onDoubleClick={dblClick}
            >
                {caption}
            </div>
        </div>
    );
}
