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
        this.onTreeClick = this.onTreeClick.bind(this);
        this.tree = undefined;
        this.state = {
            setup: {
            },
        };
    }

    onTreeClick(o) {
        console.log(o);
        this.setState({ setup: o.setup });
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
        const { setup } = this.state;
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
                    <button type="button">press</button>
                </div>
                <div>
                    <Tree
                        data={data}
                        setup={setup}
                        Icon={FontAwesomeIcon}
                        icons={icons}
                        onClick={this.onTreeClick}
                        onInit={this.onTreeInit}
                        animate={200}
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
    data: treeGenerate({ count: 10, deep: 5 }),
});

App.defaultProps = {
};

export default connect(mapStateToProps)(App);
