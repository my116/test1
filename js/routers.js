/*导航路由*/
projectB.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/cashier',{
		templateUrl:"/Public/Home/view/cashier.html",
		controller: 'CashierController'
	})
	.when('/technician',{
		templateUrl:"/Public/Home/view/technician.html",
		controller: 'TechnicianController'
	})
	.when('/finance',{
		templateUrl:"/Public/Home/view/finance.html",
		controller: 'FinanceController'
	})
	.when('/member',{
		templateUrl:"/Public/Home/view/member.html",
		controller:"MemberController"
	})
	.when('/goods',{
		templateUrl:"/Public/Home/view/goods.html",
		controller:"GoodsController"
	})
	.when('/system',{
		templateUrl:"/Public/Home/view/system.html",
		controller:"SystemController"
	})
	.when('/exit',{
		template:"退出系统",
	})
	.otherwise({redirectTo:'/cashier'});
}])