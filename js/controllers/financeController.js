/*财务管理 FinanceController*/
projectB.controller('FinanceController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){

	/**
	 * 财务管理首页信息
	 * showPage 			显示那个板块(day-business,history-business,technician,member)
	 * @type {Object}
	 */
	$scope.indexPageInfo = {
		showPage:'day-business'	
	}
	$scope.changeFinanceSelected = function(financeKind){
		$scope.indexPageInfo.showPage = financeKind;
	}

	$scope.historyBusinessInfo = {
		goodsList:[
			{
				goodsName: "按摩",
				info:[
					{
						date:"10-01",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-02",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-03",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-04",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-05",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-06",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-07",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-08",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-09",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-10",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},{
						date:"11-11",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"12-12",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"合计",
						data:["900000","50.00%","-50.00%","-50.00%"]
					}
				]
			},
			{
				goodsName: "按摩",
				info:[
					{
						date:"10-01",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-02",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-03",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-04",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-05",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-06",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-07",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-08",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-09",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"10-10",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},{
						date:"11-11",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"12-12",
						data:["90000","2.00%","-2.00%","-2.00%"]
					},
					{
						date:"合计",
						data:["900000","50.00%","-50.00%","-50.00%"]
					}
				]
			}
		]
	}
	
	/*************** 日营业 start ***************/
	$scope.dayBusinessInfo = {
		goodsList : [
			{
				goodsName: "踩背",
				info:[
					{
						date:"2016-10-02",
						data:["90000.00","20","20.00%"]
					}
				]
			},
			{
				goodsName: "按摩",
				info:[
					{
						date:"2016-10-02",
						data:["88880.00","26","19.00%"]
					}
				]
			}
		],
		allDay:{
			turnover:["18998.00","75557.00","23467.00","7482.00","125504.00"],
			recharge:["1200.00","3400.00","7878.00","/","12478.00"],
			total:["20198.00","78957.00","31345.00","--","130500.00"]
		}
	}

	/**
	 * 按日查询财务情况
	 * @return {[type]} [description]
	 */
	$scope.searchDayBusinessDetail = function(){
		$scope.setDayBusinessEchartsData();
	}
	//当日营业额支付方式饼图
	$scope.dayTurnoverOption = {
		title:{
			text:'当日营业额支付组成'
		},
		tooltip:{
			trigger:'item',
			formatter:'{a} <br/>{b} : {c} ({d}%)'
		},
		legend:{
			orient:'vertical',//图例排列方式，垂直
			x:'right',//x方向定位，右边
			data:['现金','刷卡','微信','会员']
		},
		series:[
			{
				name:'支付方式比例',
				type:'pie',
				radius:['0%','75%'],
				center:['40%','50%'],
				data:[]
			}
		]
	}
	//当日收入额支付方式饼图
	$scope.dayTotalOption = {
		title:{
			text:'当日收款支付组成'
		},
		tooltip:{
			trigger:'item',
			formatter:'{a} <br/>{b} : {c} ({d}%)'
		},
		legend:{
			orient:'vertical',//图例排列方式，垂直
			x:'right',//x方向定位，右边
			data:['现金','刷卡','微信']
		},
		series:[
			{
				name:'支付方式比例',
				type:'pie',
				radius:['0%','75%'],
				center:['40%','50%'],
				data:[]
			}
		]
	}
	//当日详细营业额Echarts配置对象
	$scope.dayBusinessEchartsOption = {
		title:{
			text:'当日营业明细'
		},
		tooltip:{
			trigger:'axis',
			axisPointer:{
				type:'shadow'
			}
		},
		legend:{
			orient:'horizontal',
			right:10,
			data:['营业额','数量']
		},
		grid:{
			left:'3%',
			right:'4%',
			bottom:'40',
			containLabel:true
		},
		xAxis:[{
			type:'category',
			data:[]
		}],
		yAxis:[{
			type:'value',
			name:'营业额',
			min:0,
			position:'left',
			axisLabel:{
				formatter:'{value} 元'
			}
		},{
			type:'value',
			splitLine:{//整数的水平线
				show:false
			},
			name:'数量',
			min:0,
			position:'right'
		}],
		dataZoom:[{
			show:true,
			height:30,
			xAxisIndex:[
				0
			],
			bottom:0,
			start:10,
			end:80,
			handleIcon:'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
			handleSize:'110%',
			handleStyle:{
				color:"#d3dee5",
			},
			textStyle:{
				color:"#fff"},
			borderColor:"#90979c"
			
		},{
			type:"inside",
			show:true,
			height:15,
			start:1,
			end:35
		}],
		series:[{
			name:'营业额',
			type:'bar',
			data:[]
		},{
			name:'数量',
			type:'bar',
			data:[],
			yAxisIndex: 1,
		}]
	}
	//设置当日营业额详细情况的数据
	$scope.setDayBusinessEchartsData = function(){
		//设置当日营业额详细数据
		var goodsNames = [],//项目和商品的名称
			turnover = [],//项目和商品的营业额
			number = [];//数量
		for(var i = 0,len = $scope.dayBusinessInfo.goodsList.length;i < len;i++){
			goodsNames.push($scope.dayBusinessInfo.goodsList[i]["goodsName"]);
			turnover.push($scope.dayBusinessInfo.goodsList[i]["info"][0]["data"][0]);
			number.push($scope.dayBusinessInfo.goodsList[i]["info"][0]["data"][1]);
		}
		$scope.dayBusinessEchartsOption.xAxis[0]["data"] = goodsNames;
		$scope.dayBusinessEchartsOption.series[0]["data"] = turnover;
		$scope.dayBusinessEchartsOption.series[1]["data"] = number;
		console.log($scope.dayBusinessEchartsOption)
		//设置当日营业额支付方式详情数据
		var payWay = [];
		payWay.push({value:$scope.dayBusinessInfo.allDay.turnover[0],name:'现金'});
		payWay.push({value:$scope.dayBusinessInfo.allDay.turnover[1],name:'刷卡'});
		payWay.push({value:$scope.dayBusinessInfo.allDay.turnover[2],name:'微信'});
		payWay.push({value:$scope.dayBusinessInfo.allDay.turnover[3],name:'会员'});
		$scope.dayTurnoverOption.series[0]["data"] = payWay;
		//设置当日总收入支付方式详情数据
		var dayTotal = [];
		dayTotal.push({value:$scope.dayBusinessInfo.allDay.total[0],name:'现金'});
		dayTotal.push({value:$scope.dayBusinessInfo.allDay.total[1],name:'刷卡'});
		dayTotal.push({value:$scope.dayBusinessInfo.allDay.total[2],name:'微信'});
		$scope.dayTotalOption.series[0]["data"] = dayTotal;
	}

	/*************** 日营业 end ***************/
}])