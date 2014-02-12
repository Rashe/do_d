var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server),
    request = require("request");

server.listen(8080);

// routing
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.configure(function () {
    app.use(express.static(__dirname + '/static'));
});

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


//saving settings
var client_info = {}, api_url = 'https://api.digitalocean.com/droplets/?';
console.log(client_info);




io.sockets.on('connection', function (socket) {
    socket.on('save_settings', function (_client_id, _client_api) {
        client_info.client_id = _client_id;
        client_info.client_api = _client_api;
        console.log(client_info);
    });

    socket.on('get_droplets', function (name, _droplets_info) {
        if (isEmpty(client_info)) {
            _droplets_info('omg');
            console.log(client_info);
        }
        else {
            console.log(client_info);
            request("https://api.digitalocean.com/droplets/", function (error, response, body) {
                console.log(body);
                _droplets_info(body);
            });
        }
    });

    socket.on('get_clientinfo', function (name, _client_info) {
        if (isEmpty(client_info)) {
            _client_info('omg');
            console.log(client_info);
        }
        else {
            _client_info(client_info);
            console.log(client_info);
        }
    });


    socket.on('disconnect', function () {
        // remove the username from global usernames list
//        delete usernames[socket.username];
        // update list of users in chat, client-side
//        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
//        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
});