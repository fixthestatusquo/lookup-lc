#!/usr/bin/env node

const https = require('http');
require('dotenv').config();
const axios = require("axios");
const port = process.env.PORT || 3000;

  axios
    .post(`http://127.0.0.1:${port}/update`,{})
    .then((response) => {
      console.log(response.data);
      //    const response = JSON.parse(Buffer.concat(data).toString());
    })
    .catch((error) => {
      console.log("Error: ", error);
    });

