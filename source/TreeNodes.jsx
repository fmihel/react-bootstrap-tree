/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import TreeNode from './TreeNode.jsx';
import TreeUtils from './TreeUtils.js';

export default class TreeNodes extends React.Component {
    constructor(p) {
        super(p);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.collapsing = this.collapsing.bind(this);
        this.action = this.action.bind(this);
        this.animate = this.animate.bind(this);
        this.state = {
            animateExpand: false,
        };
    }

    collapsing(item, setup) {
        const { idName, childsName, all } = this.props;
        const parents = TreeUtils.parents(all, item[idName], idName, childsName);

        // сворачиваем все
        const keys = Object.keys(setup);
        for (let i = 0; i < keys.length; i++) {
            // eslint-disable-next-line no-param-reassign
            if (!TreeUtils.eq(item[idName], keys[i])) setup[`${keys[i]}`].expand = false;
        }

        // разворачиваем всю родительскую цепочку
        parents.map((parent) => {
            const prop = parent[idName];
            // eslint-disable-next-line no-param-reassign
            setup[`${prop}`] = { ...setup[`${prop}`], expand: true };
        });

        // eslint-disable-next-line no-param-reassign
        // setup[`${item[idName]}`] = { ...setup[`${item[idName]}`], expand: true };
    }

    action(item, param = {}) {
        const prm = {
            select: false,
            expand: false,
            expandType: 'toggle', // toggle true false
            ...param,
        };
        const {
            idName, animate, onSelect, onChange, setup, collapsing,
        } = this.props;

        const itemProp = `${item[idName]}`;
        const newSetup = { ...setup };
        let modif = false;
        // ---------------------------------------------------------------------
        if (prm.select) {
            if (!(itemProp in setup) || (!setup[itemProp].select)) {
                Object.keys(newSetup).map((key) => {
                    if ('select' in newSetup[`${key}`]) {
                        delete newSetup[`${key}`].select;
                    }
                });

                if (!(itemProp in newSetup)) {
                    newSetup[itemProp] = {};
                }

                newSetup[itemProp].select = true;
                if (onSelect) onSelect({ [`${idName}`]: itemProp, item });
                modif = true;
            }
        }
        // ---------------------------------------------------------------------
        if (prm.expand) {
            if (!(itemProp in newSetup)) {
                newSetup[itemProp] = { expand: false };
            }
            // ---------------------------------------------------------------------
            if ((prm.expandType === 'toggle' ? (!newSetup[itemProp].expand) : prm.expand)) {
                newSetup[itemProp].expand = true;
                if (collapsing) {
                    // свернем все ненужные узлы
                    this.collapsing(item, newSetup);
                }
                if (animate > 0) {
                    this.setState({ animateExpand: itemProp });
                }
                if (onChange) {
                    onChange({ setup: newSetup });
                }
            } else {
                // newSetup[itemProp].expand = false;
                this.animate(itemProp, 'collapse')
                    .then(() => {
                        newSetup[itemProp].expand = false;
                        if (onChange) {
                            onChange({ setup: newSetup });
                        }
                    });
            }
        // ---------------------------------------------------------------------
        } else if (modif && onChange) {
            onChange({ setup: newSetup });
        }
    }

    onClick({ item, isIcon }) {
        const {
            onClick, expandOnDoubleClickCaption, expandOnDoubleClickIcon, setup, onChange,
        } = this.props;

        if (onClick) onClick({ item });

        if ((isIcon && !expandOnDoubleClickIcon) || (!isIcon && !expandOnDoubleClickCaption)) {
            this.action(item, { select: true, expand: true });
        } else {
            this.action(item, { select: true, expand: false });
        }
    }

    onDoubleClick({ item, isIcon }) {
        const {
            onDoubleClick, expandOnDoubleClickCaption, expandOnDoubleClickIcon, setup, onChange,
        } = this.props;
        if (onDoubleClick) onDoubleClick({ item });

        if ((isIcon && expandOnDoubleClickIcon) || (!isIcon && expandOnDoubleClickCaption)) {
            this.action(item, { select: true, expand: true });
        }
    }

