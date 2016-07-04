angular.module('MainCtrl', [])

.controller('mainController', ['$scope', '$http', function ($scope, $http) {

    $scope.message = 'Welcome To Project 3-D';
    $scope.sortType = "Title";
    $scope.sortReverse = false;
    $scope.searchString = "";
    $scope.model_list = "";

    $http.get("/api/model_list")
        .then(function (response) {
            console.log(response.data);
            $scope.model_list = response.data;
        });
}])