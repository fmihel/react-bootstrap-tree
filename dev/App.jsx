/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/self-closing-comp */
/* eslint-disable spaced-comment */

import React from 'react';
import { connect } from 'react-redux';
import './App.scss';
import '../style/Tree.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile, faFolder, faFolderOpen, faAddressBook,
} from '@fortawesome/free-solid-svg-icons';
import { ut } from 'fmihel-browser-lib';
import Tree from '../source/Tree.jsx';

Tree.common = {
    ...Tree.common,
    IconComponent: FontAwesomeIcon,
    icons: {
        expand: faFolderOpen,
        collapse: faFolder,
        file: faFile,
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
        this.onTreeClick = this.onTreeClick.bind(this);
        this.onUp = this.onUp.bind(this);
        this.onDown = this.onDown.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onInsert = this.onInsert.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onSelectForMove = this.onSelectForMove.bind(this);
        this.tree = undefined;
        this.state = {
            setup: {
            },
            data: treeGenerate({ count: 7, deep: 2 }),
        };
        this.current = false;
        this.selectForMove = false;
    }

    onTreeClick(o) {
        console.log(o);
        this.current = o.id;
        this.setState({ setup: o.setup });
    }

    onTreeInit({ sender }) {
        this.tree = sender;
    }

    onSelect() {
        this.tree.select('sub22');
    }

    onUp() {
        const { data } = this.state;
        const { current } = this;
        const childs = Tree.childs(data, current);

        if (childs) {
            let up;
            childs.map((it, i) => {
                if (it.id === current) {
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
                if (it.id === current) {
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
            data: Tree.filter(prev.data, (item) => item.id !== this.current),
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

    onMove() {
        const data = Tree.move(this.state.data, this.selectForMove, this.current);
        if (data) this.setState({ data });
    }

    onSelectForMove() {
        this.selectForMove = this.current;
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
                </div>
                <div style={{ height: 500, overflow: 'auto', border: '1px solid gray' }}>
                    <Tree
                        data={data}
                        setup={setup}
                        onClick={this.onTreeClick}
                        onInit={this.onTreeInit}
                        animate={0}
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
