simpleanime
===========

简单动画实现

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
		var new_ease=simpleAnime.ease(percent,'easeOutBounce','easeInBack');//获取新的缓动运算结果，可一次获取多个，返回值为数组，可连续传入缓动函数名称
		var new_ease=simpleAnime.ease(percent,['easeOutBounce','easeInBack']);//获取新的缓动运算结果，可一次获取多个，返回值为数组，
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
