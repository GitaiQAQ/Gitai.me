---
layout:     post
title:      "用 SVG + Canvas + WASM 实现低性能下发图"
date:       2019-04-24
author:     "Gitai"
tags:
  - WASM
  - Canvas
  - 可视化
categories:
  - 轮子
---

V2 上面看到个推分享的[数据可视化之下发图实践](https://www.v2ex.com/t/556279)。

![下发图 Demo](https://diycode.b0.upaiyun.com/photo/2019/c8bf9ab0e153ea3d4e8e96af221ea252.gif)

觉得挺有意思的，但是没用 Demo，所以在此尝试实现一下，并觉得他们的技术选型有问题。

![两款技术栈的具体性能对比](https://diycode.b0.upaiyun.com/photo/2019/c5bb8be7371282d71c7f808433cafb50.png)

首先，SVG 非原生的动画，实现上频繁触发 DOM 操作，要不然 SVG 本身性能应该不会比 Canvas 差。

所以我准备复合上述 2 种方案，并且引入 WASM 优化计算逻辑，直接调用 Canvas。

<!--more-->

## 使用 SVG + CSS 实现静态地图图层

在上述文章种，使用了阿里云的 datav 中获取地图的 geojson 数据，然后通过 canvas 原生 Api，添加背景色、边框等，绘制地图。
我觉得可以把这块抽离出来，直接在 datav 上下载[对应的 SVG](https://datav.aliyun.com/tools/atlas/)，然后附加 CSS 作为底层，再通过全覆盖一个 Canvas 绘制动画，来解决。

于是有了以下的实现方案：

1. 数据准备和清理，获取 SVG 和 下发图的对应坐标
2. 附加对应的属性，生成合适的背景图
3. 实现动态下发过程动画

### 数据准备和清理

下载 SVG，清理属性（移除除了 `d` 以外的全部属性）方便之后通过 CSS 创建合适的样式。

调整视口，选个刚好能显示，又不会多余的尺寸（`viewBox="300 0 900 800"`）

用取色器从上面的 Demo 获取到背景色`#0d1531`，地图填充颜色`#051132`，省界颜色`#032649`，地图厚度颜色`#2083bc`，地图阴影颜色`#000`。

### 生成合适的背景图

设置颜色到对应区块上，并设置合适的边框样式。
	
datav 获取的地图，分为 2 类节点，首个节点是整个版图，之后的是各省的区块；从上面的 Demo 能看出来，他有省市的轮廓和国界的轮廓，并且采用不同的颜色，之后是下面的投影。

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="html,result" data-user="gitaiqaq" data-slug-hash="dLarbR" data-preview="true" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="dLarbR">
  <span>See the Pen <a href="https://codepen.io/gitaiqaq/pen/dLarbR/">
  dLarbR</a> by Gitai (<a href="https://codepen.io/gitaiqaq">@gitaiqaq</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

接下来给 `svg` 增加投影：

```css
.shadow {
    filter: drop-shadow(-5px 5px 9px #000000);
}
```

并给第一个`g` 容器增加一个位移 `transform`，并设置一个颜色，用来伪造侧视图产生的高度。

```css
.pseudo-3d {
    fill: #ff00b6;
    transform: translate(-3px,3px) scale(1.002);
}
```

然后复制这个 `g` 容器，修改他的颜色和描边。

![](https://i.loli.net/2019/05/04/5ccd8f9be378f.png)

因为需要给省界和国界划定不同的描边宽度，而从上图不难发现，国界和省界在 SVG 上面是重叠的，所以无法直接完成对不同颜色的添加。

但是从填充颜色和描边的范围我们也能发现，省界的映射刚好是下层元素的 `fill` 范围，而国界和下层元素的 `stroke` 完全重合。

于是我们能获得如下启发，将上层的元素的描边颜色设为 `transparent`，这样就可以直接显示下层对应位置的颜色了。

```css
.national-boundaries {
    fill: #fff;
    stroke: #000;
    stroke-width: 2px; 
}
```

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="html,result" data-user="gitaiqaq" data-slug-hash="jRdJVg" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="jRdJVg">
  <span>See the Pen <a href="https://codepen.io/gitaiqaq/pen/jRdJVg/">
  jRdJVg</a> by Gitai (<a href="https://codepen.io/gitaiqaq">@gitaiqaq</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

已经初见雏形了，接下来把刚开始就晾在一边的省界放上来。

> 注意：河北，天津，北京被注释是为了更好地观察上面通过透明创造的色差。

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="html,result" data-user="gitaiqaq" data-slug-hash="VNgRNG" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" data-pen-title="VNgRNG">
  <span>See the Pen <a href="https://codepen.io/gitaiqaq/pen/VNgRNG/">
  VNgRNG</a> by Gitai (<a href="https://codepen.io/gitaiqaq">@gitaiqaq</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

到这里，静态的中国地图已经差不多完成了，但是还不够立体，虽然加了伪造的投影效果，但是实际上的地图并没有任何变化。这时候就需要对整个 SVG 加上空间变换。

```diff
body > * {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 430px;
+   transform: rotateX(45deg);
}
```

到这里第一个图层才算完成了，虽然很丑，但是改改配色还是可以用的。

![](https://i.loli.net/2019/05/04/5ccd8fb58da49.png)

这才是初版，但是代码写得见不得人。

或许有人会注意到最开始有这么一段代码

```css
body > * {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 430px;
}
```

当我们完成背景图层的创建，还需要一个 Canvas 覆盖上来，来绘制动画；于是将其包起来，用绝对定位放在一起。所以接下来就是添加 Canvas 元素，准备 WASM 环境了。

### 动态下发过程动画

先准备 WASM 环境，参见 [Rust wasm-bindgen](https://rustwasm.github.io/docs/wasm-bindgen/) 官方文档，这里就是私货了，Rust 写起来那么舒服是吧？快吃了这口安利。

#### 配置 WASM 开发环境

`rust` 的相关工具链，一直做的比较完善，所以 `wasm` 相关的也有个部署工具叫`wasm-pack` ，对于 win 用户，只要下 [wasm-pack-init.exe](https://rustwasm.github.io/wasm-pack/installer/) 就行了，而不建议去尝试其他教程的从基本的 `rust` 环境开始配起。

然后从 [hello_world/wasm-bindgen](https://github.com/rustwasm/wasm-bindgen/tree/master/examples/hello_world) 克隆下来这个 `hello-world`，并安装必要的 `rust` 库和 `nodejs` 依赖。

```shell
$ yarn install
$ wasm-pack
$ yarn run serve
```

如果安装成功，会有如下提示，失败了，我也不知道咋回事

```shell
$ yarn run serve
yarn run v1.12.3
$ webpack-dev-server
🧐  Checking for wasm-pack...

✅  wasm-pack is installed. 

ℹ️  Compiling your crate in development mode...

i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from /
   [INFO]: Optional fields missing from Cargo.toml: 'description', 'repository', and 'license'. These are not necessary, but recommended
  :-) [WARN]: origin crate has no README

✅  Your crate has been correctly compiled

i ｢wdm｣: Hash: 8b1c7f4243a6f3888933
Version: webpack 4.30.0
Time: 4659ms
Built at: 2019-05-02 21:17:22
                           Asset          Size  Chunks             Chunk Names
                      0.index.js       622 KiB       0  [emitted]
                      1.index.js        24 KiB       1  [emitted]
4e22c32e8bd8114d290d.module.wasm  unknown size       1  [emitted]
                      index.html     181 bytes          [emitted]
                        index.js       362 KiB    main  [emitted]  main
Entrypoint main = index.js
...
i ｢wdm｣: Compiled successfully.

```

打开上面输出的 `http://localhost:8080/` 就能看到一个弹窗，内容为 `Hello World!`；在开发者工具还可以看到如下输出，这是加载 `wasm` 时，网络请求产生的日志。

![](https://i.loli.net/2019/05/04/5ccd8fd044255.png)

其来源是，`index.js` 的 `m.greet('World!')` 调用了 `src/lib.rs` 的 `pub fn greet`；触发了提示框。

自此环境安装到环境检验都完成了。

#### 缺少点基础件

前端常用的 `console.log` 在这里是没法直接使用的，而 `rust` 的 `println!` 也是不可用的，所以写各宏覆盖上去。

```rust
#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! println {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}
```

这样原生的 `println!` 宏就被覆盖了，可以把形如 `println!("from:{:?}\ncp:{:?}\nend:{:?}", from, cp, to);` 发给开发者工具。

![](https://i.loli.net/2019/05/04/5ccd8fde119b1.png)

这里用到的 `Position` 自然也是自己定义的。

```rust
#[derive(Debug)]
struct Position {
    x: f64,
    y: f64
}
```

正式开始造轮子。

#### 实现静态的航线

参照 [canvas/wasm-bindgen](https://github.com/rustwasm/wasm-bindgen/tree/master/examples/canvas) 运行一个能跑的 `Canvas` 脚本。

主要操作就是复制其 `index.js` 和 `src/lib.rs`，当运行出错的时候，看看是不是 `Cargo.toml` 少了东西。

之后我们就得到一个画笑脸的 `Canvas` 程序。

删了他的笑脸，留下 `Canvas` 插入和初始化的相关代码，直到获取一个 `CanvasRenderingContext2d` 为止。

**2.贝塞尔曲线** 贝塞尔曲线是计算机图形学中相当重要的参数曲线，它通过一个方程来描述一条曲线，根据方程的最高阶数，又分为线性贝塞尔曲线、二次贝塞尔曲线、三次贝塞尔曲线和更高阶的贝塞尔曲线。

本案例中主要应用了二次贝塞尔曲线，二次贝塞尔曲线的函数如下：![img](http://latex.codecogs.com/gif.latex?%7B%5Cmathbf%20%7BB%7D%7D%28t%29%3D%281-t%29%5E%7B%7B2%7D%7D%7B%5Cmathbf%20%7BP%7D%7D_%7B0%7D+2t%281-t%29%7B%5Cmathbf%20%7BP%7D%7D_%7B1%7D+t%5E%7B%7B2%7D%7D%7B%5Cmathbf%20%7BP%7D%7D_%7B2%7D%7B%5Cmbox%7B%20%2C%20%7D%7Dt%5Cin%20%5B0%2C1%5D%u3002)

```js
/**
 * 绘制一条曲线路径
 * @param  {Object} ctx canvas渲染上下文
 * @param  {Array<number>} start 起点
 * @param  {Array<number>} end 终点
 * @param  {number} curveness 曲度(0-1)
 * @param  {number} percent 绘制百分比(0-100)
 */
function drawCurvePath(ctx, start, end, curveness, percent) {
    var cp = [
        (start[0] + end[0]) / 2 - (start[1] - end[1]) * curveness,
        (start[1] + end[1]) / 2 - (end[0] - start[0]) * curveness
    ];

    var t = percent / 100;

    var p0 = start;
    var p1 = cp;
    var p2 = end;

    var v01 = [p1[0] - p0[0], p1[1] - p0[1]];     // 向量<p0, p1>
    var v12 = [p2[0] - p1[0], p2[1] - p1[1]];     // 向量<p1, p2>

    var q0 = [p0[0] + v01[0] * t, p0[1] + v01[1] * t];
    var q1 = [p1[0] + v12[0] * t, p1[1] + v12[1] * t];
    var v = [q1[0] - q0[0], q1[1] - q0[1]];       // 向量<q0, q1>
    var b = [q0[0] + v[0] * t, q0[1] + v[1] * t];
    ctx.moveTo(p0[0], p0[1]);
    ctx.quadraticCurveTo(
        q0[0], q0[1],
        b[0], b[1]
    );

}
```

(原文来自开头的 v2 地址，上述代码来自 [用canvas绘制一个曲线动画——深入理解贝塞尔曲线](https://github.com/hujiulong/blog/issues/1#)

上图为本文案例中飞线的贝塞尔曲线应用，其中 from 为起点，to 为终点，curveness 为曲线的曲率，取值-1 ~ 1，曲率的绝对值越大，曲线越弯曲，percent 为飞线位置占比。

我们这里先实现静态的不需要关注如果截断的，只要通过曲率算出控制点 $$P_1$$ 即可。

所以精简一下，

```rust
/// 通过起点/终点和曲率计算控制点
fn get_control_position (from: &Position, to: &Position, curveness: f64)  -> Position{
    return Position {
        x: (from.x + to.x) / 2.0 - (from.y - to.y) * curveness,
        y: (from.y + to.y) / 2.0 - (from.x - to.x) * curveness
    };
}
```

然后通过上面获取的 `context`，调用 `quadratic_curve_to` 绘制一条曲线。

```rust
let from = Position{
    x: 210.0,
    y: 350.0
};

let to = Position {
    x: 50.0,
    y: 50.0
};

let cp = get_control_position(from, to, curveness);

println!("from:{:?}\ncp:{:?}\nend:{:?}", from, cp, to);

context.move_to(from.x, from.y);
context.quadratic_curve_to(cp.x,  cp.y,  to.x,  to.y);
```

![](https://i.loli.net/2019/05/04/5ccd8ff0caa30.png)

一个完美的开始，虽然这个锯齿怪怪的，有点辣眼睛，等结束再说如何优化，这是 `Canvas` 的一个问题。

我们参照 v2 那篇分为光晕，头部和尾部；接下来实现一下这几个丑东西。

光晕简单，径向渐变糊一个就好了。

```rust
/// 绘制光晕 - 径向渐变
fn draw_hola (ctx: &web_sys::CanvasRenderingContext2d, pos: &Position, color: &HSL, radius: f64, percent: f32)  -> Result<(), JsValue> {
    let gradient = ctx.create_radial_gradient(pos.x, pos.y, 0.0, pos.x, pos.y, radius * (percent as f64))?;

    gradient.add_color_stop(0.0, "transparent");
    gradient.add_color_stop(0.95, &color.as_str());
    gradient.add_color_stop(1.0, "transparent");

    ctx.set_fill_style(&gradient);
    ctx.fill_rect(pos.x - radius, pos.y - radius, pos.x + radius, pos.y + radius);

    Ok(())
}
```

![](https://i.loli.net/2019/05/02/5ccb0253023cd.gif)

虽然很丑，但是功能没问题，至于为什么我这个会缩放，因为我加了 buf；下一个头部；头部什么鬼，为什么他要用三角形和半圆合成，我这么懒的人，要求比较低，就弄个圆吧，后面也不要计算偏转角度了。

```rust
/// 绘制曲线路径的头部
fn draw_head_of_curve_path (ctx: &web_sys::CanvasRenderingContext2d, from: &Position, color: &HSL, radius: f64) {
    ctx.set_fill_style(&JsValue::from(&color.as_str()));
    ctx.begin_path();
    ctx.arc(from.x, from.y, radius, 0.0, 2.0 * PI);
    ctx.close_path();
    ctx.fill();
}
```

好简单鸭！组合起来，小蝌蚪？？？

![](https://i.loli.net/2019/05/04/5ccd900baa00a.png)

咦，为什么我的尾巴是半透明的？？还记得的最开始绘制这个尾巴的时候，别人给的又臭又长，但是我的就很精简；别人通过计算获取一个等效于截断的新曲线，然后赋予消失的颜色效果，但是渐变本身是可以控制阶段的，直接给 `LinearGradient` 按照百分比调整透明的位置，不就变相的让上面这个尾巴变短了吗？而且没啥需要计算的，以我小学的体育老师教的数学水平就能理解。

```rust
// 渐变颜色
let gradient = ctx.create_linear_gradient(from.x,  from.y,  to.x,  to.y);
gradient.add_color_stop(percent, "transparent");
gradient.add_color_stop(1.0, &color.as_str());
```

![](https://i.loli.net/2019/05/02/5ccb04556a1df.gif)



是不是有点那么个意思了？？

但是好像 v2 哪个不是这个鬼样子的，因为他的动画分为三段：

1. 头部出发，尾巴慢慢出现
2. 头部移动中，尾部慢慢消失
3. 头部到达，尾巴慢慢消失，光晕出现

所以人家是，头部位移，尾巴渐变出现到消失，光晕出现，三个动画混合的。而我这个就是个 Hello World，谁管你那么多事。头部空间位置有了吧，尾巴渐变有了吧，光晕出现有了吧？Ok，这就是完成了，就和我这个人一样，长到 75% 就差不多了，后面 25% 就没必要了？

#### 让 Hello World 更完美

或许有人发现了，前面用渐变假装截断，实际上有个大问题，首先渐变的起点到终点呈现线性变化的，所以并不是完全拟合曲线的变化规律，但是考虑到曲率比较低，其实肉眼不一定看得出来；但是还有个很严肃的问题二，也就是之前没实现的头部位移，因为通过颜色渐变产生的截断，无法获得对应的坐标，这也就是得整个方法给它计算出来；于是最后我们又回到，走前面抄过来的哪个公式，通过它计算出 $$B$$ 点，但是 $$B$$ 出来，$$Q_0$$ 和 $$Q_1$$ 自然也出来了，那么渐变的方法干脆也改了。（所以我这小小的微创新就这样被扼杀在摇篮里

![](https://user-gold-cdn.xitu.io/2017/12/25/1608e25792da9c97?w=240&h=100&f=png&s=5429)

```rust
// 绘制尾巴，使用渐变截断
let (q0, q1,b) = draw_part_of_curve_path(ctx, from, to,  curveness, percent);

println!("from:{:?}\ncp:{:?}\nend:{:?}", from, q0, b);

ctx.move_to(from.x, from.y);
ctx.quadratic_curve_to(q0.x,  q0.y,  b.x,  b.y);

// 渐变颜色
let gradient = ctx.create_linear_gradient(from.x,  from.y,  to.x,  to.y);
gradient.add_color_stop(0.0, "transparent");
gradient.add_color_stop(1.0, &color.as_str());

ctx.set_line_width(2.0);
ctx.set_stroke_style(&gradient);
ctx.stroke();

// 绘制头部
draw_head_of_curve_path(ctx, &b, color, 3.0);

draw_hola(ctx, &b, color, 20.0, percent)?;

Ok(())
```

![](https://i.loli.net/2019/05/02/5ccb102f06127.gif)

调整了一下参数，把进度分为三个部分

```rust
let percent_head = percent / 0.6;
let percent_curve = (percent - 0.2) / 0.8;
let percent_hola = (percent - 0.6) / 0.4;
```

并用 `1.0.partial_cmp(&percent) == Some(Ordering::Less)` 这样的语句来约束，每个绘制函数；即小于 0 或者大于 1 时，能合适的处理。

![](https://i.loli.net/2019/05/03/5ccbf34d5ad08.gif)

好像是那么回事，大概就是这样了吧。那么问题来了，我写这篇的意义在哪？？

接下来就是整合背景，数据和上面这个箭头，放到一个页面上。

#### 做个简单的性能测试

在 Performance 看看分析的结果（虽然我一行都看不懂

![](https://i.loli.net/2019/05/04/5ccd902e75dd4.png)

对应的 Profile 文件下载（只使用了 25% 的 CPU 绘制的图）

这是符合预期的，SVG 应该只有开始需要解析，之后都不会产生资源消耗。而 Canvas 的 CPU 消耗怎么那么高？？下面那个隐藏了 Canvas 的姑且当作只有函数调用和 WASM 计算产生的消耗；叠加上 SVG 之后，仿佛高了一点点。不过实际上只有 10% ~ 15% 左右。

#### 迷惑的问题

本问题之后没复现成功，不明白咋回事。

混合 SVG 和 Canvas 的 CPU 占用（内存 12MB）

![](https://i.loli.net/2019/05/04/5ccd90481d929.png)

然后移除了 SVG （内存 9MB）

![](https://i.loli.net/2019/05/04/5ccd9053933e4.png)

为什么会这样嘞，难道是 Canvas 背景会触发什么奇怪的东西？？于是给 Canvas 强制一个背景试试。

![](https://i.loli.net/2019/05/04/5ccd905f039fe.png)

恢复正常了？？？果然是透明背景产生的叠加需要 CPU 的参与，于是产生这样的性能损耗，那这问题咋整？

#### 继续实现业务

通过 DataV 能拿到 GeoJSON 数据，其中包含所有城市的“中心点”，我们需要导入到 `Rust` 中，幸好有个 GeoJSON 库。然后抽取其中的坐标数据，但是没法直接画上来，因为上面是经纬度坐标，需要转化成平面坐标；而且经纬度直接转化起点在右下角，即经纬度为 `(0,0)` 的地区，而我们 `Canvas` 的坐标起点是左上角。

![](https://i.loli.net/2019/05/04/5ccd9078bb152.png)

所以需要把 2 个图层参照上述坐标进行对齐，并调整缩放比例。

原点的经纬度应该是 `[73.50235, 53.56362]`，而在计算其他地理坐标的时候，都需要将其作为偏移值。



之后要解决缩放比的问题，宽度是 `135.09567` 和 `73.50235` 对应墨卡托坐标差值 `6856537.01867`，高度是 `53.56362` 和 `3.840206`对应墨卡托坐标差值 `5033577.46489`；通过这 2 个值和地图显示尺寸 `947x925` 的比例，计算缩放比。

所以 x 的是 7240.27140303 ，y 是 7200.14089938。

成品效果如下

![](https://i.loli.net/2019/05/04/5ccd8d6ae2ed6.gif)

### 源码

* [Airline](https://github.com/GitaiQAQ/airline)

写的巨乱，不怕眼瞎就看吧。