import React, { Fragment } from 'react';
import {
    binds, ut,
} from 'fmihel-browser-lib';
import { connect } from 'react-redux';
import Debug from 'COMPONENTS/Debug/Debug.jsx';
import redux from 'REDUX';
import AppFrame from 'COMPONENTS/AppFrame/AppFrame.jsx';
import '../scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile, faFolder, faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import Tree from '../source/Tree.jsx';

class App extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'onPress', 'onTreeClick');
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
                    </div>
                    <div>
                        <Tree
                            data={this.props.data}
                            dataHashSum={this.props.dataHashSum}
                            Icon={FontAwesomeIcon}
                            icons={icons}
                            onClick={this.onTreeClick}
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
const staticData = [
    {
        caption: 'test-1',
        collapse: false,
        childs: [
            { caption: 'sub1' },
            { caption: 'sub2' },
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
        expand: true,
        childs: [
            { caption: 'sub5' },
            { caption: 'sub6' },
        ],
    },
];
const mapStateToProps = (state) => ({
    app: state.app,
    dataHashSum: ut.random_str(5),
    // data: staticData, // treeGenerate({count:10,deep:3}),
    data: treeGenerate({ count: 10, deep: 3, expandNum: [] }),
});

App.defaultProps = {
};
export default connect(mapStateToProps)(App);
