/*技师管理controller*/
projectB.controller('TechnicianController',['$scope','$http','$rootScope','fileReader',function($scope,$http,$rootScope,fileReader){
	//重置headerInfo显示
	$scope.$parent.changeHeaderInfo('technicianPageIndex');

	//技师板块下主要界面显示标记
	$scope.technicianPageShow = [true,false];//技师板块下technician-page-index，technician-page-info(技师详情界面)界面显示标记

	//技师板块下ng-switch的变量($scope.technicianContent)
	$scope.technicianContent = 'technicianContentAll';
	
	/**
	 * technician模块下弹窗显示标记
	 * addTechnicianKinds  		添加服务分类弹窗
	 * codeImageView 			二维码弹窗
	 * delTechnicianView 		删除技师确定弹窗
	 * @type {Object}
	 */
	$scope.technicianAlertView = {
		addTechnicianKinds:false,
		codeImageView:false,
		delTechnicianView:false,
	}

	/*************** 技师管理首页 start ***************/
	/**
	 * 技师管理首页信息
	 * listTitle 		列表title
	 * searchText 		搜索框内容
	 * searchState 		需要显示的技师状态
	 * kindsList 		技师状态分类列表
	 * technicianList 	技师列表数据
	 * 		id 				技师的id
	 * 		names 			技师姓名
	 * 		number 			技师编号
	 * 		sex 			技师性别
	 * 		state 			技师状态(1:空闲，2:忙碌，3:请假，4:锁定)
	 * 		info 			技师服务对象详情
	 * 		age 			技师年龄
	 * @type {Object}
	 */
	$scope.technicianIndexPageInfo = {
		listTitle:'全部技师',
		searchText:'',
		searchState:'',
		kindsList:[{id:'1',name:'空闲'},{id:'2',name:'忙碌'},{id:'3',name:'请假'},{id:'4',name:'锁定'}],
		technicianList:[]
	}
	/**
	 * 获取全部技师数据
	 * @return {[type]} [description]
	 */
	$scope.refreshTechnicianData = function(){
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetTccList",
			data:{},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('获取技师列表数据',data);
			if(data.state == 'SUCCESS'){
				$scope.technicianIndexPageInfo.technicianList = data.data;
			}else{
				alert('发生错误，' + data.errormsg)
			}
		}).error(function(data){
			console.log(data);
			alert('网络故障！');
		})
	}
	$scope.refreshTechnicianData();//刷新技师列表数据
	/**
	 * 点击技师分类列表
	 * @return {[type]} [description]
	 */
	$scope.changeTechnicianSelect = function(technicianKind,kindName){
		$scope.technicianIndexPageInfo.searchState = technicianKind;
		$scope.technicianIndexPageInfo.listTitle = kindName;
	}
	/**
	 * 技师列表过滤函数
	 * @return {[type]} [description]
	 */
	$scope.filterTechnician = function(){
		var _filter = {
			names:$scope.technicianIndexPageInfo.searchText,
			state:$scope.technicianIndexPageInfo.searchState,
		}
		return _filter
	}
	/*************** 技师管理首页 end ***************/

	/*************** 增加技师服务分类 start ***************/
	/**
	 * 显示增加技师服务分类界面
	 * @return {[type]} [description]
	 */
	$scope.showAddTechnicianKindsView = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.technicianAlertView.addTechnicianKinds = true;
	}
	/**
	 * 隐藏增加技师服务分类界面
	 * @return {[type]} [description]
	 */
	$scope.closeAddTechnicianKindsView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.technicianAlertView.addTechnicianKinds = false;
	}
	/*************** 增加技师服务分类 end *************/

	/*************** 技师详情 start ***************/
	/**
	 * 技师详情信息
	 * technicianID 		技师id
	 * techInfo 			技师详情
	 * 		id 					技师id
	 * 		birthday 			技师生日
	 * 		category 			技师服务项目(id)
	 * 		content 			技师简介
	 * 		imageurl 			技师图片地址
	 * 		names 				技师名称
	 * 		number 				技师编号
	 * 		numberof 			服务次数
	 * 		phone 				技师电话
	 * 		server 				技师服务项目(中文)
	 * 		sex 				技师性别(1:男，2:女)
	 * 		state 				技师状态(空闲，忙碌，请假，锁定)
	 * 		times 				记录时间
	 * 		wechat 				技师微信号
	 * techRecord 			技师上钟记录
	 * 		handname 			手牌号
	 * 		id 					这条记录的id
	 * 		money 				上钟项目的金额
	 * 		room 				房间号
	 * 		score 				评分
	 * 		servertime 			服务时长
	 * 		starttime 			服务开始时间
	 * @type {Object}
	 */
	$scope.resetTechnicianPageInfo = function(){
		$scope.technicianPageInfo = {
			technicianID:'',
			techInfo:'',
			techRecord:[]
		}
	}
	$scope.resetTechnicianPageInfo();//重置技师详情页信息
	/**
	 * 显示技师详情界面
	 * @return {[type]} [description]
	 */
	$scope.showTechnicianPageInfo = function(id){
		$scope.technicianPageInfo.technicianID = id;
		$scope.technicianPageShow = [false,true];//[主界面，商品详情界面]
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetTccInfo",
			data:{id:$scope.technicianPageInfo.technicianID},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log("请求技师详情返回数据",data);
			if(data.state == 'SUCCESS'){
				$scope.technicianPageInfo.techInfo = data.tccinfo;
				$scope.technicianPageInfo.techRecord = data.record;
				$scope.technicianPageInfo.techInfo.imageurl = $scope.technicianPageInfo.techInfo.imageurl.substring(1);
			}else{
				alert("发生错误，请稍后再试");
			}
		}).error(function(data){
			alert("网络错误，请稍后再试");
		})
	}
	/**
	 * 隐藏技师详情界面
	 * @return {[type]} [description]
	 */
	$scope.closeTechnicianPageInfo = function(){
		$scope.technicianPageShow = [true,false];//[主界面，商品详情界面]
		$scope.technicianContent = 'technicianContentAll';//修改技师管理下的ng-switch显示
		$scope.resetTechnicianPageInfo();//重置技师详情页信息
	}
	/*************** 技师详情 end ***************/

	/*************** 删除技师 start ***************/
	/**
	 * 删除技师信息
	 * name 		需要删除技师的名称
	 * id 			需要删除技师的ID
	 * number 		需要删除技师的编号
	 * @type {Object}
	 */
	$scope.delTechnicianInfo = {
		name:'',
		id:'',
		number:''
	}
	/**
	 * 删除技师按钮
	 * @param  {string} technicianID   		技师的id
	 * @param  {string} technicianName 		技师的名称
	 * @param  {string} technicianNumber 	技师的编号
	 * @return {[type]}                [description]
	 */
	$scope.deleteTechnician = function(technicianID,technicianName,technicianNumber){
		$rootScope.maskLayer = true;
		$scope.technicianAlertView.delTechnicianView = true;
		$scope.delTechnicianInfo = {
			name:technicianName,
			id:technicianID,
			number:technicianNumber
		}
	}
	/**
	 * 确定删除技师
	 * @return {[type]} [description]
	 */
	$scope.makeDelTechnician = function(){
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/TccDelete",
			data:{id:$scope.delTechnicianInfo.id},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			if(data.state == 'SUCCESS'){
				alert($scope.delTechnicianInfo.name + ' 技师删除成功');
				$scope.closeDelTechnicianView();
				$scope.refreshTechnicianData();//刷新技师列表
			}else{
				alert("发生错误，请稍后再试");
			}
		}).error(function(data){
			alert("网络错误，请稍后再试");
		})
	}
	/**
	 * 关闭删除技师确定弹窗
	 * @return {[type]} [description]
	 */
	$scope.closeDelTechnicianView = function(){
		$rootScope.maskLayer = false;
		$scope.technicianAlertView.delTechnicianView = false;
		$scope.delTechnicianInfo = {
			name:'',
			id:'',
			number:''
		}
	}
	/*************** 删除技师 end ***************/

	/*************** 修改技师按钮 start ***************/
	/**
	 * 修改技师按钮
	 * @return {[type]} [description]
	 */
	$scope.changeTechnicianInfo = function(){
		var technicianData = {
			technicianID:$scope.technicianPageInfo.technicianID,
			imageurl:$scope.technicianPageInfo.techInfo.imageurl,
			name:$scope.technicianPageInfo.techInfo.names,
			sex:$scope.technicianPageInfo.techInfo.sex,
			number:$scope.technicianPageInfo.techInfo.number,
			tel:$scope.technicianPageInfo.techInfo.phone,
			weixin:$scope.technicianPageInfo.techInfo.wechat,
			birthday:$scope.technicianPageInfo.techInfo.birthday,
			skill:$scope.technicianPageInfo.techInfo.category,
			lock:$scope.technicianPageInfo.techInfo.state,
			intro:$scope.technicianPageInfo.techInfo.content
		}
		$scope.technicianPageShow = [true,false];//[主界面，商品详情界面]
		$scope.technicianContent = 'technicianEdit';
		$scope.showEditTechnicianView(technicianData);
	}
	/*************** 修改技师按钮 end ***************/

	/*************** 编辑技师 start ***************/
	/**
	 * 编辑技师信息
	 * technicianID 	技师ID
	 * titleName 		编辑页面的title信息
	 * imgFile   		用来存储图片文件
	 * imageSrc  		图片的链接地址
	 * imageUrl  		图片上传后的线上地址
	 * name 			技师姓名
	 * sex 				技师性别
	 * number 			技师编号
	 * tel 				技师手机号码
	 * weixin 			技师微信
	 * birthday 		技师出生日期
	 * skill 			技师服务项目
	 * 		id 				服务项目的id
	 * 		name 			服务项目的名称
	 * 		select 			是否选中
	 * lock 			是否锁定
	 * intro 			技师简介
	 * codeImage 		二维码图片
	 * codeImageShow 	二维码图片显示标记
	 * @type {Object}
	 */
	$scope.resetEditTechnicianInfo = function(){
		$scope.editTechnicianInfo = {
			technicianID:'',
			titleName:'',
			imgFile:'',
			imageSrc:'',
			imageUrl:'',
			name:'',
			sex:'',
			number:'',
			tel:'',
			weixin:'',
			birthday:'',
			skill:[],
			lock:'0',
			intro:'',
			codeImage:'',
			codeImageShow:false
		}
	}
	$scope.resetEditTechnicianInfo();
	/**
	 * 显示技师信息编辑页面
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	$scope.showEditTechnicianView = function(technicianData){
		$scope.resetEditTechnicianInfo();
		//获取技师服务列表
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetProductCategory",
			data:{state:'2'},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('请求技师服务列表的返回数据',data);
			if (data.state == 'SUCCESS') {
				$scope.editTechnicianInfo.skill = [];
				if (technicianData) {//修改技师信息，技师服务选择框
					//处理技师服务多选框信息
					for(var i = 0,len = data.data.length; i < len; i++){
						var _have = false;
						for(var j = 0,length = technicianData.skill.length; j < length; j++){
							if(data.data[i]['id'] == technicianData.skill[j]){
								var _skill = {
									id:data.data[i]['id'],
									name:data.data[i]['catename'],
									select:true
								}
								_have = true;
								$scope.editTechnicianInfo.skill.push(_skill);
							}
						}
						if(!_have){
							var _skill = {
								id:data.data[i]['id'],
								name:data.data[i]['catename'],
								select:false
							}
							$scope.editTechnicianInfo.skill.push(_skill);
						}
					}
				}else{//新加技师，技师服务选择框
					for(var i = 0,len = data.data.length; i < len; i++){
						var _skill = {
							id:data.data[i]['id'],
							name:data.data[i]['catename'],
							select:false
						}
						$scope.editTechnicianInfo.skill.push(_skill);
					}
				};
			}else{
				alert('发生错误')
			};
		}).error(function(){
			alert('发生错误，请稍后再试')
		})
		if (technicianData) {
			var _time = new Date();
			_time.setTime(technicianData.birthday*1000);
			var YY = _time.getFullYear();
			var MM = _time.getMonth() + 1;
			var DD = _time.getDate();
			var _birthdayStr = YY + '-' + MM + '-' + DD;
			$scope.editTechnicianInfo.titleName    = '修改技师信息';
			$scope.editTechnicianInfo.technicianID = technicianData.technicianID;
			$scope.editTechnicianInfo.imageSrc     = technicianData.imageurl;
			$scope.editTechnicianInfo.name         = technicianData.name;
			$scope.editTechnicianInfo.sex          = technicianData.sex;
			$scope.editTechnicianInfo.number       = technicianData.number;
			$scope.editTechnicianInfo.tel          = technicianData.tel;
			$scope.editTechnicianInfo.weixin       = technicianData.weixin;
			$scope.editTechnicianInfo.birthday     = _birthdayStr;
			$scope.editTechnicianInfo.lock         = technicianData.lock == '4' ? '4' : '1';
			$scope.editTechnicianInfo.intro        = technicianData.intro;
		}else{
			$scope.editTechnicianInfo.titleName = '添加技师';
		}
	}
	/**
	 * 保存编辑按钮
	 * @return {[type]} [description]
	 */
	$scope.makeEditTechnician = function(){
		//验证技师图片
		if($scope.editTechnicianInfo.technicianID){//修改技师信息时
			if($scope.editTechnicianInfo.imgFile){//修改了图片文件
				if($scope.editTechnicianInfo.imgFile.type != 'image/jpg' && $scope.editTechnicianInfo.imgFile.type != 'image/png' && $scope.editTechnicianInfo.imgFile.type != 'image/jpeg'){
					alert('图片格式不对！格式应为jpg、png、jpeg')
					return
				}else if($scope.editTechnicianInfo.imgFile.size > (2*1024*1024)){
					alert('图片太大，2M内')
					return
				}
			}
		}else{//新加技师时
			if($scope.editTechnicianInfo.imgFile == ''){
				alert("请选择上传图片");
				return
			}else if($scope.editTechnicianInfo.imgFile.type != 'image/jpg' && $scope.editTechnicianInfo.imgFile.type != 'image/png' && $scope.editTechnicianInfo.imgFile.type != 'image/jpeg'){
				alert('图片格式不对！格式应为jpg、png、jpeg')
				return
			}else if($scope.editTechnicianInfo.imgFile.size > (2*1024*1024)){
				alert('图片太大，2M内')
				return
			}
		}
		//验证技师名字
		if($.trim($scope.editTechnicianInfo.name) == ''){
			alert("请输入技师名称");
			return
		}
		//验证技师性别
		if($.trim($scope.editTechnicianInfo.sex) == ''){
			alert("请选择技师性别");
			return
		}
		//验证技师编号
		var technicianNumber_RegExp = /^[a-zA-Z0-9]{1,}$/;
		if($.trim($scope.editTechnicianInfo.number) == ''){
			alert("请填写技师编号");
			return
		}else if(!technicianNumber_RegExp.test($scope.editTechnicianInfo.number)){
			alert("技师编号格式错误，只能数字和字母");
			return
		}
		//验证技师号码是否被占用
		var _isSameNumber = false;
		if($scope.editTechnicianInfo.technicianID){//修改情况下
			var _checkTccNumber = {id:$scope.editTechnicianInfo.technicianID,number:$.trim($scope.editTechnicianInfo.number)}
		}else{//新增情况下
			var _checkTccNumber = {number:$.trim($scope.editTechnicianInfo.number)}
		}
		$.ajax({
			type:"POST",
			async: false,
			url: "http://" + $rootScope.myHost + "/Home/Index/CheckTccNumber",
			data:_checkTccNumber,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			success:function(data){
				console.log('验证技师号码是否被占用',data);
				var checkData = JSON.parse(data);
				if(checkData.state == 'ERROR'){
					alert('发生错误,' + checkData.errormsg);
					_isSameNumber = true;
				}else{
					
				}
			},
			error:function(data){
				console.log(data);
				alert('网络故障！');
				_isSameNumber = true;
			}
		})
		if(_isSameNumber){
			return
		}
		//验证技师电话号码
		var tel_RegExp = /^1\d{10}$/;
		if(!tel_RegExp.test($scope.editTechnicianInfo.tel)){
			alert("手机号码填写错误");
			return
		}
		//验证技师微信号
		if($.trim($scope.editTechnicianInfo.weixin) == ''){
			alert("请填写微信号");
			return
		}else if(!/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test($.trim($scope.editTechnicianInfo.weixin)) && !/^1\d{10}$/.test($.trim($scope.editTechnicianInfo.weixin))){
			alert("微信号错误");
			return
		}
		//验证技师生日
		if($.trim($('#technicianBirthday').val()) == ''){
			alert("请选择技师出生日期");
			return
		}else{
			$scope.editTechnicianInfo.birthday = $.trim($('#technicianBirthday').val());
		}
		//验证是否选择服务
		var skill_select = false;
		for(var i = 0,len = $scope.editTechnicianInfo.skill.length;i < len;i++){
			if($scope.editTechnicianInfo.skill[i]['select']){
				skill_select = true;
				break
			}
		}
		if(!skill_select){
			alert('请选择技师服务');
			return
		}
		//验证是否锁定
		if($scope.editTechnicianInfo.lock == '0'){
			alert("请选择是否锁定技师");
			return
		}
		//验证技师简介
		if($.trim($scope.editTechnicianInfo.intro) == ''){
			alert("请填写技师简介");
			return
		}
		/**
		 * 获取编辑技师的信息(用于向后台发送新增技师或者修改技师数据)
		 * 有technicianID参数时为修改技师
		 * 无technicianID参数时为新增技师
		 * @return {[type]} [description]
		 */
		function getEditTechnicianData(technicianID){
			//处理服务项目数据
			var servers_data = [];
			for(var i = 0,len = $scope.editTechnicianInfo.skill.length;i < len;i++){
				if($scope.editTechnicianInfo.skill[i]['select'] == true){
					servers_data.push($scope.editTechnicianInfo.skill[i]['id']);
				}
			}
			if(technicianID){
				var newTechnicianInfo = {
					id:technicianID,
					imageurl:$scope.editTechnicianInfo.imageUrl,
					names:$.trim($scope.editTechnicianInfo.name),
					sex:$scope.editTechnicianInfo.sex,
					phone:$scope.editTechnicianInfo.tel,
					wechat:$scope.editTechnicianInfo.weixin,
					birthday:$scope.editTechnicianInfo.birthday,
					content:$scope.editTechnicianInfo.intro,
					category:servers_data,
					number:$.trim($scope.editTechnicianInfo.number),
					state:$scope.editTechnicianInfo.lock
				}
			}else{
				var newTechnicianInfo = {
					imageurl:$scope.editTechnicianInfo.imageUrl,
					names:$.trim($scope.editTechnicianInfo.name),
					sex:$scope.editTechnicianInfo.sex,
					phone:$scope.editTechnicianInfo.tel,
					wechat:$scope.editTechnicianInfo.weixin,
					birthday:$scope.editTechnicianInfo.birthday,
					content:$scope.editTechnicianInfo.intro,
					category:servers_data,
					number:$.trim($scope.editTechnicianInfo.number),
					state:$scope.editTechnicianInfo.lock
				}
			}
			return newTechnicianInfo
		}
		//新加技师，修改技师请求
		if($scope.editTechnicianInfo.technicianID && $scope.editTechnicianInfo.imgFile == ''){//修改技师，且没有修改图片情况
			$scope.editTechnicianInfo.imageUrl = '.' + $scope.editTechnicianInfo.imageSrc;
			var technician_data = getEditTechnicianData($scope.editTechnicianInfo.technicianID);
			console.log(technician_data)
			//发送修改技师请求
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/EditTcc",
				data:technician_data,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(data){
					return $.param(data);
				}
			}).success(function(re){
				console.log('修改技师返回数据',re)
				if(re.state == 'SUCCESS' && re.code == '1'){//新技师修改成功，且需要绑定微信
					$scope.getTechnicianCode();//调用获取二维码函数，技师绑定微信
				}else if(re.state == 'SUCCESS' && re.code != '1'){
					alert('修改技师信息成功');
					$scope.refreshTechnicianData();//刷新技师数据
					$scope.closeEditTechnicianView();
					$scope.technicianContent = 'technicianContentAll';//显示全部技师列表界面
					$scope.showTechnicianPageInfo($scope.technicianPageInfo.technicianID);//回到技师详情页
				}else{//修改技师信息失败
					alert('发生错误，请稍后再试');
				}
			}).error(function(){
				//失败
				alert('发生错误，请稍后再试')
			})
		}else{//新加技师，或者修改技师并且换了图片的情况，先上传图片
			var img_data = new FormData();
			img_data.append('image',$scope.editTechnicianInfo.imgFile);
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/ImgUpload",
				data:img_data,
				headers: { 'Content-Type': undefined},
				transformRequest: angular.identity
			}).success(function(data,status){
				if(data.state == "SUCCESS"){//上传图片成功后
					$scope.editTechnicianInfo.imageUrl = data.imgurl;
					if($scope.editTechnicianInfo.technicianID){//修改的情况
						var technician_data = getEditTechnicianData($scope.editTechnicianInfo.technicianID);
						//发送修改技师信息请求
						$http({
							method:"POST",
							url: "http://" + $rootScope.myHost + "/Home/Index/EditTcc",
							data:technician_data,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							transformRequest: function(data){
								return $.param(data);
							}
						}).success(function(re){
							console.log('修改技师(修改了图片)返回数据',re)
							if(re.state == 'SUCCESS' && re.code == '1'){//技师修改成功，且需要绑定微信
								$scope.getTechnicianCode();//调用获取二维码函数，技师绑定微信
							}else if(re.state == 'SUCCESS' && re.code != '1'){
								alert('修改技师信息成功');
								$scope.refreshTechnicianData();//刷新技师数据
								$scope.closeEditTechnicianView();
								$scope.showEditTechnicianView();
							}else{//修改技师信息失败
								alert('发生错误，请稍后再试');
							}
						}).error(function(){
							//失败
							alert('发生错误，请稍后再试')
						})
					}else{//新增的情况
						var technician_data = getEditTechnicianData();
						//发送添加技师请求
						$http({
							method:"POST",
							url: "http://" + $rootScope.myHost + "/Home/Index/AddTcc",
							data:technician_data,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							transformRequest: function(data){
								return $.param(data);
							}
						}).success(function(re){
							console.log('添加技师信息返回数据',re)
							if(re.state == 'SUCCESS' && re.code == '1'){//新技师添加成功
								$scope.getTechnicianCode();//调用获取二维码函数，技师绑定微信
							}else if(re.state == 'SUCCESS' && re.code != '1'){
								alert('新增技师成功,该技师为锁定状态');
								$scope.refreshTechnicianData();//刷新技师数据
								$scope.closeEditTechnicianView();
								$scope.showEditTechnicianView();
							}else{//新技师添加失败
								alert('发生错误，请稍后再试')
							}
						}).error(function(){
							//失败
							alert('发生错误，请稍后再试')
						})
					}
				}else{//上传图片失败
					alert('发生错误！请稍后再试');
				}
			}).error(function(){
				alert("发生错误！请稍后再试");
			})
		}
		console.log($scope.editTechnicianInfo)
	}
	//获取二维码，技师绑定微信
	$scope.getTechnicianCode = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.technicianAlertView.codeImageView = true;//二维码弹窗
		$scope.editTechnicianInfo.codeImageShow = true;//二维码图片
		var _count = 0;//计数
		setTimeout(function(){
			$('#technicianCodeImage').attr("src","http://" + $rootScope.myHost + "/Home/Index/TccBindingWechat" +"?"+Math.random());
		},10);
		_technicianCodeTimer = setInterval(function(){
			_count++;
			if(_count > 90){
				$scope.closeCodeImageView();
			}
			if(_count % 30 == 0){//每过60秒刷新二维码
				$('#technicianCodeImage').attr("src","http://" + $rootScope.myHost + "/Home/Index/TccBindingWechat" +"?"+Math.random());
			}
			$http.post("http://" + $rootScope.myHost + "/Home/Index/CheckTccBinding").success(function(data){
				console.log('获取技师绑定情况',data.state);
				if(data.state == 'SUCCESS'){
					$scope.closeCodeImageView(data.state);//关闭二维码显示窗口
				}
			}).error(function(data){
				console.log("获取技师绑定情况发生错误",data);
			})
		},2000);
	}

	$scope.getFile = function (file) {
		fileReader.readAsDataUrl(file, $scope).then(function(result) {
			$scope.editTechnicianInfo.imageSrc = result;
		});
		$scope.editTechnicianInfo.imgFile = file;
	};
	/**
	 * 关闭编辑技师界面
	 * @return {[type]} [description]
	 */
	$scope.closeEditTechnicianView = function(){
		$scope.resetEditTechnicianInfo();//重置技师编辑页面信息
	}
	/**
	 * 技师性别选择函数
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	$scope.selectTechnicianSex = function(sex){
		$scope.editTechnicianInfo.sex = sex;
	}
	/**
	 * 选则技师服务
	 * @param  {string} technicianID 技师服务项目的id
	 * @return {[type]}              [description]
	 */
	$scope.selectTechnicianSkill = function(technicianID){
		for(var i = 0,len = $scope.editTechnicianInfo.skill.length; i < len; i++){
			if(technicianID == $scope.editTechnicianInfo.skill[i]['id']){
				$scope.editTechnicianInfo.skill[i]['select'] = !$scope.editTechnicianInfo.skill[i]['select'];
			}
		}
	}
	/**
	 * 关闭技师绑定微信的二维码显示窗口
	 * @param  {string} state 如果绑定成功state为‘SUCCESS’，没绑定成功则为空
	 * @return {[type]}       [description]
	 */
	var _technicianCodeTimer;//循环改变二维码的timer
	$scope.closeCodeImageView = function(state){
		clearInterval(_technicianCodeTimer);
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.technicianAlertView.codeImageView = false;
		$scope.refreshTechnicianData();//刷新技师数据
		$scope.closeEditTechnicianView();
		$scope.showEditTechnicianView();
		if(state == 'SUCCESS'){
			alert("技师添加成功，微信绑定成功");
		}else{
			alert("技师添加成功，微信绑定失败");
		}
	}
	/*************** 添加技师 end ***************/
}])