angular.module('ProfileCtrl', [])

.controller('ProfileController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.message = 'Welcome To The Profile Page';

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