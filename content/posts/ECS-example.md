---

layout:     post
title:      "Entity Component System"
date:       2017-09-14
author:     "Gitai"
categories:
    - 杂项

---

ECS 架构[^1]是建立在渲染引擎、物理引擎之上的，主要解决的问题是如何建立一个模型来处理游戏对象 (Game Object) 的更新操作。

[^1]: [浅谈《守望先锋》中的 ECS 构架](https://blog.codingnow.com/2017/06/overwatch_ecs.html)

相比传统的面向对象模式，其复用性更高，其中也有一点面向数据的思想。

![](https://i.loli.net/2018/04/19/5ad76e79266d7.png)[^2]

[^2]: [理解 组件-实体-系统 （ECS \CES）游戏编程模型](http://blog.csdn.net/i_dovelemon/article/details/25798677)

相比传统的面向对象，ECS 将对象复用部分进行更深一层的抽象，这是一种更为直观的采用属性和行为进行耦合的方法。

举个栗子：Entity(Component)

* Rock(Appearance, Position, Collision)
* Ball(Appearance, Position, Collision, Movetion)
* Player(Appearance, Position, Collision, Movetion, Health, Player)

<!-- more -->

Rock 是个可碰撞的静态类实体， Ball 相比则多了移动特性（Movetion），而 Player 又增加了活性（Health）和可控制（Player）这些颗粒度极低的操作。

而 System 则是根据 Component 对 Entity 进行控制和处理。

* Movememt(Position, Movetion)
* Health(Health)
* Collision(Position)

以上几个部分就能完成一个简单的弹幕游戏。

## ECS 弹幕游戏

因为 JAVA 结课需要一个弹幕游戏，这也是本篇的起源。

为了防止引入太多模块被扣分，于是只是引入了 Slick2D 这个游戏基础封装。

不过，Slick2D 对 lwjgl 封装的非常简单，所以先写个 Buttom 再说。

```java
package me.gitai.demo.Sklick2d;

import org.newdawn.slick.*;
import org.newdawn.slick.Graphics;

/**
 * Created by Gitai.me(i@gitai.me) on 9/5/17.
 */
public class Demo extends BasicGame {

    public static void main(String[] args) throws SlickException {
        AppGameContainer app = new AppGameContainer(new Demo());
        app.start();
    }

    public Demo() {
        super("PlayState");
    }

    @Override
    public void init(GameContainer gameContainer) throws SlickException {

    }

    int mI = 0;

    @Override
    public void update(GameContainer gameContainer, int i) throws SlickException {
        mI = i;
    }

    @Override
    public void render(GameContainer gameContainer, Graphics graphics) throws SlickException {
        graphics.drawString("Hello World!", 100f, 100f);
    }
}

```

至此，简答的试用结束。开始编写 ECS 架构。

首先完成基类 Entity, Component, System

* Entity{init, render}
* Component{init}
* System{init, update}

主 loop 调用 System.update 来更新 Entity 的 Component 数据。之后 render 在枚举 Entities 调用 Entity.render 来渲染 Component 所附加的属性和行为。

对于复杂而且常用的 Entity，比如子弹，我们可以继续使用对象集成 Entity，在构造函数中附加 Components。

写一堆 Components 继承自 Component，然后 补充对应的 System，以下以移动系统（Movememt）为例。

对于一个移动系统，需要提供实体的位置，方向和速度。并伴随时间，对其进行计算推导。

于是产生如下结构：

* AirPlaneEntity(Appearance, Position, Movetion)
* Components
    * Appearance(angle, width, height)
    * Position(x, y)
    * Movetion(velocity, angle)
* MovememtSystem
    * update(Appearance, Position, Movetion)

然后将上述系统进行整合，就是简单的在 init 初始化实例，在 update 调用 System 更新数据，在 rander 进行渲染和绘制。

具体参见： [ECS@Gitai](https://github.com/GitaiQAQ/ECS)

## 增加所有权系统

对于简单的碰撞系统，上述内容就能完成。

但是敌我识别，则又要引入新的 Component，也就是所有权系统，但是这个组件会对 Collision 产生强影响，暂时只能强行写入 Collision 系统。等有优雅的耦合方法，再来升级。

## 总结

使用了 ECS 架构之后，我们可以避免使用大量的类了。实体就是你游戏中存在的物体，它隐式的使用一系列的组件进行定义，这些组件都是纯粹的数据，只有系统才能够操作他们。熟悉面向数据开发的小伙伴也不难发现，这也就是面向数据的架构。