    animate(id, action = 'expand') {
        const { animate } = this.props;
        return new Promise((ok, err) => {
            if (animate > 0) {
                if (action === 'expand') {
                    $('.tree').find(`#${id}`).find('.tree-childs')
                        .slideUp(0)
                        .slideDown(animate, () => {
                            // this.setState({ animateExpand: false });
                            ok({ id, action });
                        });
                } else { // action==='collapse'
                    $('.tree').find(`#${id}`).find('.tree-childs')
                        .slideUp(animate, () => {
                            // this.setState({ animateCollapse: false });
                            ok({ id, action });
                        });
                }
            } else {
                ok({ id, action });
            }
        });
    }

    componentDidMount() {
        // разовый вызов после первого рендеринга
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // каждый раз после рендеринга (кроме первого раза !)
        const { animateExpand } = this.state;
        if (prevState.animateExpand !== animateExpand && animateExpand !== false) {
            this.animate(animateExpand, 'expand').then(() => {
                this.setState({ animateExpand: false });
            });
        }
    }

    render() {
        const {
            data,
            all,
            idName,
            captionName,
            childsName,
            level,
            setup,
            IconComponent,
            icons,
            onGetIcon,
            classNameItem, // string or function
            styleItem, // object or function
            styleIcon, // object or function
            styleCaption, // object or function

        } = this.props;
        const { animateExpand, animateCollapse } = this.state;

        const expand = (item) => {
            const idProp = item[idName];
            return (animateExpand === idProp || animateCollapse === idProp || ((idProp in setup) && (setup[idProp].expand)));
        };
        const select = (item) => {
            const idProp = item[idName];
            return ((idProp in setup) && (setup[idProp].select));
        };

        const getIcon = (item) => {
            const expnd = expand(item);
            if (onGetIcon) {
                return onGetIcon({
                    item, expand: expnd, setup, all,
                });
            }
            const isFolder = (childsName in item);
            if (isFolder) {
                return expnd ? icons.expand : icons.collapse;
            }
            return icons.file;
        };
        const getNodeStyle = (item) => (typeof styleItem === 'function' ? styleItem({
            item, data, setup, all,
        }) : styleItem);
        const getNodeIconStyle = (item) => (typeof styleIcon === 'function' ? styleIcon({
            item, data, setup, all,
        }) : styleIcon);
        const getNodeCaptionStyle = (item) => (typeof styleCaption === 'function' ? styleCaption({
            item, data, setup, all,
        }) : styleCaption);
        const getNodeClassName = (item) => (typeof classNameItem === 'function' ? classNameItem({
            item, data, setup, all,
        }) : classNameItem);

        return (
            <>
                {data.map((item) => (
                    <div key={item[idName]} className="tree-node" id={item[idName]}>
                        <TreeNode
                            caption={item[captionName]}
                            level={level}
                            onClick={this.onClick}
                            onDoubleClick={this.onDoubleClick}
                            item={item}
                            select={select(item)}
                            IconComponent={IconComponent}
                            icon={IconComponent ? getIcon(item) : ''}
                            className={classNameItem ? getNodeClassName(item) : ''}
                            style={styleItem ? getNodeStyle(item) : {}}
                            iconStyle={styleIcon ? getNodeIconStyle(item) : {}}
                            captionStyle={styleCaption ? getNodeCaptionStyle(item) : {}}
                        />
                        {(expand(item) && (childsName in item) && item[childsName].length > 0)
                        && (
                            <div className="tree-childs">
                                <TreeNodes
                                    {...this.props}
                                    level={level + 1}
                                    data={item[childsName]}

                                />
                            </div>
                        )}
                    </div>
                ))}
            </>
        );
    }
}
TreeNodes.defaultProps = {
    data: [],
    all: [],
    idName: 'id',
    captionName: 'caption',
    childsName: 'childs',
    setup: {},
    onClick: undefined,
    onDoubleClick: undefined,
    onSelect: undefined,
    onChange: undefined,
    level: 1,
    animate: 200,
    IconComponent: undefined,
    icons: {},
    expandOnDoubleClickCaption: false,
    expandOnDoubleClickIcon: false,
    collapsing: true,
    onGetIcon: undefined,
    classNameItem: undefined, // string or function
    styleItem: undefined, // object or function
    styleIcon: undefined, // object or function
    styleCaption: undefined, // object or function

};
