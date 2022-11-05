/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import TreeNode from './TreeNode.jsx';

export default class TreeNodes extends React.Component {
    constructor(p) {
        super(p);
        this.onClick = this.onClick.bind(this);
    }

    onClick({ item }) {
        const { onClick, idName, setup } = this.props;
        if (onClick) {
            const newSetup = { ...setup };
            const itemProp = item[idName];
            if (!(itemProp in newSetup)) {
                newSetup[itemProp] = { expand: false };
            }
            newSetup[itemProp].expand = !newSetup[itemProp].expand;
            onClick({ item, setup: newSetup });
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
    }

    render() {
        const {
            data,
            idName,
            captionName,
            childsName,
            level,
            setup,
        } = this.props;
        const expand = (item) => {
            const idProp = item[idName];
            return ((idProp in setup) && (setup[idProp].expand));
        };
        return (
            <>
                {data.map((item) => (
                    <div key={item[idName]} className="tree-node" id={item[idName]}>
                        <TreeNode
                            caption={item[captionName]}
                            level={level}
                            onClick={this.onClick}
                            item={item}
                        />
                        {(expand(item) && (childsName in item) && item[childsName].length > 0)
                        && (
                            <TreeNodes
                                {...this.props}
                                level={level + 1}
                                data={item[childsName]}

                            />
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
    onInit: undefined,
    level: 0,
};
