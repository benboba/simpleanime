simpleanime（简单动画实现）
=

说明
-

引用simpleanime.js即可使用，不依赖任何类库，所有动画在同一条时间轴渲染，最大化节约性能。
支持动画的延时、暂停、恢复、循环、重启、移除，支持缓动及多重缓动

API
-

<b>SimpleAnime基本方法</b>
___
@param [Object] 基本配置参数

@return [SimpleAnime] simpleAnime实例对象

```javascript
var animeObj=SimpleAnime({
	delay:1000, // 延时启动 [毫秒] 默认0
	duration:5000, // 持续时间 [毫秒] 默认1000
	loop:3, // 循环次数 [int] 0表示无限循环，默认1
	
	/*
	 * 开始单次循环时执行的方法 [函数|数组]
	 * 参数event详解：
	 * event.target [SimpleAnime] 指向当前simpleAnime实例
	 * event.loop [自然数] 当前是第几次循环
	 */
	beforeloop:function(event){},
	
	/*
	 * 结束单次循环时执行的方法 [函数|数组]
	 * 参数event详解：
	 * event.target [SimpleAnime] 指向当前simpleAnime实例
	 * event.loop [自然数] 当前是第几次循环
	 */
	afterloop:function(event){},
	
	/*
	 * 动画过程中执行的方法 [函数|数组]
	 * 参数event详解：
	 * event.target [SimpleAnime] 指向当前simpleAnime实例
	 * event.percent [Number] 范围0-1，当前时间在动画过程中的比例
	 * event.ease [Number] event.percent经缓动函数运算后的结果
	 * event.progress [毫秒] 当前已经过的时间
	 * event.total [毫秒] 本次动画的总时间（即初始化时传入的duration的值）
	 */
	progress:function(event){},
	
	/*
	 * 动画开始时执行的方法 [函数|数组] 如果有延时，则在延时结束时触发。如果默认暂停，则在第一次恢复时触发
	 * 参数event详解：
	 * event.target [SimpleAnime] 指向当前simpleAnime实例
	 */
	before:function(event){},
	
	/*
	 * 动画结束时执行的方法 [函数|数组]
	 * 参数event详解：
	 * event.target [SimpleAnime] 指向当前simpleAnime实例
	 */
	after:function(event){},
	
	/*
	 * 缓动函数 [字符串|函数] 默认linear
	 * 传入字符串需包含quad|cubic|quart|quint|sine|expo|circ|elastic|back|bounce中的任何一个，否则会当做linear处理，如果不传inout|in，则按out处理
	 * 传入函数表示自定义缓动，自定义缓动遵守规则即可：输入0需返回0，输入1需返回1
	 */
	easing:'elasticin',
	
	pause:false, // 是否初始暂停 [Boolean] 默认false
	insertBefore:true // 是否先执行 [Boolean] 默认false表示插入动画序列最后，true表示插入动画序列最前面
});
```

<b>SimpleAnime实例对象的方法</b>
____

<b>pause方法</b>

暂停当前实例

@return [SimpleAnime] 当前实例

```javascript
var animeObj = SimpleAnime({
	...
});
animeObj.pause();
```

<b>resume方法</b>

恢复被暂停的实例

@return [SimpleAnime] 当前实例

```javascript
var animeObj = SimpleAnime({
	...
});
animeObj.resume();
```

<b>destroy方法</b>

销毁当前实例（不可恢复）

@return [SimpleAnime] 当前实例

```javascript
var animeObj = SimpleAnime({
	...
});
animeObj.destroy();
```

<b>restart方法</b>

重新启动当前动画（不可恢复）

@return [SimpleAnime] 当前实例

```javascript
var animeObj = SimpleAnime({
	...
});
animeObj.restart();
```

<b>bind方法</b>

为当前动画实例绑定新的事件（progress、before、after、beforeloop、afterloop）

@param [(String, Function|Array) | Object]

@return [SimpleAnime] 当前实例

```javascript
var animeObj = SimpleAnime({
	...
});
animeObj.bind('before', function).bind('progress', [function1, function2]);
animeObj.bind({
	'before' : function(event){...},
	'progress' : function(event){...},
	'after' : function(event){...}
});
```

<b>unbind方法</b>

解除指定的事件监听（progress、before、after、beforeloop、afterloop）

@param [(String, Function|Null) | Object] 传入null表示解除指定事件的全部监听

@return [SimpleAnime] 当前实例

```javascript
var animeObj = SimpleAnime({
	...
});
animeObj.unbind('before', function).unbind('after');
animeObj.unbind({
	'before' : function,
	'after' : null
});
```

<b>setProp方法</b>

修改当前实例的特定属性

@param [(Key, Val) | Object]

@return [SimpleAnime] 当前实例

<b>Key Val详解</b>

