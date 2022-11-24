# react-bootstrap-tree v2

## Install
```bash 
$ npm i fmihel-react-bootstrap-tree
```


---
## Simple use
```js
import "fmihel-react-bootstrap-tree/style/tree.scss";
import Tree from 'fmihel-react-bootstrap-tree';

class App extends React.Component {
    constructor(p){
        super(p);
        this.onChangeTreeSetup = this.onChangeTreeSetup.bind(this);
        this.state={
            setup:{}
        };
    }
    onChangeTreeSetup({ setup }) {
        this.setState({ setup });
    }

    render() {
        return (
              <div>
                <Tree
                    id={'my-tree'}
                    data={this.props.tree}
                    setup={this.state.setup}
                    onChange={this.onChangeTreeSetup}                    
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
## Свойства компонента
|name|type|default|global*|notes|
|---|---|---|---|---|
|id|string|||идентификатор верхнего объекта DOM|
|data|array|[]||древовидная структура |
|setup|object|{}||текущая настройка дерева ( какие узлы раскрыты, какиен выделены)|
|idName|string|id|*|имя поля отвечающее за идентификатор|
|idName|string|id|*|имя поля отвечающее за идентификатор|
|captionName|string|caption|*|имя поля отвечающее за текст|
|childsName|string|childs|*|имя поля отвечающее за поля с дочерними узлами|
|IconComponent|object|null|*|компонент отображающий иконку|
|icons|object|icons*|*|объект с описанием иконок для сворачиваемых разворачиваемых и конечных узлов|
|expandOnDoubleClickCaption|boolean|true|*|разворачивать при двойном клике на иконку|
|expandOnDoubleClickIcon|boolean|false|*|разворачивать при двойном клике на тексте|
|collapsing|boolean|false|*|при разворачивании, сворачивать другие неучавствующие в ветке узлы|
|animate|int|0|*|скорость анимации в мс, требует установки ```jQuery```|
|className|string||*|дополнительный верхний класс|
|classNameItem|string||*|дополнительный класс для узла|
|styleItem|string \| function||*|дополнительный стиль (или ф-ция возвращающая тиль) для узла|
|styleIcon|string \| function||*|дополнительный стиль (или ф-ция возвращающая тиль) для иконки|
|styleCaption|string \| function||*|дополнительный стиль (или ф-ция возвращающая тиль) для текста|
|onClick|function|undefined|||
|onDoubleClick|function|undefined|||
|onSelect|```function({ [idName]:string, item:object })```|undefined||Событие при выборе узла|
|onChange|```function({ setup:object })```|undefined||Событие на изменение визуального состояния(раскрытие, выбор ..) дерева|
|onGetIcon|function|undefined|||

###### ``` global* - можно установить через глобальное статическое свойство Tree.global```
###### ``` icons* = {expand:undefined,collapse:undefined,file:undefined}```
---
## Утилиты для работы со структурой дерева

```js
Tree.map(tree:array,callback:function,param?:{idName,childsName}):array
```
Возвращает новую карту дерва, для каждого узла вызывает ```callback(child,parent)``` (если указан), который должен вернуть узел

---
```js 
Tree.each(tree:array, callbackOrId:function | string , param?:{idName,childsName} ):object | undefined
```
Цикл по всем узлам дерева tree, до момента пока ```callbackOrId(item,parent)``` не вернет true (или пока не найден узел с id = callbackOrId). ``Для верхнего уровня parent = 'root'``. Вернет либо найденный элемент или undefined

---
```js 
Tree.filter(tree:array, callback:functikon,param?:{childsName} ):object
```
Возыращает новое дерево, для узлов которого ```callback(child,parent)``` возвращает true

---
```js 
Tree.parent(tree, callbackOrId, param?:{idName, childsName}):array | undefined
```
Возвращает родительский узел для узла с id = callbackOrId или для, которого ```callback(item,parent)``` вернет
`true`

---
```js 
Tree.parents(tree, callbackOrId, param?:{idName, childsName}):array
```
Возырвщает список всех родительских узлов для узла с id = callbackOrId или для, которого ```callback(item,parent)``` вернет
`true`

---
```js 
Tree.childs(tree, callbackOrId, param?:{idName, childsName}):array | undefined
```
Возвращает список childs, т.е. список соседних элементов для узла с id = callbackOrId или для которого ```callback(item,parent)``` вернет`true`

---
```js 
Tree.eq(id1, id2):boolean
```
Алгоритм сравнения двух идентификаторов. Сравнение производится с привидением типов, но с учетом что false != 0/

 ---
```js 
Tree.scroll(scroll:string, target:string, animate:integer, off:integer)
```
Динамический скролинг контейнера с DOM.id = scroll до попадания DOM.id = target в область видимости внутри scroll.\
`scroll` - id в дерева (задавать при использовании ```<Tree id="ID"....>```)\
`target` - id узла\
`animate` - время анимации в мсек\
`off` - смещение относительно верхней граница scroll\

---

```txt 
param = {idName:string,childsName:string}  в случае если ключевые поля в основной структуре 
tree имеют другое название, нужно указать их с помощью param ( можно сделать через глобальную настройку Tree.global) 
```

---



## TreeSetupUtils -  утилит работы с состоянием узлов дерева (раскрыты, закрыты, выбраны ... )
### Подключение:
```js 
import {TreeSetupUtils} from 'fmihel-react-bootstrap-tree'; 
```

---
```js 
TreeSetupUtils.each(setup, callback)
```
Цикл по всем элементам ```setup```, вернет id для которого ```callback({id,item,setup})``` вернет true

---
```js 
TreeSetupUtils.map(setup, callback = undefined)
```
Возвращает новый ```setup```, выполняя для каждого элемента ```callback({id,item,setup})```, 

--- 
```js 
TreeSetupUtils.expandTo(tree, setup, toId, idName?:string = 'id', childsName?:string = 'childs')
```
Возвращает новый ```setup```, где раскрыты все родительские элементы для toId, при этом не сворачивает другие узлы, 
но снимает с них выделенин ```(select = false)``` и помечает toId

---

## Использование утилит для навигации, поиска, позиционирования и т.д.( Issue )

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




