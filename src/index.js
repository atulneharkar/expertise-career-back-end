import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import config from './config/config';
import routes from './routes/';
import dbConnection from './db/mongoose';
import { corsOptions } from './config/cors';

import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';

require('./config/passport.js')(passport)

const app = express();
const port = process.env.PORT || config.PORT;

/* check for CORS */
app.use(cors(corsOptions));

/* middleware will attempt to compress response bodies */
app.use(compression());

/* secure your express apps by setting various HTTP headers */
app.use(helmet());

/* log incomming request details */
app.use(morgan(':method :url :date :remote-addr :status :response-time'));

/* parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ 'extended': false }));

/* parse application/json */
app.use(bodyParser.json());

// required for passport
app.use(session({ secret: config.AUTH_KEY })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
                  
// /* all application routes */
app.use(routes);

app.listen(port, () => {
  console.log(`App started at port ${port}`);
});