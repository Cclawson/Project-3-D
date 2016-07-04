angular.module('MainCtrl', [])

.controller('mainController', ['$scope', '$http', function ($scope, $http, getModels) {

    $scope.message = 'Welcome To Project 3-D';
    $scope.sortType = "Title";
    $scope.sortReverse = false;
    $scope.searchString = "";
    $scope.tags = "";
    $scope.model_list = "";
    //    $scope.model_list = getModels.fetch().data;

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
}])