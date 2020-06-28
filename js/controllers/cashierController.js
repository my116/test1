/*前台收银controller*/
projectB.controller('CashierController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	var _rooms = [];//原始房间数据
	$scope.roomsEmpty = [];//空房间数组
	$scope.rooms = [];
	/**
	 * 刷新cashier主界面房间信息数据
	 * @return {[type]} [description]
	 */
	$scope.refreshRoomsData = function(){
		$http.get("http://" + $rootScope.myHost + "/Home/Index/GetRooms").success(function(data){
			$scope.roomsEmpty = [];
			$scope.rooms = [];
			_rooms = data.data;//存储返回的房间数据
			console.log('获得的数据',_rooms);
			var row = [];
			for(var i = 0,len = data.data.length; i < len; i++){
				if(data.data[i]){
					if(i%9 == 0){
						row = [];
					}
					row.push(data.data[i]);
					if(row.length == 9){
						$scope.rooms.push(row);
					}
				}
				if(data.data[i]["state"] == 4){//判断是否是空房间，是空房间则放进空房间数组
					$scope.roomsEmpty.push(data.data[i]);
				}
			}
			if(row.length != 9){
				$scope.rooms.push(row);
			}
			console.log($scope.rooms)
		});
	}
	$scope.refreshRoomsData();//调用一次

	//重置headerInfo
	$scope.$parent.changeHeaderInfo('roomPageIndex');
	
	$scope.roomAppointment = false;//房间预定界面显示标记
	$scope.roomUsing = false;//开房间界面显示标记

	$scope.roomPageShow = [true,false];//cashier下room-page-index，room-page-occupy界面显示标记

	/**
	 * cashier模块下弹窗显示标记
	 * changeRoomNumberView 		房间详情里房间调换弹窗
	 * continueAddUserhandView 		房间详情里增加宾客界面
	 * chargebackView 				退单界面
	 * checkOutServiceView 			房间结账界面
	 * addConsumptionView 			房间详情里增加服务界面
	 * roomAppointmentInfoView 		预约房间详情界面
	 * cancelRoomAppointment 		取消房间预约确定界面
	 * addConsumptionTechnicianView 增加服务选择技师界面
	 * @type {Object}
	 */
	$scope.cashierAlertView = {
		changeRoomNumberView:false,
		continueAddUserhandView:false,
		chargebackView:false,
		checkOutServiceView:false,
		addConsumptionView:false,
		roomAppointmentInfoView:false,
		cancelRoomAppointment:false,
		addConsumptionTechnicianView:false
	}

	/*鼠标滑过td*/
	$scope.roomMouseover = function(outerIndex,index){
		$scope.rooms[outerIndex][index]["roomHover"] = true;
	}
	/*鼠标离开td*/
	$scope.roomMouseleave = function(outerIndex,index){
		$scope.rooms[outerIndex][index]["roomHover"] = false;
	}

	/*********************** 预约房间 start ********************************/
	/**
	 * roomAppointmentInfo 房间预定信息
	 * roomNumber 房间号
	 * roomID 房间ID
	 * userName 客户名称
	 * userPhone 电话号码
	 * userRemark 客户备注
	 * time 预定时间
	 */
	$scope.roomAppointmentInfo = {
		roomNumber:'',
		roomID:'',
		userName:'',
		userPhone:'',
		userRemark:'',
		time:''
	};
	/**
	 * 预约信息错误标记
	 * userName 客户名称
	 * userPhone 联系电话
	 * time 预约的时间
	 */
	$scope.roomAppointmentErr = {
		userName:false,
		userPhone:false,
		time:false
	}
	/**
	 * 预约界面显示函数
	 * @param  {[string]} roomNumber [预约房间号]
	 * @return {[type]}            [description]
	 */
	$scope.showRoomAppointment = function(roomID,roomNumber){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.roomAppointment = true;
		$scope.roomAppointmentInfo.roomID = roomID;
		$scope.roomAppointmentInfo.roomNumber = roomNumber;
		$rootScope.disabledMouseWheel();//禁止滚轮事件
	}

	/**
	 * 确定预约房间函数
	 * @return {[type]} [description]
	 */
	$scope.makeRoomAppointment = function(){
		var timeDOM = document.getElementById('appointmentTime');
		$scope.roomAppointmentInfo.time = timeDOM.value;//获取客户预约时间
		console.log($scope.roomAppointmentInfo);
		var regexp = /^1\d{10}$/;
		var now = new Date();
		//格式化时间，方便判断预约时间是否已过
		if($scope.roomAppointmentInfo.time){
			var yyyy = $scope.roomAppointmentInfo.time.split(' ')[0].split('-')[0];
			var month = $scope.roomAppointmentInfo.time.split(' ')[0].split('-')[1]-1;
			var dd = $scope.roomAppointmentInfo.time.split(' ')[0].split('-')[2];
			var hh = $scope.roomAppointmentInfo.time.split(' ')[1].split(':')[0];
			var mm = $scope.roomAppointmentInfo.time.split(' ')[1].split(':')[1];
			var ss = $scope.roomAppointmentInfo.time.split(' ')[1].split(':')[2];
			var appointmentTime = new Date(yyyy,month,dd,hh,mm,ss);
			$scope.roomAppointmentErr.time = appointmentTime.getTime() - now < 0 ? true : false;
		}else{
			$scope.roomAppointmentErr.time = true;
		}
		$scope.roomAppointmentErr.userName = $scope.roomAppointmentInfo.userName.trim() == '' ? true : false;
		$scope.roomAppointmentErr.userPhone = regexp.test($scope.roomAppointmentInfo.userPhone) ? false : true;
		console.log(now,now.getTime(),appointmentTime);
		if($scope.roomAppointmentErr.userName || $scope.roomAppointmentErr.userPhone || $scope.roomAppointmentErr.time){//信息有误
			
		}else{//信息无误，向后台发送预约请求
			//$scope.closeRoomAppointment();
			var data = $scope.roomAppointmentInfo;
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/MakeAnAppointment",
				data:data,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(data){
					return $.param(data);
				}
			}).success(function(data){
				console.log('预约房间请求返回数据',data);
				if(data.state == 'SUCCESS'){//预约房间成功
					alert('房间预约成功');
					$scope.closeRoomAppointment();//关闭预约房间界面
				}else{
					alert('房间预约失败');
				}
			}).error(function(){
				alert('发生错误，请稍后再试');
			})
		}
	}
	/**
	 * 预约界面取消函数
	 * @return {[type]} [description]
	 */
	$scope.closeRoomAppointment = function(){
		$rootScope.maskLayer = false;//遮罩层标记设置为false
		$scope.roomAppointment = false;//预约界面标记设置为false
		//重置预约界面信息roomAppointmentInfo
		$scope.roomAppointmentInfo = {
			roomNumber:'',
			roomID:'',
			userName:'',
			userPhone:'',
			userRemark:'',
			time:''
		};
		console.log('关闭界面重置roomAppointmentInfo后的roomAppointmentInfo信息',$scope.roomAppointmentInfo);
		//重置预约错误信息标记
		$scope.roomAppointmentErr.userName = false;
		$scope.roomAppointmentErr.userPhone = false;
		$scope.roomAppointmentErr.time = false;
		//恢复滚轮事件
		$rootScope.ableMouseWheel();
		//刷新主界面房间数据
		$scope.refreshRoomsData();
	}
	/************************* 预约房间 end ************************************/

	/************************ 开房 start ***********************************/
	/**
	 * roomUsingInfo 开房间信息
	 * roomNumber 房间号码
	 * roomID 房间ID
	 * roomCount 房间总共床位
	 * userHands 客人手牌
	 * userHandsID 客人手牌ID
	 * newUserHand 最新添加的手牌
	 * newUserHandID 最新添加手牌的ID
	 * @type {Object}
	 */
	$scope.roomUsingInfo = {
		roomNumber:'',
		roomID:'',
		roomCount:'',
		userHands:[],
		userHandsID:[],
		newUserHand:''
	}
	/**
	 * 开房手牌信息错误标记
	 * isErr 是否发生错误
	 * errInfo 错误信息
	 * errCode 错误码
	 * @type {Boolean}
	 */
	$scope.roomUsingErr = {
		isErr:false,
		errInfo:'* 手牌号有误',
		errCode:''
	}
	/**
	 * 开房间界面显示函数
	 * @param  {[string]} roomNumber 开房的房间号
	 * @return {[type]}            [description]
	 */
	$scope.showRoomUsing = function(roomID,roomNumber,roomCount){
		$rootScope.maskLayer = true;
		$scope.roomUsing = true;
		$scope.roomUsingInfo.roomID = roomID;//获取房间ID
		$scope.roomUsingInfo.roomNumber = roomNumber;
		$scope.roomUsingInfo.roomCount = roomCount;
	}
	/**
	 * 开房错误标记重置函数
	 * @return {[type]} [description]
	 */
	$scope.roomUsingErrReset = function(){
		$scope.roomUsingErr.isErr = false;
		$scope.roomUsingErr.errInfo = '';
		$scope.roomUsingErr.errCode = '';
	}

	/**
	 * 开房界面添加手牌
	 * @param {[type]} e [description]
	 */
	$scope.addUserHand = function(){
		//判断输入的手牌号是否全是数字
		var regexp_userHand = /^[a-zA-Z0-9]{1,}$/;//简单手牌正则，要求全是数字或者字母
		if(!regexp_userHand.test($scope.roomUsingInfo.newUserHand)){
			$scope.roomUsingErrReset();
			$scope.roomUsingErr.isErr = true;
			$scope.roomUsingErr.errInfo = '* 手牌号错误~';
			return
		}
		//判断房间是否满员
		if($scope.roomUsingInfo.userHands.length >= 0 + $scope.roomUsingInfo.roomCount){
			$scope.roomUsingErrReset();
			$scope.roomUsingErr.isErr = true;
			$scope.roomUsingErr.errInfo = '* 房间人数已满，无法继续添加手牌';
			return
		}
		//判断手牌是否已经被添加
		var _canPush = true;
		for(var i = 0, len= $scope.roomUsingInfo.userHands.length; i < len; i++){
			if($scope.roomUsingInfo.userHands[i] == $scope.roomUsingInfo.newUserHand){//判断手牌是否已经被添加
				_canPush = false;
			}
		}
		if(_canPush){
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/CheckUserHand",
				data:{userHand:$scope.roomUsingInfo.newUserHand},
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(obj){
					var str = [];
					for(var p in obj){
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
					return str.join("&");
				}
			}).success(function(data,status){
				console.log("获得手牌号是否能被添加",data);
				// $scope.roomUsingInfo = {
				// 	roomNumber:'',
				// 	roomCount:'',
				// 	userHands:[],
				// 	userHandsID:[],
				// 	newUserHand:'',
				// 	newUserHandID:''
				// }
				if(data.state == "SUCCESS"){//后台验证手牌号可用时
					$scope.roomUsingInfo.userHands.push($scope.roomUsingInfo.newUserHand);//添加进userHands
					$scope.roomUsingInfo.userHandsID.push(data.data.handid);//添加进userHandsID
					$scope.roomUsingErrReset();//成功添加后重置错误
					$scope.roomUsingInfo.newUserHand = '';
				}else{//后台验证手牌号错误时
					$scope.roomUsingErr.errInfo = '* ' + data.errormsg;//设置错误信息
					$scope.roomUsingErr.isErr = true;//显示错误
				}
			}).error(function(){
				alert('发生错误，请稍后再试')
			})
		}else{
			$scope.roomUsingErr.errInfo = '* 手牌号错误';
			$scope.roomUsingErr.isErr = true;
		}
	}

	/**
	 * 手牌添加框keyup事件
	 * @param {[type]} e [description]
	 */
	$scope.isAddUserHand = function(e){
		var keycode = window.event ? e.keyCode : e.which;
		if(keycode == 13){//判断是否是回车事件
			$scope.addUserHand();
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		}
	}

	/**
	 * 开房界面删除手牌
	 * @param  {string} userHand 需要删除的手牌
	 * @return {[type]}          [description]
	 */
	$scope.deleteUserHand = function(userHand){
		for(var i = 0,len = $scope.roomUsingInfo.userHands.length; i < len; i++){
			if($scope.roomUsingInfo.userHands[i] == userHand){
				$scope.roomUsingInfo.userHands.splice(i,1);
				$scope.roomUsingInfo.userHandsID.splice(i,1);
			}
		}
		console.log('删除后某个手牌后，手牌信息' + $scope.roomUsingInfo);
	}

	/**
	 * 确定开房
	 * @return {[type]} [description]
	 */
	$scope.makeRoomUsing = function(){
		if($scope.roomUsingInfo.userHands.length < 1){
			$scope.roomUsingErr.nobody = true;
			return
		}else{
			var data = {roomID:$scope.roomUsingInfo.roomID,userHands:$scope.roomUsingInfo.userHandsID};
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/RoomAddUser",
				data:data,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(data){
					return $.param(data);
				}
			}).success(function(data){
				console.log("发送开放请求获得的数据",data);
				if(data.state == 'SUCCESS'){
					//操作成功后，需要重新加载房间详情数据，要求后台返回最新的房间详情数据
					$http({
						method:"POST",
						url: "http://" + $rootScope.myHost + "/Home/Index/GetRoomInfo",
						data:{roomID:$scope.roomUsingInfo.roomID},
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						transformRequest: function(obj){
							var str = [];
							for(var p in obj){
								str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							}
							return str.join("&");
						}
					}).success(function(data,status){
						$scope.roomOccupyInfo = data;
						//初始化手牌显示标记
						for(var i = 0,len = $scope.roomOccupyInfo.roomHandsInfo.length;i < len;i++){
							$scope.selectHandsInfo.userHandSelected[i] = true;
						}
					}).error(function(){
						console.log('发生错误，请刷新！');
					})
					//判断是否全部添加成功
					var allSuccess = true;//是否全部成功标记
					var addErr = [];//没添加成功的存储数组
					for(var i = 0,len = data.data.length; i < len; i++){
						if(data.data[i]["state"] == 'ERROR'){
							allSuccess = false;
							addErr.push(data.data[i]['handname']);
						}
					}
					if(allSuccess){//全部添加成功
						$scope.showRoomOccupyInfo($scope.roomUsingInfo.roomID);//显示该房间详情界面
						$scope.closeRoomUsing();//关闭开房间界面
						$scope.isUnableClickAddConsumption();//检测增加服务按钮是否能被点击
						console.log($scope.roomUsingInfo)
					}else{//存在添加不成功的手牌
						$scope.continueAddUserhandInfo.roomNumber = $scope.roomOccupyInfo.roomNumber;//获取房间号
						$scope.continueAddUserhandInfo.roomID = $scope.roomOccupyInfo.roomID;//获取ID
						$scope.continueAddUserhandInfo.roomCount = $scope.roomOccupyInfo.roomCount;//获取房间总共床位
						$scope.continueAddUserhandInfo.userHands = [];//重置增加宾客界面信息中的原本手牌数组
						$scope.continueAddUserhandInfo.newUserHands = [];//重置增加宾客界面信息中的新手牌数组
						//往continueAddUserhandInfo.userHands中添加该房间已有的手牌号
						for(var i = 0,len = $scope.roomOccupyInfo.roomHandsInfo.length; i < len; i++){
							$scope.continueAddUserhandInfo.userHands.push($scope.roomOccupyInfo.roomHandsInfo[i].userHand);
						}
						$scope.continueAddUserhandErr.errInfo = '* ';//修改增加宾客信息的错误信息
						for(var i = 0,len = addErr.length; i < len;i++){
							$scope.continueAddUserhandErr.errInfo += addErr[i] +',';
						}
						$scope.continueAddUserhandErr.errInfo += '添加失败';
						$scope.continueAddUserhandErr.isErr = true;//增加宾客信息错误标记重置
					}
				}
			}).error(function(){
				console.log("开启房间失败，请稍后再试");
			})
		}
	}

	/**
	 * 开房界面取消函数
	 * @return {[type]} [description]
	 */
	$scope.closeRoomUsing = function(){
		$rootScope.maskLayer = false;//遮罩层标记设置为false
		$scope.roomUsing = false;//开房界面标记设置为false
		//重置开房界面信息roomUsingInfo
		$scope.roomUsingInfo = {
			roomNumber:'',
			roomID:'',
			roomCount:'',
			userHands:[],
			userHandsID:[],
			newUserHand:''
		}
		//重置开房添加手牌错误信息
		$scope.roomUsingErrReset();
	}
	/************************* 开房 end ************************/

	/*************** 房间预约详情 start ***************/
	/**
	 * 房间预约详情界面信息
	 * roomID 			房间id
	 * roomName 		房间名称
	 * roomBed 			房间床位数量
	 * userName 		客人姓名
	 * userTel 			客人电话
	 * time 			预约时间
	 * remarks 			预约备注
	 * @type {Object}
	 */
	$scope.resetRoomAppointmentInformation = function(){
		$scope.roomAppointmentInformation = {
			roomID:'',
			roomName:'',
			roomBed:'',
			userName:'',
			userTel:'',
			time:'',
			remarks:''
		}
	}
	$scope.resetRoomAppointmentInformation();
	/**
	 * 显示房间预约详情界面
	 * @return {[type]} [description]
	 */
	$scope.showRoomAppointmentInfoView = function(roomID,roomName,roomBed){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.cashierAlertView.roomAppointmentInfoView = true;//显示房间预约详情界面
		//获取房间预约数据
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetMakeAnAppointment",
			data:{id:roomID},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log("获取房间预约详情数据",data);
			if(data.state == "SUCCESS"){
				$scope.roomAppointmentInformation.roomID = roomID;
				$scope.roomAppointmentInformation.roomName = roomName;
				$scope.roomAppointmentInformation.roomBed = roomBed;
				$scope.roomAppointmentInformation.userName = data.data.guestname;
				$scope.roomAppointmentInformation.userTel = data.data.phone;
				$scope.roomAppointmentInformation.time = data.data.times;
				$scope.roomAppointmentInformation.remarks = data.data.content;
				console.log($scope.roomAppointmentInformation)
			}else{
				alert("发生错误，请稍后再试");
			}
		}).error(function(data){
			alert("发生错误,请稍后再试")
		});
	}
	/**
	 * 关闭房间预约的详情信息界面
	 * @return {[type]} [description]
	 */
	$scope.closeRoomAppointmentInfoView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.cashierAlertView.roomAppointmentInfoView = false;
		$scope.resetRoomAppointmentInformation();//重置房间预约详情信息
	}
	/**
	 * 预约→开房
	 * @return {[type]} [description]
	 */
	$scope.appointmentToUsing = function(){
		var roomID = $scope.roomAppointmentInformation.roomID;
		var roomName = $scope.roomAppointmentInformation.roomName;
		var roomBed = $scope.roomAppointmentInformation.roomBed;
		$scope.closeRoomAppointmentInfoView();//关闭房间预约的详情信息界面
		$scope.showRoomUsing(roomID,roomName,roomBed);//显示开房间界面
	}
	/**
	 * 取消房间预约
	 * @return {[type]} [description]
	 */
	$scope.cancelRoomAppointment = function(){
		$scope.cashierAlertView.cancelRoomAppointment = true;
	}
	/**
	 * 确定取消房间预约
	 * @return {[type]} [description]
	 */
	$scope.makeCancelRoomAppointment = function(){
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/CalcelMakeAnAppointment",
			data:{id:$scope.roomAppointmentInformation.roomID},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log("取消房间预约返回数据",data);
			if(data.state == "SUCCESS"){
				alert("取消房间预约成功");
				$scope.closeCancelRoomAppointment();//关闭取消房间预约确定界面
				$scope.closeRoomAppointmentInfoView();//关闭房间预约的详情信息界面
				$scope.refreshRoomsData();//刷新房间数据
			}else{
				alert("发生错误，请稍后再试");
			}
		}).error(function(data){
			alert("发生错误,请稍后再试")
		});
	}
	/**
	 * 关闭取消房间预约界面
	 * @return {[type]} [description]
	 */
	$scope.closeCancelRoomAppointment = function(){
		$scope.cashierAlertView.cancelRoomAppointment = false;
	}
	/*************** 房间预约详情 end ***************/

	/********************* 房间占用详情 start *********************/
	$scope.unableClickAddConsumption = true;//增加服务按钮是否能被点击的标记true(不能点击)false(能点击)
	$scope.isUnableClickAddConsumption = function(){//检测增加服务按钮是否能被点击
		var _count = 0;
		for(var i = 0,len = $scope.selectHandsInfo.userHandSelected.length; i < len; i++){
			if($scope.selectHandsInfo.userHandSelected[i]){
				_count++;
				$scope.roomOccupyInfo.userHand = $scope.roomOccupyInfo.roomHandsInfo[i]["userHand"];//获取增加服务的手牌号
				$scope.roomOccupyInfo.userHandID = $scope.roomOccupyInfo.roomHandsInfo[i]["handid"];//获取增加服务的手牌ID
			}
		}
		if(_count !== 1){
			$scope.unableClickAddConsumption = true;
		}else{
			$scope.unableClickAddConsumption = false;
		}
	}
	/**
	 * 房间占用信息
	 * roomNumber 		房间号
	 * roomID 			房间ID
	 * roomCount 		房间总共床位
	 * roomStartTime 	开房时间
	 * roomHandsInfo 	该房间所有手牌信息
	 * userHand 		选择的手牌名称
	 * userHandID 		选择的手牌ID
	 * @type {Object}
	 */
	$scope.roomOccupyInfo = {
		roomNumber:'',
		roomID:'',
		roomCount:'',
		roomStartTime:'',
		roomHandsInfo:'',
		userHand:'',
		userHandID:''
	}
	/**
	 * show占用房间详情界面
	 * 获取房间数据，转换显示内容
	 * @return {[type]} [description]
	 */
	$scope.showRoomOccupyInfo = function(roomID){
		//调用父controller中changeHeaderInfo函数，显示顶部导航信息中退出房间按钮
		$scope.$parent.changeHeaderInfo('roomPageOccupy');
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetRoomInfo",
			data:{roomID:roomID},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(obj){
				var str = [];
				for(var p in obj){
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
				return str.join("&");
			}
		}).success(function(data,status){
			console.log("getRoomInfo",data)
			$scope.roomOccupyInfo = data;
			$scope.roomPageShow[0] = false;//隐藏room-index界面
			$scope.roomPageShow[1] = true;//显示房间占用详情界面
			//初始化手牌显示标记
			for(var i = 0,len = $scope.roomOccupyInfo.roomHandsInfo.length;i < len;i++){
				$scope.selectHandsInfo.userHandSelected[i] = true;
			}
			$scope.isUnableClickAddConsumption();//检测增加服务按钮是否能被点击
		}).error(function(){

		})
	}

	/**
	 * 选择所要显示详情消费的手牌号码
	 * @param  {[type]} userHand [description]
	 * @return {[type]}          [description]
	 */
	$scope.selectUserHand = function(index){
		$scope.selectHandsInfo.userHandSelected[index] = !$scope.selectHandsInfo.userHandSelected[index];
		$scope.isUnableClickAddConsumption();
	}
	/**
	 * 用来存储详情消费已经选择的手牌号码信息
	 * @type {Object}
	 */
	$scope.selectHandsInfo = {
		userHandSelected : []
	};

	/**
	 * 重置cashier下的页面显示标记
	 * @return {[type]} [description]
	 */
	$scope.resetRoomPageShow = function(){
		$scope.roomPageShow[0] = true;//显示cashier下的主界面
		$scope.roomPageShow[1] = false;//影藏cashier下的房间详情界面
	}

	/**
	 * 接受父controller的callCashierBack事件
	 * 重置cashier下默认界面显示
	 */
	$scope.$on('callCashierBack',function(){
		$scope.resetRoomPageShow();//重置cashier下显示的界面(显示全部房间，影藏房间详情界面)
		$scope.unableClickAddConsumption = true;//重置增加消费按钮为不能点击状态
		$scope.selectHandsInfo.userHandSelected = [];//清空用来存储详情消费已经选择的手牌号码信息
		$scope.refreshRoomsData();//刷新数据
	})
	/********************** 房间占用详情 end *********************/

	/*******************增加服务板块 start **********************/
	/**
	 * userHand 				需要增加服务或者商品的手牌
	 * userHandID 				手牌的ID
	 * goodsKindsList 			商品分类列表
	 * 		catename 				商品分类名称
	 * 		id 						商品分类名称的id
	 * 		state 					商品是否需要技师(1不需要，2需要)
	 * selectGoodsKind 			筛选的商品种类
	 * selectGoodsKindName 		筛选的商品种类名称
	 * searchText 				搜索框内容
	 * allGoodsList 			全部商品数据
	 *  	addmoney 				加钟价格
	 *  	addtime 				加钟时长
	 *  	catename 				商品分类名称
	 *  	category 				商品分类ID
	 *  	endtime 				结束供应时间
	 *  	id 						商品id
	 *  	money 					商品价格
	 *  	pname 					商品名称
	 *  	serverstime 			服务时长
	 *  	starttime 				开始供应时间
	 * selectedGoodsList 		已经选择了的商品列表
	 * 		id 						商品id
	 * 		name 					商品名称
	 * 		price 					商品单价
	 * 		number 					商品数量
	 * 		state 					1不需要技师，2需要技师
	 * 		tid 					技师ID
	 * 		tname 					技师姓名
	 * 		tcode 					技师错误码(303技师不存在或被占用)
	 * selectTechnicianInfo 	增加服务时选择技师界面的信息
	 * 		selectTechnicianList 	增加服务时被选择的技师列表
	 *  		id 						技师id
	 *  	 	info 					服务详情
	 *  	  	names 					技师名称
	 *  	   	number 					技师编号
	 *  	    numberof 				上钟次数
	 *  	    phone 					技师号码
	 *  	    sex 					技师性别
	 *  	    state 					技师状态（1空闲2忙碌3请假4锁定）
	 *  	    wechat 					技师微信
	 *  	 goodsName 				服务名称
	 *  	 goodsID 				服务商品的ID
	 *  	 goodsPrice 			服务价格
	 *  	 searchText 			技师搜索框内容
	 *  	 technicianID 		 	选中的技师id
	 *  	 technicianName 	 	选中的技师名称
	 * @type {Object}
	 */
	$scope.resetAddConsumptionInfo = function(){
		$scope.addConsumptionInfo = {
			roomID:'',
			userHand:'',
			userHandID:'',
			goodsKindsList:[],
			selectGoodsKind:'',
			selectGoodsKindName:'',
			searchText:'',
			allGoodsList:[],
			selectedGoodsList:[],
			selectTechnicianInfo:{
				selectTechnicianList:[],
				goodsName:'',
				goodsID:'',
				goodsPrice:'',
				searchText:'',
				technicianID:'',
				technicianName:''
			}
		}
	}
	$scope.resetAddConsumptionInfo();
	/**
	 * 点击增加消费，显示增加消费界面
	 * @return {[type]} [description]
	 */
	$scope.showAddConsumptionView = function(){
		console.log('增加消费界面显示时，addConsumptionInfo',$scope.addConsumptionInfo);
		//如果增加服务按钮不能点击，则直接return
		if($scope.unableClickAddConsumption){//$scope.unableClickAddConsumption为能否点击的标记
			return
		}
		$scope.addConsumptionInfo.roomID = $scope.roomOccupyInfo.roomID;//获取房间id
		$scope.addConsumptionInfo.userHand = $scope.roomOccupyInfo.userHand;//需要增加服务的手牌
		$scope.addConsumptionInfo.userHandID = $scope.roomOccupyInfo.userHandID;//获取增加服务的手牌id
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.cashierAlertView.addConsumptionView = true;
		//获取商品分类列表
		$http.post("http://" + $rootScope.myHost + "/Home/Index/GetProductCategory").success(function(data){
			console.log('获取商品分类列表数据',data);
			$scope.addConsumptionInfo.goodsKindsList = data.data;
		}).error(function(data){
			console.log(data);
			alert('网络故障！稍后再试');
		})
		//获取全部商品数据
		$http.post("http://" + $rootScope.myHost + "/Home/Index/GetProducts").success(function(data){
			console.log('获取全部商品数据',data);
			if(data.state == 'SUCCESS'){
				$scope.addConsumptionInfo.allGoodsList = data.data;
			}
		}).error(function(data){
			console.log(data);
			alert('网络故障！稍后再试');
		})
	}
	/**
	 * 关闭增加消费界面
	 * @return {[type]} [description]
	 */
	$scope.closeAddConsumptionView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.cashierAlertView.addConsumptionView = false;
		var _add_userHand = $scope.addConsumptionInfo.userHand;//存储增加服务的手牌名称
		var _add_userHandID = $scope.addConsumptionInfo.userHandID;//存储增加服务的手牌ID
		$scope.resetAddConsumptionInfo();//重置增加消费界面信息
		$scope.closeSelectTechnician();//关闭增加服务时选择技师的窗口
		//刷新房间数据
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetRoomInfo",
			data:{roomID:$scope.roomOccupyInfo.roomID},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(obj){
				var str = [];
				for(var p in obj){
					str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				}
				return str.join("&");
			}
		}).success(function(re){
			console.log("getRoomInfo",re)
			$scope.roomOccupyInfo = re;
			$scope.roomOccupyInfo.userHand = _add_userHand;
			$scope.roomOccupyInfo.userHandID = _add_userHandID;
			//初始化手牌显示标记,显示增加服务的手牌，隐藏其他手牌
			for(var i = 0,len = re.roomHandsInfo.length;i < len;i++){
				if($scope.roomOccupyInfo.userHandID == re.roomHandsInfo[i]['handid']){
					$scope.selectHandsInfo.userHandSelected[i] = true;
				}else{
					$scope.selectHandsInfo.userHandSelected[i] = false;
				}
			}
			$scope.isUnableClickAddConsumption();//检测增加服务按钮是否能被点击
		}).error(function(){

		})
	}
	/**
	 * 增加消费商品过滤函数
	 * 搜索商品
	 * @return {[type]} [description]
	 */
	$scope.filterAddConsumptionGoods = function(){
		if($scope.addConsumptionInfo.selectGoodsKind == ''){
			$scope.addConsumptionInfo.selectGoodsKindName = '';
		}else{
			for(var i = 0,len = $scope.addConsumptionInfo.goodsKindsList.length; i < len; i++){
				if($scope.addConsumptionInfo.goodsKindsList[i]['id'] == $scope.addConsumptionInfo.selectGoodsKind){
					$scope.addConsumptionInfo.selectGoodsKindName = $scope.addConsumptionInfo.goodsKindsList[i]['catename'];
					break
				}
			}
		}
		var _filter = {
			catename:$scope.addConsumptionInfo.selectGoodsKindName,
			pname:$scope.addConsumptionInfo.searchText,
		}
		return _filter
	}
	/**
	 * 增加消费时，点击商品函数
	 */
	$scope.addConsumption = function(serversTime,goodsKindID,goodsName,goodsID,goodsPrice){
		if(serversTime > 0){//服务类项目，需要技师
			$scope.cashierAlertView.addConsumptionTechnicianView = true;//显示增加服务时选择技师的弹窗
			$scope.addConsumptionInfo.selectTechnicianInfo.goodsName = goodsName;
			$scope.addConsumptionInfo.selectTechnicianInfo.goodsID = goodsID;
			$scope.addConsumptionInfo.selectTechnicianInfo.goodsPrice = goodsPrice;
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/GetTccList",
				data:{category:goodsKindID},
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(data){
					return $.param(data);
				}
			}).success(function(data){
				console.log('增加服务时所属技师数据',data)
				if(data.state == 'SUCCESS'){
					$scope.addConsumptionInfo.selectTechnicianInfo.selectTechnicianList = data.data;
				}
			}).error(function(){
				//失败
				alert('获取技师列表错误，请稍后再试')
			})
		}else{//非服务类项目，不需要技师
			for(var i = 0,len = $scope.addConsumptionInfo.selectedGoodsList.length; i < len;i++){
				if(goodsID == $scope.addConsumptionInfo.selectedGoodsList[i]['id']){
					$scope.addConsumptionInfo.selectedGoodsList[i]['number']++;
					return
				}
			}
			var _goods = {
				id:goodsID,
				name:goodsName,
				price:goodsPrice,
				number:'1',
				state:'1'
			};
			$scope.addConsumptionInfo.selectedGoodsList.push(_goods);
		}
	}
	/**
	 * 移除选择了的商品
	 * @return {[type]} [description]
	 */
	$scope.removeConsumption = function(goodsID){
		for(var i = 0,len = $scope.addConsumptionInfo.selectedGoodsList.length; i < len; i++){
			if(goodsID == $scope.addConsumptionInfo.selectedGoodsList[i]['id']){
				$scope.addConsumptionInfo.selectedGoodsList.splice(i,1);
				return
			}
		}
	}
	/**
	 * 增加服务商品时，加减商品数量
	 * @param  {boolean} type 商品的运算方式，加或者减
	 * @return {[type]}      [description]
	 */
	$scope.changeSelectedGoodsNumber = function(index,type){
		if(type){//加数量
			$scope.addConsumptionInfo.selectedGoodsList[index]['number']++;
		}else{//减数量
			if($scope.addConsumptionInfo.selectedGoodsList[index]['number'] <= 1){
				return
			}else{
				$scope.addConsumptionInfo.selectedGoodsList[index]['number']--;
			}
		}
	}
	/**
	 * 增加服务时，选择技师函数
	 * @return {[type]} [description]
	 */
	$scope.selectTechnician = function(technicianID,technicianState,technicianName){
		if(technicianState != '1'){
			return;
		}
		$scope.addConsumptionInfo.selectTechnicianInfo.technicianID = technicianID;
		$scope.addConsumptionInfo.selectTechnicianInfo.technicianName = technicianName;
	}
	/**
	 * 选择技师确定按钮
	 * @return {[type]} [description]
	 */
	$scope.makeSelectTechnician = function(){
		//判断是否选择了技师
		if($scope.addConsumptionInfo.selectTechnicianInfo.technicianID == ''){
			alert("请选择技师");
			return
		}
		//判断是否已经添加了技师
		for(var i = 0,len = $scope.addConsumptionInfo.selectedGoodsList.length; i < len; i++){
			if($scope.addConsumptionInfo.selectTechnicianInfo.goodsID == $scope.addConsumptionInfo.selectedGoodsList[i]['id']){
				alert("已经添加该项目");
				return
			}
		}
		var _goods = {
			id:$scope.addConsumptionInfo.selectTechnicianInfo.goodsID,
			name:$scope.addConsumptionInfo.selectTechnicianInfo.goodsName,
			price:$scope.addConsumptionInfo.selectTechnicianInfo.goodsPrice,
			number:1,
			state:'2',
			tid:$scope.addConsumptionInfo.selectTechnicianInfo.technicianID,
			tname:$scope.addConsumptionInfo.selectTechnicianInfo.technicianName
		}
		$scope.addConsumptionInfo.selectedGoodsList.push(_goods);
		$scope.closeSelectTechnician();
	}
	/**
	 * 确定发送增加服务项目
	 * @return {[type]} [description]
	 */
	$scope.makeAddConsumption = function(){
		var _goodsList = [];
		for(var i = 0,len = $scope.addConsumptionInfo.selectedGoodsList.length; i < len; i++){
			if ($scope.addConsumptionInfo.selectedGoodsList[i]['state'] == '1') {//不需要技师的产品
				var _goods = {
					pid:$scope.addConsumptionInfo.selectedGoodsList[i]['id'],
					number:$scope.addConsumptionInfo.selectedGoodsList[i]['number']
				}
				_goodsList.push(_goods);
			}else if($scope.addConsumptionInfo.selectedGoodsList[i]['state'] == '2'){//需要技师的商品
				var _goods = {
					state:true,
					pid:$scope.addConsumptionInfo.selectedGoodsList[i]['id'],
					tid:$scope.addConsumptionInfo.selectedGoodsList[i]['tid']
				}
				_goodsList.push(_goods);
			};
		}
		var _data = {
			roomid:$scope.addConsumptionInfo.roomID,
			handid:$scope.addConsumptionInfo.userHandID,
			product:_goodsList
		}
		console.log(_data)
		//发送数据
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/RoomAddConsumption",
			data:_data,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log("增加服务请求返回数据",data);
			if(data.state == 'SUCCESS'){
				//检测平板是否推送成功
				for(var i = 0, len = data.PadMsgPush; i < len;i++){
					for(var j = 0,length = data.PadMsgPush[i].length; j < length; j++){
						if(data.PadMsgPush[i][j]['state'] != 'SUCCESS'){
							alert(data.PadMsgPush[i][j]['padname'] + '信息推送失败！');
						}
					}
				}
				//检测商品是否添加成功
				var _addErr = [];//没有添加成功的商品
				for(var i = 0, len = data.info.length;i < len;i++){
					if(data.info[i]['state'] == 'SUCCESS'){
						$scope.removeConsumption(data.info[i]['pid']);//移除添加成功的商品
					}else if(data.info[i]['tcccode'] == '303'){
						for(var j = 0,length = $scope.addConsumptionInfo.selectedGoodsList.length;j < length;j++){
							if(data.info[i]['tid'] == $scope.addConsumptionInfo.selectedGoodsList[j]['tid'] && data.info[i]['pid'] == $scope.addConsumptionInfo.selectedGoodsList[j]['id']){
								 $scope.addConsumptionInfo.selectedGoodsList[j]['tcode'] = data.info[i]['tcccode'];
								 _addErr.push($scope.addConsumptionInfo.selectedGoodsList[j]['name']);//添加没添加成功的商品名称
								 break
							}
						}
					}
				}
				if(_addErr.length == 0){//全部商品添加成功
					alert("商品添加成功");
					var _add_userHand = $scope.addConsumptionInfo.userHand;//存储增加服务的手牌名称
					var _add_userHandID = $scope.addConsumptionInfo.userHandID;//存储增加服务的手牌ID
					$scope.closeAddConsumptionView();//关闭增加服务窗口
				}else{
					var str = '';
					for(var i = 0,len = _addErr.length; i < len; i++){
						str = str + _addErr[i] + ',';
					}
					alert(str + '添加失败');
				}
			}else{
				alert("发生错误，稍后再试")
			}
		}).error(function(){
			alert("发生错误，请稍后再试");
		})
	}
	/**
	 * 关闭增加服务时选择技师的弹窗
	 * @return {[type]} [description]
	 */
	$scope.closeSelectTechnician = function(){
		$scope.cashierAlertView.addConsumptionTechnicianView = false;//关闭增加服务时选择技师的弹窗
		$scope.addConsumptionInfo.selectTechnicianInfo = {
			selectTechnicianList:[],
			goodsName:'',
			goodsID:'',
			goodsPrice:'',
			searchText:'',
			technicianID:'',
			technicianName:''
		};//重置增加服务时选择技师的信息
	}
	/*************** 增加服务板块 end ***************************/

	/******************** 调换房间 start *********************/
	/**
	 * 调换房间的信息
	 * roomNumber 原房间号
	 * roomID 原房间ID
	 * newRoomNumber 新房间号
	 * newRoomNumberID 新房间ID
	 * @type {Object}
	 */
	$scope.changeRoomNumberInfo = {
		roomNumber:'',
		roomID:'',
		newRoomNumber:'',
		newRoomID:''
	}
	/**
	 * 调换房间错误信息
	 * isErr 是否发生错误
	 * errInfo 错误信息
	 * errCode 错误码
	 * @type {Object}
	 */
	$scope.changeRoomNumberErr = {
		isErr:false,
		errInfo:'* 房间号错误',
		errCode:''
	}
	/**
	 * 显示房间详情中调换房间弹窗
	 * @return {[type]} [description]
	 */
	$scope.showChangeRoomNumberView = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.cashierAlertView.changeRoomNumberView = true;//显示调换房间弹窗
		$scope.changeRoomNumberInfo.roomNumber = $scope.roomOccupyInfo.roomNumber;//获取原房间号码
		$scope.changeRoomNumberInfo.roomID = $scope.roomOccupyInfo.roomID;//获取原房间ID
		$scope.refreshRoomsData();//刷新所有房间数据
	}

	/**
	 * 隐藏房间详情中调换房间弹窗
	 * 调换房间信息清空
	 * @return {[type]} [description]
	 */
	$scope.closeChangeRoomNumberView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.cashierAlertView.changeRoomNumberView = false;//隐藏调换房间弹窗
		//重置调换房间信息
		$scope.changeRoomNumberInfo = {
			roomNumber:'',
			roomID:'',
			newRoomNumber:'',
			newRoomID:''
		}
		$scope.changeRoomNumberErr.isErr = false;//重置调换房间错误信息标记
		$scope.changeRoomNumberErr.errInfo = '';//重置调换房间错误信息提示
		$scope.changeRoomNumberErr.errCode = '';//重置调换房间错误信息代码
	}

	/**
	 * 调换房间确定函数
	 * 验证输入内容，然后发送请求
	 * @return {[type]} [description]
	 */
	$scope.makeChangeRoomNumber = function(){
		console.log('调换房间发出的信息',$scope.changeRoomNumberInfo)
		if($scope.changeRoomNumberInfo.newRoomID !== ''){
			//重置调换房间错误信息
			$scope.changeRoomNumberErr = {
				isErr:false,
				errInfo:'',
				errCode:''
			}
			//向后台发送调换房间请求
			data = {
				nowID:$scope.changeRoomNumberInfo.roomID,
				newID:$scope.changeRoomNumberInfo.newRoomID
			}
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/ChangeRoom",
				data:data,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(data){
					return $.param(data);
				}
			}).success(function(data){
				console.log('请求调换房间返回数据',data)
				if(data.state == 'SUCCESS'){
					alert('调换房间成功');
					//重新刷新房间数据
					$http({
						method:"POST",
						url: "http://" + $rootScope.myHost + "/Home/Index/GetRoomInfo",
						data:{roomID:$scope.changeRoomNumberInfo.newRoomID},
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						transformRequest: function(obj){
							var str = [];
							for(var p in obj){
								str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							}
							return str.join("&");
						}
					}).success(function(data,status){
						console.log("getRoomInfo",data)
						$scope.roomOccupyInfo = data;
						//初始化手牌显示标记
						for(var i = 0,len = $scope.roomOccupyInfo.roomHandsInfo.length;i < len;i++){
							$scope.selectHandsInfo.userHandSelected[i] = true;
						}
					}).error(function(){
						alert('发生错误，请刷新数据')
					})
					$scope.closeChangeRoomNumberView();//调用关闭房间弹窗函数
				}else{
					$scope.changeRoomNumberErr = {
						isErr:true,
						errInfo:'* 调换房间失败！' + data.errormsg,
						errCode:''
					}
				}
			}).error(function(){
				//失败
				alert('发生错误，请稍后再试')
			})
		}else{//显示错误信息
			$scope.changeRoomNumberErr.isErr = true;
			$scope.changeRoomNumberErr.errInfo = '* 请选择新房间号码！';
		}
	}
	/************************** 调换房间 end ***********************/

	/************************** 增加宾客 start *********************/
	/**
	 * 增加宾客界面的信息
	 * roomNumber 房间号码
	 * roomID 房间ID
	 * userHands 房间中已经有的手牌
	 * userHandsID 房间中已经有的手牌ID
	 * roomCount 房间总共床位
	 * newUserHand 绑定输入框的信息
	 * newUserHands 新增加的手牌号，数组
	 * newUserHandsID 新增加的手牌ID
	 * @type {Object}
	 */
	$scope.continueAddUserhandInfo = {
		roomNumber:'',
		roomID:'',
		userHands:[],
		userHandsID:[],
		roomCount:'',
		newUserHand:'',
		newUserHands:[],
		newUserHandsID:[]
	}
	/**
	 * 增加宾客界面手牌号错误信息
	 * @type {Object}
	 */
	$scope.continueAddUserhandErr = {
		isErr:false,
		errInfo:'* 手牌号错误',
		errCode:''
	}
	/**
	 * 显示房间详情中增加宾客的界面
	 * @return {[type]} [description]
	 */
	$scope.showContinueAddUserhandView = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.cashierAlertView.continueAddUserhandView = true;//显示增加宾客弹窗
		$scope.continueAddUserhandInfo.roomNumber = $scope.roomOccupyInfo.roomNumber;//获取房间号
		$scope.continueAddUserhandInfo.roomID = $scope.roomOccupyInfo.roomID;//获取ID
		$scope.continueAddUserhandInfo.roomCount = $scope.roomOccupyInfo.roomCount;//获取房间总共床位
		$scope.continueAddUserhandInfo.userHands = [];//重置增加宾客界面信息中的原本手牌数组
		//往continueAddUserhandInfo.userHands中添加该房间已有的手牌号
		for(var i = 0,len = $scope.roomOccupyInfo.roomHandsInfo.length; i < len; i++){
			$scope.continueAddUserhandInfo.userHands.push($scope.roomOccupyInfo.roomHandsInfo[i].userHand);
		}
	}
	/**
	 * 隐藏增加宾客界面
	 * @return {[type]} [description]
	 */
	$scope.closeContinueAddUserhandView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.cashierAlertView.continueAddUserhandView = false;//隐藏增加宾客弹窗
		//重置增加宾客界面信息
		$scope.continueAddUserhandInfo = {
			roomNumber:'',
			userHands:[],
			userHandsID:[],
			roomCount:'',
			newUserHand:'',
			newUserHands:[],
			newUserHandsID:[]
		}
		//重置增加宾客错误信息
		$scope.continueAddUserhandErr = {
			isErr:false,
			errInfo:'* 手牌号错误',
			errCode:''
		}
	}
	/**
	 * 增加宾客界面中输入框的回车事件
	 * @param  {[type]}  e [description]
	 * @return {Boolean}   [description]
	 */
	$scope.isContinueAddUserhand = function(e){
		var keycode = window.event ? e.keyCode : e.which;
		if(keycode == 13){//判断是否是回车事件
			$scope.continueAddUserhand();
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		}
	}
	/**
	 * 增加宾客界面添加手牌
	 * @return {[type]} [description]
	 */
	$scope.continueAddUserhand = function(){
		//判断输入的手牌号是否全是数字
		var regexp_userHand = /^[a-zA-Z0-9]{1,}$/;//简单手牌正则，要求全是数字或字母
		if(!regexp_userHand.test($scope.continueAddUserhandInfo.newUserHand)){
			$scope.continueAddUserhandErr.errInfo = '* 手牌号错误';//修改错误信息
			$scope.continueAddUserhandErr.isErr = true;//设置错误标记为true
			return
		}
		//判断房间是否满员
		if($scope.continueAddUserhandInfo.userHands.length + $scope.continueAddUserhandInfo.newUserHands.length >= 0 + $scope.continueAddUserhandInfo.roomCount){
			console.log($scope.continueAddUserhandInfo.userHands.length,$scope.continueAddUserhandInfo.newUserHands.length,$scope.roomUsingInfo.roomCount)
			$scope.continueAddUserhandErr.errInfo = '* 房间已满，无法添加新手牌';//修改错误信息
			$scope.continueAddUserhandErr.isErr = true;
			return
		}
		//判断手牌是否已经被添加
		var _canPush = true;
		//判断原本房间是否存在要添加的号码
		for(var i = 0, len= $scope.continueAddUserhandInfo.userHands.length; i < len; i++){
			if($scope.continueAddUserhandInfo.userHands[i] == $scope.continueAddUserhandInfo.newUserHand){//判断手牌是否已经被添加
				_canPush = false;
			}
		}
		//判断新添加的号码是否存在要添加的号码
		for(var i = 0, len= $scope.continueAddUserhandInfo.newUserHands.length; i < len; i++){
			if($scope.continueAddUserhandInfo.newUserHands[i] == $scope.continueAddUserhandInfo.newUserHand){//判断手牌是否已经被添加
				_canPush = false;
			}
		}
		if(_canPush){
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/CheckUserHand",
				data:{userHand:$scope.continueAddUserhandInfo.newUserHand},
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(obj){
					var str = [];
					for(var p in obj){
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
					return str.join("&");
				}
			}).success(function(data,status){
				console.log("获得手牌号是否能被添加",data);
				if(data.state == "SUCCESS"){//后台验证手牌号可用时
					$scope.continueAddUserhandInfo.newUserHands.push(data.data.userHand);//添加进newUserHands
					$scope.continueAddUserhandInfo.newUserHandsID.push(data.data.handid);//添加进userHandsID
					//成功添加后重置错误
					$scope.continueAddUserhandErr = {
						isErr:false,
						errInfo:'* 手牌号错误',
						errCode:''
					}
					$scope.continueAddUserhandInfo.newUserHand = '';//输入框清零
				}else{//后台验证手牌号错误时
					$scope.continueAddUserhandErr.errInfo = '* ' + data.errormsg;//设置错误信息
					$scope.continueAddUserhandErr.isErr = true;//显示错误
				}
			}).error(function(){
				alert('发生错误，请稍后再试')
			})
		}else{
			$scope.continueAddUserhandErr.errInfo = '* 此手牌已被添加';
			$scope.continueAddUserhandErr.isErr = true;
		}
	}
	/**
	 * 增加宾客界面删除手牌
	 * @param  {string} userHand 要删除的手牌
	 * @return {[type]}          [description]
	 */
	$scope.deleteNewUserhands = function(userHand){
		for(var i = 0,len = $scope.continueAddUserhandInfo.newUserHands.length; i < len; i++){
			if($scope.continueAddUserhandInfo.newUserHands[i] == userHand){
				$scope.continueAddUserhandInfo.newUserHands.splice(i,1);
				$scope.continueAddUserhandInfo.newUserHandsID.splice(i,1);
			}
		}
	}
	/**
	 * 增加宾客界面确定函数
	 * @return {[type]} [description]
	 */
	$scope.makeContinueAddUserhand = function(){
		console.log('$scope.continueAddUserhandInfo',$scope.continueAddUserhandInfo);
		if($scope.continueAddUserhandInfo.newUserHands.length == 0){
			$scope.continueAddUserhandErr.errInfo = '* 请添加手牌';//开房信息错误标记重置
			$scope.continueAddUserhandErr.errCode = '';//开房信息错误标记重置
			$scope.continueAddUserhandErr.isErr = true;//开房信息错误标记重置
			return
		}
		var data = {roomID:$scope.continueAddUserhandInfo.roomID,userHands:$scope.continueAddUserhandInfo.newUserHandsID};
		console.log('data',data);
		/*data = JSON.stringify(data);*/
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/RoomAddUser",
			data:data,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data,status,headers,config){
			console.log('增加宾客',data)
			if(data.state == 'SUCCESS'){
				//操作成功后，需要重新加载房间详情数据，要求后台返回最新的房间详情数据*******需完善********
				//增加宾客成功后，向后台请求最新房间详情数据
				$http({
					method:"POST",
					url: "http://" + $rootScope.myHost + "/Home/Index/GetRoomInfo",
					data:{roomID:$scope.continueAddUserhandInfo.roomID},
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					transformRequest: function(obj){
						var str = [];
						for(var p in obj){
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						}
						return str.join("&");
					}
				}).success(function(data,status){
					$scope.roomOccupyInfo = data;
					//初始化手牌显示标记
					for(var i = 0,len = $scope.roomOccupyInfo.roomHandsInfo.length;i < len;i++){
						$scope.selectHandsInfo.userHandSelected[i] = true;
					}
					$scope.isUnableClickAddConsumption();//检测增加服务按钮是否能被点击
				}).error(function(){

				})
				//判断是否全部添加成功
				var allSuccess = true;//是否全部成功标记
				var addErr = [];//没添加成功的存储数组
				for(var i = 0,len = data.data.length; i < len; i++){
					if(data.data[i]["state"] == 'ERROR'){
						allSuccess = false;
						addErr.push(data.data[i]['handname']);
					}
				}
				if(allSuccess){//全部添加成功
					$scope.closeContinueAddUserhandView();
				}else{//存在添加不成功的手牌
					$scope.continueAddUserhandInfo.roomNumber = $scope.roomOccupyInfo.roomNumber;//获取房间号
					$scope.continueAddUserhandInfo.roomID = $scope.roomOccupyInfo.roomID;//获取ID
					$scope.continueAddUserhandInfo.roomCount = $scope.roomOccupyInfo.roomCount;//获取房间总共床位
					$scope.continueAddUserhandInfo.userHands = [];//重置增加宾客界面信息中的原本手牌数组
					$scope.continueAddUserhandInfo.newUserHands = [];//重置增加宾客界面信息中的新手牌数组
					//往continueAddUserhandInfo.userHands中添加该房间已有的手牌号
					for(var i = 0,len = $scope.roomOccupyInfo.roomHandsInfo.length; i < len; i++){
						$scope.continueAddUserhandInfo.userHands.push($scope.roomOccupyInfo.roomHandsInfo[i].userHand);
					}
					$scope.continueAddUserhandErr.errInfo = '* ';//修改增加宾客信息的错误信息
					for(var i = 0,len = addErr.length; i < len;i++){
						$scope.continueAddUserhandErr.errInfo += addErr[i] +',';
					}
					$scope.continueAddUserhandErr.errInfo += '添加失败';
					$scope.continueAddUserhandErr.isErr = true;//增加宾客信息错误标记重置
				}
			}
		}).error(function(data,status,headers,config){
			alert("出现错误，请稍后再试");
		})
		// $.ajax({
		// 	url:"http://pay.iloveyour.cn/Home/Index/RoomAddUser",
		// 	data:data,
		// 	success: function(data){
		// 		console.log(data)
		// 	}
		// })
	}
	/******************** 增加宾客 end ************************/

	/********************* 退单 start *************************/
	/**
	 * 点击退单按钮，显示退单界面
	 * @return {[type]} [description]
	 */
	$scope.showChargebackView = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.cashierAlertView.chargebackView = true;
	}
	/**
	 * 关闭退单界面
	 * @return {[type]} [description]
	 */
	$scope.closeChargebackView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.cashierAlertView.chargebackView = false;
	}
	/******************** 退单 end ****************************/

	/********************** 结账 start *************************/
	/**
	 * 结账界面信息
	 * titleName 			界面名称
	 * searchPlaceholder 	搜索框提示内容
	 * searchText 			输入的搜索内容
	 * payWay 				结账方式(房间结账，手牌结账)
	 * payType 				付款方式 (cash:现金支付,weixin:微信支付,bank:银联支付,vip:会员支付)
	 * collectMoney 		实收金额
	 * totalMoney 			合计金额
	 * changeMoney 			找零金额
	 * selectListShow 		显示可供选择列表的标记 
	 * selectList 			可以结账的房间号或者手牌号
	 * 		id 					value值,唯一ID,房间id或者手牌id
	 * 		name 				手牌号或者房间号
	 * selectedList 		已经选择了的需要结账的手牌或者房间
	 *  	id 					value值,唯一ID,房间id或者手牌id
	 * 		name 				手牌号或者房间号
	 * needPayNumber 		需要结账的手牌或者房间的数量
	 * @type {Object}
	 */
	$scope.resetCheckOutServiceInfo = function(){
		$scope.checkOutServiceInfo = {
			titleName:'',
			searchPlaceholder:'',
			searchText:'',
			payWay:'',
			payType:'',
			collectMoney:'',
			totalMoney:'1239',
			changeMoney: '',
			selectListShow:false,
			selectList:[{id:'023',name:'023'},{id:'024',name:'生的发生的生的发生的'},{id:'025',name:'025'},{id:'026',name:'026'},{id:'027',name:'027'},{id:'028',name:'028'},{id:'029',name:'029'},{id:'030',name:'030'},{id:'031',name:'031'},{id:'032',name:'032'},{id:'034',name:'034'},{id:'035',name:'035'},{id:'036',name:'036'}],
			selectedList:[],
			needPayNumber:'0'
		}
	}
	$scope.resetCheckOutServiceInfo();
	//检测需要找零的钱
	$scope.$watch('checkOutServiceInfo.collectMoney',function(newVal,oldVal,scope){
		console.log('newValue:',newVal,'oldValue:',oldVal);
		$scope.checkOutServiceInfo.changeMoney = newVal - $scope.checkOutServiceInfo.totalMoney;
	})
	/**
	 * 点击结账按钮，显示结账界面
	 * index 结账方式 1 为房间结账，2 为手牌结账
	 * @return {[type]} [description]
	 */
	$scope.showCheckOutServiceView = function(index){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.cashierAlertView.checkOutServiceView = true;
		if(index == 1){//房间结账
			$scope.checkOutServiceInfo.titleName = '房间结账';//设置结账界面title信息,1为房间结账
			$scope.checkOutServiceInfo.searchPlaceholder = '请输入房间号';//设置搜索框提示信息
		}else{//手牌结账
			$scope.checkOutServiceInfo.titleName = '手牌结账';
			$scope.checkOutServiceInfo.searchPlaceholder = '请输入手牌号';
		}
	}
	/**
	 * 关闭结账界面
	 * @return {[type]} [description]
	 */
	$scope.closeCheckOutServiceView = function(){
		$rootScope.maskLayer = false;//显示遮罩层
		$scope.cashierAlertView.checkOutServiceView = false;
		$scope.resetCheckOutServiceInfo();//重置结账界面信息
	}
	/**
	 * 添加需要结账的房间或者手牌
	 * @param  {str} id   房间或者手牌的id
	 * @param  {str} name 房间名或者手牌号
	 * @return {[type]}      [description]
	 */
	$scope.selectNeedPay = function(id,name){
		var _canAdd = true;
		//判断该手牌或者该房间是否已经被添加
		for(var i = 0,len = $scope.checkOutServiceInfo.selectedList.length;i < len;i++){
			if($scope.checkOutServiceInfo.selectedList[i]["id"] == id){
				_canAdd = false;
				break
			}
		}
		if(_canAdd){
			var _needPay;//需要结账的手牌或者房间
			//从可选择结账的列表里移除该条内容
			for(var i = 0,len = $scope.checkOutServiceInfo.selectList.length; i < len; i++){
				if($scope.checkOutServiceInfo.selectList[i]["id"] == id){
					_needPay = $scope.checkOutServiceInfo.selectList[i];
					$scope.checkOutServiceInfo.selectList.splice(i,1);
					break
				}
			}
			//往已经选择了的列表里添加
			$scope.checkOutServiceInfo.selectedList.unshift(_needPay);
			//修改已经选择了的手牌或者房间数量
			$scope.checkOutServiceInfo.needPayNumber = $scope.checkOutServiceInfo.selectedList.length;
		}
	}
	/**
	 * 删除已经选择了的需要结账的手牌或者房间
	 * @param  {string} id 需要移除的手牌或者房间id
	 * @return {[type]}    [description]
	 */
	$scope.removeNeedPay = function(id){
		var _needPay;
		for(var i = 0,len = $scope.checkOutServiceInfo.selectedList.length; i < len;i++){
			if($scope.checkOutServiceInfo.selectedList[i]["id"] == id){
				_needPay = $scope.checkOutServiceInfo.selectedList[i];
				$scope.checkOutServiceInfo.selectedList.splice(i,1);
				//修改已经选择了的手牌或者房间数量
				$scope.checkOutServiceInfo.needPayNumber = $scope.checkOutServiceInfo.selectedList.length;
				break;
			}
		}
		$scope.checkOutServiceInfo.selectList.push(_needPay);
	}
	/**
	 * 选择付款方式
	 * @param  {string} payType [支付方式]
	 * @return {[type]}         [description]
	 */
	$scope.selectPayType = function(payType){
		$scope.checkOutServiceInfo.payType = payType;//获取选择的付款方式
	}
	/**
	 * 结账
	 * @return {[type]} [description]
	 */
	$scope.makeCheckOutService = function(){
		alert($scope.checkOutServiceInfo.collectMoney)
	}
	/******************** 结账 end ******************************/
}])