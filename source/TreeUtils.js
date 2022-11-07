export default class TreeUtils {
    static each(tree, callbackOrId, idName, childsName, parent = 'root') {
        for (let i = 0; i < tree.length; i++) {
            const item = tree[i];
            if (typeof callbackOrId === 'function') {
                if (callbackOrId(item, parent) === true) {
                    return item;
                }
            } else if (item[idName] == callbackOrId) {
                return item;
            }
            if (childsName in item) {
                const child = TreeUtils.each(item[childsName], callbackOrId, idName, childsName, item);
                if (child) {
                    return child;
                }
            }
        }
        return undefined;
    }

    static map(childs, callback, childsName, parent = 'root') {
        return childs.map((item) => {
            const child = { ...item };
            if (childsName in item && child[childsName] && child[childsName].length) {
                child[childsName] = TreeUtils.map(child[childsName], callback, childsName, child);
            }
            return callback ? callback(child, parent) : child;
        });
    }

    static filter(childs, callback, childsName, parent = 'root') {
        const out = [];
        for (let i = 0; i < childs.length; i++) {
            const child = { ...childs[i] };
            if (callback(child, parent) === true) {
                if (childsName in child && child[childsName] && child[childsName].length) {
                    child[childsName] = TreeUtils.filter(child[childsName], callback, childsName, child);
                }
                out.push(child);
            }
        }

        return out;
    }

    static parent(tree, callbackOrId, idName, childsName) {
        let out;
        TreeUtils.each(tree, (item, parent) => {
            if (typeof callbackOrId === 'function') {
                if (callbackOrId(item, parent) === true) {
                    out = parent;
                    return true;
                }
            } else if (item[idName] == callbackOrId) {
                out = parent;
                return true;
            }
        }, idName, childsName);
        return out;
    }

    static childs(tree, callbackOrId, idName, childsName) {
        const parent = TreeUtils.parent(tree, callbackOrId, idName, childsName);
        if (parent === 'root') {
            return tree;
        }
        if (parent) {
            return parent[childsName];
        }
        return undefined;
    }
}
