import express from 'express';
import mongoose from "mongoose";
import cookieParser  from 'cookie-parser';
import session from 'express-session';
import flush from 'connect-flash';
import errorHandler from "./middlewares/errorHandler";
import path from "path";
var bodyParser = require('body-parser');
import { APP_PORT ,DB_URL} from "./config";
const app = express()
import routes from './routes/admin';

// DATABASE CONNECTION
mongoose.connect(DB_URL, {
   
});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'))
db.once('open', () => {
   console.log('DB connected...');
});
global.appRoot = path.resolve(__dirname);
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

app.use(session({
   secret:'secret',
   cookie:{maxAge:60000},
   resave:false,
   saveUninitialized:false
}));
app.use(flush);
app.use('/admin', routes);
app.use(errorHandler);
app.use(cookieParser());
app.listen(APP_PORT, () => console.log(`listening on porting ${APP_PORT}`))