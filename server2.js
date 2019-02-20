const express = require('express'); // importing a CommonJS module
// global third party middleware
const helmet = require('helmet');
//const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();


//server.use must be above the request to the server in order to function
server.use(express.json());
server.use(helmet());
//server.use(morgan('dev'))
//notice that local middleware doesn't need to be "called"
server.use(teamName);
//server.use(moodyGatekeeper);
server.use(restricted);
//you can chain middleware and pass in arguments
server.use('/api/hubs', restricted, only('frodo'))
server.use(errorHandler);




server.use('/api/hubs', hubsRouter);

server.get('/', (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} to the Lambda Hubs API</p>
    `);
});

function only (name)  {
  return function(req, res, next) {
    const myName = req.headers.name
    //this can also be const myName = req.headers.name || ' '
    //just in case no name header is provided

    if (myName.toLowerCase() === name.toLowerCase()) {
      next();
    } else {
      res.status(403).json('Not TODAY!')
    }
  }
}

//notice that this middleware could be set up to effect only certain endpoints. it could be root, like a login or special features like admin
function restricted(req, res, next) {
  const password = req.headers.authorization;

  if (req.headers && req.headers.authorization) {
    if (password === 'mellon') {
      next();
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    // fire the next error handling middleware in the chain
    next({ message: 'no authorization header provided' });
  }
}
// We can route the request to the error handling middleware from any middleware or endpoint by calling `next()` passing **any** argument, doesn't have to be a proper `Error` object.

function teamName(req, res, next) {
  // we can add properties to the request and response objects
  req.team = 'Lambda Students';

  next();// calling next continues to the next middleware/route handler, else it can hang and clients get a timeout
}


// function moodyGatekeeper(req,res,next) {
//   const seconds = new Date().getSeconds();

//   if (seconds % 3 === 0) {
//      res.status(403).json('none shall pass!')
//   } else {
//     next ();
//   }
// }

function errorHandler(error, req, res, next) {
  res.status(400).json({message: "Bad Panda!", error});
}



// server.use((req, res) => {
//   res.status(404).send('Aint nobody got time for that!')
// }) here we see the res ends the lifecycle instead of sending .json and going to next

module.exports = server;
