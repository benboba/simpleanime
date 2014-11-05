simpleanime（简单动画实现）
=

简单说明
-

引用simpleanime.js即可使用，不依赖任何类库，所有动画在同一条时间轴渲染，最大化节约性能。
支持动画的延时、暂停、恢复、循环、重启、移除，支持缓动及多重缓动

API
-

SimpleAnime基本方法
___
@param [Object] 基本配置参数

@return [SimpleAnime] simpleAnime实例对象

配置参数详解：
```javascript
var animeObj=SimpleAnime({
	delay:1000, // 延时启动 [毫秒] 默认0
	duration:5000, // 持续时间 [毫秒] 默认1000
	loop:3, // 循环次数 [自然数] 0表示无限循环，默认1
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
	 * 传入字符串需包含quad|cubic|quart|quint|sine|expo|circ|elastic|back|bounce中的任何一个，否则会当做linear处理，如果不传in|out|inout，则按out处理
	 * 传入函数表示自定义缓动，自定义缓动遵守规则即可：输入0需返回0，输入1需返回1
	 */
	easing:'elasticin',
	pause:false, // 是否初始暂停 [Boolean] 默认false
	insertBefore:true // 是否先执行 [Boolean] 默认false表示插入动画序列最后，true表示插入动画序列最前面
});
```

SimpleAnime实例对象的方法
____

pause方法

暂停

```javascript
animeObj.pause()//中途暂停
	.resume()//取消暂停
	.destroy()//移除（不可恢复）
	.restart()//重新启动动画（不可恢复）
	.bind({//绑定事件，可为一个事件绑定多个回调函数，所有回调函数的作用域为simpleAnime实例本身
		before:function(){},
		beforeloop:function(){},
		progress:function(){},
		afterloop:function(){},
		after:function(){}
	})
	.bind('progress',function(){})//也支持“事件名+回调函数”的方式
	.unbind({//解除绑定，参数同bind
		before:function(){}
	})
	.unbind('before',function(){})//解除绑定同理
	.unbind('before')//只传事件名会解除该事件下所有回调函数的绑定
	.unbind({//只传事件名会解除该事件下所有回调函数的绑定
		'before':null,
		'after':null
	})
	.setProp('loop_in',0)//设置属性
```

其它方法：
```javascript
animeObj.getProp('begin')//获取属性
animeObj.getEasing(number,easingFunction1,easingFunction2)//获取其它缓动方法的运算结果
animeObj.getObj()//获取原始参数
```

其它：
```javascript
SimpleAnime.listen(function)//注册定时器执行的方法
	.unlisten(function)//移除定时器执行的方法
	.setFPS(fps);
```
