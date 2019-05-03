var app = angular.module("ChatApp", [ "ngSanitize", "ngRoute", "ui.tinymce" ]);

/* ChatApp Controller */
app.controller("ChatAppCtrl", function($scope, $location) {
    console.log("ChatAppCtrl");

    $scope.userConnected = null;

    var users = [
        { id: "1", name: "Hiba", pseudo: "bipa", password: 'toto' },
        { id: "2", name: "Molka", pseudo: "moka", password: '123456' },
        { id: "3", name: "Mohamed", pseudo: "med87", password: '123456' }
    ];

    /* getUser functions */
    $scope.getUserById = function(id) {
        return users[id-1];
    };
    $scope.getUser = function(pseudo, password) {
        for(var i in users) {
            var user = users[i];
            if(pseudo == user.pseudo && password == user.password) {
                return user;
            }
        }
        return null;
    };

    /* seesionStorage */
    var userId = 0;
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
        if($scope.user.pseudo && $scope.user.password) {
            var user = $scope.getUser($scope.user.pseudo, $scope.user.password);
            if(user == null) {
                console.log("Failed to connect! please check your infos.");
                $location.path("/login");
            } else {
                $scope.setUserId(user.id);
                $scope.userConnected = user;
                console.log("hello " + user.name + ", you're connected!");
                $location.path("/messagerie");
            }
        }
    };

    //logout function
    $scope.logout = function() {
        console.log("logout");
        $scope.setUserId(0);
        $location.path("/login");
    };

    /* navigation */
    $scope.$watch(function() {
        return $location.path();
    }, function(newPath) {
        var tabPath = newPath.split("/");
        console.log("$scope.getUserId(): " + $scope.getUserId());
        
        if($scope.getUserId() == 0 || $scope.getUserId() == null) {
            console.log("login");
            $location.path("/login");
        } else {
            $scope.userConnected = $scope.getUserById($scope.getUserId());
            console.log("Hello " + $scope.userConnected.name + ", you're already connected ");
            $location.path("/messagerie");
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