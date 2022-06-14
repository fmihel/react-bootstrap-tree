import React, { Fragment } from 'react';
import {
    binds, ut,
} from 'fmihel-browser-lib';
import { connect } from 'react-redux';
import Debug from 'COMPONENTS/Debug/Debug.jsx';
import redux from 'REDUX';
import AppFrame from 'COMPONENTS/AppFrame/AppFrame.jsx';
import '../style/scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile, faFolder, faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import Tree from '../source/Tree.jsx';

class App extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onPress', 'onTreeClick', 'onTreeInit', 'onSelect');
        this.tree = undefined;
    }

    onPress() {
        redux.actions.debug({
            test: ut.random_str(5),
            test2: ut.random_str(5),
        });
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
            <Fragment>
                <AppFrame>
                    <div>
                        <button onClick={this.onPress} className="btn btn-secondary btn-sm"><i className="far fa-address-book"></i> press</button>
                        <button onClick={this.onSelect} className="btn btn-secondary btn-sm">select</button>
                    </div>
                    <div>
                        <Tree
                            data={this.props.data}
                            dataHashSum={this.props.dataHashSum}
                            Icon={FontAwesomeIcon}
                            icons={icons}
                            onClick={this.onTreeClick}
                            onInit = {this.onTreeInit}
                        />

                    </div>
                </AppFrame>

            </Fragment>
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
        expandNum: [],
        ...param,
    };

    for (let i = 0; i < p.count; i++) {
        const item = {
            id: ID_ITER,
            caption: `item-${ID_ITER}`,
            expand: (p.expandNum.indexOf(i) > -1),
        };
        ID_ITER++;
        if (p.deep > 1) {
            item.childs = treeGenerate({ ...p, deep: p.deep - 1, level: p.level + 1 });
        }
        out.push(item);
    }
    return out;
}


const staticData = Tree.expand([
    {
        caption: 'test-1',
        id: 'test',
        childs: [
            { caption: 'sub1' },
            {
                caption: 'sub2',
                childs: [
                    {
                        id: 'sub21',
                        caption: 'sub2-1',
                    },
                    {
                        id: 'sub22',
                        caption: 'sub2-2',

                    },
                ],
            },
        ],
    },
    {
        caption: 'test-2',
        childs: [
            { caption: 'sub3' },
            { caption: 'sub4' },
        ],
    },
    {
        caption: 'test-3',
        childs: [
            { caption: 'sub5' },
            { caption: 'sub6' },
        ],
    },
], (it) => it.caption === 'test-1');
const mapStateToProps = (state) => ({
    app: state.app,
    dataHashSum: ut.random_str(5),
    data: staticData, // treeGenerate({count:10,deep:3}),
    // data: treeGenerate({ count: 10, deep: 3, expandNum: [100] }),
});

App.defaultProps = {
};
export default connect(mapStateToProps)(App);
