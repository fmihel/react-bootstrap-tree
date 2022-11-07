/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import TreeNode from './TreeNode.jsx';

export default class TreeNodes extends React.Component {
    constructor(p) {
        super(p);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);

        this.action = this.action.bind(this);
        this.state = {
            animateExpand: false,
            animateCollapse: false,
        };
    }

    action(item, param = {}) {
        const prm = {
            select: false,
            expand: false,
            expandType: 'toggle', // toggle true false
            ...param,
        };
        const {
            idName, animate, onSelect, onChange, setup,
        } = this.props;

        const itemProp = item[idName];
        const newSetup = { ...setup };
        let modif = false;
        // ---------------------------------------------------------------------
        if (prm.select) {
            if (!(itemProp in setup) || (!setup[itemProp].select)) {
                Object.keys(newSetup).map((key) => {
                    if ('select' in newSetup[key]) {
                        delete newSetup[key].select;
                    }
                });

                if (!(itemProp in newSetup)) {
                    newSetup[itemProp] = {};
                }

                newSetup[itemProp].select = true;
                if (onSelect) onSelect({ [idName]: itemProp, item });
                modif = true;
            }
        }
        // ---------------------------------------------------------------------
        if (prm.expand) {
            if (!(itemProp in newSetup)) {
                newSetup[itemProp] = { expand: false };
            }

            newSetup[itemProp].expand = (prm.expandType === 'toggle' ? (!newSetup[itemProp].expand) : prm.expand);

            if (animate > 0) {
                if (newSetup[itemProp].expand) {
                    this.setState({ animateExpand: itemProp });
                } else {
                    this.setState({ animateCollapse: itemProp });
                }
            }
            modif = true;
        }
        // ---------------------------------------------------------------------
        if (modif && onChange) {
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

    componentDidMount() {
        // разовый вызов после первого рендеринга
    }

    componentWillUnmount() {
        // разовый после последнего рендеринга
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        // каждый раз после рендеринга (кроме первого раза !)
        const { animateExpand, animateCollapse } = this.state;
        const { animate } = this.props;
        if (prevState.animateExpand !== animateExpand && animateExpand !== 'false') {
            $('.tree').find(`#${animateExpand}`).find('.tree-childs')
                .slideUp(0)
                .slideDown(animate, () => {
                    this.setState({ animateExpand: false });
                });
        }
        if (prevState.animateCollapse !== animateCollapse && animateCollapse !== 'false') {
            $('.tree').find(`#${animateCollapse}`).find('.tree-childs')
                .slideUp(animate, () => {
                    this.setState({ animateCollapse: false });
                });
        }
    }

    render() {
        const {
            data,
            idName,
            captionName,
            childsName,
            level,
            setup,
            IconComponent,
            icons,
            onGetIcon,
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
                return onGetIcon({ item, expand: expnd });
            }
            const isFolder = (childsName in item);
            if (isFolder) {
                return expnd ? icons.expand : icons.collapse;
            }
            return icons.file;
        };
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
};
