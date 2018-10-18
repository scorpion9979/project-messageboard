'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var helmet = require('helmet');

var app = express();

// information security
app.use(helmet.frameguard({action: 'deny'}));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.referrerPolicy({policy: 'same-origin'}));

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); // for FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// sample front-end
app.route('/b/:board/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:threadid')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });

// index page (static HTML)
app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// for FCC testing purposes
fccTestingRoutes(app);

// routing for API
apiRoutes(app);

// sample Front-end

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// start our server and tests!
app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + process.env.PORT);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
