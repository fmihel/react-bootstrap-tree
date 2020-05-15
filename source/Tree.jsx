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
                    this.props.onClick({
                        ...o,
                        tree: this,
                        data: this.props.data,
                    });
                }
            } else if (o.event === 'select') {
                state.selected = [o.dom];
            }
        });
        if (state !== {}) { this.setState(state); }
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

    componentDidUpdate(props) {
        if (this.props.dataHashSum !== props.dataHashSum) {
            this.setState({ expandes: [], selected: [] });
        }
    }

    render() {
        const {
            data, css, collapse, collapsing, theme, dataHashSum, icons, Icon,
            collapseOnClickIcon, animate,
        } = this.props;
        const { expandes, id, selected } = this.state;
        return (
            <div className={css + (theme ? `-${theme}` : '')} id={id}>
                {data.map((node, i) => <TreeNode
                    toRoot = {this.fromNode}
                    key = {data.id ? data.id : i}
                    data={node}
                    collapse={collapse}
                    expandes={expandes}
                    selected={selected}
                    collapsing={collapsing}
                    dataHashSum={dataHashSum}
                    icons={icons}
                    Icon={Icon}
                    collapseOnClickIcon={collapseOnClickIcon}
                    animate={animate}
                />)
                }
            </div>
        );
    }
}
Tree.defaultProps = {
    css: 'fmb-tree',
    collapse: true,
    collapsing: true,
    collapseOnClickIcon: true,
    id: undefined,
    theme: 'light',
    dataHashSum: '',
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
