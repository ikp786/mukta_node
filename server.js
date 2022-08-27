import express from 'express';
import mongoose from "mongoose";

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
app.use('/admin', routes);

app.listen(APP_PORT, () => console.log(`listening on porting ${APP_PORT}`))