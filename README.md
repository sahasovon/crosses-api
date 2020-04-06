## Tic Tac Toe

Tic tac toe game api with NodeJs and Mongo

#### Technology

**Database:** MongoDB

**Platform:** ExpressJs

#### Setup
Copy `.env.example` to `.env`:
`cp .env.example .env`

#### Run Project

`docker-compose up -d`

#### Run Test

`docker-compose -f docker-compose.test.yaml up`

#### API Details

`POST /game`

Header: `Content-Type: application/json`

Body: `{ "restart": bool, "players": { "first": "X", "second": "O" } }`

`POST /game/:id/turn`

Header: `Content-Type: application/x-www-form-urlencoded`

Body:

`row` : `int, 0-2`

`column` : `int, 0-2`
