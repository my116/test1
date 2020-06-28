
/*头部controller*/
projectB.controller('controller',['$scope','$http','$rootScope','$location',function($scope,$http,$rootScope,$location){
	$rootScope.myHost = $location.host();
	console.log($rootScope.myHost);
	$scope.nav = [true,false,false,false,false,false];//导航状态标记

	//maskLayer遮罩层
	$rootScope.maskLayer = false;

	//$scope.cashierNavInfo = [true,false];//cashier导航信息显示标记
	/**
	 * 头部下方的各个板块标记信息
	 * @type {Object}
	 */
	$scope.headerInfo = {
		roomPageIndex:true,
		roomPageOccupy:false,
		memberPageIndex:false,
		memberPageInfo:false,
		goodsPageIndex:false
	}

	/*route跳转成功事件*/
	$rootScope.$on('$routeChangeSuccess',function(){
		var now_nav_path = $location.path();//获取当前路径
		var now_nav_index;
		switch(now_nav_path){
			case '/cashier' :
				now_nav_index = 0;
				break;
			case '/technician' :
				now_nav_index = 1;
				break;
			case '/finance':
				now_nav_index = 2;
				break;
			case '/member':
				now_nav_index = 3;
				break;
			case '/goods':
				now_nav_index = 4;
				break;
			case '/system':
				now_nav_index = 5;
				break;
			default:
				break;
		}
		for(var i = 0,len = $scope.nav.length; i < len; i++){
			if(now_nav_index == i){
				$scope.nav[i] = true;
			}else{
				$scope.nav[i] = false;
			}
		}
	})

	/**
	 * 页面渲染完之后，重新设置footer位置
	 * @return {[type]} [description]
	 */
	$rootScope.renderFinish = function(){
		console.log('渲染完之后的操作');
		/*重新定位footer的位置*/
		var window_height = window.innerHeight;
		var body_height;
		var footer = document.getElementById('footer');
		setTimeout(function(){
			body_height = document.getElementsByTagName('body')[0].clientHeight;
			if(body_height + footer.offsetHeight < window_height){
				console.log('小于',body_height,footer.offsetHeight,window_height);
				footer.style.top = window_height - footer.offsetHeight + 'px';
			}else{
				footer.style.top = body_height + 'px';
			}
		},100)

		if($scope.nav[0]){
			try{
				/**
				 * 时间选择控件
				 * @type {String}
				 */
				laydate({
				  elem: '#appointmentTime', //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
				  event: 'focus', //响应事件。如果没有传入event，则按照默认的click
				  format: 'YYYY-MM-DD hh:mm:ss',//日期格式
				  istime: true //是否开启时间选择
				});
			}catch(error){}
		}
	}

	/**
	 * 改变headerInfo显示信息标记（头部导航下面的东西）
	 * str 需要显示的标记名称
	 * @return {[type]} [description]
	 */
	$scope.changeHeaderInfo = function(str){
		angular.forEach($scope.headerInfo,function(data,index,array){
			if(index == str){
				$scope.headerInfo[index] = true;
			}else{
				$scope.headerInfo[index] = false;
			}
		})
	}

	/**
	 * 从房间详情界面回到cashier主界面
	 * @return {[type]} [description]
	 */
	$scope.backCashierIndex = function(){
		$scope.$broadcast('callCashierBack');//向子controller(CashierController)传递callCashierBack事件
		//重置$scope.headerInfo标记信息,显示roomPageIndex
		$scope.changeHeaderInfo('roomPageIndex');
	}

	/**
	 * 从会员详情界面回到member主界面
	 * @return {[type]} [description]
	 */
	$scope.backMemberIndex = function(){
		$scope.$broadcast('callMemberBack');//向子controller(MemberController)传递callMemberBack事件
		//重置$scope.headerInfo标记信息,显示memberPageIndex
		$scope.changeHeaderInfo('memberPageIndex');
	}

	//禁止滚轮事件
	$rootScope.disabledMouseWheel = function(){
		if(document.addEventListener){
			document.addEventListener('DOMMouseScroll', stopScrollFunc, false);
		}//W3C
		window.onmousewheel = document.onmousewheel = stopScrollFunc;//IE/Opera/Chrome
	}
	function stopScrollFunc(evt){
		evt = evt || window.event;
		if(evt.preventDefault){
			//Firefox
			evt.preventDefault();
			evt.stopPropagation();
		}else{
			evt.cancelBubble=true;
			evt.returnValue = false;
		}
		return false;
	}
	//$rootScope.disabledMouseWheel();
	//恢复滚轮事件
	$rootScope.ableMouseWheel = function(){
		if(document.removeEventListener){
			document.removeEventListener('DOMMouseScroll', stopScrollFunc, false);
		}//W3C
		window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome
	}
	function scrollFunc(evt){

	}
	//$rootScope.ableMouseWheel();
	
	/**
	 * 弹出层
	 * cashierHandoverView 				收银交接弹出框
	 * @type {Object}
	 */
	$scope.alertView = {
		cashierHandoverView:false
	}
	/*************** 收银交班 start ***************/
	//收银交班
	$scope.showCashierHandover = function(){
		$rootScope.maskLayer = true;
		$scope.alertView.cashierHandoverView = true;
	}
	$scope.closeCashierHandover = function(){
		$rootScope.maskLayer = false;
		$scope.alertView.cashierHandoverView = false;
	}
	/*************** 收银交班 end ***************/
}])