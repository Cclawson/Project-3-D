angular.module('MainCtrl', [])

.controller('mainController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
    $scope.sortType = "Title";
    $scope.sortReverse = false;
    $scope.searchString = "";
    $scope.tags = "";
    $scope.model_list = "";
    $scope.pageSize = 3;
    $scope.currentPage = 1;
    $scope.user;

    $http.get("/api/user")
        .then(function (response) {
            console.log(response);
            $scope.user = response;
        });

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
            console.log(response);
            $scope.model_list = response.data;
        });

    $scope.sendSearch = function () {
        $cookies.searchterm = $scope.searchString;
        console.log($scope.searchString);
        window.location = "/search";
    }
}])