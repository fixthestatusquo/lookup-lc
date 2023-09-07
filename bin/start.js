#!/usr/bin/env node

require('dotenv').config();
const {start} = require('../build/http.js');

//dotenv.config();
(async () => {

  console.log("running the lookup server, you can use (on a separate console) email or update");

  await start();
})();

