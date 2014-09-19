simpleanime
===========

简单动画实现

引用simpleanime.js即可使用，不依赖任何类库，所有动画在同一条时间轴渲染，最大化节约性能。
支持动画的延时、暂停、恢复、循环、重启、移除，支持缓动及多重缓动

simpleanime：
```javascript
var animeObj=SimpleAnime({
	delay:1000,//延时启动[毫秒]
	duration:5000,//持续时间[毫秒]
	loop:3,//循环次数
	beforeloop:function(event){},//开始单次循环时执行[函数]
	afterloop:function(event){},//结束单次循环时执行[函数]
	progress:obj.function(event){//动画过程[函数]，event.easing，event.progress，event.total，event.percent，event.target
		var new_ease=this.getEasing(event.progress/event.total,'easeOutBounce','easeInBack');//获取新的缓动运算结果，可一次获取多个，返回值为数组
		var new_ease=this.getEasing(event.easing,['easeOutBounce','easeInBack']);//获取新的缓动运算结果，可一次获取多个，返回值为数组，
	},
	before:function(event){},//延时结束开始动画时执行[函数]event.target
	after:function(event){},//结束动画时执行[函数]event.target
	easing:'easeOutElastic',//缓动函数
	pause:false,//是否初始暂停
	insertBefore:true//先执行
});
```

以下功能支持链式操作
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
	.getEasing(number,easingFunction1,easingFunction2)//获取其它缓动方法的运算结果
	.getObj()//获取原始参数
```
