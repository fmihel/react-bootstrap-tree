# react-bootstrap-tree v2.0
bootstrap tree react component
# Tree view react component (bootstrap compatible)

## Install
```npm i fmihel-react-bootstrap-tree```

## Simple use
```js
import "fmihel-react-bootstrap-tree/style/tree.scss";
import Tree from 'fmihel-react-bootstrap-tree';

class App extends React.Component {
    render() {
        return (
              <div className="container-fluid" >
                <div className="row">
                    <div className="col">
                        Tree
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Tree
                            data={this.props.data}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

App.defaultProps = {
    data:[
        {
            id:1,
            caption: 'folder-1',
            childs: [
                { id:4,caption: 'sub1' },
                { id:5,caption: 'sub2' },
            ],
        },
        {
            id:2,
            caption: 'folder-2',
            childs: [
                { id:6,caption: 'sub3' },
                { id:7,caption: 'sub4' },
            ],
        },
        {
            id:3,
            caption: 'folder-3',
            childs: [
                { id:8,caption: 'sub5' },
                { id:9,caption: 'sub6' },
            ],
        },
    ]
};
``` 
