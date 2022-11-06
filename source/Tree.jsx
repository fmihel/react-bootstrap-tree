/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
import React from 'react';
import TreeNodes from './TreeNodes.jsx';

function Tree({
    data = [],
    idName = Tree.common.idName,
    captionName = Tree.common.captionName,
    childsName = Tree.common.childsName,
    setup = {},
    onClick = undefined,

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
            />
        </div>
    );
}

Tree.common = {
    idName: 'id',
    captionName: 'caption',
    childsName: 'childs',
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

const _map = (childs, callback, param = Tree.common, parent = 'root') => childs.map((item, i) => {
    const child = { ...item };
    if (param.childsName in item && child[param.childsName] && child[param.childsName].length) {
        child[param.childsName] = _map(child[param.childsName], callback, param, child);
    }
    return callback(child, parent);
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

Tree.map = (tree, callback, param = Tree.common) => _map(tree, callback, param);

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
    const item = _each(tree, id, param);
    const out = _filter(tree, (it) => (it[param.idName] != item[param.idName]), param);
    const parent = Tree.parent(out, beforeID, param);
    if (parent === 'root') {
        out.push(item);
    } else {
        parent[param.childsName].push(item);
    }
    return out;
};

Tree.clone = (tree, id, param = Tree.common) => {

};

export default Tree;
