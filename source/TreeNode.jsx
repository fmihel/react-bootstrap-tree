import React, { Fragment } from 'react';
import {
    flex, ut,
} from 'fmihel-browser-lib';

export default class TreeNode extends React.Component {
    constructor(p) {
        super(p);
        this.onClick = this.onClick.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.onClickIcon = this.onClickIcon.bind(this);
        this.select = this.select.bind(this);

        this.refNode = React.createRef();
        this.refCollapse = React.createRef();

        this.prevCollapse = undefined;
        this.dataHashSum = '';
        this._relay = {};
    }

    onClickIcon() {
        if (
            this.props.collapseOnClickIcon) {
            this.props.toRoot({
                event: 'collapse',
                sender: this.refNode.current,
                dom: this.refNode.current,
                collapse: !this.isCollapse(),
            },
            {
                event: 'select',
                sender: this,
                dom: this.refNode.current,
            });
        }
    }

    select(bool) {
        this.props.toRoot([
            {
                event: (bool ? 'select' : 'unselect'),
                sender: this,
                dom: this.refNode.current,
            },
        ]);
    }

    onClick() {
        const params = this.props.collapseOnClickIcon ? [] : [{
            event: 'collapse',
            sender: this.refNode.current,
            dom: this.refNode.current,
            collapse: !this.isCollapse(),
        }];
        params.push({
            event: 'select',
            sender: this,
            dom: this.refNode.current,
        },
        {
            event: 'click',
            sender: this,
            item: this.props.data,
            dom: this.refNode.current,
        });
        this.props.toRoot(...params);
    }


    isCollapse(props = undefined) {
        const p = props || this.props;
        return this.refNode.current ? (p.collapse && (p.expandes.indexOf(this.refNode.current) === -1)) : p.collapse;
    }

    isSelected(props = undefined) {
        const p = props || this.props;
        return this.refNode.current ? (p.selected.indexOf(this.refNode.current) > -1) : false;
    }

    initAfterChangeData() {
        if (this.dataHashSum !== this.props.dataHashSum) {
            this.dataHashSum = this.props.dataHashSum;
            if ((this.props.data.expand === true) || (this.props.data.collapse === false)) {
                this.props.toRoot({
                    event: 'init',
                    sender: this,
                    dom: this.refNode.current,
                });
            }
        }
    }

    shouldComponentUpdate(nextProps) {
        let update = (this.dataHashSum !== nextProps.dataHashSum);
        if (!update) {
            const nextCollapse = this.isCollapse(nextProps);
            update = (!nextCollapse) || (this.prevCollapse !== nextCollapse);
        }

        if (!update) {
            update = this.isSelected() || this.isSelected(nextProps);
        }

        if (update) {
            return true;
        }
        return false;
    }

    relay(name, value, cond, enableFirstTime = true) {
        if (this._relay[name] !== value) {
            let res;
            if ((!enableFirstTime) && (!(name in this._relay))) {
                res = false;
            } else {
                res = value === cond;
            }
            this._relay[name] = value;
            return res;
        }

        return false;
    }

    componentDidMount() {
        this.initAfterChangeData();
        if ($) {
            this.$collapse = $(this.refCollapse.current);
        }
    }

    componentDidUpdate() {
        this.initAfterChangeData();

        if (this.props.animate && $) {
            const doAnimate = () => {
                this.$collapse.slideToggle(0, () => {
                    this.$collapse.slideToggle(this.props.animate);
                });
            }; if (this.relay('prevCollapse:false', this.prevCollapse, false)) {
                doAnimate();
            }
            if (this.relay('prevCollapse:true', this.prevCollapse, true, false)) {
                doAnimate();
            }
        } else {
            this.relay('prevCollapse:false', this.prevCollapse, false);
            this.relay('prevCollapse:true', this.prevCollapse, true, false);
        }
    }

    render() {
        // console.info('node render');
        const {
            data, level, toRoot, expandes, collapse, dataHashSum, selected, icons, Icon, collapseOnClickIcon, animate,
        } = this.props;
        const { childs } = data;
        const off = [];
        this.prevCollapse = this.isCollapse();
        const select = this.isSelected() ? ' tree-caption-select' : '';
        const isFolder = !!(childs && childs.length);

        const getIcon = () => {
            const icon = icons[data.icon ? data.icon : 'common'];
            if (icon) {
                let iconName = false;
                if (typeof icon === 'object') {
                    iconName = icon[Object.keys(icon)];
                    if (isFolder) {
                        iconName = (this.prevCollapse ? icon.collapse : icon.expand) || iconName;
                    } else {
                        iconName = icon.last || iconName;
                    }
                }
                // eslint-disable-next-line no-nested-ternary
                return iconName ? (Icon ? <Icon icon={iconName}/> : iconName) : null;
            }
            return null;
        };

        const icon = getIcon();
        for (let i = 0; i < level - 1; i++) {
            off.push(<div key = {i} style={{ ...flex('fixed') }} className="tree-off"/>);
        }
        off.push(<div key = {level - 1} style={{ ...flex('fixed') }} className="tree-off tree-caption-icon" onClick={this.onClickIcon}>{icon}</div>);

        return (
            <div className="tree-node " id={data.id !== undefined ? data.id : ut.random_str(5)}>
                <div
                    ref={this.refNode}
                    className={`tree-caption${select}`}
                    style={{ ...flex() }}
                    onClick={this.onClick}
                    onDoubleClick={this.onClickIcon}
                >
                    {off}
                    <div className="tree-caption-text" style={{ ...flex('stretch') }}>{data.caption}</div>
                </div>

                {isFolder && <div
                    className="tree-childs"
                    style={{ display: this.prevCollapse ? 'none' : 'block' }}
                    ref={this.refCollapse}
                >
                    {childs.map((node, i) => <TreeNode
                        key={data.key ? data.key : i}
                        collapse={collapse}
                        data={node}
                        level={level + 1}
                        toRoot={toRoot}
                        expandes={expandes}
                        selected={selected}
                        dataHashSum={dataHashSum}
                        icons={icons}
                        Icon={Icon}
                        collapseOnClickIcon={collapseOnClickIcon}
                        animate={animate}
                    />)}

                </div>
                }
            </div>
        );
    }
}
TreeNode.defaultProps = {
    dataHashSum: '',
    level: 1,
    collapse: true,
    expandes: [],
    selected: [],
    toRoot: undefined,
    select: false,
    data: {
        caption: 'text',
        childs: [],
    },

};
