/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
import React from 'react';
import TreeNodes from './TreeNodes.jsx';

function Tree({
    data = [],
    setup = {},
    idName = Tree.common.idName,
    captionName = Tree.common.captionName,
    childsName = Tree.common.childsName,
    IconComponent = Tree.common.IconComponent,
    icons = Tree.common.icons,
    onClick = undefined,
    onDoubleClick = undefined,
    onSelect = undefined,
    onChange = undefined,
    onGetIcon = Tree.common.onGetIcon,
    expandOnDoubleClickCaption = Tree.common.expandOnDoubleClickCaption,
    expandOnDoubleClickIcon = Tree.common.expandOnDoubleClickIcon,
    collapsing = Tree.common.collapsing,
}) {
    return (
        <div className="tree">
            <TreeNodes
                data={data}
                idName={idName}
                captionName={captionName}
                childsName={childsName}
                setup={setup}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onSelect={onSelect}
                onChange={onChange}
                IconComponent={IconComponent}
                icons={icons}
                onGetIcon={onGetIcon}
                expandOnDoubleClickCaption={expandOnDoubleClickCaption}
                expandOnDoubleClickIcon={expandOnDoubleClickIcon}
                collapsing={collapsing}
            />
        </div>
    );
}

Tree.common = {
    idName: 'id',
    captionName: 'caption',
    childsName: 'childs',
    IconComponent: undefined,
    icons: {
        expand: undefined,
        collapse: undefined,
        file: undefined,
    },
    onGetIcon: undefined,
    expandOnDoubleClickCaption: true,
    expandOnDoubleClickIcon: false,
    collapsing: true,

};

const _each = (tree, callbackOrId, param = Tree.common, parent = 'root') => {
    for (let i = 0; i < tree.length; i++) {
        const item = tree[i];
        if (typeof callbackOrId === 'function') {
            if (callbackOrId(item, parent) === true) {
                return item;
            }
        } else if (item[param.idName] == callbackOrId) {
            return item;
        }
        if (param.childsName in item) {
            const child = _each(item[param.childsName], callbackOrId, param, item);
            if (child) {
                return child;
            }
        }
    }
    return undefined;
};

const _map = (childs, callback = undefined, param = Tree.common, parent = 'root') => childs.map((item, i) => {
    const child = { ...item };
    if (param.childsName in item && child[param.childsName] && child[param.childsName].length) {
        child[param.childsName] = _map(child[param.childsName], callback, param, child);
    }

    return callback ? callback(child, parent) : child;
});

const _filter = (childs, callback, param = Tree.common, parent = 'root') => {
    const out = [];
    for (let i = 0; i < childs.length; i++) {
        const child = { ...childs[i] };
        if (callback(child, parent) === true) {
            if (param.childsName in child && child[param.childsName] && child[param.childsName].length) {
                child[param.childsName] = _filter(child[param.childsName], callback, param, child);
            }
            out.push(child);
        }
    }

    return out;
};

Tree.each = (tree, callbackOrId, param = Tree.common) => _each(tree, callbackOrId, param);

Tree.parent = (tree, callbackOrId, param = Tree.common) => {
    let out;
    _each(tree, (item, parent) => {
        if (typeof callbackOrId === 'function') {
            if (callbackOrId(item, parent) === true) {
                out = parent;
                return true;
            }
        } else if (item[param.idName] == callbackOrId) {
            out = parent;
            return true;
        }
    }, param);
    return out;
};
Tree.parents = (tree, callbackOrId, param = Tree.common) => {
    const out = [];
    let parent = Tree.parent(tree, callbackOrId, param);
    while (parent && parent !== 'root') {
        out.push(parent);
        parent = Tree.parent(tree, parent[param.idName], param);
    }
    return out;
};
Tree.childs = (tree, callbackOrId, param = Tree.common) => {
    const parent = Tree.parent(tree, callbackOrId, param);
    if (parent === 'root') {
        return tree;
    }
    if (parent) {
        return parent[param.childsName];
    }
    return undefined;
};

Tree.map = (tree, callback = undefined, param = Tree.common) => _map(tree, callback, param);

Tree.exchange = (tree, fromID, toID, param = Tree.common) => {
    let from;
    let to;

    _each(tree, ((item) => {
        if (item[param.idName] == fromID) {
            from = item;
        }
        if (item[param.idName] == toID) {
            to = item;
        }
        if (from && to) return true;
        return false;
    }), param);

    const out = _map(tree, (item) => {
        if (item[param.idName] == fromID) return to;
        if (item[param.idName] == toID) return from;
        return item;
    }, param);
    return out;
};

Tree.filter = (tree, callback, param = Tree.common) => _filter(tree, callback, param);

Tree.move = (tree, id, beforeID, param = Tree.common) => {
    const item = { ..._each(tree, id, param) };
    const out = _filter(tree, (it) => (it[param.idName] != item[param.idName]), param);
    const parent = Tree.parent(out, beforeID, param);
    if (parent) {
        if (parent === 'root') {
            const index = out.findIndex((it) => it[param.idName] == beforeID);
            return [...out.slice(0, index), item, ...out.slice(index)];
        }

        const index = parent[param.childsName].findIndex((it) => it[param.idName] == beforeID);
        parent[param.childsName] = [...parent[param.childsName].slice(0, index), item, ...parent[param.childsName].slice(index)];

        return out;
    }
    return false;
};

Tree.clone = (tree, param = Tree.common) => Tree.map(tree, undefined, param);

export default Tree;
