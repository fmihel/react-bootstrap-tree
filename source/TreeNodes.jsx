/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import TreeNode from './TreeNode.jsx';

export default class TreeNodes extends React.Component {
    constructor(p) {
        super(p);
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
        } = this.props;
        return (
            <>
                {data.map((item) => (
                    <div key={item[idName]} className="tree-node" id={item[idName]}>
                        <TreeNode
                            caption={item[captionName]}
                            level={level}
                        />
                        {((childsName in item) && item[childsName].length > 0)
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
