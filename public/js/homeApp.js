var app = angular.module('homeApp', ['MainCtrl']);

app.factory("getModels", ['$http', function ($http) {
    return {
        fetch: function () {
            return
            $http.get("/api/model_list")
        }
    }
}]);