var app = angular.module('myApp', []);

app.controller('LoginController', ['$scope', '$rootScope', 'loginFactory', function($scope, $rootScope, loginFactory) {

	$rootScope.auth = false;

	$scope.login = function() {
		loginFactory.login($scope.name, $scope.password)
		.then(function(s) {
			localStorage.setItem("token", s.token);
			$scope.authenticate();
		},
		function(e) {
			console.error("error", e);
		})
	}

	$scope.logoff = function() {
		loginFactory.logoff();
		$rootScope.auth = false;
		localStorage.removeItem("token");
	}

	$scope.authenticate = function() {
		if (localStorage.getItem("token")) {
			$rootScope.auth = true;
		}
	}

	$scope.authenticate();

}]);

app.factory('loginFactory', function($http) {

	var loginFactory = {};

	loginFactory.login = function(name, password) {
		var data = {'name': name, 'password': password};

		var promisse = $http.post('/user/login', data)
		.then(function(response) {
			if ("token" in response) {
				$http.defaults.headers.common.Authorization = 'Bearer ' + response.token;
			}
			return response.data;
		});
		return promisse;
	}

	loginFactory.logoff = function() {
		$http.defaults.headers.common.Authorization = "";
	}

	return loginFactory;
});