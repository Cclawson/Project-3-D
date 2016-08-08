angular.module('MainCtrl', [])

.controller('mainController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.message = 'Welcome To Project 3-D';
    $scope.sortType = "Title";
    $scope.sortReverse = false;
    $scope.searchString = "";
    $scope.tags = "";
    $scope.model_list = "";
    /*TAG Filter*/
    $scope.tag = function (model) {
        if ($scope.tags) {
            return $scope.tags.replace(/\s*,\s*/g, ',').split(',').every(function (tag) {
                return model.tags.some(function (objTag) {
                    return objTag.indexOf(tag) !== -1;
                });
            });
        } else {
            return true;
        }
    };
    $http.get("/api/model_list")
        .then(function (response) {
            $scope.model_list = response.data;
        });

    $scope.sendSearch = function () {
        $cookies.searchterm = $scope.searchString;
        window.location = "/search";
    }
}])