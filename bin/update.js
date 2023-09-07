#!/usr/bin/env node

const https = require('http');
require('dotenv').config();
const port = process.env.PORT || 3000;


//  if (argv.email) {
//    await axios.get(`http://127.0.0.1:${port}/trust-lookup?email=${argv.email}`)
//  }

emails.forEach (email => {
https.get(`http://127.0.0.1:${port}/trust-lookup?email=${email}`, res => {
  let data = [];
  const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  console.log('Status Code:', res.statusCode);
//  console.log('Date in Response header:', headerDate);

  res.on('data', chunk => {
    data.push(chunk);
  });

  res.on('end', () => {
    console.log('Response ended: ');
    const response = JSON.parse(Buffer.concat(data).toString());
console.log(response);
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
});
