const mongoose = require('mongoose');

// Connect to 
// "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="c:\data\db"
mongoose.connect('mongodb://localhost/maindb')

// Connext to db before tests run
before(function(done){
    mongoose.connection.once('open', function() {
        console.log('Connection has been made');
        done();
    }).on('error', function(error){
        console.log('Connection errror: ', error);
    })
});

// OPTIONAL: Drop the collection (of players) before each test
beforeEach(function(done){
    mongoose.connection.collections.players.drop(function(){
        done();
    });
});
