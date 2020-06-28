//指令
projectB.directive('repeatFinish',function(){
	return {
		link: function(scope,element,attr){
			if(scope.$last == true){
				console.log('ng-repeat执行完毕');
				scope.$eval(attr.repeatFinish);
			}
		}
	}
}).directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, ngModel) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;
			element.bind('change', function(event){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
				//附件预览
				scope.file = (event.srcElement || event.target).files[0];
				scope.getFile(scope.file);
			});
		}
	};
}]).directive('barCharts',function(){
	return{
		restrict:'AE',              
		scope :{
			source:'='
		},
		replace: true,
		template:'<div id="dayBusinessEchart" style="height:400px;width:800px;"></div>',
		controller: function($scope){
		},
		link:function(scope,element,attr){
			var dayOption = {
				title:{
					text:'日营业报表'
				},
				tooltip:{},
				legend:{
					data:['金额']
				},
				xAxis:{
					data:["按摩","踩背","掏耳","洗脚","红牛","水饺","汤圆"]
				},
				yAxis:{},
				series:[{
					name:'金额',
					type:'bar',
					data:[900,9000,3483,23242,23424,23423,1323]
				}]
			}
			var dayChart = echarts.init(document.getElementById('dayBusinessEchart'));
			dayChart.setOption(dayOption);
		}
	}
}).directive('echarts',function(){
	return {
		restrict: 'AE',
		scope:{
			eid:'@id',
			option:'='
		},
		replace:false,
		template:'',
		link:function(scope,elem,attrs){
			console.log(scope.option);
			var echart = echarts.init(document.getElementById(scope.eid));
			console.log(echart);
			echart.setOption(scope.option);
			scope.$watch('option',function(newVal,oldVal,scope){
				echart.setOption(scope.option);
			},true);
		}
	}
})