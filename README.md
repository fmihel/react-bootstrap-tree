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
    constructor(p){
        super(p);
        this.state={
            setup:{}
        };
    }
    render() {
        return (
              <div>
                <Tree
                    data={this.props.tree}
                    setup={this.state.setup}                    
                />
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

## utils
---
### Tree.map(tree:array,callback:function,param?:{idName,childsName}):array

Возвращает новую карту дерва, для каждого узла вызывает callback (если указан), который должен вернуть узел\

Ex, Свернуть все/collapse all
```js
    let newTree = Tree.map(tree,(child,parent)=>{
        return {...child,expand:false};
    });
```
---
### Tree.each(tree:array, callbackOrId:function | string , param?:{idName,childsName} ):object | undefined

Цикл по всем узлам дерева tree, до момента пока callbackOrId не вернет true (или пока не найден узел с id = callbackOrId). 
Вернет либо найденный элемент или undefined

Ex, Поиск
```js
    let item = Tree.each(tree,(item,parent)=>{
        return item.id === '100';
    });
```









