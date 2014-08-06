//     simpleAnime.js
//     (c) 2013-2014 WangFeng

(function(w){
	var anime_list=[],//动画对象列表
	ease={//缓动函数
		linear : function(f) {
			return f;
		},
		quadin : function(f) {
			return f*f;
		},
		quadout : function(f) {
			return -f*(f-2);
		},
		quadinout : function(f) {
			var f=f*2;
			if (f<1) {
				return 1/2*f*f;
			}
			return -1/2*((--f)*(f-2)-1);
		},
		cubicin : function(f) {
			return f*f*f;
		},
		cubicout : function(f) {
			var f=f-1;
			return f*f*f+1;
		},
		cubicinout : function(f) {
			var f=f*2;
			if (f<1) {
				return 1/2*f*f*f;
			}
			return 1/2*((f-=2)*f*f+2);
		},
		quartin : function(f) {
			return f*f*f*f;
		},
		quartout : function(f) {
			var f=f-1;
			return -(f*f*f*f-1);
		},
		quartinout : function(f) {
			var f=f*2;
			if (f<1) {
				return 1 / 2 * f * f * f * f;
			}
			return -1 / 2 * ((f -= 2) * f * f * f - 2);
		},
		quintin : function(f) {
			return f * f * f * f * f;
		},
		quintout : function(f) {
			var f=f-1;
			return f * f * f * f * f + 1;
		},
		quintinout : function(f) {
			var f=f*2;
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
			if (f === 0 || f===1) {
				return f;
			}
			var f=f*2;
			if (f < 1) {
				return 1 / 2 * Math.pow(2, 10 * (f - 1));
			}
			return 1 / 2 * (-Math.pow(2, -10 * --f) + 2);
		},
		circin : function(f) {
			return -(Math.sqrt(1 - f * f) - 1);
		},
		circout : function(f) {
			return Math.sqrt(1 - ( f -= 1) * f);
		},
		circinout : function(f) {
			if ((f*=2) < 1) {
				return -1 / 2 * (Math.sqrt(1 - f * f) - 1);
			}
			return 1 / 2 * (Math.sqrt(1 - (f -= 2) * f) + 1);
		},
		elasticin : function(f) {
			if (f === 0 || f===1) {
				return f;
			}
			var j = 0.3;
			var i = j / (2 * Math.PI) * Math.asin(1);
			return -(Math.pow(2, 10 * (f -= 1)) * Math.sin((f - i) * (2 * Math.PI) / j));
		},
		elasticout : function(f) {
			if (f === 0 || f===1) {
				return f;
			}
			var j = 0.3;
			var i = j / (2 * Math.PI) * Math.asin(1);
			return Math.pow(2, -10 * f) * Math.sin((f - i) * (2 * Math.PI) / j) + 1;
		},
		elasticinout : function(f) {
			if (f === 0 || f===0.5 || f===1) {
				return f;
			}
			var f=f*2;
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
			var f=f*2,g = 1.70158;
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
	},
	interval=function(){//间隔执行函数
		var now=Anime.getTime();
		for(var i=anime_list.length;i--;){
			if(anime_list[i].pause){
				continue;
			}
			if(!anime_list[i].running){//判断延时启动
				if(now-anime_list[i].begin<anime_list[i].delay){
					continue;
				}else{
					anime_list[i].running=true;
					if(anime_list[i].before){
						anime_list[i].before();
					}
					if(anime_list[i].beforeloop){
						anime_list[i].beforeloop();
					}
				}
			}
			
			var past=Math.min(now-anime_list[i].begin-anime_list[i].delay,anime_list[i].duration),easeFunc=ease[anime_list[i].ease]||ease.linear;
			var _per=past/anime_list[i].duration;
			var _ease=easeFunc(_per);
			anime_list[i].func(_ease,_per,anime_list[i].id);
			if(anime_list[i] && past==anime_list[i].duration){
				if(anime_list[i].afterloop){
					anime_list[i].afterloop();
				}
				if(anime_list[i].loop!==0 && ++anime_list[i].loop_in>=anime_list[i].loop){//判断是否循环
					if(anime_list[i].after){
						anime_list[i].after();
					}
					anime_list.splice(i,1);
					if(!anime_list.length){
						Anime.clear(timer);
						timer=0;
					}
				}else{
					anime_list[i].begin=now;
					anime_list[i].delay=0;
				}
			}
		}
	},
	timer=0,
	aFrame = w.requestAnimationFrame || w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.oRequestAnimationFrame,
	Anime = {
		cancel : false,
		set : function(fn) {
			if (aFrame) {
				timer = aFrame(function() {
					fn();
					if(Anime.cancel){
						Anime.cancel=false;
					}else{
						timer = aFrame(arguments.callee);
					}
				});
			} else {
				timer = setInterval(fn, 17);
			}
		},
		clear : function(id) {
			if(aFrame){
				Anime.cancel=true;
			}else{
				clearInterval(id);
			}
			id=0;
		},
		getTime:function(){
			return w.performance.now?w.performance.now():+new Date();
		},
		easeFormate:function(str){
			str=str.toLowerCase().replace(/[^a-z]/g,'');
			if(ease.hasOwnProperty(str)){
				return str;
			}
			if(ease.hasOwnProperty(str+'out')){
				return str+'out';
			}
			var _type='';
			str=str.replace(/(quad|cubic|quart|quint|sine|expo|circ|elastic|back|bounce)/,function(type){
				_type=type;
				return '';
			});
			if(_type){
				var inout='out';
				if(/(inout|in)/.test(str)){
					inout=RegExp.$1;
				}
				return _type+inout;
			}
			return 'linear';
		},
		reg:function(obj,id){
			if(obj.func && typeof obj.func == 'function'){
				var _now=Anime.getTime(),_id=id || ('a'+_now+'_'+Math.random());
				var _obj={
					id:_id,//唯一id
					begin:_now,//记录开始时间
					delay:parseInt(obj.delay)||0,//延时启动
					duration:parseInt(obj.duration) || 1000,//持续时间
					loop:(obj.loop !== undefined && obj.loop == parseInt(obj.loop))?parseInt(obj.loop):1,//循环次数
					loop_in:0,//记录循环第几次
					beforeloop:obj.beforeloop||null,//开始单次循环时执行
					afterloop:obj.afterloop||null,//结束单次循环时执行
					func:obj.func,//动画过程
					running:false,//记录是否已启动
					before:obj.before||null,//延时结束开始动画时执行
					after:obj.after||null,//结束动画时执行
					ease:Anime.easeFormate(obj.ease),//缓动函数,
					pause:Boolean(obj.pause),//是否处于暂停
					pause_time:0,//暂停的时间点
					obj:obj//记录原始参数
				};
				if(_obj.pause){
					_obj.pause_time=_now;
				}
				if(!_obj.delay){
					_obj.running=true;
				}
				anime_list.push(_obj);
				if(!timer){
					Anime.set(interval);
				}
				return _id;
			}
			return false;
		}
	};
	
	w.simpleAnime={
		reg:function(obj){
			return Anime.reg(obj);
		},
		pause:function(id){//暂停指定动画
			for(var i=anime_list.length;i--;){
				if(anime_list[i].id===id){
					anime_list[i].pause=true;
					anime_list[i].pause_time=Anime.getTime();
					break;
				}
			}
			return this;
		},
		resume:function(id){//恢复指定动画
			for(var i=anime_list.length;i--;){
				if(anime_list[i].id===id){
					anime_list[i].pause=false;
					anime_list[i].begin=anime_list[i].begin-anime_list[i].pause_time+Anime.getTime();
					anime_list[i].pause_time=0;
					break;
				}
			}
			return this;
		},
		restart:function(id){//重启动画
			for(var i=anime_list.length;i--;){
				if(anime_list[i].id===id){
					var _o=anime_list[i];
					anime_list.splice(i,1);
					Anime.reg(_o.obj,_o.id);//重启保持id与原id一致
				}
			}
			return this;
		},
		remove:function(id){
			for(var i=anime_list.length;i--;){
				if(anime_list[i].id===id){
					anime_list.splice(i,1);
					if(!anime_list.length){
						Anime.clear(timer);
						timer=0;
					}
					break;
				}
			}
			return this;
		},
		ease:function(per){//获取其它缓动
			var args=[];
			if(Object.prototype.toString.call(arguments[1])==='[object Array]'){
				args=arguments[1];
			}else{
				for(var i=1,il=arguments.length;i<il;i++){
					args.push(Anime.easeFormate(arguments[i]));
				}
			}
			if(!args.length){
				return [per];
			}
			var result=[];
			for(var s=0,l=args.length;s<l;s++){
				result[s]=ease[args[s]](per);
			}
			return result;
		}
	};
})(window);
