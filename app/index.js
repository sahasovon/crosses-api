const appModule = require('express').Router();

const GameController = require('./game.controller');

appModule.post('/game/', GameController.start);
appModule.post('/game/:id/turn', GameController.turn);

module.exports = appModule;
