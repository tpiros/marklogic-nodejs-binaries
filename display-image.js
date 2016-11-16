'use strict';
const marklogic = require('marklogic');
const connection = require('./connection');
const db = marklogic.createDatabaseClient(connection);
const qb = marklogic.queryBuilder;
const http = require('http');

http.createServer((req, res) => {
  const uri = req.url;
  if (uri === '/favicon.ico') {
    res.end();
    return;
  }
  if (uri !== '/') {
    let data = [];
    db.documents.read(uri).stream('chunked')
    .on('data', chunks => data.push(chunks))
    .on('error', error => console.log(error))
    .on('end', () => {
      let buffer = new Buffer(data.length).fill(0);
      buffer = Buffer.concat(data);
      res.end(buffer);
    });
  }
}).listen(3000, () => console.log('Magic happens on port 3000. Please open a browser and go to an endpoint that represents a URI in your MarkLogic database, e.g.: "http://localhost:3000/images/sanandres.jpg"'));
