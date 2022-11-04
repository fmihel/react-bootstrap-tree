/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/self-closing-comp */
/* eslint-disable spaced-comment */
import React from 'react';
import { ut } from 'fmihel-browser-lib';
import { connect } from 'react-redux';
import '../style/style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile, faFolder, faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import Tree from '../source/Tree.jsx';

class App extends React.Component {
    constructor(p) {
        super(p);
        this.tree = undefined;
    }

    onTreeClick(o) {
        console.info(o);
    }

    onTreeInit({ sender }) {
        this.tree = sender;
    }

    onSelect() {
        this.tree.select('sub22');
    }

    componentDidMount() {
    }

    render() {
        const { data } = this.props;
        const icons = {
            common: {
                expand: faFolderOpen,
                collapse: faFolder,
                last: faFile,
            },
            folder: [faFolder],
            file: [faFile],
        };
        console.log('data', data);
        return (
            <div>
                <div>
                    <button type="button">press</button>
                </div>
                <div>
                    <Tree
                        data={data}
                        Icon={FontAwesomeIcon}
                        icons={icons}
                        onClick={this.onTreeClick}
                        onInit={this.onTreeInit}
                    />

                </div>
            </div>
        );
    }
}

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

const mapStateToProps = (state) => ({
    app: state.app,
    dataHashSum: ut.random_str(5),
    data: treeGenerate({ count: 2, deep: 3 }),
});

App.defaultProps = {
};

export default connect(mapStateToProps)(App);
