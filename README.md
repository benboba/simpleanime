simpleanime
===========

简单动画实现

引用simpleAnime.js即可使用，不依赖任何类库，所有动画在同一条时间轴渲染，最大化节约性能。

simpleAnime示例：
```javascript
var anime_id=simpleAnime.reg({
	delay:1000,//延时启动[毫秒]
	duration:5000,//持续时间[毫秒]
	loop:3,//循环次数
	beforeloop:function(){},//开始单次循环时执行[函数]
	afterloop:function(){},//结束单次循环时执行[函数]
	func:obj.function(result,percent,anime_id){//动画过程[函数，必须]，三个参数为：缓动函数运算结果、动画进度(0-1)、动画id
		console.log(result);
		console.log(percent);
		console.log(anime_id);
		
		//下面的代码是获取新的缓动运算结果，可一次获取多个，返回值为数组，可连续传入缓动函数名称或传入一个数组，以下为两种方式的示例，传入参数的格式和顺序没有任何要求，只要包含缓动类型关键字(linear|quad|cubic|quart|quint|sine|expo|circ|elastic|back|bounce)即可，大小写不限，如果不传入缓动方式in|out|inout，则默认会返回out缓动
		var new_ease=simpleAnime.ease(percent,'easeOutBounce','BackEaseIn');
		var new_ease=simpleAnime.ease(percent,['bounce','inout-back']);
	},
	before:function(){},//延时结束开始动画时执行[函数]
	after:function(){},//结束动画时执行[函数]
	ease:'easeOutElastic',//缓动函数
	pause:false//是否初始暂停
});
```

以下功能支持链式操作
```javascript
simpleAnime.pause(anime_id)//中途暂停
	.resume(anime_id)//取消暂停
	.remove(anime_id)//移除（不可恢复）
	.restart(anime_id);//重新启动动画（不可恢复）
```
