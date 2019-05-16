var app = angular.module("ChatApp", [ "ngSanitize", "ngRoute", "ui.tinymce", 'LocalStorageModule', 'btford.socket-io' ]);

/* ChatApp Controller */
app.controller("ChatAppCtrl", function($scope, $location, localStorageService, SocketService) {

    /* declare messages */
    $scope.messages = [];
    $scope.messageSent = {};
    
    /* declare users */
    $scope.userConnected = null;
    $scope.usersConnected = null;
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

    /* hide & show date */
    $scope.hideShowDate = function(id_msg) {
        const selected_msg = document.getElementById('msg_' + id_msg).getElementsByClassName("msg-list__date");
        var date_msg = angular.element(selected_msg);
        if(date_msg.hasClass('hidden')) {
            date_msg.removeClass('hidden');
        } else {
            date_msg.addClass('hidden');
        }
    };

    /* scroll to bottom */
    $scope.scrollToBottom = function() {
        var msg_list = document.getElementsByClassName('msg-list')[0];
        var hasScroll = msg_list.scrollHeight > msg_list.clientHeight;
        if(hasScroll) {
            var msg_items = msg_list.getElementsByClassName('msg-list__item');
            var lastMsg = msg_items[msg_items.length-1];
            lastMsg.scrollIntoView({behavior: 'smooth',block: 'start'});
        }
    };

    /* insertPhoto function */
    $scope.insertPhoto = function() {
        setTimeout(() => {
            console.log($scope.messageSent);
            var message = {sender: $scope.userConnected.pseudo, message: null, image: $scope.messageSent.img, date: new Date()};
            SocketService.emit("sendMail", message);
        }, 1000);
        $scope.messageSent = {};
    }

    /* send click */
    $scope.sendMail = function(user) {
        var message = {sender: user.pseudo, message: $scope.messageSent.msg, image: null, date: new Date()};
        SocketService.emit("sendMail", message);
        $scope.messageSent = {};
    };
    
    /* call socket */
    SocketService.on('listUsers', function(users) {
        $scope.usersConnected = users;
    });
    SocketService.on('listMessages', function(messages_sent) {
        if(messages_sent.sender) {
            $scope.messages.push(messages_sent);
        } else {
            $scope.messages = messages_sent;
        }
        if ($scope.userConnected) {
            setTimeout(() => {
                $scope.scrollToBottom();
            }, 200);
        }
    });
    SocketService.on('userConnected', function(user) {
        if ($scope.userConnected) {
            var alert_container = document.getElementById('alert-container');
            alert_container.innerHTML = '<div class="alert alert-info">' + user.name + ' a rejoint le Chat !</div>';
            angular.element(alert_container).addClass('show');
            setTimeout(() => {
                angular.element(alert_container).removeClass('show');
                alert_container.innerHTML = '';
            }, 3000);
        }
    });

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
        if($scope.user.pseudo && $scope.user.password) {
            var user = $scope.getUser($scope.user.pseudo, $scope.user.password);
            if(user == null) {
                alert("Failed to connect! \nPlease check your infos.");
                $location.path("/login");
            } else {
                $scope.setUserId(user.id);
                $scope.userConnected = user;
                SocketService.emit("connected", user);
                $location.path("/messagerie");
            }
        }
    };

    //logout function
    $scope.logout = function() {
        $scope.setUserId(0);
        SocketService.emit('logout', $scope.userConnected);
        $location.path("/login");
    };

    /* navigation */
    $scope.$watch(function() {
        return $location.path();
    }, function(newPath) {
        var tabPath = newPath.split("/");
        
        if($scope.getUserId() == 0 || $scope.getUserId() == null) {
            $location.path("/login");
        } else {
            $scope.userConnected = $scope.getUserById($scope.getUserId());
            $location.path("/messagerie");
        }
    });

});

/* fileReader factory */
app.factory("fileReader", function($q, $log) {
    var onLoad = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.resolve(reader.result);
        });
      };
    };
 
    var onError = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.reject(reader.result);
        });
      };
    };
 
    var onProgress = function(reader, scope) {
      return function(event) {
        scope.$broadcast("fileProgress", {
          total: event.total,
          loaded: event.loaded
        });
      };
    };
 
    var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    };
 
    var readAsDataURL = function(file, scope) {
      var deferred = $q.defer();
 
      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);
 
      return deferred.promise;
    };
 
    return {
      readAsDataUrl: readAsDataURL
    };
});

/* ng-FileSelect directive */
app.directive("ngFileSelect", function(fileReader, $timeout) {
    return {
      scope: {
        ngModel: "="
      },
      link: function($scope, el) {
        function getFile(file) {
          fileReader.readAsDataUrl(file, $scope).then(function(result) {
            $timeout(function() {
              $scope.ngModel = result;
            });
          });
        }
 
        el.bind("change", function(e) {
          var file = (e.srcElement || e.target).files[0];
          getFile(file);
        });
      }
    };
});

/* ng-enter directive */
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

/* Socket Service */
app.service('SocketService', ['socketFactory', function SocketService(socketFactory) {
    return socketFactory({
        ioSocket: io.connect('http://172.16.0.89')
    });
}]);

/* Routes config */
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/messagerie', {templateUrl: 'chat-client/messages.html'})
        .when('/login', {templateUrl: 'chat-client/login.html'})
        .otherwise({redirectTo : '/login'});
}]);