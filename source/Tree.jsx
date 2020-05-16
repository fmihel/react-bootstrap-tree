import React from 'react';
import { binds, ut, DOM } from 'fmihel-browser-lib';
import TreeNode from './TreeNode.jsx';


export default class Tree extends React.Component {
    constructor(p) {
        super(p);
        binds(this, 'fromNode');
        this.state = {
            expandes: [],
            selected: [],
            id: this.props.id ? this.props.id : ut.random_str(7),
        };
        this.init = {
            expandes: [],
        };
        this.lockAnimate = false;
        this.prevClick = undefined;
    }

    fromNode(...from) {
        const state = {};
        // eslint-disable-next-line array-callback-return
        from.map((o) => {
            if (o.event === 'collapse') {
                const idx = this.state.expandes.indexOf(o.dom);
                if (this.props.collapsing) {
                    const expandes = this.getParentNodes(o.dom);
                    if (!o.collapse) {
                        expandes.push(o.dom);
                    }
                    state.expandes = expandes;
                } else if (!o.collapse) {
                    if (idx === -1) {
                        const expandes = [...this.state.expandes];
                        expandes.push(o.dom);
                        state.expandes = expandes;
                    }
                } else if (idx > -1) {
                    const expandes = [...this.state.expandes];
                    expandes.splice(idx, 1);
                    state.expandes = expandes;
                }
            } else if (o.event === 'click') {
                if (this.props.onClick) {
                    if (this.prevClick !== o.dom) {
                        this.prevClick = o.dom;
                        this.props.onClick({
                            ...o,
                            tree: this,
                            data: this.props.data,
                        });
                    }
                }
            } else if (o.event === 'select') {
                state.selected = [o.dom];
            } else if (o.event === 'init') {
                this.init.expandes.push(o.dom);
            }
        });
        if (state !== {}) {
            this.setState(state);
        }
    }

    getParentNodes(from) {
        const out = [];
        let parent = from.parentNode.parentNode;
        while (parent.id !== this.state.id) {
            if (parent.className.indexOf('tree-node') > -1) {
                out.push(DOM('.tree-caption', parent));
            }
            parent = parent.parentNode;
        }
        return out;
    }

    initAfterChangeData() {
        // console.info('init', this.init.expandes);
        this.lockAnimate = true;
        this.setState({ expandes: this.init.expandes, selected: [] });
        this.init.expandes = [];
    }

    culcDataHashSum() {
        // in dev
    }

    componentDidMount() {
        this.initAfterChangeData();
    }

    componentDidUpdate(props) {
        if (this.props.dataHashSum !== props.dataHashSum) {
            this.initAfterChangeData();
        }
        this.lockAnimate = false;
    }


    render() {
        // console.info('tree render');
        const {
            data, css, collapsing, theme, dataHashSum, icons, Icon,
            collapseOnClickIcon, animate,
        } = this.props;
        const {
            expandes, id, selected,
        } = this.state;
        return (
            <div className={css + (theme ? `-${theme}` : '')} id={id}>
                {data.map((node, i) => <TreeNode
                    toRoot = {this.fromNode}
                    key = {data.id ? data.id : i}
                    data={node}
                    collapse={true}
                    expandes={expandes}
                    selected={selected}
                    collapsing={collapsing}
                    dataHashSum={dataHashSum}
                    icons={icons}
                    Icon={Icon}
                    collapseOnClickIcon={collapseOnClickIcon}
                    animate={this.lockAnimate ? 0 : animate}

                />)
                }
            </div>
        );
    }
}
Tree.defaultProps = {
    id: undefined,
    css: 'fmb-tree', // css корневой класс дерева
    theme: 'light', // окончание добавляемре к имен класса, Ex: сss = 'mytree' theme = 'light' set mytree-light

    collapsing: true,
    collapseOnClickIcon: true,
    dataHashSum: ut.random_str(10),
    animate: 200,
    icons: {
        common: {
            expand: '-',
            collapse: '+',
            last: '>',
        },
    },
    Icon: undefined,
    data: [
        {
            caption: 'Item1',
            id: 'item1',
            childs: [
                { caption: 'Item3' },
                { caption: 'Item4' },
            ],
        },
        {
            caption: 'Item2',
            id: 'item2',
            childs: [
                { caption: 'Item5' },
                {
                    caption: 'Item6',
                    childs: [
                        { caption: 'Item7' },
                        { caption: 'Item8' },
                    ],
                },
            ],
        },
        {
            caption: 'Item9',
            id: 'item9',
            childs: [
                { caption: 'Item10' },
                {
                    caption: 'Item11',
                    childs: [
                        { caption: 'Item12' },
                        { caption: 'Item13' },
                    ],
                },
            ],
        },
    ],
    onClick: undefined,

};
