angular.module('ModelDetailsCtrl', [])

.controller('modelDetailsController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {

    $scope.model = "";
    $scope.message = 'Welcome To Model Details Page';

    $scope.user;


    var updateUser = function () {
        $http.get("/api/user")
            .then(function (response) {
                $scope.user = response;
                var favorites = $scope.user.data.favorites;
                $scope.favorited = false;
                for (var i = 0, len = favorites.length; i < len; i++) {
                    if (favorites[i].urlString === window.location.href) {
                        console.log("Hello");
                        $scope.favorited = true;
                    }
                };
            })
    };


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
        $http.put("/addfavorites/?url=" + window.location.href + "&name=" + $scope.model.Title).then(function (response) {
            updateUser();
        })
    };

    $scope.removeFavorite = function () {
        $http.put("/removefavorite/?url=" + window.location.href + "&name=" + $scope.model.Title).then(function (response) {
            updateUser();

        })
    };

    $scope.addModel = function () {
        $http.put("/purchaseModel/?id=" + $scope.model._id + "&name=" + $scope.model.Title).then(function (response) {
            updateUser();
        })
    }

    updateUser();

                }]);