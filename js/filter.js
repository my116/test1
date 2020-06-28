//自定义过滤器
projectB.filter("filterTime",function(){
	/**
	 * 自定义时间过滤器
	 * 后台获得的时间戳单位为秒，需要格式化时间
	 * timeStr 	为时间戳
	 * format 	为可选参数，年月日的间隔标志
	 * type 	为时间格式，YY-MM-DD返回年月日，YY-MM-DD hh-mm-ss返回年月日时分秒
	 * @return {[type]}            [description]
	 */
	return function(timeStr,format,type){
		var out = '';
		var YY = '',
			MM = '',
			DD = '',
			hh = '',
			mm = '',
			ss = '';
		timeStr *= 1000;
		var time = new Date();
		time.setTime(timeStr);
		YY = time.getFullYear();
		MM = time.getMonth() + 1;
		DD = time.getDate();
		hh = time.getHours();
		mm = time.getMinutes();
		ss = time.getSeconds();
		if(!format){
			var format = '-';
		}
		if(type == 'YY-MM-DD'){
			out += YY + format + MM + format + DD;
		}else if(type == 'hh-mm-ss'){
			out += hh + ':' + mm + ':' + ss;
		}else{
			out += YY + format + MM + format + DD + ' ' + hh + ':' + mm + ':' + ss;
		}
		return out
	}
}).filter("filterSex",function(){
	/**
	 * 性别过滤器
	 * @param  {string} state 为性别状态(1 为男, 2 为女)
	 * @return {string}       返回汉字“男”或“女”
	 */
	return function(state){
		var out = '';
		out = state == '1' ? '男' : '女';
		if(state == '1'){
			out = '男';
		}else if(state == '2'){
			out = '女';
		}else{
			out ='未知';
		}
		return out
	}
}).filter("filterTechnicianState",function(){
	/**
	 * 技师状态过滤器
	 * @param  {string} state 技师状态码 1:空闲，2:忙碌，3:请假，4:锁定
	 * @return {string}       中文技师状态
	 */
	return function(state){
		var out = '';
		if(state == '1'){
			out = '空闲';
		}else if(state == '2'){
			out = '忙碌';
		}else if(state == '3'){
			out = '请假';
		}else if(state == '4'){
			out = '锁定';
		}else{
			out = '异常';
		}
		return out
	}
}).filter("filterTechnicianFor",function(){
	/**
	 * 技师服务详情
	 * @param  {string} info 格式为“无”或者是“35/123”,房间号/手牌号
	 * @return {string}      格式化后的字符串
	 */
	return function(info){
		var out = '';
		if (info == '无') {
			out = '无';
		} else{
			var array = info.split("/",2);
			out = '房间:' +　array[0] + ', 手牌:' + array[1];
		};
		return out;
	}
})