/* eslint-disable no-unused-vars */
import React from 'react';

export default class TreeNode extends React.Component {
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
            <div>TreeNode</div>
        );
    }
}
TreeNode.defaultProps = {
    id: undefined,
    caption: '',
};
