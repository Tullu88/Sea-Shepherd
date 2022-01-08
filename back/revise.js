getToken: function(url, callback) {
    const options = {
        url: process.env.GET_TOKEN,
        json: true,
        body: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'client_credentials'
        }
    };

    request.post(options, (err, res, body) => {
        if(err) {
            return console.log(err)
        }
        console.log(`Status: ${res.statusCode}`)
        console.log(body);

        callback(res);
    });
},

// var AT = '';
// getToken(process.env.GET_TOKEN, (res) => {
//     AT = res.body.access_token;
//     return AT;
// });

getGames: function (url, accessToken, callback) {
    const gameOptions = {
        url: process.env.GET_GAMES,
        method: 'GET',
        headers: {
            'Client-ID': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + accessToken
        }
    };

    request.get(gameOptions, (err, res, body) => {
        if(err) {
            return console.log(err);
        }
        console.log(`Status: ${res.statusCode}`);
        console.log(JSON.parse(body));
        //req.send(parsed);
    });
}

// setTimeout(() => {
//    getGames(process.env.GET_GAMES, AT, (response) => {

//     });
// }, 1000);