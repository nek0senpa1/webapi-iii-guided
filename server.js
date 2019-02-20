const express = require('express'); // importing a CommonJS module

const helmet = require('helmet');

const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');


const server = express();


function teamName(req, res, next) {
  req.team = "Lambda Students"
  next()
}

server.use(express.json());

server.use(helmet());

server.use(morgan('dev'));

server.use('/api/hubs', hubsRouter);

server.use(moodyGateKeeper);

server.use(restricted);

server.use('api/hubs' , restricted, only('frodo'))



function moodyGateKeeper (req, res, next) {
  const seconds = new Date().getSeconds();

  if (seconds % 3 === 0) {
    res.status(403).json(' NONE SHALL PASS !!! ')
  }
  else{
    next();
  }
}

server.use(teamName);


server.get('/', (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to ${req.team} the Lambda Hubs API</p>
    `);
});


function only (name) {
  return function(req, res, next) {
    //const bob = req.headers.name;
    if (name === req.headers.name){
      next();
    }
    else {
      res.status(403).json({ message: 'NARP NARP NARP'})
    }
  }
}

function restricted(req, res, next) {
  const password = req.headers.authorization;

  if (password === 'mellon') {
    next();
  } else {
    res.status(401).json({message: "you are not auth'ed"})
  }
}


function errorHandler(error, req, res, next) {
  res.status(400).json({message: "Pad Banda, Pad!", error})
}


server.use((req, res) => {
  res.status(404).send('Aint Nobody... and stuff')
})

module.exports = server;

