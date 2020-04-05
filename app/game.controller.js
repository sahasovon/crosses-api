const Game = require('./game.model');
const boxNumber = Number(process.env.BOX_NUMBER);

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
            if (!req.body.restart) {
                return res.status(200).json({
                    type: 'old',
                    game: existingGame
                });
            } else {
                await Game.deleteOne({ _id: existingGame._id });
            }
        }

        let boxArray = [];
        const rowFilledWithZero = new Array(boxNumber).fill(0);

        for (let i = 0; i < boxNumber; i++) {
            boxArray[i] = rowFilledWithZero;
        }

        // Create new game
        const game = await new Game({
            boxNumber: boxNumber,
            boxData: boxArray,
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
        const game = await Game.findOne({_id: req.params.id, result: 'ongoing'});

        if (!game) return res.status(404).json({success: false, message: 'Game not found'});

        const {row, column} = req.body;

        // Check if box is already filled
        if (game.boxData[row][column] !== 0)
            return res.status(400).json({success: false, message: 'Box data is already filled'});

        // Update box data and activities
        let boxData = game.boxData;

        boxData[row][column] = (game.nextTurnBy === 'first') ? 1 : -1;

        game.boxData.set(row, boxData[row]);
        game.filledData++;
        game.activities.push(
            'Player ' + game.nextTurnBy + ' has put ' + game.players[game.nextTurnBy] +
            ' on row ' + row + ' and column ' + column
        );
        game.nextTurnBy = (game.nextTurnBy === 'first' ? 'second' : 'first');
        await game.save();

        // Verify game result
        let result = 'ongoing';
        let resultBoxes = [];

        // To match in quickest way, it needs minimum 5 turns
        if (game.filledData >= 5) {
            const matches = verifyGameResult(game.boxData, row, column);
            resultBoxes = matches[1];

            if (matches[0] !== 0) {
                result = (matches[0] > 1) ? 'first' : 'second'
            }

            if (result !== 'ongoing') {
                game.activities.push(
                    'Player ' + result + ' has won the game'
                );
            }

            if (result === 'ongoing' && game.filledData === (boxNumber * boxNumber)) {
                result = 'draw';

                game.activities.push(
                    'Game has Drawn'
                );
            }
        }

        // Update game object
        game.result = result;
        game.resultBoxes = resultBoxes;
        await game.save();

        res.status(200).json({
            game: game
        });
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

function verifyGameResult(data, row, column) {
    let total = 0;
    let matchBoxes = [];

    // Calculate vertical sum
    for (let r = 0; r < boxNumber; r++) {
        total += data[r][column];
        matchBoxes.push([r, column]);
    }

    if (total !== 0 && total % boxNumber === 0) {
        return [total, matchBoxes];
    }

    total = 0;
    matchBoxes = [];

    // Calculate horizontal sum
    for (let c = 0; c < boxNumber; c++) {
        total += data[row][c];
        matchBoxes.push([row, c]);
    }

    if (total !== 0 && total % boxNumber === 0) {
        return [total, matchBoxes];
    }

    // Check left to right diagonal lines
    total = 0;
    matchBoxes = [];

    if (row === column) {
        for (let i = 0; i < boxNumber; i++) {
            total += data[i][i];
            matchBoxes.push([i, i]);
        }

        if (total !== 0 && total % boxNumber === 0) {
            return [total, matchBoxes];
        }
    }

    // Check right to left diagonal lines
    total = 0;
    matchBoxes = [];

    if ((row + column) === (boxNumber - 1)) {
        for (let i = 0; i < boxNumber; i++) {
            total += data[i][boxNumber - 1 - i];
            matchBoxes.push([i, (boxNumber - 1 - i)]);
        }

        if (total !== 0 && total % boxNumber === 0) {
            return [total, matchBoxes];
        }
    }

    return [0, []];
}
