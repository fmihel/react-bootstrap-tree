/* eslint-disable react/prop-types */
import React from 'react';

const map = (count, callback) => {
    const out = [];
    for (let i = 0; i < count; i++) out.push(callback(i));
    return out;
};

// eslint-disable-next-line func-names
export default function ({ level = 0, caption = '' }) {
    const text = 'TreeNode';

    return (
        <div className="tree-item">
            {map(level, (i) => <div key={i} className="tree-level" />)}
            <div className="tree-caption">
                {caption}
            </div>
        </div>
    );
}
