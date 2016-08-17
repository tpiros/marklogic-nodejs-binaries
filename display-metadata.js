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
    db.documents.read({
      uris: uri,
      categories: ['properties']
    })
    .result().then(data => res.end(JSON.stringify(data[0].properties)))
    .catch(error => console.log(error));
  }
}).listen(3000, () => console.log('Magic happens on port 3000. Please open a browser and go to an endpoint that represents a URI for a binary in your MarkLogic database where you have assigned metadata, e.g.: "http://localhost:3000/songs/robingrey-thesedays.mp3"'));
