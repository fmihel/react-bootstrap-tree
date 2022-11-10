# react-bootstrap-tree v2.0

## Install
```npm i fmihel-react-bootstrap-tree```

---

## Peer depend (optional)
If use scroll function Tree.scroll(...) add jquery\
```npm i jquery```


---
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

---

## Утилиты для работы со структурой дерева

### Tree.map(tree:array,callback:function,param?:{idName,childsName}):array
Возвращает новую карту дерва, для каждого узла вызывает callback (если указан), который должен вернуть узел\

---
### Tree.each(tree:array, callbackOrId:function | string , param?:{idName,childsName} ):object | undefined
Цикл по всем узлам дерева tree, до момента пока callbackOrId(item,parent) не вернет true (или пока не найден узел с id = callbackOrId). ``Для верхнего уровня parent = 'root'``. Вернет либо найденный элемент или undefined

---
### Tree.filter(tree:array, callback:functikon,param?:{childsName} ):object
Возыращает новое дерево, для узлов которого callback(child,parent) возвращает true

---
### Tree.parent(tree, callbackOrId, param?:{idName, childsName}):array | undefined
Возвращает родительский узел

---
### Tree.parents(tree, callbackOrId, param?:{idName, childsName}):array
Возырвщает список всех родительских узлов

---
### Tree.childs(tree, callbackOrId, param?:{idName, childsName}):array | undefined
Возвращает список childs, т.е. список соседних элементов для callbackOrId

---
### Tree.eq(id1, id2):boolean
Алгоритм сравнения двух идентификаторов. Сравнение производится с привидением типов, но с учетом что false != 0/

 ---
### Tree.scroll(scroll:string, target:string, animate:integer, off:integer)
Динамический скролинг контейнера с DOM.id = scroll до попадания DOM.id = target в область видимости внутри scroll.\
`scroll` - id в дерева (задавать при использовании <Tree id="ID"....>)\
`target` - id узла\
`animate` - время анимации в мсек\
`off` - смещение относительно верхней граница scroll\

---

```txt 
param = {idName:string,childsName:string}  в случае если ключевые поля в основной структуре 
tree имеют другое название, нужно указать их с помощью param ( можно сделать через глобальную настройку Tree.global) 
```

---



## TreeSetupUtils
Подключение:\
``` import {TreeSetupUtils} from 'fmihel-react-bootstrap-tree'; ```

---
### TreeSetupUtils.each(setup, callback)
Цикл по всем элементам setup, вернет id для которого callback({id,item,setup}) вернет true

---
### TreeSetupUtils.map(setup, callback = undefined)
Возвращает новый setup

--- 
### TreeSetupUtils.expandTo(tree, setup, toId, idName?:string = 'id', childsName?:string = 'childs')
Возвращает новый setup, где раскрыты все родительские элементы для toId

---

## Использование утилит для навигации, поиска . позиционирования и т.д.( Issue )

### Поиск узла
```js
    let item = Tree.each(tree,(item,parent)=>{
        return item.id === '100';
    });
```

### Удалить узел ID
```js
    let newTree = Tree.filter(tree, (item) => !Tree.eq(item.id, ID));
```

### Добавить узел с id = ID в узел с id=TOID
```js
    const to = Tree.each(tree, TOID);
    if (to ){
        if (!('childs' in to))
            to.childs = [];    
        to.childs.push({id:ID,caption:'new'});
    }
```




