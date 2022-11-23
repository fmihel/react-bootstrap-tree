import { JX } from 'fmihel-browser-lib';

export default class TreeUtils {
    static each(tree, callbackOrId, idName, childsName, parent = 'root') {
        for (let i = 0; i < tree.length; i++) {
            const item = tree[i];
            if (typeof callbackOrId === 'function') {
                if (callbackOrId(item, parent) === true) {
                    return item;
                }
            } else if (TreeUtils.eq(item[idName], callbackOrId)) {
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
            } else if (TreeUtils.eq(item[idName], callbackOrId)) {
                out = parent;
                return true;
            }
        }, idName, childsName);
        return out;
    }

    static parents(tree, callbackOrId, idName, childsName) {
        const out = [];
        let parent = TreeUtils.parent(tree, callbackOrId, idName, childsName);
        while (parent && parent !== 'root') {
            out.push(parent);
            parent = TreeUtils.parent(tree, parent[idName], idName, childsName);
        }
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

    static eq(id1, id2) {
        const t1 = typeof id1;
        const t2 = typeof id2;
        if (t1 === t2) return (id1 === id2);
        if (t1 === 'boolean' || t2 === 'boolean') return false;
        if (t1 === 'undefined' || t2 === 'undefined') return false;

        return `${id1}` === `${id2}`;
    }

    /** скроллирует внешний объект scroll:DOM,
     *  до момента, пока target:DOM не окажется в области видимости
    */
    static scroll({
        scroll, // DOM
        target, // DOM
        animate = 0,
        off = 0,
    }) {
        import('jquery').then(({ default: $ }) => {
            // const $ = mod.default;
            const $scroll = $(scroll);

            const posTar = JX.abs(target);
            const posScr = JX.abs(scroll);
            const delta = posTar.y - posScr.y + $scroll.scrollTop() - off;

            if (animate > 0) {
                $scroll.animate({ scrollTop: delta }, animate);
            } else {
                $scroll.scrollTop(delta);
            }
        });
    }
}
