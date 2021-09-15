const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const Answer = require('./Answer');

function Router({ }) {

    const answer = new Answer;
    
    router.all('/*', (req, res) => res.send(answer.bad(404)));

    return router;
}

module.exports = Router;