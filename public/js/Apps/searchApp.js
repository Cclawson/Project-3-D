angular.module('searchApp', ['SearchCtrl', 'ngCookies', 'ui.bootstrap']).filter('startFrom', function () {
    return function (data, start) {
        return data.slice(start);
    }
})