'use strict';

var Promise = global.Promise || require('promise');
var uuid = require('uuid');
var WebSocketServer = require('ws').Server;

function wsCtrl ( httpListener, logger ) {
    var instance = {};
    instance.logger = logger;
    instance.wss = new WebSocketServer({ server: httpListener });
    return Promise.resolve(instance);
}

function addBroadcastPolyfill( instance ) {
    return Promise.resolve()
    .then(function(){
        instance.wss.broadcast = function(msg, sender) {
            instance.wss.clients.forEach(function(client){
                if (client.id !== sender) {
                    client.send(msg);
                    instance.logger.info('Message sent:' + msg + ' from ' + sender + ' to ' + client.id);
                }
            });
        };
        return instance;
    });
}

function addWsEvtListeners( instance ) {
    return Promise.resolve()
    .then(function(){
        instance.wss.on('connection', function(socket){
            socket.id = uuid.v4();
            // to try if behind a proxy: logger.info('user connected' + socket.upgradeReq.headers['x-forwarded-for']);
            instance.logger.info('User connected: ' + socket.id + ' (' + socket.upgradeReq.connection.remoteAddress + ')');
            
            socket.on('close', function(){
                instance.logger.info('User disconnected: ' + socket.id + ' (' + socket.upgradeReq.connection.remoteAddress + ')');
            });
            socket.on('message', function(msg){
                instance.logger.info('Message received: ' + msg + ' from ' + socket.upgradeReq.connection.remoteAddress);
                instance.wss.broadcast(msg, socket.id);
            });
        });

        // listen for server shut down
        instance.wss.on('close', function(){
            instance.logger.error('Server shut down.');
            // try auto reconnect here ?
        });

        // handle wrongly formated queries
        instance.wss.on('clientError', function(err, socket){
            instance.logger.error('Wrong request from client '+ socket.id +'!');
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });

        return instance;
    });
}

module.exports = function( httpListener, logger ) {
    return new wsCtrl( httpListener, logger )
    .then(addBroadcastPolyfill)
    .then(addWsEvtListeners);
};
