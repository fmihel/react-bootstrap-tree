/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/self-closing-comp */
/* eslint-disable spaced-comment */
import React from 'react';
import { connect } from 'react-redux';
import '../style/style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile, faFolder, faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import Tree from '../source/Tree.jsx';

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
        this.onPress = this.onPress.bind(this);
        this.onDown = this.onDown.bind(this);
        this.tree = undefined;
        this.state = {
            setup: {
            },
            data: treeGenerate({ count: 5, deep: 2 }),
        };
        this.current = false;
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

    onPress() {
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

    componentDidMount() {
    }

    render() {
        const { setup, data } = this.state;
        const icons = {
            common: {
                expand: faFolderOpen,
                collapse: faFolder,
                last: faFile,
            },
            folder: [faFolder],
            file: [faFile],
        };
        return (
            <div>
                <div>
                    <button type="button" onClick={this.onPress}>up</button>
                    <button type="button" onClick={this.onDown}>down</button>
                </div>
                <div style={{ height: 500, overflow: 'auto', border: '1px solid gray' }}>
                    <Tree
                        data={data}
                        setup={setup}
                        Icon={FontAwesomeIcon}
                        icons={icons}
                        onClick={this.onTreeClick}
                        onInit={this.onTreeInit}
                        animate={0}
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
