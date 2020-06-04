require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwtAuthz = require('express-jwt-authz');
const compression = require('compression');

// CONSTANTS
const {
  PORT,
  API_URL,
  STATIC_SERVE,
  HTML,
  ENTRY
} = require('./constants');

// AUTHENTICATION
const { checkIfAuthenticated, extendJWTSession } = require('./api/authentication');

// ENDPOINTS
const { fetchPageSegmentation, registerLink } = require('./api/endpoint');

const app = express();
// app.use(cors());
app.use(compression());
app.use(bodyParser.json());

// IN HERE API ROUTERS ARE FIRST

app.route(`${API_URL}/pageSegmentation`).post(extendJWTSession,
  jwtAuthz(['role:user', 'role:admin']), fetchPageSegmentation);
app.route(`${API_URL}/click`).post(checkIfAuthenticated,
  jwtAuthz(['role:user']), registerLink);

// Extending valid jwt sessions
app.use(extendJWTSession);

// WE ARE HANDLING ALL ROUTES WHICH DO NOT RESULT IN A REQUEST LAST AND RETURN THE SPA
STATIC_SERVE && app.use(express.static(HTML));
STATIC_SERVE && app.route('*').get((request, response) => { response.sendFile(ENTRY); });

app.listen(PORT, () => console.log('Port: ' + PORT));
require('./api/debugger').config();
require('./api/cron').run();
