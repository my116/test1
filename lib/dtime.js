/**
 * Times 
 * 	event 							触发事件
 * 	run()							运行程序
 * 	hour 							数组，存入24个小时
 * 	minutes 						数组，存入60个分钟
 * 	addEvent 						添加时间的函数
 * 	mouseup()						鼠标抬起事件
 * 	checkValue() 					检测输入是否符合要求
 * 	writeValue() 					往事件控件中写入值
 * 	resetClass(elems,elem,cls) 		重置样式
 * 	getScrollTop() 					获取滚动条到顶部的高度
 * 	getScrollLeft() 				获取滚动条到左边的距离
 * 	setPosition() 					设置dtime_wrap的位置
 * 	view() 							生成dtime_wrap视图
 * 	trim(str)						格式化字符串，去掉前后空格
 * 	hasClass(elem,cls) 				检测是否有该class,返回true或者false
 * 	addClass(elem,cls) 				添加class
 * 	removeClass(elem,cls) 			删除class					
 */

;!function(win){
	var Times = {};
	!function(){
		Times.hour = [];
		Times.minutes = [];
		for(var i = 0;i < 24;i++){
			if(i < 10){
				var str = '0' + (i + '');
			}else{
				var str = i + '';
			}
			Times.hour.push(str);
		}
		for(var i = 0;i < 60;i++){
			if(i < 10){
				var str = '0' + (i + '');
			}else{
				var str = i + '';
			}
			Times.minutes.push(str);
		}
	}();
	//给Times添加addEvent方法
	if(document.addEventListener){
		Times.addEvent = function(el,type,fn){
			if(el.length){
				for(var i=0;i<el.length;i++){
					Times.addEvent(el[i],type,fn);
				}
			}else{
				el.addEventListener(type,fn,false);
			}
		};
	}else{
		Times.addEvent = function(el,type,fn){
			if(el.length){
				for(var i=0;i<el.length;i++){
					Times.addEvent(el[i],type,fn);
				}
			}else{
				el.attachEvent('on'+type,function(){
					return fn.call(el,window.event);
				});
			}
		};
	};

	win.dtime = function(){
		console.log(window.event);
		try{
			Times.event = window.event ? window.event : dtime.caller.arguments[0];//存储触发事件
			Times.addEvent(Times.event.target, "blur", function(e){
				Times.checkValue();
			})
		}catch(e){}
		Times.run();
	}
	Times.run = function(){
		Times.view();//生成界面
		Times.dtime = document.getElementById('dtime_wrap');//保存dtime对象
		Times.setPosition();//设置位置
	}
	//鼠标点击事件
	Times.addEvent(win,"click",function(e){
		if(!Times.event){
			return
		}
		//判断是否存在dtime_wrap的父节点，返回值>=0为存在
		function parentIndexOf(node,parent){ 
			if(node==parent){return 0;} 
			for (var i=0,n=node; n=n.parentNode; i++){ 
				if(n==parent){return i;} 
				if(n==document.documentElement){return -1;} //找不到目标父节点，防止死循环 
			} 
		}
		var _isParentDtime = parentIndexOf(e.target, Times.dtime);
		console.log(_isParentDtime)
		//判断是隐藏还是显示界面
		if(e.target == Times.event.target || _isParentDtime >= 0){
			Times.dtime.style.display = 'block';
		}else{
			if(Times.dtime.style.display == 'block'){
				//检测输入是否符合要求
				Times.checkValue();
			}
			Times.dtime.style.display = 'none';
			return
		}
		//判断点击的是否是小时
		var _isParentDtimeHour = parentIndexOf(e.target, document.getElementById('dtime_hour_list'));
		if(_isParentDtimeHour >= 0){
			var _all = document.querySelectorAll('#dtime_hour_list li');
			Times.resetClass(_all, e.target, 'selected');
			Times.writeValue();
		}
		//判断是否点击的是否是分钟
		var _isParentDtimeMinutes = parentIndexOf(e.target, document.getElementById('dtime_minutes_list'));
		if(_isParentDtimeMinutes >= 0){
			var _all = document.querySelectorAll('#dtime_minutes_list li');
			Times.resetClass(_all, e.target, 'selected');
			Times.writeValue();
		}
	});
	//检测输入是否符合要求
	Times.checkValue = function(){
		function inArray(_arr,val){
			for(var _i = 0,_len = _arr.length; _i < _len;_i++){
				if(_arr[_i] == val){
					return true;
				}
			}
			return false;
		}
		var value = Times.event.target.value;
		if(/:/.test(value)){
			var arr = value.split(':');
			if(!inArray(Times.hour,arr[0])){
				Times.event.target.value = '';
				return
			}
			if(!inArray(Times.minutes,arr[1].substr(0,2))){
				Times.event.target.value = '';
				return
			}else{
				Times.event.target.value = arr[0] + ':' + arr[1].substr(0,2);
			}
		}else{
			Times.event.target.value = '';
			console.log(value);
		}
	}

	//赋值
	Times.writeValue = function(){
		var _selectHour = false,
			_selectMinutes = false,
			hourElems = document.querySelectorAll('#dtime_hour_list li'),
			minutesElems = document.querySelectorAll('#dtime_minutes_list li'),
			hourValue,
			minutesValue;
		for(var i = 0,len = hourElems.length;i < len;i++){
			if(Times.hasClass(hourElems[i],'selected')){
				_selectHour = true;
				hourValue = hourElems[i].innerHTML;
				break
			}
		}
		for(var i = 0,len = minutesElems.length;i < len;i++){
			if(Times.hasClass(minutesElems[i],'selected')){
				_selectMinutes = true;
				minutesValue = minutesElems[i].innerHTML;
				break
			}
		}
		if(_selectHour && _selectMinutes){
			var elemv = /textarea|input/.test(Times.event.target.tagName.toLocaleLowerCase()) ? 'value' : 'innerHTML';
			Times.event.target[elemv] = hourValue + ':' + minutesValue;
			Times.dtime.style.display = 'none';
		}
	}
	//设置是否选中
	Times.resetClass = function(elems, elem, cls){
		elems = elems || [];
		for(var i = 0,len = elems.length;i < len;i++){
			if(elems[i] == elem){
				Times.addClass(elems[i], cls);
			}else{
				Times.removeClass(elems[i], cls);
			}
		}
	}
	//获取滚动条到顶部的高度
	Times.getScrollTop =function(){
		var scrollTop=0;
		if(document.documentElement&&document.documentElement.scrollTop){
			scrollTop=document.documentElement.scrollTop;
		}else if(document.body){
			scrollTop=document.body.scrollTop;
		}
		return scrollTop;
	}
	Times.getScrollLeft =function(){
		var scrollLeft=0;
		if(document.documentElement&&document.documentElement.scrollLeft){
			scrollLeft = document.documentElement.scrollLeft;
		}else if(document.body){
			scrollLeft = document.body.scrollLeft;
		}
		return scrollLeft;
	}
	//设置位置
	Times.setPosition = function(){
		console.log(Times)
		var rect = Times.event.target.getBoundingClientRect();//获取触发元素在窗口中的位置
		Times.dtime.style.position = 'absolute';
		Times.dtime.style.top = rect.bottom + Times.getScrollTop() + 'px';
		Times.dtime.style.left = rect.left + Times.getScrollLeft() + 'px';
		if(Times.dtime.style.display == 'none'){
			Times.resetClass(document.querySelectorAll('#dtime_wrap li'), '', 'selected');//去掉选中标记
		}
		Times.dtime.style.display = 'block';
		var hourBox = document.getElementById("dtime_hour_list_wrap");
		hourBox.scrollTop = 0;
		var minutesBox = document.getElementById("dtime_minutes_list_wrap");
		minutesBox.scrollTop = 0;
	}
	//生成视图
	Times.view = function(){
		if(document.getElementById('dtime_wrap')){
			return
		}
		var dtime_wrap = document.createElement('div');
		dtime_wrap.className = 'dtime_wrap';
		dtime_wrap.id = 'dtime_wrap';
		var html = '<div class="dtime_hour">'
					+ '<div class="dtime_hour_list_wrap" id="dtime_hour_list_wrap">'
						+ '<ul class="dtime_hour_list" id="dtime_hour_list">' + function(){
							var str = '';
							for(var i = 0; i < 24; i++){
								str += '<li>';
								if(i < 10){
									str += '0' + (i + '') + '</li>';
								}else{
									str += (i + '') + '</li>';
								}
							}
							return str;
						}()
						+ '</ul>'
					+ '</div>'
				+ '</div>'
				+ '<div class="dtime_spaceMark">'
					+ ':'
				+ '</div>'
				+ '<div class="dtime_minutes">'
					+ '<div class="dtime_minutes_list_wrap" id="dtime_minutes_list_wrap">'
						+ '<ul class="dtime_minutes_list" id="dtime_minutes_list">' + function(){
							var str = '';
							for(var i = 0; i < 60; i++){
								str += '<li>';
								if(i < 10){
									str += '0' + (i + '') + '</li>';
								}else{
									str += (i + '') + '</li>';
								}
							}
							return str;
						}()
						+ '</ul>'
					+ '</div>'
				+ '</div>';
		dtime_wrap.innerHTML = html;
		console.log(dtime_wrap);
		document.body.appendChild(dtime_wrap);
	};
	Times.trim = function(str){
		str = str || '';
		return str.replace(/^\s|\s$/g, '').replace(/\s+/g, ' ');
	}
	//检测是否含有同名class
	Times.hasClass = function(elem, cls){
		elem = elem || {};
		return new RegExp('\\b' + cls + '\\b').test(elem.className)
	}
	//添加class
	Times.addClass = function(elem, cls){
		elem = elem || {};
		Times.hasClass(elem, cls) || (elem.className += ' ' + cls);
		elem.className = Times.trim(elem.className);
		return this;
	}
	//删除类
	Times.removeClass = function(elem, cls){
		elem = elem || {};
		if(Times.hasClass(elem, cls)){
			var reg = new RegExp('\\b' + cls + '\\b');
			elem.className = elem.className.replace(reg, '');
		}
		return this;
	}
}(window);