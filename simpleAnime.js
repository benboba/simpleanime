/*
 * simpleanime.js
 * @author WangFeng
 *
 * Copyright 2014, (https://github.com/benboba/simpleanime)
 * Licensed under the MIT license
 */

(function(w) {
	var anime_list = [], // 动画对象列表
	timer_listen = [], // 定时器执行方法列表
	ease = {// 缓动函数
		linear : function(f) {
			return f;
		},
		quadin : function(f) {
			return f * f;
		},
		quadout : function(f) {
			return -f * (f - 2);
		},
		quadinout : function(f) {
			var f = f * 2;
			if (f < 1) {
				return 1 / 2 * f * f;
			}
			return -1 / 2 * ((--f) * (f - 2) - 1);
		},
		cubicin : function(f) {
			return f * f * f;
		},
		cubicout : function(f) {
			var f = f - 1;
			return f * f * f + 1;
		},
		cubicinout : function(f) {
			var f = f * 2;
			if (f < 1) {
				return 1 / 2 * f * f * f;
			}
			return 1 / 2 * ((f -= 2) * f * f + 2);
		},
		quartin : function(f) {
			return f * f * f * f;
		},
		quartout : function(f) {
			var f = f - 1;
			return -(f * f * f * f - 1);
		},
		quartinout : function(f) {
			var f = f * 2;
			if (f < 1) {
				return 1 / 2 * f * f * f * f;
			}
			return -1 / 2 * ((f -= 2) * f * f * f - 2);
		},
		quintin : function(f) {
			return f * f * f * f * f;
		},
		quintout : function(f) {
			var f = f - 1;
			return f * f * f * f * f + 1;
		},
		quintinout : function(f) {
			var f = f * 2;
			if (f < 1) {
				return 1 / 2 * f * f * f * f * f;
			}
			return 1 / 2 * ((f -= 2) * f * f * f * f + 2);
		},
		sinein : function(f) {
			return -Math.cos(f * Math.PI / 2) + 1;
		},
		sineout : function(f) {
			return Math.sin(f * Math.PI / 2);
		},
		sineinout : function(f) {
			return -1 / 2 * (Math.cos(Math.PI * f) - 1);
		},
		expoin : function(f) {
			return (f == 0) ? 0 : Math.pow(2, 10 * (f - 1));
		},
		expoout : function(f) {
			return (f == 1) ? 1 : -Math.pow(2, -10 * f) + 1;
		},
		expoinout : function(f) {
			if (f === 0 || f === 1) {
				return f;
			}
			var f = f * 2;
			if (f < 1) {
				return 1 / 2 * Math.pow(2, 10 * (f - 1));
			}
			return 1 / 2 * (-Math.pow(2, -10 * --f) + 2);
		},
		circin : function(f) {
			return -(Math.sqrt(1 - f * f) - 1);
		},
		circout : function(f) {
			return Math.sqrt(1 - (f -= 1) * f);
		},
		circinout : function(f) {
			if ((f *= 2) < 1) {
				return -1 / 2 * (Math.sqrt(1 - f * f) - 1);
			}
			return 1 / 2 * (Math.sqrt(1 - (f -= 2) * f) + 1);
		},
		elasticin : function(f) {
			if (f === 0 || f === 1) {
				return f;
			}
			var j = 0.3;
			var i = j / (2 * Math.PI) * Math.asin(1);
			return -(Math.pow(2, 10 * (f -= 1)) * Math.sin((f - i) * (2 * Math.PI) / j));
		},
		elasticout : function(f) {
			if (f === 0 || f === 1) {
				return f;
			}
			var j = 0.3;
			var i = j / (2 * Math.PI) * Math.asin(1);
			return Math.pow(2, -10 * f) * Math.sin((f - i) * (2 * Math.PI) / j) + 1;
		},
		elasticinout : function(f) {
			if (f === 0 || f === 0.5 || f === 1) {
				return f;
			}
			var f = f * 2;
			var j = 0.3 * 1.5;
			var i = j / (2 * Math.PI) * Math.asin(1);
			if (f < 1) {
				return -0.5 * (Math.pow(2, 10 * (f -= 1)) * Math.sin((f - i) * (2 * Math.PI) / j));
			}
			return Math.pow(2, -10 * (f -= 1)) * Math.sin((f - i) * (2 * Math.PI) / j) * 0.5 + 1;
		},
		backin : function(f) {
			var g = 1.70158;
			return f * f * ((g + 1) * f - g);
		},
		backout : function(f) {
			var g = 1.70158;
			return (( f = f - 1) * f * ((g + 1) * f + g) + 1);
		},
		backinout : function(f) {
			var f = f * 2, g = 1.70158;
			if (f < 1) {
				return 1 / 2 * (f * f * (((g *= (1.525)) + 1) * f - g));
			}
			return 1 / 2 * ((f -= 2) * f * (((g *= (1.525)) + 1) * f + g) + 2);
		},
		bouncein : function(f) {
			return 1 - ease.bounceout(1 - f);
		},
		bounceout : function(f) {
			if (f < (1 / 2.75)) {
				return (7.5625 * f * f);
			} else if (f < (2 / 2.75)) {
				return (7.5625 * (f -= (1.5 / 2.75)) * f + 0.75);
			} else if (f < (2.5 / 2.75)) {
				return (7.5625 * (f -= (2.25 / 2.75)) * f + 0.9375);
			} else {
				return (7.5625 * (f -= (2.625 / 2.75)) * f + 0.984375);
			}
		},
		bounceinout : function(f) {
			if (f < 1 / 2) {
				return ease.bouncein(f * 2) * 0.5;
			}
			return ease.bounceout(f * 2 - 1) * 0.5 + 0.5;
		}
	}, interval = function() {// 间隔执行函数
		var now = Anime.getTime();
		for (var ti = timer_listen.length; ti--; ) {
			if (timer_listen[ti].destroy) {
				timer_listen.splice(ti, 1);
				if (!anime_list.length && !timer_listen.length) {
					Anime.clear(timer);
					timer = 0;
				}
			} else {
				timer_listen[ti].fn();
			}
		}
		for (var i = anime_list.length; i--; ) {
			var animeObj = anime_list[i];
			if (animeObj.bedestroy) {
				anime_list.splice(i, 1);
				if (!anime_list.length && !timer_listen.length) {
					Anime.clear(timer);
					timer = 0;
				}
				continue;
			}
			var propFunc = animeObj.getProp;
			if (propFunc('pause')) {
				continue;
			}
			
			var obj_begin = propFunc('begin'), obj_delay = propFunc('delay'), obj_duration = propFunc('duration'), obj_loop = propFunc('loop'), obj_loop_in = propFunc('loop_in');
			var obj_before = propFunc('before'), obj_after = propFunc('after'), obj_progress = propFunc('progress'), obj_beforeloop = propFunc('beforeloop'), obj_afterloop = propFunc('afterloop');
			
			if (!propFunc('running')) {// 判断延时启动
				if (now - obj_begin < obj_delay) {
					continue;
				} else {
					animeObj.setProp('running', true);
					var bi = obj_before.length, bli = obj_beforeloop.length;
					if (bi) {
						for (; bi--; ) {
							obj_before[bi].call(animeObj, {
								target : animeObj
							});
						}
					}
					if (bli) {
						for (; bli--; ) {
							obj_beforeloop[bli].call(animeObj, {
								loop : obj_loop_in,
								target : animeObj
							});
						}
					}
				}
			}
			var past = Math.min(now - obj_begin - obj_delay, obj_duration), easeFunc = propFunc('easing');
			var _duration = obj_duration, _per = past / _duration;
			var _ease = easeFunc(_per);
			var fi = obj_progress.length;
			if (fi) {
				for (; fi--; ) {
					obj_progress[fi].call(animeObj, {
						ease : _ease,
						total : _duration,
						progress : past,
						percent : _per,
						target : animeObj
					});
				}
			}
			if (past == obj_duration) {
				var ali = obj_afterloop.length;
				if (ali) {
					for (; ali--; ) {
						obj_afterloop[ali].call(animeObj, {
							loop : obj_loop_in,
							target : animeObj
						});
					}
				}
				var _loop = obj_loop_in + 1;
				animeObj.setProp('loop_in', _loop);
				if (obj_loop !== 0 && _loop >= obj_loop) {// 判断是否循环
					var ai = obj_after.length;
					if (ai) {
						for (; ai--; ) {
							obj_after[ai].call(animeObj, {
								target : animeObj
							});
						}
					}
					anime_list.splice(i, 1);
					if (!anime_list.length && !timer_listen.length) {
						Anime.clear(timer);
						timer = 0;
					}
				} else {
					animeObj.setProp({
						'begin' : obj_begin + obj_duration,
						'delay' : 0
					});
					var bli = obj_beforeloop.length;
					if (bli) {
						for (; bli--; ) {
							obj_beforeloop[bli].call(animeObj, {
								loop : obj_loop_in,
								target : animeObj
							});
						}
					}
				}
			}
		}
	}, timer = 0, // 记录interval或requestAnimationFrame
	toString = Object.prototype.toString, // 缓存toString方法
	aFrame = w.requestAnimationFrame || w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.oRequestAnimationFrame, // 获取requestAnimationFrame
	Anime = {
		cancel : false,
		set : function(fn) {//启动定时器
			if (aFrame) {
				timer = aFrame(function() {
					fn();
					if (Anime.cancel) {
						Anime.cancel = false;
					} else {
						timer = aFrame(arguments.callee);
					}
				});
			} else {
				timer = setInterval(fn, 17);
			}
		},
		clear : function(id) {// 终止定时器
			if (aFrame) {
				Anime.cancel = true;
			} else {
				clearInterval(id);
			}
			id = 0;
		},
		getTime : function() {// 获取时间戳
			return (w.performance && w.performance.now) ? w.performance.now() : +new Date();
		},
		easeFormate : function(str) {// 格式化缓动函数
			if (!str)
				return ease.linear;
			if ( typeof str === 'function' && str(0) === 0 && str(1) === 1) {// 验证自定义缓动方法是否符合规范
				return str;
			}
			if ( typeof str !== 'string')
				return ease.linear;
			str = str.toLowerCase().replace(/[^a-z]/g, '');
			if (ease.hasOwnProperty(str)) {
				return ease[str];
			}
			if (ease.hasOwnProperty(str + 'out')) {// 默认为out类型缓动
				return ease[str + 'out'];
			}
			var _type = '';
			str = str.replace(/(quad|cubic|quart|quint|sine|expo|circ|elastic|back|bounce)/, function(type) {
				_type = type;
				return '';
			});
			if (_type) {
				var inout = 'out';
				if (/(inout|in)/.test(str)) {
					inout = RegExp.$1;
				}
				return ease[_type + inout];
			}
			return ease.linear;
		},
		makeObj : function(obj) {// 将原始参数转换为动画参数
			var _now = Anime.getTime();
			var _obj = {
				begin : _now, //记录开始时间
				delay : parseInt(obj.delay) || 0, // 延时启动
				duration : parseInt(obj.duration) || 1000, // 持续时间
				loop : (obj.loop !== undefined && obj.loop == parseInt(obj.loop)) ? parseInt(obj.loop) : 1, //循环次数
				loop_in : 0, // 记录循环第几次
				beforeloop : [], // 开始单次循环时执行
				afterloop : [], // 结束单次循环时执行
				progress : [], // 动画过程
				running : false, // 记录是否已启动
				before : [], // 延时结束开始动画时执行
				after : [], // 结束动画时执行
				easing : Anime.easeFormate(obj.easing), // 缓动函数
				pause : Boolean(obj.pause), // 是否处于暂停
				pause_time : 0// 暂停的时间点
			};
			if (_obj.pause) {
				_obj.pause_time = _now;
			} else if (!_obj.delay) {
				_obj.running = true;
			}

			var checkEv = function(ev) {// 处理事件绑定
				if (obj[ev]) {
					if ( typeof obj[ev] === 'function') {
						_obj[ev].push(obj[ev]);
					} else if (toString.call(obj[ev]) === '[object Array]') {
						for (var ei = obj[ev].length; ei--; ) {
							if ( typeof obj[ev][ei] === 'function') {
								_obj[ev].unshift(obj[ev][ei]);
							}
						}
					}
				}
			};

			checkEv('beforeloop');
			checkEv('afterloop');
			checkEv('progress');
			checkEv('before');
			checkEv('after');
			return _obj;
		}
	}, proto = {
		pause : function() {// 暂停
			this.setProp({
				'pause' : true,
				'pause_time' : Anime.getTime()
			});
			return this;
		},
		resume : function() {// 恢复
			var _self = this;
			this.setProp({
				'pause' : false,
				'begin' : _self.getProp('begin') - _self.getProp('pause_time') + Anime.getTime(),
				'pause_time' : 0
			});
			return this;
		},
		destroy : function() {// 终止
			for (var i = anime_list.length; i--; ) {
				if (anime_list[i] === this) {
					anime_list[i].bedestroy = 1;
					break;
				}
			}
			return this;
		},
		getEasing : function(per) {// 获取其它缓动
			var args = [], i, il;
			if (toString.call(arguments[1]) === '[object Array]') {
				for ( i = 0, il = arguments[1].length; i < il; i++) {
					args.push(Anime.easeFormate(arguments[1][i]));
				}
			} else {
				for ( i = 1, il = arguments.length; i < il; i++) {
					args.push(Anime.easeFormate(arguments[i]));
				}
			}
			if (!args.length) {
				return [per];
			}
			var result = [];
			for (var s = 0, l = args.length; s < l; s++) {
				result[s] = args[s](per);
			}
			return result;
		}
	};

	var simpleAnime = function(obj) {
		if (!(this instanceof simpleAnime)) {
			return new simpleAnime(obj);
		}

		var _obj = Anime.makeObj(obj), _self = this;
		this.getProp = function(key) {// 获取属性
			return _obj[key];
		};
		this.setProp = function(key, val) {// 设置属性，支持key+val也支持对象的形式
			if (toString.call(key) === '[object Object]') {
				for (var i in key) {
					_self.setProp(i, key[i]);
				}
			} else if ((key === 'begin' || key === 'pause_time' || key === 'delay' || key === 'duration') && val === parseFloat(val)) {
				var _now = Anime.getTime();
				if (val >= _obj.begin && val <= _now) {
					_obj[key] = val;
				}
			} else if (key === 'loop_in' && val === parseInt(val) && val >= 0 && val <= _obj.loop) {
				_obj[key] = val;
			} else if (key === 'pause' || key === 'running') {
				_obj[key] = Boolean(val);
			}
			return _self;
		};
		this.getObj = function() {// 获取原始动画对象，深度拷贝
			var _o = {};
			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					if (toString.call(obj[i]) === '[object Array]') {
						var _arr = [];
						for (var ai = obj[i].length; ai--; ) {
							_arr.unshift(obj[i][ai]);
						}
						_o[i] = _arr;
					} else {
						_o[i] = obj[i];
					}
				}
			}
			return _o;
		};
		this.bind = function(event, fn) {// 绑定事件处理方法
			if (toString.call(event) === '[object Object]') {
				for (var i in event) {
					_self.bind(i, event[i]);
				}
			} else if ( typeof event === 'string' && /^(?:progress|beforeloop|afterloop|before|after)$/.test(event)) {
				if ( typeof fn === 'function') {
					_obj[event].push(fn);
				} else if (toString.call(fn) === '[object Array]') {
					for (var fi = 0, fl = fn.length; fi < fl; fi++) {
						if ( typeof fn[fi] === 'function') {
							_obj[event].push(fn[fi]);
						}
					}
				}
			}
			return _self;
		};
		this.unbind = function(event, fn) {// 解除绑定
			if (toString.call(event) === '[object Object]') {
				for (var i in event) {
					_self.unbind(i, event[i]);
				}
			} else if ( typeof event === 'string' && /^(?:progress|beforeloop|afterloop|before|after)$/.test(event)) {
				if ( typeof fn === 'function') {
					for (var i1 = _obj[event].length; i1--; ) {
						if (_obj[event][i1] === fn) {
							_obj[event].splice(i1, 1);
						}
					}
				} else if (!fn) {
					for (var i2 = _obj[event].length; i2--; ) {
						_obj[event].pop();
					}
				}
			}
			return _self;
		};
		this.restart = function() {// 重启动画
			var __obj = Anime.makeObj(obj);
			// 继承所有已绑定的事件
			__obj.progress = _obj.progress;
			__obj.before = _obj.before;
			__obj.beforeloop = _obj.beforeloop;
			__obj.after = _obj.after;
			__obj.afterloop = _obj.afterloop;
			_obj = __obj;
			return _self;
		};

		if (obj.insertBefore) {
			anime_list.unshift(this);
		} else {
			anime_list.push(this);
		}
		if (!timer) {
			Anime.set(interval);
		}
	};
	for (var i in proto) {
		simpleAnime.prototype[i] = proto[i];
	}
	simpleAnime.listen = function(fn) {
		if ( typeof fn === 'function') {
			timer_listen.push({
				fn : fn
			});
		}
		if (!timer) {
			Anime.set(interval);
		}
		return simpleAnime;
	};
	simpleAnime.unlisten = function(fn) {
		if ( typeof fn === 'function') {
			for (var ti = timer_listen.length; ti--; ) {
				if (timer_listen[ti].fn === fn) {
					timer_listen[ti].destroy = 1;
					break;
				}
			}
		}
		return simpleAnime;
	};
	w.SimpleAnime = simpleAnime;

	if ( typeof w.define === 'function' && define.amd) {
		define('simpleanime', [], function() {
			return simpleAnime;
		});
	}
})(window);
/*
 * 示例：
 * var animeObj=SimpleAnime({
 * 	delay:1000,//延时启动[毫秒]
 * 	duration:5000,//持续时间[毫秒]
 * 	loop:3,//循环次数
 * 	beforeloop:function(event){},//开始单次循环时执行[函数]event.loop,event.target
 * 	afterloop:function(event){},//结束单次循环时执行[函数]event.loop,event.target
 * 	progress:obj.function(event){//动画过程[函数]，event.ease，event.progress，event.total，event.percent，event.target
 * 		var new_ease=this.getEasing(event.progress/event.total,'easeOutBounce','easeInBack');//获取新的缓动运算结果，可一次获取多个，返回值为数组
 * 		var new_ease=this.getEasing(event.ease,['easeOutBounce','easeInBack']);//获取新的缓动运算结果，可一次获取多个，返回值为数组
 * 	},
 * 	before:function(event){},//延时结束开始动画时执行[函数]event.target
 * 	after:function(event){},//结束动画时执行[函数]event.target
 * 	easing:'easeOutElastic',//缓动函数
 * 	pause:false,//是否初始暂停
 * 	insertBefore:true//先执行
 * });
 *
 * 以下功能支持链式操作
 * animeObj.pause()//中途暂停
 * 	.resume()//取消暂停
 * 	.destroy()//移除（不可恢复）
 * 	.restart()//重新启动动画
 * 	.bind({//绑定事件，可为一个事件绑定多个回调函数，传入数组可绑定多个方法
 * 		before:[function1(){},function2(){}],
 * 		beforeloop:function(){},
 * 		progress:function(){},
 * 		afterloop:function(){},
 * 		after:function(){}
 * 	}).bind('progress',function(){}).unbind({//解除绑定，参数同bind
 * 	});
 */
