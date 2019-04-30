var app = angular.module("ChatApp", [ "ngSanitize", "ngRoute", "ui.tinymce" ]);

/* ChatApp Controller */
app.controller("ChatAppCtrl", function($scope, $location) {
    console.log("ChatAppCtrl");

    var users = [
        { id: "1", name: "Hiba", pseudo: "bipa", password: 'toto' },
        { id: "2", name: "Molka", pseudo: "moka", password: '123456' },
        { id: "3", name: "Mohamed", pseudo: "med87", password: '123456' }
    ];

    // seesionStorage
    var userId = null;
    $scope.getUserId = function() {
        if(!userId) {
            userId = sessionStorage.getItem('userId');
        }
        return userId;
    };
    $scope.setUserId = function(user) {
        userId = user;
        sessionStorage.setItem('userId', user);
    };

    /* conncet function */
    $scope.connect = function() {
        console.log("connect");
        console.log("pseudo: " + $scope.user.pseudo);
        console.log("password: " + $scope.user.password);
        if($scope.user.pseudo && $scope.user.password) {
            for(var i in users) {
                var user = users[i];
                if($scope.user.pseudo == user.pseudo && $scope.user.password == user.password) {
                    console.log("hello " + user.name + ", you're connected!");
                    $scope.setUserId(user.id);
                    // to redirect page messagerie https://stackoverflow.com/questions/27941876/how-to-redirect-to-another-page-using-angularjs/27941966
                    return;
                }
            }
        }
    };

    /* navigation */
    $scope.$watch(function() {
        return $location.path();
    }, function(newPath) {
        var tabPath = newPath.split("/");
        if(tabPath.length > 1) {
            if(tabPath[1] == "login") {
                console.log("login");
            } else {
                console.log("messagerie: " + $scope.getUserId());
            }
        }
    });

});

/* Routes config */
app.config(['$routeProvider', function($routeProvider){
    console.log('routeProvider');
    $routeProvider
        .when('/messagerie', {templateUrl: 'chat-client/messages.html'})
        .when('/login', {templateUrl: 'chat-client/login.html'})
        .otherwise({redirectTo : '/login'});
}]);