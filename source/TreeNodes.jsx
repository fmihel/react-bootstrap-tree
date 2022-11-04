/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

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
        } = this.props;
        return (
            <div>
                {data.map((item) => (
                    <div key={item[idName]} className="tree-node" id={item[idName]}>
                        <div className="tree-caption">

                            {item[captionName]}
                        </div>
                        {(childsName in item && item[childsName].length)
                        ?? (
                            <TreeNodes
                                {...this.props}
                                data={item[childsName]}

                            />
                        )}
                    </div>
                ))}
            </div>
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
};
