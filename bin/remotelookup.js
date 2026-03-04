#!/usr/bin/env node

const http = require("http");
const axios = require("axios");

require("dotenv").config();
const emails = process.argv.slice(2);
const port = process.env.PORT || 3000;

if (emails.length === 0) {
  console.error("put one of several emails to fetch");
  process.exit(1);
}

//  if (argv.email) {
//    await axios.get(`http://127.0.0.1:${port}/trust-lookup?email=${argv.email}`)
//  }

emails.forEach((email) => {
  axios
    .post(`http://127.0.0.1:${port}/trust/lookup?email=${email}`, { email: email })
    .then((response) => {
      console.log(response.data);
      //    const response = JSON.parse(Buffer.concat(data).toString());
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
});
