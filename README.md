# react-bootstrap-tree
bootstrap tree react component
# Tree view react component (bootstrap compatible)

## Install
```npm i fmihel-react-bootstrap-tree```

## Simple use
```js
import "fmihel-react-bootstrap-tree/style/css";
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
            caption: 'folder-1',
            collapse: false,
            childs: [
                { caption: 'sub1' },
                { caption: 'sub2' },
            ],
        },
        {
            caption: 'folder-2',
            childs: [
                { caption: 'sub3' },
                { caption: 'sub4' },
            ],
        },
        {
            caption: 'folder-3',
            expand: true,
            childs: [
                { caption: 'sub5' },
                { caption: 'sub6' },
            ],
        },
    ]
};
``` 
## Tree.props
|name|type|default|notes|
|----|----|----|----|
|id|any|undefined| id of root html element tree|
|css|string|'fmb-tree'|css class name of root element tree|
|theme|string|''|postfix for css, Ex: if css = "myclass" and theme="light" so result classname of root "myclass-light"|
|collapsing|bool|true|collapse other tree node after expand selected node|
|collapseOnClickIcon|bool|true| if true so collapse node after click icon or double click node|
|animate|int|200|delay animation on collapse/expand (!!! need jQuery)|
|data|array|[]|tree data, see data struct chapter|
|icons|object|{common: {<br>expand: '-',<br>collapse: '+',<br>last: '>',<br>}| icons lib, see icons chapter|
|Icon|React.Component|undefined| custom component for draw icon, see Icon chapter|
|onClick|Function|undefined|callback on click node|

## data struct
Example:
```js
data:[
    {
        caption: 'folder-1',
        collapse: false,
        childs: [
            { caption: 'sub1' },
            { caption: 'sub-folder',
              childs:[
                  {caption:"sub2"},
                  {caption:"sub3"},
              ]
            },
        ],
    },
]
``` 
|name|type|notes|
|----|----|----|
|caption|string|node caption|
|expand/collapse|bool| expan/collapse of node on first draw|
|id|any|id of dom element|
|childs|array|array of sub node|
|icon|any|icon or icons for draw on Icon|

## icons
Lib of icons name<br>
format
```javascript
icons: {
    NAME_OF_ICON1: {
        expand: '-',  // symbol for expand node
        collapse: '+',// symbol for collapse node
        last: '>',    // symbol for node have not childs
    },
    //or use
    NAME_OF_ICON2:'*'  // symbol fot node (always),
    ...
},
 ```
 use in data
 ```javascript
 data:[
    {
        caption: 'folder-1',
        icon:NAME_OF_ICON1
        childs: [
            { caption: 'sub1',icon:NAME_OF_ICON2 },
        ],
    },
]
 ```
 
 ## Icon
 React component for custom draw icon. Component must by consists  ***props.icon*** as minimal.
 Simple example:
 ```javascript
class MyIcon extends React.Component {
    render() {
        return (
            <img src={this.props.icon}/>
        );
    }
}
 ```
 to use this component redefine  icons props:
 ```javascript
 class App extends React.Component {
    render() {
        const icons = {
            common: {
                expand:'https://path/path/folder-open.png',
                collapse:'https://path/path/folder.png',
                last:'https://path/path/file.png',    
            },
            selected_file:'https://path/path/active.png',  
        };

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
                            icons={icons}
                            Icon={MyIcon}
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
        caption: 'folder-1', // icon from icons.common
        childs: [
            { caption: 'sub1' }, // icon from icons.common
            { caption: 'sub2' ,icon:'selected_file'} // icon from  icons.selected_file
        ],
    },
]
};
 ```

## Icon from fontawesome lib
### install fontawesome component 
```npm  i @fortawesome/fontawesome-free @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome```

define ***props.icons***
```javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFile, faFolder, faFolderOpen,faCoffeCup} from '@fortawesome/free-solid-svg-icons';
import "fmihel-react-bootstrap-tree/style/css";
import Tree from 'fmihel-react-bootstrap-tree';

class App extends React.Component {
    render() {
        const icons = {
            common: {
                expand: faFolderOpen,
                collapse: faFolder,
                last: faFile,
            },
            coffe: [faCoffeCup],
        };

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
                            icons={icons}
                            Icon={FontAwesomeIcon}
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
            caption: 'folder-1',
            collapse: false,
            childs: [
                { caption: 'sub1',icon:'coffe' },
                { caption: 'sub2' },
            ],
        }
    ]
};

```
