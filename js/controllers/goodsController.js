
/*商品管理controller*/
projectB.controller('GoodsController',['$scope','$http','$rootScope','fileReader',function($scope,$http,$rootScope,fileReader){
	//重置headerInfo显示
	$scope.$parent.changeHeaderInfo('goodsPageIndex');

	//member下主要界面显示标记
	$scope.goodsPageShow = [true,false];//goods下goods-page-index，goods-page-info(商品详情界面)界面显示标记
	/**
	 * goods模块下弹窗显示标记
	 * addGoodsKinds 添加商品分类弹窗
	 * @type {Object}
	 */
	$scope.goodsAlertView = {
		addGoodsKindsView:false
	}

	/*************** 商品管理首页 start ***************/
	/**
	 * 商品管理首页信息
	 * goodsListTitle  goods列表显示的title
	 * selectGoodsKind 选中的分类商品
	 * allGoodsList    全部商品数据
	 * 		id 				商品id
	 * 		pname 	   		商品名称
	 * 		money 			商品单价
	 * 		catename 		商品分类
	 * 		starttime 		开始供应时间
	 * 		endtime 		结束供应时间
	 * goodsKindsList  商品分类列表
	 * 		id       		商品分类名称的id
	 * 		catename 		商品分类名称
	 * @type {Object}
	 */
	$scope.indexPageInfo = {
		goodsListTitle:'全部商品',
		selectGoodsKind: '',
		allGoodsList:[],
		goodsKindsList:[]
	}
	//goods板块下的ng-switch
	$scope.goodsContent = 'goodsContentAll';
	//获取全部商品数据
	$scope.refreshGoodsData = function(){
		$http.post("http://" + $rootScope.myHost + "/Home/Index/GetProducts").success(function(data){
			console.log('获取商品数据',data);
			if(data.state == 'SUCCESS'){
				$scope.indexPageInfo.allGoodsList = data.data;
			}
		}).error(function(data){
			console.log(data);
			alert('网络故障！');
		})
	}
	$scope.refreshGoodsData();//刷新商品数据

	//获取商品分类列表
	$http.post("http://" + $rootScope.myHost + "/Home/Index/GetProductCategory").success(function(data){
		console.log('获取商品分类列表数据',data);
		$scope.indexPageInfo.goodsKindsList = data.data;
	}).error(function(data){
		console.log(data);
		alert('网络故障！');
	})
	/**
	 * 显示选择的分类的商品
	 * @param  {string} goodsKind 商品分类
	 * @return {[type]}           [description]
	 */
	$scope.changeSelectGoodsKind = function(goodsKind){
		$scope.indexPageInfo.selectGoodsKind = goodsKind;
		$scope.closeEditGoodsView();
		if(goodsKind == ''){
			$scope.indexPageInfo.goodsListTitle = '全部商品';
		}else{
			$scope.indexPageInfo.goodsListTitle = goodsKind;
		}
	}
	/**
	 * 修改商品过滤规则
	 * @param  {string} goodsKind 商品分类
	 * @return {[type]}           [description]
	 */
	$scope.goodsFilter = function(goodsKind){
		var searchObj = {};
		searchObj["catename"] = goodsKind;
		return searchObj;
	}
	/*************** 商品管理首页 end ***************/

	/*************** 增加商品分类 start ***************/
	/**
	 * 增加商品分类信息
	 * kindName 商品类别名称
	 * state    是否需要技师（1否，2是）
	 * @type {Object}
	 */
	$scope.addGoodsKindsInfo = {
		kindName:'',
		state:''
	}
	/**
	 * 增加商品分类的分类名称错误
	 * @type {Object}
	 */
	$scope.addGoodsKinds_nameErr = {
		isErr:false,
		errInfo:''
	}
	/**
	 * 增加商品分类中是否需要技师的信息错误
	 * @type {Object}
	 */
	$scope.addGoodsKinds_needErr = {
		isErr:false,
		errInfo:''
	}
	/**
	 * 显示增加商品分类界面
	 * @return {[type]} [description]
	 */
	$scope.showAddGoodsKindsView = function(){
		$rootScope.maskLayer = true;//显示遮罩层
		$scope.goodsAlertView.addGoodsKindsView = true;
	}
	/**
	 * 隐藏商品分类界面
	 * @return {[type]} [description]
	 */
	$scope.closeAddGoodsKindsView = function(){
		$rootScope.maskLayer = false;//隐藏遮罩层
		$scope.goodsAlertView.addGoodsKindsView = false;
		//重置增加商品分类信息
		$scope.addGoodsKindsInfo = {
			kindName:'',
			state:''
		}
		//重置错误信息
		$scope.addGoodsKinds_nameErr = {
			isErr:false,
			errInfo:''
		}
		$scope.addGoodsKinds_needErr = {
			isErr:false,
			errInfo:''
		}
	}
	/**
	 * 确定增加商品分类
	 * @return {[type]} [description]
	 */
	$scope.makeAddGoodsKinds = function(){
		console.log($scope.addGoodsKindsInfo)
		var _canMake = true;
		var kindsName_RegExp = /[*?:"<>\/\\\|]/;//不能含有【*,?,:,",<,>,/,\,|】
		//验证增加分类名称
		if($scope.addGoodsKindsInfo.kindName == ''){
			$scope.addGoodsKinds_nameErr = {
				isErr:true,
				errInfo:'* 分类名称不能为空！'
			}
			_canMake = false;
		}else if(kindsName_RegExp.test($scope.addGoodsKindsInfo.kindName)){
			$scope.addGoodsKinds_nameErr = {
				isErr:true,
				errInfo:'* 含有非法字符！'
			}
			_canMake = false;
		}else{
			$scope.addGoodsKinds_nameErr = {
				isErr:false,
				errInfo:''
			}
		}
		//验证是否选择需要技师选项
		if($scope.addGoodsKindsInfo.state == ''){
			$scope.addGoodsKinds_needErr = {
				isErr:true,
				errInfo:'* 请选择是否需要技师！'
			}
			_canMake = false;
		}else{
			$scope.addGoodsKinds_needErr = {
				isErr:false,
				errInfo:''
			}
		}
		//判断是否能向后台发送请求
		if(_canMake){
			var data = {
				catename:$scope.addGoodsKindsInfo.kindName,
				state:$scope.addGoodsKindsInfo.state
			}
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/AddProductCategory",
				data:data,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(data){
					return $.param(data);
				}
			}).success(function(data){
				console.log('请求增加商品分类返回数据',data)
				if(data.state == 'SUCCESS'){//平板设备添加成功
					alert('请求增加商品分类成功！');
					$scope.closeAddGoodsKindsView();
				}else{//平板设备添加失败
					alert('发生错误，' + data.errormsg)
				}
			}).error(function(){
				//失败
				alert('发生错误，请稍后再试')
			})
		}
	}
	/*************** 增加商品分类 end *************/

	/*************** 商品详情 start ***************/
	/**
	 * 商品详情信息
	 * goodsData 	商品详情信息
	 * 		category 	商品分类
	 * 		content 	商品简介
	 * 		serverstime 服务时长
	 * 		starttime 	商品供应开始时间
	 * 		endtime 	商品供应结束时间
	 * 		id 			商品id
	 * 		imageurl 	商品图片地址
	 * 		money 		商品价格
	 * 		addmoney 	加钟价格
	 * 		pname 		商品名称
	 * 		sendmsg 	通知设备
	 * 		times 		商品添加时间
	 * vipPrice 	会员价格
	 *  	vipName 	会员等级名称
	 *  	classID 	会员等级id
	 *  	price 		会员价格
	 * @type {Object}
	 */
	$scope.goodsPageInfo = {
		goodsData:{},
		vipPrice:[]
	}
	/**
	 * 显示商品详情界面
	 * @param  {string} goodsID 要显示详情商品的id
	 * @return {[type]}         [description]
	 */
	$scope.showGoodsPageInfo = function(goodsID){
		//获取商品详情数据
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/GetProductInfo",
			data:{id:goodsID},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('请求商品详情返回数据',data)
			if(data.state == 'SUCCESS'){//请求商品详情成功
				$scope.goodsPageInfo.goodsData = data.data;
				$scope.goodsPageInfo.goodsData['imageurl'] = $scope.goodsPageInfo.goodsData['imageurl'].substring(1);//字符串截取，去掉图片路劲的第一个点
				//获取会员等级信息
				$http({
					method:"POST",
					url: "http://" + $rootScope.myHost + "/Home/Index/GetVipClass",
					data:{},
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					transformRequest: function(data){
						return $.param(data);
					}
				}).success(function(re){
					console.log('请求会员等级列表返回数据',re)
					if(re.state == 'SUCCESS'){//平板设备添加成功
						for(var i = 0,len = re.data.length;i < len;i++){
							for(var j = 0,length = $scope.goodsPageInfo.goodsData.vipmoney.length;j < length;j++){
								if(re.data[i]['id'] == $scope.goodsPageInfo.goodsData.vipmoney[j]['classid']){
									var _price = {
										vipName:re.data[i]['vipname'],
										classID:re.data[i]['id'],
										price:$scope.goodsPageInfo.goodsData.vipmoney[j]['money']
									}
									$scope.goodsPageInfo.vipPrice.push(_price);
								}
							}
						}
					}else{//平板设备添加失败
						alert('发生错误，请稍后再试')
					}
				}).error(function(){
					//失败
					alert('发生错误，请稍后再试')
				})
			}else{//请求商品详情失败
				alert('发生错误，' + data.errormsg)
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		})
		
		$scope.goodsPageShow = [false,true];//[主界面，商品详情界面]
	}
	/**
	 * 隐藏商品详情界面
	 * @return {[type]} [description]
	 */
	$scope.closeGoodsPageInfo = function(){
		$scope.goodsPageShow = [true,false];//[主界面，商品详情界面]
		//重置商品详情界面信息
		$scope.goodsPageInfo = {
			goodsData:{},
			vipPrice:[]
		}
	}
	/*************** 商品详情 end ***************/

	/*************** 修改商品 start ***************/
	/**
	 * 修改商品按钮
	 * @return {[type]} [description]
	 */
	$scope.changeGoodsInfo = function(){
		var goodsData = {
			goodsID:$scope.goodsPageInfo.goodsData.id,
			imageurl:$scope.goodsPageInfo.goodsData.imageurl,
			goodsName:$scope.goodsPageInfo.goodsData.pname,
			goodsKind:$scope.goodsPageInfo.goodsData.category,
			serversTime:$scope.goodsPageInfo.goodsData.serverstime,
			addTime:$scope.goodsPageInfo.goodsData.addtime,
			startTime:$scope.goodsPageInfo.goodsData.starttime,
			endTime:$scope.goodsPageInfo.goodsData.endtime,
			goodsCall:$scope.goodsPageInfo.goodsData.sendmsg,
			price:$scope.goodsPageInfo.goodsData.money,
			addPrice:$scope.goodsPageInfo.goodsData.addmoney,
			vipPrice:$scope.goodsPageInfo.vipPrice,
			goodsInfo:$scope.goodsPageInfo.goodsData.content
		}
		$scope.closeGoodsPageInfo();
		$scope.goodsContent = 'goodsEdit';//修改ng-switch
		$scope.showEditGoodsView(goodsData);
	}
	/*************** 修改商品 end ***************/

	/*************** 添加商品 start ***************/
	/**
	 * 添加商品信息
	 * goodsID 		   商品id，修改时才有
	 * title 		   编辑页的title
	 * imgFile		   商品图片
	 * imageSrc		   本地显示的商品图片地址
	 * goodsCall       通知设备
	 * memberClassList 会员等级列表(根据等级数量确定商品价格框的多少)
	 * 		id         		会员等级id
	 * 		vipname 		会员等级名称
	 * padList         平板列表(根据平板数量确定通知设备)
	 * 		id      		平板设备ID
	 * 		padid   		平板设备账号
	 * 		padname 		平板设备名称
	 * imageUrl 	   商品图片地址(图片上传服务器后的线上地址)
	 * goodsName       商品名称
	 * goodsKind       商品分类
	 * serversTime 	   服务时长
	 * addTime 		   加钟时长
	 * isServers  	   存储商品分类的state，判断是否为服务项目(2:是服务项目)
	 * goodsStartTime  商品供应开始时间
	 * goodsEndTime    商品供应结束时间
	 * sendMsg         通知设备(数组)
	 * 		name       		平板设备名称
	 * 		id         		平板设备id
	 * 		select  		是否选择通知此设备(true,false)
	 * goodsPrice      商品价格
	 * addPrice 	   加钟价格
	 * goodsVipPrice   商品会员价格(数组)
	 * 		id   	   		会员等级分类id
	 * 		vipname 		会员等级名称
	 * 		price 			会员价格
	 * goodsInfo       商品简介
	 * @type {Object}
	 */
	$scope.resetEditGoodsInfo = function(){
		$scope.editGoodsInfo = {
			goodsID:'',
			title:'',
			imgFile:'',
			imageSrc:'',
			goodsCall:[],
			memberClassList:[],
			padList:[],
			imageUrl:'',
			goodsName:'',
			goodsKind:'0',
			serversTime:'',
			addTime:'',
			isServers:'',
			goodsStartTime:'',
			goodsEndTime:'',
			sendMsg:[],
			goodsPrice:'',
			addPrice:'',
			goodsVipPrice:[],
			goodsInfo:''
		}
	}
	$scope.resetEditGoodsInfo();
	/**
	 * 显示编辑商品界面
	 * @param  {string} goodsID 商品id
	 * @return {[type]}         [description]
	 */
	$scope.showEditGoodsView = function(goodsData){
		console.log('修改商品时的goodsData',goodsData);
		$scope.resetEditGoodsInfo();//重置添加商品信息
		//获取通知设备列表
		$http.post("http://" + $rootScope.myHost + "/Home/Index/GetPad").success(function(data){
			console.log('获取平板列表数据',data);
			if(data.state == 'SUCCESS'){
				$scope.editGoodsInfo.padList = data.data;
				//根据通知设备的数量设置sendMsg
				$scope.editGoodsInfo.sendMsg = [];//清空
				if(goodsData){
					for(var i = 0,len = data.data.length; i < len; i++){
						var _have = false;
						for(var j = 0,length = goodsData.goodsCall.length; j < length; j++){
							if(data.data[i]['padname'] == goodsData.goodsCall[j]){
								var _pad = {
									name:data.data[i]['padname'],
									id:data.data[i]['id'],
									select:true
								}
								$scope.editGoodsInfo.sendMsg.push(_pad);
								_have = true;
							}
						}
						if(!_have){
							var _pad = {
								name:data.data[i]['padname'],
								id:data.data[i]['id'],
								select:false
							}
							$scope.editGoodsInfo.sendMsg.push(_pad);
						}
					}
				}else{
					for(var i = 0,len = data.data.length; i < len; i++){
						var _pad = {
							name:data.data[i]['padname'],
							id:data.data[i]['id'],
							select:false
						}
						$scope.editGoodsInfo.sendMsg.push(_pad);
					}
				}
			}
		}).error(function(data){
			console.log(data);
			alert('网络故障！');
		})
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
				$scope.editGoodsInfo.memberClassList = data.data;
				//根据会员等级的数量设置goodsVipPrice
				$scope.editGoodsInfo.goodsVipPrice = [];//清空
				if(goodsData){//修改商品时,会员价格的输入框
					for(var i = 0,len = data.data.length;i < len; i++){
						var _have = false;
						for(var j = 0,length = goodsData.vipPrice.length; j < length; j++){
							if(data.data[i]['id'] == goodsData.vipPrice[j]['classID']){
								var _vipPrice = {
									id:data.data[i]['id'],
									vipname:data.data[i]['vipname'],
									price:goodsData.vipPrice[j]['price']/100
								}
								$scope.editGoodsInfo.goodsVipPrice.push(_vipPrice);
								_have = true;
								break
							}
						}
						if(!_have){
							var _vipPrice = {
								id:data.data[i]['id'],
								vipname:data.data[i]['vipname'],
								price:''
							}
							$scope.editGoodsInfo.goodsVipPrice.push(_vipPrice);
						}
					}
				}else{//新添商品时，会员价格的输入框
					for(var i = 0,len = data.data.length; i < len; i++){
						var _vipPrice = {
							id:data.data[i]['id'],
							vipname:data.data[i]['vipname'],
							price:''
						}
						$scope.editGoodsInfo.goodsVipPrice.push(_vipPrice);
					}
				}
				
			}else{//平板设备添加失败
				alert('发生错误，请稍后再试')
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		})
		//判断是添加商品还是修改商品
		if(goodsData){//有goodsID参数时为修改商品
			$scope.editGoodsInfo.goodsID        = goodsData.goodsID;
			$scope.editGoodsInfo.title          = '修改商品';
			$scope.editGoodsInfo.imageSrc       = goodsData.imageurl;
			$scope.editGoodsInfo.goodsName      = goodsData.goodsName;
			$scope.editGoodsInfo.goodsKind      = goodsData.goodsKind;
			$scope.editGoodsInfo.serversTime    = goodsData.serversTime/60;
			$scope.editGoodsInfo.addTime        = goodsData.addTime/60;
			$scope.editGoodsInfo.goodsStartTime = goodsData.startTime;
			$scope.editGoodsInfo.goodsEndTime   = goodsData.endTime;
			$scope.editGoodsInfo.goodsPrice     = goodsData.price/100;
			$scope.editGoodsInfo.addPrice       = goodsData.addPrice/100;
			$scope.editGoodsInfo.goodsInfo      = goodsData.goodsInfo;
			if(goodsData.serversTime > 0){
				$scope.editGoodsInfo.isServers  = '2';
			}
		}else{//无goodsID参数时为添加商品
			$scope.editGoodsInfo.title = '添加商品';
		}
	}
	/**
	 * 当select改变时，改变是否显示服务时长输入框的标记值
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	$scope.selectServers = function(id){
		for(var i = 0,len = $scope.indexPageInfo.goodsKindsList.length;i < len;i++){
			if($scope.indexPageInfo.goodsKindsList[i]['id'] == id){
				$scope.editGoodsInfo.isServers = $scope.indexPageInfo.goodsKindsList[i]['state'];
				return
			}
		}
		$scope.editGoodsInfo.isServers = '0';
	}
	/**
	 * 上传图片
	 * @param  {[type]} file [description]
	 * @return {[type]}      [description]
	 */
	$scope.getFile = function (file) {
		fileReader.readAsDataUrl(file, $scope).then(function(result) {
			$scope.editGoodsInfo.imageSrc = result;
		});
		$scope.editGoodsInfo.imgFile = file;//存储商品图片文件
	};
	/**编辑商品确定按钮
	 * @return {[type]} [description]
	 */
	$scope.makeEditGoods = function(){
		//验证商品图片
		if($scope.editGoodsInfo.goodsID){//修改商品时
			if($scope.editGoodsInfo.imgFile){
				if($scope.editGoodsInfo.imgFile.type != 'image/jpg' && $scope.editGoodsInfo.imgFile.type != 'image/png' && $scope.editGoodsInfo.imgFile.type != 'image/jpeg'){
					alert('图片格式不对！格式应为jpg、png、jpeg')
					return
				}else if($scope.editGoodsInfo.imgFile.size > (2*1024*1024)){
					alert('图片太大，2M内')
					return
				}
			}
		}else{//新加商品时
			if($scope.editGoodsInfo.imgFile == ''){
				alert("请选择商品图片");
				return
			}else if($scope.editGoodsInfo.imgFile.type != 'image/jpg' && $scope.editGoodsInfo.imgFile.type != 'image/png' && $scope.editGoodsInfo.imgFile.type != 'image/jpeg'){
				alert('图片格式不对！格式应为jpg、png、jpeg')
				return
			}else if($scope.editGoodsInfo.imgFile.size > (2*1024*1024)){
				alert('图片太大，2M内')
				return
			}
		}
		
		//验证商品名称
		if($.trim($scope.editGoodsInfo.goodsName) == ''){
			alert("请输入商品名称");
			return
		}
		//验证商品名称是否同名
		var _isSameName = false;
		if($scope.editGoodsInfo.goodsID){
			var _checkName = {
				id:$scope.editGoodsInfo.goodsID,
				pname:$.trim($scope.editGoodsInfo.goodsName)
			}
		}else{
			var _checkName = {
				pname:$.trim($scope.editGoodsInfo.goodsName)
			}
		}
		$.ajax({
			type:"POST",
			async: false,
			url: "http://" + $rootScope.myHost + "/Home/Index/CheckProduct",
			data:_checkName,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			success:function(data){
				console.log('获取验证商品是否同名数据',data);
				var checkData = JSON.parse(data);
				if(checkData.state == 'ERROR'){
					alert('发生错误,' + checkData.errormsg);
					_isSameName = true;
				}else{
					
				}
			},
			error:function(data){
				console.log(data);
				alert('网络故障！');
				_isSameName = true;
			}
		})
		if(_isSameName){
			return
		}
		
		//验证商品分类
		if($scope.editGoodsInfo.goodsKind == '0'){
			alert("请选择商品分类");
			return
		}
		//验证服务时长
		var serversTime_RegExp = /^\d{0,}$/;
		if($scope.editGoodsInfo.isServers == '2'){
			if($.trim($scope.editGoodsInfo.serversTime) == ''){
				alert("请填写服务时长");
				return
			}else if(!serversTime_RegExp.test($scope.editGoodsInfo.serversTime)){
				alert("服务时长错误");
				return
			}else if($scope.editGoodsInfo.serversTime == '0'){
				alert("服务时长不能为0");
				return
			}
		}else{
			$scope.editGoodsInfo.serversTime = '0';
		}
		//验证加钟时长
		if($scope.editGoodsInfo.isServers == '2'){
			if($.trim($scope.editGoodsInfo.addTime) == ''){
				alert("请填写加钟时长");
				return
			}else if(!serversTime_RegExp.test($scope.editGoodsInfo.addTime)){
				alert("加钟时长错误");
				return
			}else if($scope.editGoodsInfo.addTime == '0'){
				alert("加钟时长不能为0");
				return
			}
		}else{
			$scope.editGoodsInfo.addTime = '0';
		}
		//验证供应时间
		if($.trim($('#goodsStartTime').val()) == '' || $.trim($('#goodsEndTime').val()) == ''){
			alert("请选择供应时间");
			return
		}else{
			$scope.editGoodsInfo.goodsStartTime = $.trim($('#goodsStartTime').val());
			$scope.editGoodsInfo.goodsEndTime = $.trim($('#goodsEndTime').val());
		}
		//验证通知设备
		var pad_selected = false;//通知设备是否至少选择一个
		for(var i = 0,len = $scope.editGoodsInfo.sendMsg.length; i < len; i++){
			if($scope.editGoodsInfo.sendMsg[i]['select'] == true){
				pad_selected = true;
				break;
			}
		}
		if(!pad_selected){
			alert('请选择通知设备');
			return
		}
		//验证价格
		if($.trim($scope.editGoodsInfo.goodsPrice) == null || $.trim($scope.editGoodsInfo.goodsPrice) == '' || isNaN($.trim($scope.editGoodsInfo.goodsPrice))){
			alert("价格错误");
			return
		}
		//验证加钟价格
		if($scope.editGoodsInfo.isServers == '2'){
			if($.trim($scope.editGoodsInfo.addPrice) == ''){
				alert("请填写加钟价格");
				return
			}else if(isNaN($.trim($scope.editGoodsInfo.addPrice))){
				alert("加钟价格错误");
				return
			}else if($scope.editGoodsInfo.addPrice == '0'){
				alert("加钟价格不能为0");
				return
			}
		}else{
			$scope.editGoodsInfo.addPrice = '0';
		}
		//验证会员价格
		for(var i = 0, len = $scope.editGoodsInfo.goodsVipPrice.length; i < len; i++){
			if($.trim($scope.editGoodsInfo.goodsVipPrice[i]['price']) == null || $.trim($scope.editGoodsInfo.goodsVipPrice[i]['price']) == '' || isNaN($.trim($scope.editGoodsInfo.goodsVipPrice[i]['price']))){
				alert('会员价格错误');
				return
			}
		}
		//验证商品简介
		if($.trim($scope.editGoodsInfo.goodsInfo) == ''){
			alert('请填写商品简介');
			return
		}

		/**
		 * 获取编辑商品的信息(用于向后台发送新增商品或者修改商品数据)
		 * 有goodsID参数时为修改商品
		 * 无goodsID参数时为新增商品
		 * @return {[type]} [description]
		 */
		function getEditGoodsData(goodsID){
			//处理sendmsg数据
			var sendmsg_data = [];
			for(var i = 0,len = $scope.editGoodsInfo.sendMsg.length;i < len;i++){
				if($scope.editGoodsInfo.sendMsg[i]['select'] == true){
					sendmsg_data.push($scope.editGoodsInfo.sendMsg[i]['id']);
				}
			}
			//处理vipmoney数据
			var vipmoney_data = [];
			for(var i = 0,len = $scope.editGoodsInfo.goodsVipPrice.length;i < len;i++){
				var _money = {
					id:$scope.editGoodsInfo.goodsVipPrice[i]['id'],
					price:$scope.editGoodsInfo.goodsVipPrice[i]['price']
				}
				vipmoney_data.push(_money);
			}
			if(goodsID){
				var newGoodsInfo = {
					id:goodsID,
					imageurl:$scope.editGoodsInfo.imageUrl,
					pname:$.trim($scope.editGoodsInfo.goodsName),
					productcategory:$scope.editGoodsInfo.goodsKind,
					serverstime:$.trim($scope.editGoodsInfo.serversTime),
					addtime:$.trim($scope.editGoodsInfo.addTime),
					starttime:$scope.editGoodsInfo.goodsStartTime,
					endtime:$scope.editGoodsInfo.goodsEndTime,
					sendmsg:sendmsg_data,
					money:$.trim($scope.editGoodsInfo.goodsPrice),
					addmoney:$.trim($scope.editGoodsInfo.addPrice),
					vipmoney:vipmoney_data,
					content:$scope.editGoodsInfo.goodsInfo
				}
			}else{
				var newGoodsInfo = {
					imageurl:$scope.editGoodsInfo.imageUrl,
					pname:$.trim($scope.editGoodsInfo.goodsName),
					productcategory:$scope.editGoodsInfo.goodsKind,
					serverstime:$.trim($scope.editGoodsInfo.serversTime),
					addtime:$.trim($scope.editGoodsInfo.addTime),
					starttime:$scope.editGoodsInfo.goodsStartTime,
					endtime:$scope.editGoodsInfo.goodsEndTime,
					sendmsg:sendmsg_data,
					money:$.trim($scope.editGoodsInfo.goodsPrice),
					addmoney:$.trim($scope.editGoodsInfo.addPrice),
					vipmoney:vipmoney_data,
					content:$scope.editGoodsInfo.goodsInfo
				}
			}
			return newGoodsInfo
		}
		//新加商品，修改商品的请求
		if($scope.editGoodsInfo.goodsID && $scope.editGoodsInfo.imgFile == ''){//修改商品，且没有修改图片情况
			$scope.editGoodsInfo.imageUrl = '.' + $scope.editGoodsInfo.imageSrc;
			var goods_data = getEditGoodsData($scope.editGoodsInfo.goodsID);
			console.log(goods_data)
			//发送添加商品请求
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/EditProduct",
				data:goods_data,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest: function(data){
					return $.param(data);
				}
			}).success(function(re){
				console.log('修改商品返回数据',re)
				if(re.state == 'SUCCESS'){//修改商品成功
					alert('修改商品成功');
					$scope.refreshGoodsData();//刷新商品数据
					$scope.closeEditGoodsView();
					$scope.showEditGoodsView();
				}else{//修改商品失败
					alert('修改商品发生错误，请稍后再试')
				}
			}).error(function(){
				//失败
				alert('发生错误，请稍后再试')
			})
		}else{//新加商品，或者修改商品并且换了图片的情况，先上传图片
			var data = new FormData();
			data.append('image',$scope.editGoodsInfo.imgFile);
			$http({
				method:"POST",
				url: "http://" + $rootScope.myHost + "/Home/Index/ImgUpload",
				data:data,
				headers: { 'Content-Type': undefined},
				transformRequest: angular.identity
			}).success(function(data,status){
				if(data.state == "SUCCESS"){//上传图片成功后
					$scope.editGoodsInfo.imageUrl = data.imgurl;
					if($scope.editGoodsInfo.goodsID){//修改的情况
						var goods_data = getEditGoodsData($scope.editGoodsInfo.goodsID);
						//发送修改商品请求
						$http({
							method:"POST",
							url: "http://" + $rootScope.myHost + "/Home/Index/EditProduct",
							data:goods_data,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							transformRequest: function(data){
								return $.param(data);
							}
						}).success(function(re){
							console.log('修改商品返回数据',re)
							if(re.state == 'SUCCESS'){//新商品添加成功
								alert('修改商品成功');
								$scope.refreshGoodsData();//刷新商品数据
								$scope.closeEditGoodsView();
								$scope.showEditGoodsView();
							}else{//修改商品失败
								alert('修改商品发生错误，' + re.errormsg)
							}
						}).error(function(){
							//失败
							alert('发生错误，请稍后再试')
						})
					}else{//新增的情况
						var goods_data = getEditGoodsData();
						//发送添加商品请求
						$http({
							method:"POST",
							url: "http://" + $rootScope.myHost + "/Home/Index/AddProduct",
							data:goods_data,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
							transformRequest: function(data){
								return $.param(data);
							}
						}).success(function(re){
							console.log('添加商品返回数据',re)
							if(re.state == 'SUCCESS'){//新商品添加成功
								alert('添加商品成功');
								$scope.refreshGoodsData();//刷新商品数据
								$scope.closeEditGoodsView();
								$scope.showEditGoodsView();
							}else{//新商品添加失败
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
	}
	/**
	 * 通知设备的复选框选择
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	$scope.selectCall = function(index,padID){
		$scope.editGoodsInfo.goodsCall[index] = !$scope.editGoodsInfo.goodsCall[index];//修改选中的标记
		//修改sendMsg中的是否选中标记
		for(var i = 0,len = $scope.editGoodsInfo.sendMsg.length; i < len; i++){
			if(padID == $scope.editGoodsInfo.sendMsg[i]["id"]){
				$scope.editGoodsInfo.sendMsg[i]["select"] = !$scope.editGoodsInfo.sendMsg[i]["select"];
			}
		}
	}
	/**
	 * 关闭商品添加页
	 * @return {[type]} [description]
	 */
	$scope.closeEditGoodsView = function(){
		//重置商品添加页信息
		$scope.resetEditGoodsInfo();
	}
	/*************** 添加商品 end ***************/

	/*************** 删除商品 start ***************/
	$scope.deleteGoods = function(goodsID){
		$http({
			method:"POST",
			url: "http://" + $rootScope.myHost + "/Home/Index/DeleteProduct",
			data:{id:goodsID},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			transformRequest: function(data){
				return $.param(data);
			}
		}).success(function(data){
			console.log('删除商品返回数据',data)
			if(data.state == 'SUCCESS'){//新商品添加成功
				alert('删除商品成功');
				$scope.refreshGoodsData();//刷新商品数据
			}else{//删除商品失败
				alert('发生错误，请稍后再试')
			}
		}).error(function(){
			//失败
			alert('发生错误，请稍后再试')
		})
	}
	/*************** 删除商品 end ***************/
}])