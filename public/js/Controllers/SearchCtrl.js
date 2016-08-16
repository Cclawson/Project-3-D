angular.module('SearchCtrl', [])

.controller('searchController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
    $scope.sortType = "Title";
    $scope.sortReverse = false;
    $scope.searchString = "";
    $scope.tags = "";
    $scope.model_list = "";
    $scope.pageSize = 6;
    $scope.currentPage = 1;
    $scope.user;
    $scope.search = {};

    $http.get("/api/user")
        .then(function (response) {
            console.log(response);
            $scope.user = response;
        });

    if ($cookies.searchterm != "") {
        console.log($cookies.searchterm);
        $scope.search.Title = $cookies.searchterm;
    }

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
}])