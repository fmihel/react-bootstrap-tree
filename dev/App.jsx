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
        binds(this, 'onPress');
    }

    onPress() {
        redux.actions.debug({
            test: ut.random_str(5),
            test2: ut.random_str(5),
        });
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
                        />

                    </div>
                </AppFrame>
                <Debug/>
            </Fragment>
        );
    }
}

let ID_ITER = 0;
function treeGenerate(count = 100, deep = 2) {
    const out = [];

    for (let i = 0; i < count; i++) {
        const item = {
            id: ID_ITER,
            caption: `item-${ID_ITER}`,
        };
        ID_ITER++;
        if (deep > 1) {
            item.childs = treeGenerate(count, deep - 1);
        }
        out.push(item);
    }
    return out;
}
const staticData = [
    {
        caption: 'test',
        icon: 'file',
        childs: [
            { caption: 'sub1' },
            { caption: 'sub2' },
        ],
    },
];
const mapStateToProps = (state) => ({
    app: state.app,
    dataHashSum: ut.random_str(5),
    data2: staticData, // treeGenerate(10, 3),
    data: treeGenerate(7, 3),
});

export default connect(mapStateToProps)(App);
