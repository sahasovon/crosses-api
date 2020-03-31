const {check} = require('express-validator');
const validate = require('./validate');

const appModule = require('express').Router();

const GameController = require('./game.controller');

appModule.post('/game/', GameController.start);
appModule.post('/game/:id/turn', [
    check('row').not().isEmpty().withMessage('Box row is required'),
    check('column').not().isEmpty().withMessage('Box column is required'),
], validate, GameController.turn);

module.exports = appModule;