key = begin(动画开始时间)|pause_time(暂停时间，需与pause同时设置), val限制为时间戳，范围必须大于等于旧的begin时间戳，且小于等于当前时间戳

key = delay(延迟启动)|duration(动画时长), val限制为以毫秒为单位的整数

key = loop(循环次数), val限制为整数

key = loop_in(循环第几次), val限制为自然数，且不能大于总循环数

key = pause(是否暂停，需与pause_time同时设置)|running(是否运行中), val限制为布尔值

key = easing(缓动方式), val没有限制，但如果不是符合规则的字符串或缓动函数，会将缓动方式置为linear

```javascript
var animeObj = SimpleAnime({
	...
});
animeObj.setProp('loop_in', 0);
animeObj.setProp({
	'loop_in' : 0,
	'begin' : SimpleAnime.getTime()
});
```

<b>getProp方法</b>

获取当前实例的特定属性

@param [String]

@return [Val] 根据不同的属性返回不同的值

<b>Key Val详解</b>

begin [时间戳] 动画开始的时间戳

duration [毫秒] 动画时长

delay [毫秒] 延迟启动

running [Boolean] 动画是否已启动

pause [Boolean] 是否处于暂停

pause_time [时间戳] 暂停的时间戳

loop [int] 循环次数

loop_in [int] 循环第几次

easing [String|Function] 缓动方式

beforeloop [Array] 开始单次循环时触发的函数列表

afterloop [Array] 结束单次循环时触发的函数列表

progress [Array] 动画过程中每帧触发的函数列表

before [Array] 延时结束开始动画时触发的函数列表

after [Array] 动画结束时触发的函数列表

```javascript
var animeObj = SimpleAnime({
	...
});
var duration = animeObj.getProp('duration');
```

<b>getObj方法</b>

获取原始参数

@return [Object] 返回原始参数的深拷贝对象

```javascript
var animeObj = SimpleAnime({
	...
});
var originalObject = anime.getObj();

```

<b>其它方法</b>
____

<b>SimpleAnime.getEasing</b>

获取其它缓动结果

@param [percent, String|Function, ...] 传入当前进度和缓动名称或自定义缓动方法

@return [Array] 依据传入参数的顺序生成相应的数组

```javascript
var animeObj = SimpleAnime({
	progress : function(event) {
		var new_ease = SimpleAnime.getEasing(event.percent, 'elastic', easingFunction1, easingFunction2, 'circinout');
		console.log(new_ease); // [elasticout(percent), easingFunction1(percent), easingFunction2(percent), circinout(percent)]
	}
	...
});

```

<b>SimpleAnime.listen</b>

注册逐帧执行的方法（相当于监听onEnterFrame）

@param callback [Function]
@param target [Object]

@return [Class] 返回SimpleAnime构造函数

```javascript
SimpleAnime.listen(function, this);
```

<b>SimpleAnime.unlisten</b>

移除逐帧执行的方法

@param callback [Function]
@param target [Object]

@return [Class] 返回SimpleAnime构造函数

```javascript
SimpleAnime.unlisten(function, this);
```

<b>SimpleAnime.raf</b>

注册单次延时执行的方法

@param callback [Function]
@param target [Object]

@return [Class] 返回SimpleAnime构造函数

```javascript
// 下面这个方法会延时执行this.check
SimpleAnime.raf(this.check, this);
```

<b>SimpleAnime.setFPS</b>

设置全局FPS（每秒执行的帧数） 默认FPS为60，最大60

@param [FPS]

@return [Class] 返回SimpleAnime构造函数

```javascript
SimpleAnime.setFPS(20);
```

<b>SimpleAnime.getTime</b>

获取当前时间戳

@return [毫秒] 返回当前时间戳，SimpleAnime会优先获取performance.now，使用此方法可保证获取的时间戳格式与SimpleAnime一致

```javascript
SimpleAnime.setFPS(20);
```

一些简单用例
-

<b>设置执行5秒的动画</b>

```javascript
var animeObj = SimpleAnime({
	duration : 5000,
	progress : function(event) {...},
	after : function(event) {...}
});
```

<b>设置每帧100毫秒，共10帧的动画</b>

```javascript
var animeObj = SimpleAnime({
	duration : 100,
	loop : 10,
	beforeloop : function(event) {...},
	afterloop : function(event) {...},
	after : function(event) {...}
});
```

<b>判断如果是Android浏览器，则设置FPS为20</b>

```javascript
if (navigator.userAgent.toLowerCase().indexOf('android') !== -1) {
	SimpleAnime.setFPS(20);
}
```

<b>延迟1秒，用2秒时间，将一个div的top值按bounce缓动从100px变到200px</b>

```javascript
var div = document.getElementById('div');
var animeObj = SimpleAnime({
	duration : 2000,
	delay : 1000,
	progress : function(event) {
		div.style.top = 100 + 100 * event.ease + 'px';
	},
	easing : 'bounce'
});
```
