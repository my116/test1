
/*系统管理 SystemController*/
projectB.controller('SystemController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	//重置headerInfo
	$scope.$parent.changeHeaderInfo('systemPageIndex');
	/**
	 * system模块下弹窗显示标记
	 * addPadView 添加平板界面
	 * delPadView 删除平板界面
	 * @type {Object}
	 */
	$scope.systemAlertView = {
		addPadView:false,
		delPadView:false
	}

	/*************** 平板管理 start ***************/
	/**
	 * 平板管理板块信息
	 * padList 平板列表数据
	 * 		id      平板设备ID
	 * 		padname 平板设备名称
	 * 		padid   平板账号
	 * @type {Object}
	 */
	$scope.systemPadInfo = {
		padList: []
	}
	/**
	 * 获取平板列表数据函数
	 * @return {[type]} [description]
	 */
	$scope.getPadList = function(){
		$http.post("http://" + $rootScope.myHost + "/Home/Index/GetPad").success(function(data){
			console.log('获取平板列表数据',data);
			$scope.systemPadInfo.padList = data.data;
		}).error(function(data){
			console.log(data);
			alert('网络故障！');
		})
	}
	$scope.getPadList();//获取平板数据
	/**
	 * 增加平板信息
	 * padName       平板名称
	 * padPassword   平板密码
	 * padRepassword 重复密码
	 * @type {Object}
	 */
	$scope.addPadInfo = {
		padName:'',
		padRepassword:'',
		padPassword:''
	}
	/**
	 * 添加平板中的名称错误信息
	 * @type {Object}
	 */
	$scope.addPad_nameErr = {
		isErr:false,
		errInfo:'',
		errCode:''
	}
	/**
	 * 添加平板中重复密码错误信息
	 * @type {Object}
	 */
	$scope.addPad_repasswordErr = {
		isErr:false,
		errInfo:'',
		errCode:''
	}
	/**
	 * 添加平板中密码错误信息
	 * @type {Object}
	 */
	$scope.addPad_passwordErr = {
		isErr:false,
		errInfo:'',
		errCode:''
	}
	/**
	 * 显示增加平板界面
	 * @return {[type]} [description]
	 */
	$scope.showAddPadView = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.systemAlertView.addPadView = true;//显示增加平板弹窗
	}
	/**
	 * 确定增加平板
	 * @return {[type]} [description]
	 */
	$scope.makeAddPad = function(){
		var padName_RegExp = /[*?:"<>\/\\\|]/;//不能含有【*,?,:,",<,>,/,\,|】
		var canAddPad = true;//能否向后台发送请求的标记
		//判断设备名称
		if($scope.addPadInfo.padName == ''){
			$scope.addPad_nameErr = {
				isErr:true,
				errInfo:'* 名称不能为空！'
			}
			canAddPad = false;
		}else if(padName_RegExp.test($scope.addPadInfo.padName)){
			$scope.addPad_nameErr = {
				isErr:true,
				errInfo:'* 含有非法字符！'
			}
			canAddPad = false;
		}else{
			$scope.addPad_nameErr = {
				isErr:false,
				errInfo:''
			}
		}
		//判断平板设备密码
		var padPassword_RegExp = /^[a-zA-Z0-9]{6,16}$/;//数字和字符
		if($scope.addPadInfo.padPassword == ''){
			$scope.addPad_passwordErr = {
				isErr:true,
				errInfo:'* 密码不能为空！'
			}
			canAddPad = false;
		}else if(!padPassword_RegExp.test($scope.addPadInfo.padPassword)){
			$scope.addPad_passwordErr = {
				isErr:true,
				errInfo:'* 数字,字符6-16位！'
			}
			canAddPad = false;
		}else{
			$scope.addPad_passwordErr = {
				isErr:false,
				errInfo:''
			}
		}
		//判断平板重复密码
		if($scope.addPadInfo.padPassword != $scope.addPadInfo.padRepassword){
			$scope.addPad_repasswordErr = {
				isErr:true,
				errInfo:'* 密码不一致！'
			}
			canAddPad = false;
		}else{
			$scope.addPad_repasswordErr = {
				isErr:false,
				errInfo:''
			}
		}
		if (canAddPad) {
			data = {
				padname:$scope.addPadInfo.padName,
				password:$scope.addPadInfo.padPassword
			}
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/AddPad",
				data:data,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(data){
					return $.param(data);
				}
			}).success(function(data){
				console.log('请求增加平板返回数据',data)
				if(data.state == 'SUCCESS'){//平板设备添加成功
					alert('添加平板成功');
					$scope.getPadList();//重新获取平板数据(刷新数据)
					$scope.closeAddPadView();//关闭增加平板界面
				}else{//平板设备添加失败
					$scope.addPad_nameErr = {
						isErr:true,
						errInfo:'* ' + data.errormsg
					}
				}
			}).error(function(){
				//失败
				alert('发生错误，请稍后再试')
			})
		};
	}
	/**
	 * 关闭增加平板界面
	 * @return {[type]} [description]
	 */
	$scope.closeAddPadView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.systemAlertView.addPadView = false;//隐藏增加平板弹窗
		//重置增加平板的输入信息
		$scope.addPadInfo = {
			padName:'',
			padTel:'',
			padPassword:''
		}
		//重置增加平板错误信息
		$scope.addPad_nameErr = {
			isErr:false,
			errInfo:'',
			errCode:''
		}
		$scope.addPad_telErr = {
			isErr:false,
			errInfo:'',
			errCode:''
		}
		$scope.addPad_passwordErr = {
			isErr:false,
			errInfo:'',
			errCode:''
		}
	}
	/**
	 * 删除平板设备信息
	 * padID   需要删除的平板的ID
	 * padName 需要删除的平板的名称
	 * @type {Object}
	 */
	$scope.delPadInfo = {
		padID:'',
		padName:''
	}
	/**
	 * 删除平板设备弹窗界面
	 * @return {[type]} [description]
	 */
	$scope.showDelPadView = function(padID,padName){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.systemAlertView.delPadView = true;//显示删除平板弹窗
		$scope.delPadInfo = {
			padID:padID,
			padName:padName
		}
	}
	/**
	 * 关闭删除平板设备的弹窗界面
	 * @return {[type]} [description]
	 */
	$scope.closeDelPadView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.systemAlertView.delPadView = false;//隐藏删除平板弹窗
		//重置删除平板设备信息
		$scope.delPadInfo = {
			padID:'',
			padName:''
		}
	}
	/**
	 * 确定删除平板设备
	 * @param {string} padID 要删除的平板ID
	 */
	$scope.makeDelPad = function(){
		var data = {
			id:$scope.delPadInfo.padID
		}
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/DeletePad",
			data:data,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('请求删除平板返回数据',data)
			if(data.state == 'SUCCESS'){//平板设备添加成功
				alert('删除平板成功');
				$scope.getPadList();//重新获取平板数据(刷新数据)
				$scope.closeDelPadView();//关闭增加平板界面
			}else{//平板设备添加失败
				
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		})
	}
	/*************** 平板管理 end ***************/
}])