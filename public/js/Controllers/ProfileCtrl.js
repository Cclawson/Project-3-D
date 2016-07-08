angular.module('ProfileCtrl', [])

.controller('ProfileController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.message = 'Welcome To The Profile Page';
    $scope.user;

    $http.get("/api/user")
        .then(function (response) {
            console.log(response);
            $scope.user = response;
        });


}]);