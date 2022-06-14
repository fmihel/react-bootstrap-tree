import React from 'react';
import { binds, ut, DOM } from 'fmihel-browser-lib';
import TreeNode from './TreeNode.jsx';


export default class Tree extends React.Component {
    constructor(p) {
        super(p);
        this.fromNode = this.fromNode.bind(this);
        this.select = this.select.bind(this);
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
            } else if (o.event === 'unselect') {
                const index = state.selected.indexOf(o.dom);
                if (index >= 0) {
                    state.selected.splice(index, 1);
                }
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

    /** поиск узла по id и выделение его */
    select(id) {
        const t = this;

        $(`#${t.state.id}`).find('.tree-node').each((i, it) => {
            if (it.id === id) {
                const dom = $(it).find('.tree-caption')[0];
                this.lockAnimate = true;
                t.fromNode(
                    {
                        event: 'collapse',
                        sender: dom,
                        dom,
                        collapse: false,
                    },
                    {
                        event: 'select',
                        sender: this,
                        dom,
                    },
                );
                return false;
            }
        });
    }

    static _expand(data, cond) {
        for (let i = 0; i < data.length; i++) {
            const it = data[i];
            if (cond(it) === true) {
                it.expand = true;
                return true;
            }
            if (('childs' in it) && (it.childs.length > 0)) {
                if (Tree._expand(it.childs, cond)) {
                    it.expand = true;
                    return true;
                }
            }
        }
        return false;
    }

    /** вставит метку раскрытия узлов, до узла отвечающего условию cond(it):bool */
    static expand(data, cond) {
        Tree._expand(data, cond);
        return data;
    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
        this.initAfterChangeData();
        if (this.props.onInit) {
            this.props.onInit({ sender: this });
        }
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(props) {
        // каждый раз после рендеринга (кроме первого раза !)
        if (this.props.dataHashSum !== props.dataHashSum) {
            this.initAfterChangeData();
        }
        this.lockAnimate = false;
    }


    render() {
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
    onInit: undefined,

};
