const Game = require('./game.model');

// @route POST api/game
// @desc Start a tic tac toe game
// @access Public
exports.start = async (req, res) => {
    try {
        // Check if there is any ongoing game.
        // If yes, return existing
        // else create new
        const existingGame = await Game.findOne({result: 'ongoing'});

        if (existingGame) {
            return res.status(200).json({
                type: 'old',
                game: existingGame
            });
        }

        const boxNumber = process.env.BOX_NUMBER;

        // Create new game
        const game = await new Game({
            boxNumber: boxNumber,
            boxData: new Array(boxNumber * boxNumber).fill(0),
            players: req.body.players,
            nextTurnBy: ['first', 'second'][Math.floor(Math.random() * 2)],
            result: 'ongoing'
        }).save();

        // Add activities
        game.activities.push('Game has started');
        game.activities.push('Player ' + game.nextTurnBy + ' has the first move');
        await game.save();

        // Get update game object
        const updatedGame = await Game.findById(game._id);

        res.status(200).json({
            type: 'new',
            game: updatedGame
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

// @route POST api/game/:id/turn
// @desc Give a turn to game
// @access Public
exports.turn = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};
