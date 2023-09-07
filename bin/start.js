#!/usr/bin/env node

require('dotenv').config();
const {start} = require('../build/http.js');
const {scheduleUpdate} = require('../build/update.js');

(async () => {

  console.log("running the lookup server, you can use (on a separate console) email or update");

  await scheduleUpdate();
  await start();
})();

