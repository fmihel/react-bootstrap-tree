/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
import React from 'react';
import TreeNodes from './TreeNodes.jsx';
import TreeUtils from './TreeUtils.js';

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
    animate = Tree.common.animate,
}) {
    return (
        <div className="tree">
            <TreeNodes
                data={data}
                all={data}
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
                animate={animate}
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
    animate: 50,

};
Tree.each = (tree, callbackOrId, param = Tree.common) => TreeUtils.each(tree, callbackOrId, param.idName, param.childsName);
Tree.parent = (tree, callbackOrId, param = Tree.common) => TreeUtils.parent(tree, callbackOrId, param.idName, param.childsName);
Tree.parents = (tree, callbackOrId, param = Tree.common) => TreeUtils.parents(tree, callbackOrId, param.idName, param.childsName);
Tree.childs = (tree, callbackOrId, param = Tree.common) => TreeUtils.childs(tree, callbackOrId, param.idName, param.childsName);
Tree.map = (tree, callback = undefined, param = Tree.common) => TreeUtils.map(tree, callback, param.childsName);
Tree.filter = (tree, callback, param = Tree.common) => TreeUtils.filter(tree, callback, param.childsName);

Tree.exchange = (tree, fromID, toID, param = Tree.common) => {
    let from;
    let to;

    Tree.each(tree, ((item) => {
        if (item[param.idName] == fromID) {
            from = item;
        }
        if (item[param.idName] == toID) {
            to = item;
        }
        if (from && to) return true;
        return false;
    }), param);

    const out = Tree.map(tree, (item) => {
        if (item[param.idName] == fromID) return to;
        if (item[param.idName] == toID) return from;
        return item;
    }, param);
    return out;
};

Tree.move = (tree, id, beforeID, param = Tree.common) => {
    const item = { ...Tree.each(tree, id, param) };
    const out = Tree.filter(tree, (it) => (it[param.idName] != item[param.idName]), param);
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
