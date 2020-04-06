'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Game = require('../app/game.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');

chai.use(chaiHttp);

describe('Start Game', () => {

    before((done) => { //Before each test we empty the database
        Game.deleteMany({},done);
    });

    describe('#game', () => {

        it('should fail with incorrect details',() => {
            chai.request(server)
                .post('/game')
                .send({})
                .end((err, res) => {
                    res.should.have.status(500);
                });
        });

        it('should pass with player details',() => {
            chai.request(server)
                .post('/game')
                .set('Content-Type', 'application/json')
                .send({
                    "players": {
                        "first": "X",
                        "second": "O"
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('type').eq('new');
                    res.body.should.have.property('game');
                    res.body.game.should.be.a('object');
                });
        });

        it('should pass with player details with previous game details',() => {
            chai.request(server)
                .post('/game')
                .set('Content-Type', 'application/json')
                .send({
                    "players": {
                        "first": "X",
                        "second": "O"
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('type').eq('old');
                    res.body.should.have.property('game');
                    res.body.game.should.be.a('object');
                });
        });
    });
});
