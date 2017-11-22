const dotenv = require('dotenv');
const CONSTANTS = require('./constants.config');

if (process.env.NODE_ENV !== CONSTANTS.production) {
  dotenv.load();
}

module.exports = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
};
