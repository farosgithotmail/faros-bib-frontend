'use strict';

var SockJS = require('sockjs-client');
require('stompjs');

function register(registrations) {
    var socket = SockJS('http://localhost:8080/messages');
    var stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        registrations.forEach(function (registration) {
            stompClient.subscribe(registration.route, registration.callback);
        });
    });
}

module.exports.register = register;

