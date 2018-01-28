---

layout:     post
title:      "d3.js 无向图绘制"
date:       2017-07-01
author:     "Gitai"
categories:
    - 数据可视化
tags:
    - D3.js

---

这只是数据可视化的一个小例子，

首先看看成品

![无向图](https://ooo.0o0.ooo/2017/07/02/5957e4fd07313.png)

[戳进去](http://sandbox.runjs.cn/show/bkmdgig6)会动的～ 

<!-- more -->

首先写个 d3.js 的力图

参见人家的 [布局 力导向图](http://d3.decembercafe.org/pages/layout/force.html)，在此不对重复内容进行赘述。

相比来说只是数据预处理和 `linkDistance` 改成数组这种小细节。

`linkDistance` 指定结点连接线的距离，默认为20。如果距离是一个常数，那么各连接线的长度总是固定的；如果是一个函数，那么这个函数是作用于各连接线（ source , target ）的。

写完是这样的
```html
<html>
<head><meta charset="utf-8"></head> 
<body>  
<script src="d3.min.js" charset="utf-8"></script>  
<script>            

var edges = [
  {source: "0", target: "1", distance: 40},
  {source: "0", target: "2", distance: 60},
  {source: "0", target: "3", distance: 75},
  {source: "0", target: "4", distance: 90},
  {source: "0", target: "5", distance: 200},
  {source: "0", target: "6", distance: 100},
  {source: "0", target: "7", distance: 160},
  {source: "0", target: "8", distance: 80}
];

var nodes = {};

// Compute the distinct nodes from the links.
edges.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

nodes = d3.values(nodes);

var width = 960,
    height = 500;

var force = d3.layout.force()
  //指定节点数组
  .nodes(nodes)
  //指定连线数组
  .links(edges)
  //指定范围
  .size([width,height])
  //指定连线长度
  .linkDistance(function(d) { return  d.distance*3; })
  //相互之间的作用力
  .charge(-400)
  //开始作用
  .start();

var svg = d3.select("body")
  .append("svg")
  .attr("width",width)
  .attr("height",height);

//添加连线         
var svg_edges = svg.selectAll("line")
  .data(edges)
  .enter()
  .append("line")
  .style("stroke","#ddd")
  .style("stroke-width",2);

var color = d3.scale.category20();

//添加节点              
var svg_nodes = svg.selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r",10)
  .style("fill",function(d,i){
    return color(i);
  })
  //使得节点能够拖动
  .call(force.drag);

//添加描述节点的文字
var svg_nodes_texts = svg.selectAll("text#nodes")
  .data(nodes)
  .enter().append("text")
  .style("fill", "black")
  .attr('id', 'nodes')
  .attr("dx", 20)
  .attr("dy", 8)
  .text(function(d){
    return d.name;
  });

force.on("tick", function(){  //对于每一个时间间隔
  //更新连线坐标
  svg_edges
    .attr("x1",function(d){ return d.source.x; })
    .attr("y1",function(d){ return d.source.y; })
    .attr("x2",function(d){ return d.target.x; })
    .attr("y2",function(d){ return d.target.y; });

  //更新节点坐标
  svg_nodes
    .attr("cx",function(d){ return d.x; })
    .attr("cy",function(d){ return d.y; });

  //更新文字坐标
  svg_nodes_texts
    .attr("x", function(d){ return d.x; })
    .attr("y", function(d){ return d.y; });
});

</script>  

</body>
</html>  
```

之后我们只需要修改和添加，对应 `edges` 数组中的 `{source: "0", target: "8", distance: 80}`

如下所示
```
  {source: "0", target: "1", distance: 40},
  {source: "0", target: "2", distance: 60},
  {source: "0", target: "3", distance: 75},
  {source: "0", target: "4", distance: 90},
  {source: "0", target: "5", distance: 200},
  {source: "0", target: "6", distance: 100},
  {source: "0", target: "7", distance: 160},
  {source: "0", target: "8", distance: 80},
  {source: "1", target: "2", distance: 65},
  {source: "1", target: "3", distance: 40},
  {source: "1", target: "4", distance: 100},
  {source: "1", target: "5", distance: 50},
  {source: "1", target: "6", distance: 75},
  {source: "1", target: "7", distance: 110},
  {source: "1", target: "8", distance: 100},
  {source: "2", target: "3", distance: 75},
  {source: "2", target: "4", distance: 100}
```

但是手写有点多。。。懒才是第一生产力

我们首先分析原始数据，一个 8*8 的矩阵

```
    0   1   2   3   4   5   6   7   8
0	0	40	60	75	90	200	100	160	80
1	40	0	65	40	100	50	75	110	100
2	60	65	0	75	100	100	75	75	75
3	75	40	75	0	100	50	90	90	150
4	90	100	100	100	0	100	75	75	100
5	200	50	100	50	100	0	70	90	75
6	100	75	75	90	75	70	0	70	100
7	160	110	75	90	75	90	70	0	100
8	80	100	75	150	100	75	100	100	0
```

对于这种结构严谨的小量数据，正则表达式可以完成全部工作

正则表达式的语法细节，在此也不再赘述。

首先每一行需要对应的起点，终点和距离，对应矩阵的 x,y,value 但是，不用循环，不可能取出 y 的，于是用正则先对行内容进行分离。

```
x v1 v2 v3 ...
```

定义正则
```
(\d+)\t(\d+)\t(\d+)\t(\d+)\t(\d+)\t(\d+)\t(\d+)\t(\d+)\t(\d+)\t(\d+)
```

括号是正则的定义变量，而对应的 `$d` 则是取出对应参数，`$0` 是取出整个字符串

取出字符
```
$1 0 $2
$1 1 $3
$1 2 $4
$1 3 $5
$1 4 $6
$1 5 $7
$1 6 $8
$1 7 $9
$1 8 $10
```

之后得到如下内容

```
0 0 0
0 1 40
0 2 60
0 3 75
...
8 6 100
8 7 100
8 8 0
```

之后对于每行
```
8 8 0
```

可以得到对应的 起点，终点和距离，对此可以直接用模板
```
(\d+) (\d+) (\d+)
```
```
{source: "$1", target: "$2", distance: $3},
```

来取出结果
```
{source: "8", target: "8", distance: 0},
```

对应的全局替换

```
{source: "0", target: "1", distance: 40},
{source: "0", target: "2", distance: 60},
{source: "0", target: "3", distance: 75},
...
{source: "6", target: "8", distance: 100},
{source: "7", target: "8", distance: 100}
```

然后带入上述代码中啊，得到一个如果加上箭头，就是有向图的拓扑结构，对此我们需要再加一层预处理。去掉矩阵重复的部分，为了复用上述脚本。对无用节点进行标记。比如赋值 `0` 之类的。

```
0	0	40	60	75	90	200	100	160	80
1	0	0	65	40	100	50	75	110	100
2	0	0	0	75	100	100	75	75	75
3	0	0	0	0	100	50	90	90	150
4	0	0	0	0	0	100	75	75	100
5	0	0	0	0	0	0	70	90	75
6	0	0	0	0	0	0	0	70	100
7	0	0	0	0	0	0	0	0	100
```

然后得到一堆同上的表
```
0 0 0
0 1 40
0 2 60
...
7 6 0
7 7 0
7 8 100
```
然后去掉标记的的值为 `0` 的元素，即 x,y 随机，值为 `0`

```
(\d+) (\d+) 0\n
```

得到一个可用的新表
```
0 1 40
0 2 60
0 3 75
...
6 7 70
6 8 100
7 8 100
```

然后按照之前的逻辑，继续构造

```
{source: "0", target: "1", distance: 40},
```

并复制回去，完成！

之后，再修改下初始参数，给 `nodes` 加个 `_weight` 参数，因为 `weight` 是 D3.js 的保留属性

```js
var nodes = [
  {name: '0', _weight: 0},
  {name: '1', _weight: 2},
  {name: '2', _weight: 1.5},
  {name: '3', _weight: 4.5},
  {name: '4', _weight: 3},
  {name: '5', _weight: 1.5},
  {name: '6', _weight: 4},
  {name: '7', _weight: 2.5},
  {name: '8', _weight: 3}
];
```

之后在节点的渲染上，加上半径

```js
//添加节点              
var svg_nodes = svg.selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r",function(node,index){
    return node._weight * 5;
  })
  .style("fill",function(node,index){
    return color(index);
  })
  //使得节点能够拖动
  .call(force.drag);
```

或许可能需要路径长度，只需要复制 `svg_nodes_texts` 的实现，写个 `svg_edges_texts` 即可。

```js
//添加描述连线的文字
var svg_edges_texts = svg.selectAll("text#edges")
  .data(edges)
  .enter().append("text")
  .style("fill", "#ddd")
  .attr('id', 'edges')
  .attr("dx", 20)
  .attr("dy", 8)
  .text(function(d){
    return d.distance;
  });
```

```js
svg_edges_texts
  .attr("rotate", 
    function(d){ return 0; })
  .attr("x", function(d){ return (d.source.x+d.target.x)/2; })
  .attr("y", function(d){ return (d.source.y+d.target.y)/2; });
```

不过在 D3js 的 4.x 版本之后，改了部分 API 暂时也只是发现，而并没有啥时间来重写这玩意。

4.x 的方法，参见 https://bl.ocks.org/shimizu/e6209de87cdddde38dadbb746feaf3a3