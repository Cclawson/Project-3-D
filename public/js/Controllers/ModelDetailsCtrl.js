angular.module('ModelDetailsCtrl', [])

.controller('modelDetailsController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.model = "";
    $scope.message = 'Welcome To Model Details Page';

    $scope.user;

    $http.get("/api/user")
        .then(function (response) {
            console.log(response);
            $scope.user = response;
        });


    $http.get("/api/model/" + $cookies.modelNumber)
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

    $scope.addToFavorites = function () {
        console.log(window.location.href);
        $http.put("/addfavorites/?url=" + window.location.href + "&name=" + $scope.model.Title).then(function (response) {
            console.log(response);
        })
    };
}]);