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
    select = false,
    IconComponent = undefined,
    icon = undefined,
}) {
    const click = () => {
        onClick({ item });
    };
    const cLevel = IconComponent ? level - 1 : level;
    return (
        <div
            className={`tree-item${select ? ' tree-item-select' : ''}`}
            onClick={click}
        >
            {map(cLevel, (i) => <div key={i} className="tree-level" />)}
            {IconComponent && <div className="tree-icon">{icon && <IconComponent icon={icon} />}</div>}
            <div className="tree-caption">
                {caption}
            </div>
        </div>
    );
}
