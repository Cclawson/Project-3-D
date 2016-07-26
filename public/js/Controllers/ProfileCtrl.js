angular.module('ProfileCtrl', [])

.controller('ProfileController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.message = 'Welcome To The Profile Page';
    $scope.user;

    $http.get("/api/user")
        .then(function (response) {
            console.log(response);
            $scope.user = response;
        });


    $scope.getModel = function (id) {
        window.open("/api/download/" + id)
        $http.get("/api/download/" + id).then(function (response) {
            console.log(response);      
        })
    }
}]);