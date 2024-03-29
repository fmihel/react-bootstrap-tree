import TreeUtils from './TreeUtils';

export default class TreeSetupUtils {
    static each(setup, callback) {
        const ids = Object.keys(setup);
        for (let i = 0; i < ids.length; i++) {
            const id = `${ids[i]}`;
            if (callback({ id, item: setup[id], setup }) === true) {
                return id;
            }
        }
        return undefined;
    }

    static map(setup, callback = undefined) {
        const ids = Object.keys(setup);
        const out = {};
        ids.map((key) => {
            const id = `${key}`;
            if (callback) {
                out[id] = callback({ id, item: { ...setup[id] }, setup });
            } else {
                out[id] = { ...setup[id] };
            }
        });
        return out;
    }

    static expandTo(tree, setup, toId, idName = 'id', childsName = 'childs') {
        const parents = TreeUtils.parents(tree, toId, idName, childsName);
        const setupKeys = Object.keys(setup);
        const newSetup = {};
        setupKeys.map((key) => {
            const prop = `${key}`;
            newSetup[prop] = { ...setup[prop], select: false };
        });

        parents.map((parent) => {
            const prop = `${parent[idName]}`;
            if (!(prop in newSetup)) {
                newSetup[prop] = { expand: true };
            } else {
                newSetup[prop] = { ...newSetup[prop], expand: true };
            }
        });
        if (!(`${toId}` in newSetup)) {
            newSetup[`${toId}`] = { select: true };
        } else {
            newSetup[`${toId}`] = { ...newSetup[`${toId}`], select: true };
        }
        return newSetup;
    }
}
