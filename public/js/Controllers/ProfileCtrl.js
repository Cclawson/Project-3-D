angular.module('ProfileCtrl', [])

.controller('ProfileController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.message = 'Welcome To The Profile Page';
    $scope.user;


    var updateUser = function () {
        $http.get("/api/user")
            .then(function (response) {
                console.log(response);
                $scope.user = response;
            });
    }


    $scope.getModel = function (id) {
        console.log(id);
        window.open("/api/download/" + id)
        $http.get("/api/download/" + id).then(function (response) {
            console.log(response);      
        })
    }

    $scope.removeFavorite = function (url, name) {
        $http.put("/removefavorite/?url=" + url + "&name=" + name).then(function (response) {
            updateUser();
        })
    };

    updateUser();
}]);