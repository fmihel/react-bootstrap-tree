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
    item = {}, level = 0,
    caption = '',
    onClick = undefined,
    select = false,
}) {
    const click = () => {
        onClick({ item });
    };
    return (
        <div
            className={`tree-item${select ? ' tree-item-select' : ''}`}
            onClick={click}
        >
            {map(level, (i) => <div key={i} className="tree-level" />)}
            <div className="tree-caption">
                {caption}
            </div>
        </div>
    );
}
