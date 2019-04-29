var app = angular.module("ChatApp", [ "ngSanitize", "ngRoute", "ui.tinymce" ]);

/* Webmail Controller */
app.controller("ChatAppCtrl", function($scope, $location) {


    /* navigation */
    $scope.$watch(function() {
        return $location.path();
    }, function(newPath) {
        var tabPath = newPath.split("/");
        console.log("tabPath: " + tabPath);
    });

});

/* Routes config */
app.config(['$routeProvider', function($routeProvider){
    console.log('routeProvider');
    /* $routeProvider
        .when('/', {templateUrl: 'partiels/listEmails.html'})
        .when('/newEmail', {templateUrl: 'partiels/newEmail.html'})
        .otherwise({redirectTo : '/'}); */
}]);