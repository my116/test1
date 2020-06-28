/*会员管理controller*/
projectB.controller('MemberController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	//重置headerInfo显示
	$scope.$parent.changeHeaderInfo('memberPageIndex');

	//member下主要界面显示标记
	$scope.memberPageShow = [true,false];//member下member-page-index，member-page-info界面显示标记
	
	/**
	 * member模块下弹窗显示标记
	 * addNewMemberAlertView  	新增会员弹窗界面
	 * editMemberView  			修改会员弹窗界面
	 * memberRechargeView  		会员充值界面
	 * codeImageView 			会员绑定微信二维码
	 * @type {Object}
	 */
	$scope.memberAlertView = {
		addNewMemberView:false,
		editMemberView:false,
		memberRechargeView:false,
		codeImageView:false
	}

	/*************** 会员管理首页 start ***************/
	/**
	 * 会员首页信息
	 * searchText 		搜索框信息
	 * memberList 		会员数据
	 * 		class 			会员等级
	 * 		id 				会员id
	 * 		money 			会员余额
	 * 		names 			会员名称
	 * 		phone 			会员电话
	 * 		sex 			会员性别(1男2女)
	 * 		state 			会员是否绑定微信(1绑定微信2未绑定微信)
	 * @type {Object}
	 */
	$scope.memberIndexPageInfo = {
		searchText:'',
		memberList:[]
	}

	/**
	 * 获取会员数据
	 * @return {[type]} [description]
	 */
	$scope.refreshMemberData = function(){
		$http.post("http://" + $rootScope.myHost + "/Home/Index/GetVipList").success(function(data){
			console.log('获取会员数据',data);
			if(data.state == 'SUCCESS'){
				$scope.memberIndexPageInfo.memberList = data.data;
			}else{
				alert("发生错误，请稍后再试");
			}
		}).error(function(data){
			console.log(data);
			alert('网络故障！');
		})
	}
	$scope.refreshMemberData();

	/*************** 会员管理首页 end ***************/

	/******************** 会员充值 start ***************************/
	$scope.showMemberRechargeView = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.memberAlertView.memberRechargeView = true;
	}
	$scope.closeMemberRechargeView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.memberAlertView.memberRechargeView = false;
	}
	/******************** 会员充值 end *****************************/

	/******************** 会员详情 start ***************************/
	/**
	 * 会员详情页信息
	 * info 			会员基本信息
	 *  	birthday 		会员出生日期
	 *  	classid 		会员等级
	 *  	className 		会员等级名称
	 *  	id 				会员id
	 *  	jifen 			会员积分
	 *  	money 			会员余额
	 *  	names 			会员名称
	 *  	phone 			会员电话
	 *  	sex 			会员性别
	 *  	startime 		会员日期
	 *  	state 			会员状态
	 *  	wechat 			会员微信
	 * memberRecords  	会员充值消费记录
	 * 		content 		方式（消费、充值）
	 * 		id 				记录的id
	 * 		money 			消费或充值金额
	 * 		orderid 		订单编号
	 * 		times 	 		消费时间
	 * classList 		会员等级列表
	 * @type {Object}
	 */
	$scope.resetMemberPageInfo = function(){
		$scope.memberPageInfo = {
			info:{},
			memberRecords:[],
			classList:[]
		}
	}
	$scope.resetMemberPageInfo();
	/**
	 * 显示会员详情界面
	 * @return {[type]} [description]
	 */
	$scope.showMemberPageInfo = function(id){
		$scope.memberPageShow[0] = false;//隐藏member-page-index
		$scope.memberPageShow[1] = true;//显示member-page-info(会员详情页)
		//修改headerInfo显示标记
		$scope.$parent.changeHeaderInfo('memberPageInfo');
		//请求会员等级列表
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetVipClass",
			data:{},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(re){
			console.log('请求会员等级返回数据',re)
			if(re.state == 'SUCCESS'){//请求会员等级成功
				//发请求会员信息详情
				$http({
					method:"POST",
					url: "http://" + $rootScope.myHost + "/Home/Index/GetVipInfo",
					data:{id:id},
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					transformRequest: function(data){
						return $.param(data);
					}
				}).success(function(data){
					console.log('请求会员详情信息返回数据',data)
					if(data.state == 'SUCCESS'){//请求会员详情信息成功
						$scope.memberPageInfo.info = data.data;
						$scope.memberPageInfo.memberRecords = data.info;
						//设置会员等级名称
						for(var i = 0,len = re.data.length; i < len; i++){
							if(re.data[i]['id'] == $scope.memberPageInfo.info.classid){
								$scope.memberPageInfo.info.className = re.data[i]['vipname'];
								break
							}
						}
					}else{//请求会员详情信息失败
						alert('发生错误，请稍后再试')
					}
				}).error(function(){
					//失败
					alert('发生错误，请稍后再试')
				})
			}else{//请求会员等级失败
				alert('发生错误，请稍后再试')
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		})
		
	}
	/**
	 * 关闭会员详情界面
	 * 接受父controller的callMemberBack事件
	 * 重置member下默认界面显示
	 */
	$scope.$on('callMemberBack',function(){
		$scope.memberPageShow = [true,false];
		
		$scope.refreshMemberData();//刷新数据,获得最新会员列表信息
		$scope.resetMemberPageInfo();//重置会员详情信息
	})
	/******************** 会员详情 end ******************************/

	/*************** 会员信息修改 start ***************/
	/**
	 * 修改会员信息
	 * memberName     		会员姓名
	 * memberID 			会员ID
	 * memberTel      		会员电话
	 * memberWeixin   		会员微信
	 * memberSex      		会员性别
	 * memberBirthday 		会员生日
	 * memberClass    		会员等级
	 * memberClassList 		会员等级列表
	 *  	id 					会员等级id
	 *  	vipname 			会员名称
	 * @type {Object}
	 */
	$scope.resetChangeMemberInfo = function(){
		$scope.changeMemberInfo = {
			memberName:'',
			memberID:'',
			memberTel:'',
			memberWeixin:'',
			memberSex:'',
			memberBirthday:'',
			memberClass:'0',
			memberClassList:[]
		}
	}
	$scope.resetChangeMemberInfo();
	/**
	 * 修改会员的错误信息
	 * @return {[type]} [description]
	 */
	$scope.resetChangeMemberErrInfo = function(){
		$scope.changeMemberErrInfo = {
			nameErr:{
				isErr:false,
				errInfo:''
			},
			telErr:{
				isErr:false,
				errInfo:''
			},
			weixinErr:{
				isErr:false,
				errInfo:''
			},
			sexErr:{
				isErr:false,
				errInfo:''
			},
			birthdayErr:{
				isErr:false,
				errInfo:''
			},
			classErr:{
				isErr:false,
				errInfo:''
			}
		}
	}
	$scope.resetChangeMemberErrInfo();
	/**
	 * 点击会员信息修改按钮显示修改会员信息界面
	 * @return {[type]} [description]
	 */
	$scope.showEditMemberView = function(id){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.memberAlertView.editMemberView = true;
		$rootScope.disabledMouseWheel();//禁止滚轮
		//获取会员等级
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetVipClass",
			data:{},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('请求会员等级列表返回数据',data)
			if(data.state == 'SUCCESS'){//请求会员等级成功
				$scope.changeMemberInfo.memberClassList = data.data;
				$scope.changeMemberInfo.memberName = $scope.memberPageInfo.info.names;
				$scope.changeMemberInfo.memberTel = $scope.memberPageInfo.info.phone;
				$scope.changeMemberInfo.memberWeixin = $scope.memberPageInfo.info.wechat;
				$scope.changeMemberInfo.memberSex = $scope.memberPageInfo.info.sex;
				var YY = '',
					MM = '',
					DD = '';
				var timeStr = $scope.memberPageInfo.info.birthday;
				timeStr *= 1000;
				var time = new Date();
				time.setTime(timeStr);
				YY = time.getFullYear();
				MM = time.getMonth() + 1;
				DD = time.getDate();
				$scope.changeMemberInfo.memberBirthday = YY + '-' + MM + '-' + DD;
				$scope.changeMemberInfo.memberClass = $scope.memberPageInfo.info.classid;
				$scope.changeMemberInfo.memberID = id;
		console.log($scope.changeMemberInfo);
			}else{//请求会员等级失败
				alert('发生错误，请稍后再试')
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		});
	}
	/**
	 * 确定修改会员信息
	 * @return {[type]} [description]
	 */
	$scope.makeChangeMember = function(){
		var _haveErr = false;
		$scope.resetChangeMemberErrInfo();
		$scope.changeMemberInfo.memberBirthday = $('#changeMember_Birthday').val();
		//验证姓名
		if($.trim($scope.changeMemberInfo.memberName) == ''){
			$scope.changeMemberErrInfo.nameErr.isErr = true;
			$scope.changeMemberErrInfo.nameErr.errInfo = '* 不能为空';
			_haveErr = true;
		}
		//验证手机
		var tel_RegExp = /^1\d{10}$/;
		if($.trim($scope.changeMemberInfo.memberTel) == ''){
			$scope.changeMemberErrInfo.telErr.isErr = true;
			$scope.changeMemberErrInfo.telErr.errInfo = '* 不能为空';
			_haveErr = true;
		}else if(!tel_RegExp.test($scope.changeMemberInfo.memberTel)){
			$scope.changeMemberErrInfo.telErr.isErr = true;
			$scope.changeMemberErrInfo.telErr.errInfo = '* 格式错误';
			_haveErr = true;
		}
		//验证微信
		var weixin_RegExp = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
		if($.trim($scope.changeMemberInfo.memberWeixin) == ''){
			$scope.changeMemberErrInfo.weixinErr.isErr = true;
			$scope.changeMemberErrInfo.weixinErr.errInfo = '* 不能为空';
			_haveErr = true;
		}else if(!/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test($.trim($scope.changeMemberInfo.memberWeixin)) && !/^1\d{10}$/.test($.trim($scope.changeMemberInfo.memberWeixin))){
			$scope.changeMemberErrInfo.weixinErr.isErr = true;
			$scope.changeMemberErrInfo.weixinErr.errInfo = '* 格式错误';
			_haveErr = true;
		}
		//验证性别
		if($scope.changeMemberInfo.memberSex == ''){
			$scope.changeMemberErrInfo.sexErr.isErr = true;
			$scope.changeMemberErrInfo.sexErr.errInfo = '* 请选择性别';
			_haveErr = true;
		}
		//验证生日
		if($.trim($scope.changeMemberInfo.memberBirthday) == ''){
			$scope.changeMemberErrInfo.birthdayErr.isErr = true;
			$scope.changeMemberErrInfo.birthdayErr.errInfo = '* 请选择出生日期';
			_haveErr = true;
		}
		//验证会员等级
		if($scope.changeMemberInfo.memberClass == '0'){
			$scope.changeMemberErrInfo.classErr.isErr = true;
			$scope.changeMemberErrInfo.classErr.errInfo = '* 请选择会员等级';
			_haveErr = true;
		}
		if(_haveErr){//填写信息有误
			return
		}
		//检测手机号码是否重复
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/CheckVipPhone",
			data:{id:$scope.changeMemberInfo.memberID,phone:$scope.changeMemberInfo.memberTel},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('检测会员手机是否重复返回数据',data)
			if(data.state == 'SUCCESS'){//检测手机号通过
				//发送修改数据
				var _post_changeMemberData = {
					id:$scope.changeMemberInfo.memberID,
					names:$.trim($scope.changeMemberInfo.memberName),
					phone:$.trim($scope.changeMemberInfo.memberTel),
					wechat:$.trim($scope.changeMemberInfo.memberWeixin),
					sex:$scope.changeMemberInfo.memberSex,
					birthday:$.trim($scope.changeMemberInfo.memberBirthday),
					classid:$scope.changeMemberInfo.memberClass
				} 
				$http({
					method:"POST",
					url: "http://" + $rootScope.myHost + "/Home/Index/EditStoreVip",
					data:_post_changeMemberData,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					transformRequest: function(data){
						return $.param(data);
					}
				}).success(function(re){
					console.log("发送修改数据的返回数据",re);
					if(re.state == "SUCCESS"){
						alert("修改成功");
						$scope.showMemberPageInfo($scope.changeMemberInfo.memberID);//刷新会员详情数据
						$scope.closeEditMemberView();
					}
				}).error(function(){
					alert('发生错误，请稍后再试');
				});
			}else if(data.state == 'ERROR'){//检测手机号没通过
				$scope.changeMemberErrInfo.telErr.isErr = true;
				$scope.changeMemberErrInfo.telErr.errInfo = '* ' + data.errormsg;
			}else{//检测没通过
				alert('发生错误，请稍后再试')
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		})
	}
	/**
	 * 关闭会员信息修改界面
	 * @return {[type]} [description]
	 */
	$scope.closeEditMemberView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.memberAlertView.editMemberView = false;
		$rootScope.ableMouseWheel();//回复滚轮
		$scope.resetChangeMemberInfo();//重置修改会员信息数据
	}
	/**
	 * 修改会员性别
	 * @param  {string} sex 会员性别(men,women)
	 * @return {[type]}     [description]
	 */
	$scope.changeMemberSex = function(sex){
		$scope.changeMemberInfo.memberSex = sex;
	}
	/******************* 会员信息修改 end ****************************/

	/******************** 新增会员功能 start ****************/
	/**
	 * 新增会员信息
	 * memberID 	   会员ID
	 * memberName      会员姓名
	 * memberTel       会员电话
	 * memberWeixin    会员微信
	 * memberSex       会员性别
	 * memberBirthday  会员生日
	 * memberClass     会员等级
	 * memberClassList 会员等级列表
	 * 		id      会员等级ID
	 * 		vipname 会员等级名称
	 * @type {Object}
	 */
	$scope.resetAddNewMemberInfo = function(){
		$scope.addNewMemberInfo = {
			memberID:'',
			memberName:'',
			memberTel:'',
			memberWeixin:'',
			memberSex:'',
			memberBirthday:'',
			memberClass:'0',
			memberClassList:[]
		}
	}
	$scope.resetAddNewMemberInfo();
	/**
	 * 新增会员错误信息
	 * @type {Object}
	 */
	$scope.resetAddNewMemberErrInfo = function(){
		$scope.addNewMemberErrInfo = {
			nameErr:{
				isErr:false,
				errInfo:''
			},
			telErr:{
				isErr:false,
				errInfo:''
			},
			weixinErr:{
				isErr:false,
				errInfo:''
			},
			sexErr:{
				isErr:false,
				errInfo:''
			},
			birthdayErr:{
				isErr:false,
				errInfo:''
			},
			classErr:{
				isErr:false,
				errInfo:''
			}
		}
	}
	$scope.resetAddNewMemberErrInfo();
	/**
	 * 点击新增按钮显示新增会员界面
	 * @return {[type]} [description]
	 */
	$scope.showAddNewMemberView = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.memberAlertView.addNewMemberView = true;
		$rootScope.disabledMouseWheel();//禁止滚轮
		//获取会员等级
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetVipClass",
			data:{},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('请求会员等级列表返回数据',data)
			if(data.state == 'SUCCESS'){//平板设备添加成功
				$scope.addNewMemberInfo.memberClassList = data.data;
			}else{//平板设备添加失败
				alert('发生错误，请稍后再试')
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		})
	}
	/**
	 * 点击关闭按钮隐藏新增会员界面
	 * @return {[type]} [description]
	 */
	$scope.closeAddNewMemberView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.memberAlertView.addNewMemberView = false;
		$rootScope.ableMouseWheel();//回复滚轮
		$scope.resetAddNewMemberInfo();//重置添加新会员信息
		$scope.resetAddNewMemberErrInfo();//重置添加会员错误信息
	}
	/**
	 * 选择新增会员性别
	 * @param  {string} sex 会员性别(men,women)
	 * @return {[type]}     [description]
	 */
	$scope.selectMemberSex = function(sex){
		$scope.addNewMemberInfo.memberSex = sex;
	}
	/**
	 * 确定新增会员
	 * @return {[type]} [description]
	 */
	$scope.makeAddNewMember = function(){
		var _haveErr = false;
		$scope.resetAddNewMemberErrInfo();
		$scope.addNewMemberInfo.memberBirthday = $('#addMember_Birthday').val();
		//验证姓名
		if($.trim($scope.addNewMemberInfo.memberName) == ''){
			$scope.addNewMemberErrInfo.nameErr.isErr = true;
			$scope.addNewMemberErrInfo.nameErr.errInfo = '* 不能为空';
			_haveErr = true;
		}
		//验证手机
		var tel_RegExp = /^1\d{10}$/;
		if($.trim($scope.addNewMemberInfo.memberTel) == ''){
			$scope.addNewMemberErrInfo.telErr.isErr = true;
			$scope.addNewMemberErrInfo.telErr.errInfo = '* 不能为空';
			_haveErr = true;
		}else if(!tel_RegExp.test($scope.addNewMemberInfo.memberTel)){
			$scope.addNewMemberErrInfo.telErr.isErr = true;
			$scope.addNewMemberErrInfo.telErr.errInfo = '* 格式错误';
			_haveErr = true;
		}
		//验证微信
		var weixin_RegExp = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
		if($.trim($scope.addNewMemberInfo.memberWeixin) == ''){
			$scope.addNewMemberErrInfo.weixinErr.isErr = true;
			$scope.addNewMemberErrInfo.weixinErr.errInfo = '* 不能为空';
			_haveErr = true;
		}else if(!/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test($.trim($scope.addNewMemberInfo.memberWeixin)) && !/^1\d{10}$/.test($.trim($scope.addNewMemberInfo.memberWeixin))){
			$scope.addNewMemberErrInfo.weixinErr.isErr = true;
			$scope.addNewMemberErrInfo.weixinErr.errInfo = '* 格式错误';
			_haveErr = true;
		}
		//验证性别
		if($scope.addNewMemberInfo.memberSex == ''){
			$scope.addNewMemberErrInfo.sexErr.isErr = true;
			$scope.addNewMemberErrInfo.sexErr.errInfo = '* 请选择性别';
			_haveErr = true;
		}
		//验证生日
		if($.trim($scope.addNewMemberInfo.memberBirthday) == ''){
			$scope.addNewMemberErrInfo.birthdayErr.isErr = true;
			$scope.addNewMemberErrInfo.birthdayErr.errInfo = '* 请选择出生日期';
			_haveErr = true;
		}
		//验证会员等级
		if($scope.addNewMemberInfo.memberClass == '0'){
			$scope.addNewMemberErrInfo.classErr.isErr = true;
			$scope.addNewMemberErrInfo.classErr.errInfo = '* 请选择会员等级';
			_haveErr = true;
		}
		if(_haveErr){//填写信息有误
			return
		}
		//发送添加请求
		var _post_newMemberData = {
			names:$.trim($scope.addNewMemberInfo.memberName),
			phone:$.trim($scope.addNewMemberInfo.memberTel),
			wechat:$.trim($scope.addNewMemberInfo.memberWeixin),
			sex:$scope.addNewMemberInfo.memberSex,
			birthday:$.trim($scope.addNewMemberInfo.memberBirthday),
			classid:$scope.addNewMemberInfo.memberClass
		}
		console.log(_post_newMemberData)
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/AddStoreVip",
			data:_post_newMemberData,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('请求添加新会员返回数据',data)
			if(data.state == 'SUCCESS'){//新会员添加成功
				$scope.memberAlertView.codeImageView = true;
				$scope.addNewMemberInfo.memberID = data.id;
				$scope.getMemberCode(data.id);//获取绑定二维码
				// $scope.closeAddNewMemberView();
				// $scope.refreshMemberData();//刷新会员列表数据
			}else if(data.state == 'ERROR' && data.errorcode == '1'){
				$scope.addNewMemberErrInfo.telErr.isErr = true;
				$scope.addNewMemberErrInfo.telErr.errInfo = '* 已被注册';
			}else{//新会员添加失败
				alert('发生错误，请稍后再试')
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		})
	}
	/**
	 * 获取会员绑定微信二维码
	 * id 为没绑定成功的会员id，需要删除掉
	 */
	var _memberCodeTimer;
	$scope.getMemberCode = function(){
		setTimeout(function(){
			$('#memberCodeImage').attr("src","http://" + $rootScope.myHost + "/Home/Index/VipBindingWechat" + "?" + Math.random());
		},1);
		var _count = 0;//计数
		_memberCodeTimer = setInterval(function(){
			_count++;
			if(_count > 90){
				$scope.memberAlertView.codeImageView = false;
				clearInterval(_memberCodeTimer);
				$scope.closeMemberCodeImageView();
			}
			if(_count % 30 == 0){//每过60秒刷新二维码
				$('#memberCodeImage').attr("src","http://" + $rootScope.myHost + "/Home/Index/VipBindingWechat" + "?" + Math.random());
			}
			$http.post("http://" + $rootScope.myHost + "/Home/Index/CheckVipBinding").success(function(data){
				console.log('获取会员绑定情况',data.state);
				if(data.state == 'SUCCESS'){
					$scope.memberAlertView.codeImageView = false;//关闭二维码显示窗口
					clearInterval(_memberCodeTimer);
					alert("会员添加成功");
					$scope.memberAlertView.codeImageView = false;//关闭二维码弹窗
					$scope.closeAddNewMemberView();//关闭添加会员弹窗
					$scope.refreshMemberData();//刷新会员列表数据
				}
			}).error(function(data){
				console.log("获取技师绑定情况发生错误",data);
			})
		},2000);
	}
	/**
	 * 关闭会员二维码窗口
	 * @return {[type]} [description]
	 */
	$scope.closeMemberCodeImageView = function(){
		var id = $scope.addNewMemberInfo.memberID;
		//发送请求，删除刚添加进去的会员信息
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/DeleteStoreVip",
			data:{id:id},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('请求删除刚添加的会员返回数据',data)
			if(data.state == 'SUCCESS'){//新会员添加成功
				alert("未绑定二维码，添加会员失败");
			}
		}).error(function(){
			//删除没绑定微信的会员信息失败
		})
		clearInterval(_memberCodeTimer);
		$scope.memberAlertView.codeImageView = false;
		$scope.refreshMemberData();//刷新会员列表数据
	}
	/*********** 新增会员功能 end ****************/

}])