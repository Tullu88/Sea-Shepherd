const assert = require('assert');
const Player = require('../models/players');

// Describe tests
describe('some demo test', function(){
    
    // Create tests
    it('saving a player to DB', function(done){
        var player = new Player({
            name: 'John',
            ship: 'Tartane',
            crew: 0,
            guns: 0
        });

        player.save().then(function(){
            assert(player.isNew === false);
            done();
        });

    });

    // next test here
});