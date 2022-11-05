/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React from 'react';
import TreeNodes from './TreeNodes.jsx';

export default class Tree extends React.Component {
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
        return (
            <div className="tree">
                <TreeNodes {...this.props} />
            </div>
        );
    }
}
Tree.defaultProps = {
    data: [],
    idName: 'id',
    captionName: 'caption',
    childsName: 'childs',
    setup: {},
    onClick: undefined,
    onInit: undefined,

};
