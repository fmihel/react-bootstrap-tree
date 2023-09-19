/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/self-closing-comp */
/* eslint-disable spaced-comment */

import React from 'react';
import { connect } from 'react-redux';
import './App.scss';
import '../style/tree.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile, faFolder, faFolderOpen, faAddressBook,
} from '@fortawesome/free-solid-svg-icons';
import { ut } from 'fmihel-browser-lib';
import Tree from '../source/Tree.jsx';
import TreeSetupUtils from '../source/TreeSetupUtils';

Tree.global = {
    ...Tree.global,
    IconComponent: FontAwesomeIcon,
    icons: {
        expand: faFolderOpen,
        collapse: faFolder,
        file: faFile,
    },
    collapsing: false,
    animate: 200,
    styleItem({ item, setup }) {
        return Tree.eq(item.id, 22222) ? { color: 'red' } : {};
    },
    styleCaption({ item, setup }) {
        return (Tree.eq(item.id, 22222) && setup[`${item.id}`] && setup[`${item.id}`].expand) ? { color: 'lime' } : {};
    },
};

let ID_ITER = 0;
function treeGenerate(param = {}) {
    const out = [];
    const p = {
        count: 100,
        deep: 2,
        level: 0,
        ...param,
    };

    for (let i = 0; i < p.count; i++) {
        const item = {
            id: ID_ITER,
            caption: `item-${ID_ITER}`,
        };
        ID_ITER++;
        if (p.deep > 1) {
            item.childs = treeGenerate({ ...p, deep: p.deep - 1, level: p.level + 1 });
        }
        out.push(item);
    }
    return out;
}
class App extends React.Component {
    constructor(p) {
        super(p);
        this.onTreeSelect = this.onTreeSelect.bind(this);
        this.onTreeChange = this.onTreeChange.bind(this);
        this.onUp = this.onUp.bind(this);
        this.onDown = this.onDown.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onInsert = this.onInsert.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onSelectForMove = this.onSelectForMove.bind(this);
        this.onExpandTo = this.onExpandTo.bind(this);
        this.scroll = this.scroll.bind(this);
        this.test = this.test.bind(this);

        this.tree = undefined;
        this.state = {
            setup: {
            },
            //data: treeGenerate({ count: 10, deep: 5 }),
            data: [
                {
                    id: '/',
                    caption: 'root',
                    childs: [
                        {
                            id: '/path1',
                            caption: 'path1',
                            childs: [
                                { id: '/path1/path2', caption: 'path-attr', attr: { test: '' } },
                                { id: '/path1/path3', caption: 'path3' },
                            ],
                        },
                        {
                            id: '/path4',
                            caption: 'path4',
                            childs: [
                                { id: '/path4/path5', caption: 'path5' },
                                { id: '/path4/path6', caption: 'path6' },
                            ],
                        },

                    ],
                },
            ],
        };
        this.current = false;
        this.selectForMove = false;
    }

    onTreeSelect(o) {
        console.log('select', o);
        this.current = o.id;
    }

    onTreeChange({ setup }) {
        this.setState({ setup });
    }

    onUp() {
        const { data } = this.state;
        const { current } = this;
        const childs = Tree.childs(data, current);
        if (childs) {
            let up;
            childs.map((it, i) => {
                if (Tree.eq(it.id, current)) {
                    if (i > 0) up = childs[i - 1];
                }
            });

            if (up) {
                this.setState(() => ({
                    data: Tree.exchange(data, up.id, current),
                }));
            }
        }
    }

    onDown() {
        const { data } = this.state;
        const { current } = this;
        const childs = Tree.childs(data, current);

        if (childs) {
            let down;
            childs.map((it, i) => {
                if (Tree.eq(it.id, current)) {
                    if (i < childs.length - 1) down = childs[i + 1];
                }
            });

            if (down) {
                this.setState(() => ({
                    data: Tree.exchange(data, down.id, current),
                }));
            }
        }
    }

    onDelete() {
        this.setState((prev) => ({
            data: Tree.filter(prev.data, (item) => !Tree.eq(item.id, this.current)),
        }));
    }

    onInsert() {
        const data = Tree.clone(this.state.data);
        let id = ut.random_str(5);
        while (Tree.each(data, id)) { id = ut.random_str(5); }

        const current = Tree.each(data, this.current);

        if (!('childs' in current)) current.childs = [];
        current.childs.push({ id, caption: `new - ${id}` });
        console.log('current', current, data);
        this.setState({ data });
    }

    onExpandTo() {
        const id = 33334;
        this.setState(({ data, setup }) => ({ setup: Tree.expandTo(data, setup, id) }));
    }

    onMove() {
        const data = Tree.move(this.state.data, this.selectForMove, this.current);
        if (data) this.setState({ data });
    }

    onSelectForMove() {
        this.selectForMove = this.current;
    }

    scroll() {
        const { setup } = this.state;
        const select = TreeSetupUtils.each(setup, ({ item }) => item.select);
        if (select) {
            Tree.scroll('mytree', select, 200, 100);
        }
    }

    test() {
        console.log('test');
        const id = '/path1'.replace('/', '\\/');
        const $f = $(`#${id}`);
        console.log($f);
    }

    componentDidMount() {
    }

    render() {
        const { setup, data } = this.state;
        return (
            <div>
                <div>
                    <button type="button" onClick={this.onUp}>up</button>
                    <button type="button" onClick={this.onDown}>down</button>
                    <button type="button" onClick={this.onInsert}>insert</button>
                    <button type="button" onClick={this.onDelete}>delete</button>
                    <button type="button" onClick={this.onMove}>move</button>
                    <button type="button" onClick={this.onSelectForMove}>select for move</button>
                    <button type="button" onClick={this.onExpandTo}>expand to</button>
                    <button type="button" onClick={this.scroll}>scroll to</button>
                    <button type="button" onClick={this.test}>test</button>
                </div>
                <div style={{ height: 500, overflow: 'auto', border: '1px solid gray' }}>
                    <Tree
                        id="mytree"
                        data={data}
                        setup={setup}
                        onSelect={this.onTreeSelect}
                        onChange={this.onTreeChange}
                        onGetIcon={({ item, expand }) => {
                            if (item.id == 40) return faAddressBook;
                            if (item.id == 8) return false;
                            if (ut.get(item, 'childs', 'length', false)) {
                                return expand ? faFolderOpen : faFolder;
                            }
                            return faFile;
                        }}
                    />

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    app: state.app,
    //data: treeGenerate({ count: 5, deep: 3 }),
});

App.defaultProps = {
};

export default connect(mapStateToProps)(App);
