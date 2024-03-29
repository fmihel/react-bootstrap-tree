/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
import { ut } from 'fmihel-browser-lib';
import React from 'react';
import TreeNodes from './TreeNodes.jsx';
import TreeUtils from './TreeUtils.js';

function Tree({
    data = [],
    id = ut.random_str(5),
    setup = {},
    idName = Tree.global.idName,
    captionName = Tree.global.captionName,
    childsName = Tree.global.childsName,
    IconComponent = Tree.global.IconComponent,
    icons = Tree.global.icons,
    onClick = undefined,
    onDoubleClick = undefined,
    onSelect = undefined,
    onChange = undefined,
    onGetIcon = Tree.global.onGetIcon,
    expandOnDoubleClickCaption = Tree.global.expandOnDoubleClickCaption,
    expandOnDoubleClickIcon = Tree.global.expandOnDoubleClickIcon,
    collapsing = Tree.global.collapsing,
    animate = Tree.global.animate,
    className = Tree.global.className,
    classNameItem = Tree.global.classNameItem, // string or function
    styleItem = Tree.global.styleItem, // object or function
    styleIcon = Tree.global.styleIcon, // object or function
    styleCaption = Tree.global.styleCaption, // object or function

}) {
    return (
        <div className={`tree ${className}`} id={id}>
            <TreeNodes
                id={id}
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
                classNameItem={classNameItem}
                styleItem={styleItem}
                styleIcon={styleIcon}
                styleCaption={styleCaption}
            />
        </div>
    );
}

Tree.global = {
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
    collapsing: false,
    animate: 100,
    className: '',
    classNameItem: undefined, // string or function
    styleItem: undefined, // object or function
    styleIcon: undefined, // object or function
    styleCaption: undefined, // object or function
};

Tree.each = (tree, callbackOrId, param = Tree.global) => TreeUtils.each(tree, callbackOrId, param.idName, param.childsName);
Tree.parent = (tree, callbackOrId, param = Tree.global) => TreeUtils.parent(tree, callbackOrId, param.idName, param.childsName);
Tree.parents = (tree, callbackOrId, param = Tree.global) => TreeUtils.parents(tree, callbackOrId, param.idName, param.childsName);
Tree.childs = (tree, callbackOrId, param = Tree.global) => TreeUtils.childs(tree, callbackOrId, param.idName, param.childsName);
Tree.map = (tree, callback = undefined, param = Tree.global) => TreeUtils.map(tree, callback, param.childsName);
Tree.filter = (tree, callback, param = Tree.global) => TreeUtils.filter(tree, callback, param.childsName);
Tree.eq = (id1, id2) => TreeUtils.eq(id1, id2);
Tree.clone = (tree, param = Tree.global) => Tree.map(tree, undefined, param);
Tree.exchange = (tree, fromID, toID, param = Tree.global) => {
    let from;
    let to;

    Tree.each(tree, ((item) => {
        if (TreeUtils.eq(item[param.idName], fromID)) {
            from = item;
        }
        if (TreeUtils.eq(item[param.idName], toID)) {
            to = item;
        }
        if (from && to) return true;
        return false;
    }), param);

    const out = Tree.map(tree, (item) => {
        if (TreeUtils.eq(item[param.idName], fromID)) return to;
        if (TreeUtils.eq(item[param.idName], toID)) return from;
        return item;
    }, param);
    return out;
};
Tree.move = (tree, id, beforeID, param = Tree.global) => {
    const item = { ...Tree.each(tree, id, param) };
    const out = Tree.filter(tree, (it) => (!TreeUtils.eq(it[param.idName], item[param.idName])), param);
    const parent = Tree.parent(out, beforeID, param);
    if (parent) {
        if (parent === 'root') {
            const index = out.findIndex((it) => TreeUtils.eq(it[param.idName], beforeID));
            return [...out.slice(0, index), item, ...out.slice(index)];
        }

        const index = parent[param.childsName].findIndex((it) => TreeUtils.eq(it[param.idName], beforeID));
        parent[param.childsName] = [...parent[param.childsName].slice(0, index), item, ...parent[param.childsName].slice(index)];

        return out;
    }
    return false;
};
Tree.scroll = (treeId, toId, animate = 0, off = 0) => {
    TreeUtils.scroll({
        scroll: document.getElementById(treeId),
        target: document.getElementById(toId),
        animate,
        off,
    });
};

export default Tree;
