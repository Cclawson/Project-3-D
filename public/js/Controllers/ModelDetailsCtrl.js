angular.module('ModelDetailsCtrl', [])

.controller('modelDetailsController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.model = "";
    $scope.message = 'Welcome To Model Details Page';

    $http.get("/api/" + $cookies.modelNumber)
        .then(function (response) {
            $scope.model = response.data;
            $scope.Tag = "";

            $scope.sendTag = function () {
                var data = $.param({
                    tag: $scope.Tag
                });
                if ($scope.Tag != "") {
                    $http.put('/api/' + $cookies.modelNumber + '?' + data)
                        .success(function (data, status, headers) {
                            $scope.Tag = "";
                            $scope.model = data;
                        })
                }
            }
        });

}]);